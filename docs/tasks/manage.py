#!/usr/bin/env python3
"""Validate/render the task backlog and publish it through the authenticated gh CLI."""
from __future__ import annotations

import argparse
import collections
import hashlib
import heapq
import json
import re
import subprocess
import sys
import time
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HERE = ROOT / "docs/tasks"
REPO = "JoseLArantes/detew"
BASE_URL = f"https://github.com/{REPO}"
SOURCES = [HERE / f"catalog-{part}.json" for part in ("m00-m04", "m05-m08", "m09-m13")]
STATE_PATH = HERE / "github.json"
TASK_PATTERN = re.compile(r"M\d{2}-W\d{2}-T\d{2}")
TYPES = {"decision", "spike", "feature", "test", "docs", "release"}
AREAS = {"governance", "build", "core", "packet", "classifier", "data", "opnsense", "ui", "control", "activity", "security", "quality", "research", "release", "extensions", "tls"}
FIELDS = {"id", "title", "milestone", "work_package", "scope", "type", "area", "priority", "size", "confidence", "depends_on", "requirements", "product_sections", "architecture_sections", "architecture_decisions", "gates", "outcome", "deliverables", "acceptance", "tests", "constraints", "evidence", "refinement_notes", "doc_path"}


def read_json(path, fallback=None):
    return json.loads(path.read_text()) if path.exists() else fallback


def write_json(path, value):
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_text(json.dumps(value, indent=2, ensure_ascii=False) + "\n")
    temporary.replace(path)


def gh(*args, payload=None):
    command = ["gh", *args]
    result = subprocess.run(command, cwd=ROOT, input=json.dumps(payload) if payload is not None else None, text=True, capture_output=True)
    if result.returncode:
        raise RuntimeError(f"gh {' '.join(args[:4])}: {result.stderr.strip()}")
    data = json.loads(result.stdout) if result.stdout.strip() else None
    if isinstance(data, dict) and data.get("errors"):
        raise RuntimeError("GraphQL: " + json.dumps(data["errors"]))
    return data


def api(endpoint, method="GET", data=None):
    args = ["api", endpoint, "--method", method, "-H", "Accept: application/vnd.github+json"]
    if data is not None:
        args.extend(["--input", "-"])
    return gh(*args, payload=data)


def graphql(query, variables=None):
    return gh("api", "graphql", "--input", "-", payload={"query": query, "variables": variables or {}})["data"]


def paged(endpoint):
    result = []
    for page in range(1, 100):
        separator = "&" if "?" in endpoint else "?"
        items = api(f"{endpoint}{separator}per_page=100&page={page}")
        result.extend(items)
        if len(items) < 100:
            return result
    raise RuntimeError("Pagination exceeded safe bound")


def headings(text):
    text = re.sub(r"^```[^\n]*\n.*?^```\s*$", "", text, flags=re.M | re.S)
    seen = collections.Counter()
    result = set()
    for heading in re.findall(r"^#{1,6}\s+(.+)$", text, flags=re.M):
        heading = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", heading).strip().lower()
        slug = "".join(c for c in heading if c in " -_" or unicodedata.category(c)[0] in "LN").replace(" ", "-")
        result.add(slug if not seen[slug] else f"{slug}-{seen[slug]}")
        seen[slug] += 1
    result.update(re.findall(r'<a\s+(?:id|name)="([^"]+)"', text))
    return result


def load():
    tasks = []
    for source in SOURCES:
        items = read_json(source)
        if not isinstance(items, list):
            raise ValueError(f"Missing/non-array catalog: {source.name}")
        tasks.extend(items)
    return sorted(tasks, key=lambda task: task["id"])


def ordered(tasks):
    by_id = {task["id"]: task for task in tasks}
    indegree = {tid: len(task["depends_on"]) for tid, task in by_id.items()}
    children = collections.defaultdict(list)
    for task in tasks:
        for parent in task["depends_on"]:
            if parent not in by_id:
                raise ValueError(f"{task['id']}: unknown dependency {parent}")
            children[parent].append(task["id"])
    ready = [tid for tid, degree in indegree.items() if not degree]
    heapq.heapify(ready)
    result = []
    while ready:
        tid = heapq.heappop(ready)
        result.append(by_id[tid])
        for child in children[tid]:
            indegree[child] -= 1
            if not indegree[child]:
                heapq.heappush(ready, child)
    if len(result) != len(tasks):
        raise ValueError("Cyclic dependencies: " + ", ".join(tid for tid, degree in indegree.items() if degree))
    return result


def validate(tasks):
    errors = []
    requirements = dict(re.findall(r"^\| ((?:INS|DAT|POL|OPS|UX|SEC|PRI|OSS|QLT)-\d{2}) \| (V1|T1|E) \|", (ROOT / "docs/PRD.md").read_text(), re.M))
    packages = set(re.findall(r"^\| (M\d{2}-W\d{2}) \|", (ROOT / "docs/MILESTONES.md").read_text(), re.M))
    arc = set(re.findall(r"^\| (ARC-\d{2}) \|", (ROOT / "docs/ARCHITECTURE.md").read_text(), re.M))
    gates = {f"G{i}" for i in range(6)} | {f"ARCH-G{i:02d}" for i in range(1, 7)}
    seen = set()
    for task in tasks:
        tid = task.get("id", "missing")
        if FIELDS - set(task):
            errors.append(f"{tid}: missing fields {sorted(FIELDS - set(task))}")
            continue
        if not TASK_PATTERN.fullmatch(tid) or tid in seen:
            errors.append(f"Invalid/duplicate task ID {tid}")
        seen.add(tid)
        if task["milestone"] != tid[:3] or task["work_package"] != tid[:7] or task["work_package"] not in packages:
            errors.append(f"{tid}: milestone/package mismatch")
        if task["doc_path"] != f"docs/tasks/{tid[:3].lower()}/{tid}.md":
            errors.append(f"{tid}: unexpected path")
        for field, values in [("type", TYPES), ("area", AREAS), ("scope", {"V1", "T1", "E"}), ("priority", {"p0", "p1", "p2"}), ("size", {"s", "m", "l"}), ("confidence", {"high", "medium", "low"})]:
            if task[field] not in values:
                errors.append(f"{tid}: invalid {field}: {task[field]}")
        if task["scope"] != ("T1" if task["milestone"] == "M12" else "E" if task["milestone"] == "M13" else "V1"):
            errors.append(f"{tid}: release scope mismatch")
        for field, minimum in [("deliverables", 1), ("acceptance", 3), ("tests", 2), ("constraints", 1), ("evidence", 1)]:
            if not isinstance(task[field], list) or len(task[field]) < minimum or any(not isinstance(x, str) or not x.strip() for x in task[field]):
                errors.append(f"{tid}: insufficient/non-string {field}")
        if len(task["depends_on"]) != len(set(task["depends_on"])) or tid in task["depends_on"]:
            errors.append(f"{tid}: duplicate/self dependency")
        for field, known in [("requirements", requirements), ("architecture_decisions", arc), ("gates", gates)]:
            for value in task[field]:
                if value not in known:
                    errors.append(f"{tid}: unknown {field} {value}")
        for field, document in [("product_sections", "PRODUCT.md"), ("architecture_sections", "ARCHITECTURE.md")]:
            known = headings((ROOT / "docs" / document).read_text())
            for anchor in task[field]:
                if anchor not in known:
                    errors.append(f"{tid}: missing anchor {document}#{anchor}")
    missing = packages - {task["work_package"] for task in tasks}
    uncovered = set(requirements) - {rid for task in tasks for rid in task["requirements"]}
    if missing:
        errors.append("Uncovered packages: " + ", ".join(sorted(missing)))
    if uncovered:
        errors.append("Uncovered requirements: " + ", ".join(sorted(uncovered)))
    for package in packages:
        ids = sorted(task["id"] for task in tasks if task["work_package"] == package)
        if ids != [f"{package}-T{i:02d}" for i in range(1, len(ids) + 1)]:
            errors.append("Noncontiguous task IDs: " + package)
    try:
        sequence = ordered(tasks)
    except ValueError as exc:
        errors.append(str(exc))
        sequence = []
    if errors:
        raise ValueError("\n".join(errors))
    return {"tasks": len(tasks), "work_packages": len(packages), "requirements": len(requirements), "scope_counts": dict(collections.Counter(t["scope"] for t in tasks)), "acyclic": True, "first_ready": [t["id"] for t in sequence if not t["depends_on"] and t["scope"] == "V1"]}


def workflow(task, state):
    if task["scope"] != "V1":
        return "deferred"
    records = state.get("issues", {})
    if task["depends_on"] and any(records.get(parent, {}).get("state") != "closed" for parent in task["depends_on"]):
        return "blocked"
    return "ready"


def labels(task, state):
    return [f"type:{task['type']}", f"area:{task['area']}", f"priority:{task['priority']}", f"scope:{task['scope'].lower()}", f"status:{workflow(task, state)}", f"size:{task['size']}"]


def bullet(items, checkbox=False):
    return "\n".join(("- [ ] " if checkbox else "- ") + item for item in items)


def body(task, state, remote=False):
    tid = task["id"]
    baseline = state.get("baseline", "main")
    def doc(name, anchor=""):
        target = f"{BASE_URL}/blob/{baseline}/docs/{name}" if remote else f"../../{name}"
        return target + (f"#{anchor}" if anchor else "")
    blocks = []
    for parent in task["depends_on"]:
        record = state.get("issues", {}).get(parent)
        target = record["url"] if remote and record else f"../{parent[:3].lower()}/{parent}.md"
        blocks.append(f"[{parent}]({target})" + (f" (#{record['number']})" if record else ""))
    foundations = [f"[PRD]({doc('PRD.md')}): {', '.join(task['requirements'])}."]
    foundations += [f"[PRODUCT §{anchor.split('-')[0]}]({doc('PRODUCT.md', anchor)})." for anchor in task["product_sections"]]
    foundations += [f"[ARCHITECTURE §{anchor.split('-')[0]}]({doc('ARCHITECTURE.md', anchor)})." for anchor in task["architecture_sections"]]
    foundations += [f"Architecture decisions: {', '.join(task['architecture_decisions']) or 'none additional'}; gates: {', '.join(task['gates']) or 'milestone acceptance'}." ]
    headings_lines = [
        f"# {tid} — {task['title']}", "",
        f"<!-- detew-task:{tid} -->", "",
        task["outcome"], "",
        "## Planning metadata", "",
        f"- Milestone / work package: **{task['milestone']} / {task['work_package']}**.",
        f"- Scope: **{task['scope']}**; initial workflow status: **{workflow(task, state)}**.",
        f"- Type / area: **{task['type']} / {task['area']}**; priority: **{task['priority']}**.",
        f"- Relative size: **{task['size']}**; estimate confidence: **{task['confidence']}**. Confirm the estimate during refinement; this is not an elapsed-time promise.",
        "- Owner / reviewer: unassigned; name them when scheduling. Implementation and acceptance have not started.",
        f"- Canonical document path: `{task['doc_path']}`.",
        "", "## Foundations", "", bullet(foundations),
        "", "## Dependencies and entry conditions", "",
        bullet(blocks) if blocks else "No hard task dependencies. Confirm scope, owner, and available inputs before starting.",
        "", "Dependencies require accepted predecessor outputs, not merely merged code. Use the gate evidence named above where applicable. Independent planning can proceed only within the task's declared scope.",
        "", "## Deliverables", "", bullet(task["deliverables"]),
        "", "## Acceptance criteria", "", bullet(task["acceptance"], checkbox=True),
        "", "## Required tests and validation", "", bullet(task["tests"]),
        "", "## Boundaries and failure behavior", "", bullet(task["constraints"]),
        "", "## Evidence to retain", "", bullet(task["evidence"]),
        "", "Record exact implementation revision, host/toolchain/input versions, procedure, expected and observed results, limitations, and reviewer. Missing native or independent-user checks remain missing evidence; mocks or a successful build do not close those gates.",
        "", "## Refinement and documentation", "", bullet(task["refinement_notes"]) if task["refinement_notes"] else "No additional refinement identified; confirm inputs and estimate before scheduling.",
        "", f"Update affected [foundation contracts]({doc('MILESTONES.md', '81-ownership-and-update-triggers')}) and the requirement evidence ledger when behavior, support, or acceptance changes. Regenerate the task index and reconcile this issue's dependencies/labels if its scope changes.",
        "", "## Completion record", "", "- [ ] Link implementation, executed validation, and evidence at an exact revision.", "- [ ] Record reviewer acceptance and any unresolved release gate or limitation.", "- [ ] Update workflow status; close only when all acceptance criteria have evidence.", ""
    ]
    if not remote and tid in state.get("issues", {}):
        headings_lines.insert(4, f"**GitHub:** [#{state['issues'][tid]['number']}]({state['issues'][tid]['url']})\n")
    return "\n".join(headings_lines)


def render(tasks, state):
    write_json(HERE / "catalog.json", tasks)
    order = ordered(tasks)
    levels = {}
    for task in order:
        levels[task["id"]] = 1 + max((levels[parent] for parent in task["depends_on"]), default=-1)
    for task in tasks:
        path = ROOT / task["doc_path"]
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(body(task, state))
    summary = ["# Task index", "", "Generated from the three versioned source catalogs. Each row is one development task and one GitHub issue; all implementation is unstarted. Initial workflow labels reflect the dependency snapshot, not live status.", "", "| Order | Task | Title | Milestone | Scope | Initial status | GitHub |", "|---|---|---|---|---|---|---|"]
    dependencies = ["# Task dependencies", "", "This is a directed acyclic graph: predecessor tasks must supply accepted outputs before dependent implementation starts. The order index uses a stable topological sort; tasks without an edge between them can proceed independently once their entry conditions hold. A single line of work is not imposed on parallel branches.", "", "## Dependency layers", "", "Layers count prerequisite depth, not sprints or delivery duration. Each milestone page includes a diagram of its task branches and incoming prerequisites.", "", "| Layer | Tasks |", "|---|---|"]
    for level in sorted(set(levels.values())):
        links = ", ".join(f"[{t['id']}]({t['milestone'].lower()}/{t['id']}.md)" for t in order if levels[t["id"]] == level)
        dependencies.append(f"| {level} | {links} |")
    dependencies.extend(["", "## Direct prerequisites", "", "| Task | Direct prerequisites | Initial status |", "|---|---|---|"])
    for idx, task in enumerate(order, 1):
        tid = task["id"]
        record = state.get("issues", {}).get(tid)
        link = f"[{tid}]({task['milestone'].lower()}/{tid}.md)"
        issue = f"[#{record['number']}]({record['url']})" if record else "not published"
        summary.append(f"| {idx} | {link} | {task['title']} | {task['milestone']} | {task['scope']} | {workflow(task, state)} | {issue} |")
        deps = ", ".join(f"[{parent}]({parent[:3].lower()}/{parent}.md)" for parent in task["depends_on"]) or "none"
        dependencies.append(f"| {link} | {deps} | {workflow(task, state)} |")
    (HERE / "INDEX.md").write_text("\n".join(summary) + "\n")
    (HERE / "DEPENDENCIES.md").write_text("\n".join(dependencies) + "\n")
    for mid in sorted({task["milestone"] for task in tasks}):
        subset = [t for t in order if t["milestone"] == mid]
        lines = [f"# {mid} tasks", "", "Read the linked task specification before scheduling. Dependencies are accepted-output prerequisites; labels and estimates are planning metadata.", "", "| Task | Outcome | Direct prerequisites | Initial status | GitHub |", "|---|---|---|---|---|"]
        for task in subset:
            tid = task["id"]
            record = state.get("issues", {}).get(tid)
            deps = ", ".join(f"[{parent}](../{parent[:3].lower()}/{parent}.md)" for parent in task["depends_on"]) or "none"
            issue = f"[#{record['number']}]({record['url']})" if record else "not published"
            lines.append(f"| [{tid}]({tid}.md) | {task['title']} | {deps} | {workflow(task, state)} | {issue} |")
        lines.extend(["", "## Dependency branches", "", "```mermaid", "flowchart TD"])
        nodes = {task["id"] for task in subset} | {parent for task in subset for parent in task["depends_on"]}
        for tid in sorted(nodes):
            lines.append(f'    {tid.replace("-", "_")}["{tid}"]')
        for task in subset:
            for parent in task["depends_on"]:
                lines.append(f'    {parent.replace("-", "_")} --> {task["id"].replace("-", "_")}')
        lines.extend(["```", ""])
        (HERE / mid.lower() / "README.md").write_text("\n".join(lines) + "\n")
    requirements = dict(re.findall(r"^\| ((?:INS|DAT|POL|OPS|UX|SEC|PRI|OSS|QLT)-\d{2}) \| (V1|T1|E) \|", (ROOT / "docs/PRD.md").read_text(), re.M))
    coverage = ["# Requirement-to-task coverage", "", "This is planned task coverage. It does not establish implementation or accepted evidence. Release closure still uses the milestone evidence contract and every in-scope PRD requirement.", "", "| Requirement | Scope | Planned tasks |", "|---|---|---|"]
    for rid, scope in requirements.items():
        links = ", ".join(f"[{t['id']}]({t['milestone'].lower()}/{t['id']}.md)" for t in tasks if rid in t["requirements"])
        coverage.append(f"| {rid} | {scope} | {links} |")
    (HERE / "COVERAGE.md").write_text("\n".join(coverage) + "\n")


def check_views(tasks, state):
    errors = []
    combined = read_json(HERE / "catalog.json")
    if combined != tasks:
        errors.append("Generated catalog.json differs from source catalogs; run render.")
    for task in tasks:
        path = ROOT / task["doc_path"]
        if not path.exists() or path.read_text() != body(task, state):
            errors.append(task["id"] + ": generated Markdown differs from its definition/snapshot; run render.")
    if errors:
        raise ValueError("\n".join(errors))


def label_definitions():
    result = {}
    for kind in TYPES:
        result[f"type:{kind}"] = ("5319e7", f"Work type: {kind}")
    for area in AREAS:
        result[f"area:{area}"] = ("1d76db", f"Primary owning area: {area}")
    for priority, color, description in [("p0", "b60205", "Critical foundation, feasibility, correctness or release dependency"), ("p1", "fbca04", "Required delivery within the selected scope"), ("p2", "c2e0c6", "Deferred optional capability or subsequent improvement")]:
        result[f"priority:{priority}"] = (color, description)
    for scope, description in [("v1", "First production release"), ("t1", "Optional managed TLS after V1"), ("e", "Selected ecosystem extension after V1")]:
        result[f"scope:{scope}"] = ("0e8a16", description)
    for status, description in [("ready", "No unmet task dependency; refine inputs and assign before starting"), ("blocked", "Waiting for accepted prerequisite output or an explicit blocker"), ("in-progress", "Implementation or investigation underway"), ("in-review", "Outcome and evidence awaiting acceptance"), ("deferred", "Outside active V1 scope; activate only after its scope/gates")]:
        result[f"status:{status}"] = ("d4c5f9", description)
    for size, description in [("s", "Small bounded result; refine estimate when scheduled"), ("m", "Moderate result across a focused contract"), ("l", "Larger or uncertain result; split further if needed")]:
        result[f"size:{size}"] = ("bfdadc", description)
    return result


def wait_write(last_write):
    time.sleep(max(0, 1.2 - (time.monotonic() - last_write)))
    return time.monotonic()


def publish(tasks):
    remote = gh("repo", "view", REPO, "--json", "nameWithOwner,url,viewerPermission")
    origin = subprocess.check_output(["git", "remote", "get-url", "origin"], cwd=ROOT, text=True).strip()
    git_root = Path(subprocess.check_output(["git", "rev-parse", "--show-toplevel"], cwd=ROOT, text=True).strip()).resolve()
    if git_root != ROOT or remote["nameWithOwner"] != REPO or not re.search(r"JoseLArantes/detew(?:\.git)?$", origin):
        raise RuntimeError("Repository identity mismatch; publication stopped")
    state = read_json(STATE_PATH, {"repository": REPO, "baseline": subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=ROOT, text=True).strip(), "issues": {}, "milestones": {}, "relationships": []})
    if state["repository"] != REPO:
        raise RuntimeError("Publication state repository mismatch")
    catalog_digest = hashlib.sha256(json.dumps(tasks, sort_keys=True).encode()).hexdigest()
    if state.get("catalog_digest") and state["catalog_digest"] != catalog_digest and state["issues"]:
        raise RuntimeError("Published task definitions changed. Reconcile existing issue bodies/metadata/relationships deliberately; this creation helper will not silently overwrite them or create duplicates.")
    state["catalog_digest"] = catalog_digest
    existing = paged(f"repos/{REPO}/issues?state=all")
    for issue in existing:
        marker = re.search(r"<!-- detew-task:(M\d{2}-W\d{2}-T\d{2}) -->", issue.get("body") or "")
        title_marker = re.match(r"\[(M\d{2}-W\d{2}-T\d{2})\]", issue["title"])
        match = marker or title_marker
        if not match:
            continue
        tid = match.group(1)
        previous = state["issues"].get(tid)
        if previous and previous["number"] != issue["number"]:
            raise RuntimeError("Duplicate remote task ID: " + tid)
        state["issues"][tid] = {"number": issue["number"], "node_id": issue["node_id"], "id": issue["id"], "url": issue["html_url"], "state": issue["state"]}
    write_json(STATE_PATH, state)
    last_write = 0
    current_labels = {label["name"]: label for label in paged(f"repos/{REPO}/labels")}
    for name, (color, description) in sorted(label_definitions().items()):
        if name in current_labels:
            continue
        last_write = wait_write(last_write)
        current_labels[name] = api(f"repos/{REPO}/labels", "POST", {"name": name, "color": color, "description": description})
    current_milestones = {item["title"]: item for item in paged(f"repos/{REPO}/milestones?state=all")}
    titles = dict(re.findall(r"^### (M\d{2}): (.+)$", (ROOT / "docs/MILESTONES.md").read_text(), re.M))
    for mid, name in titles.items():
        title = f"{mid}: {name}"
        if title not in current_milestones:
            last_write = wait_write(last_write)
            current_milestones[title] = api(f"repos/{REPO}/milestones", "POST", {"title": title, "description": f"{mid} delivery group from docs/MILESTONES.md. Completion requires accepted evidence; all tasks are initially unstarted. " + ("Deferred optional scope after V1." if mid in {"M12", "M13"} else "No delivery date is committed.")})
        state["milestones"][mid] = {key: current_milestones[title][key] for key in ("number", "node_id", "title", "html_url")}
        write_json(STATE_PATH, state)
    repository_id = graphql('query { repository(owner:"JoseLArantes",name:"detew") { id } }')["repository"]["id"]
    relations = {tuple(item) for item in state["relationships"]}
    for idx, task in enumerate(ordered(tasks), 1):
        tid = task["id"]
        resumed = tid in state["issues"]
        if tid not in state["issues"]:
            variables = {"input": {"repositoryId": repository_id, "title": f"[{tid}] {task['title']}", "body": body(task, state, remote=True), "labelIds": [current_labels[name]["node_id"] for name in labels(task, state)], "milestoneId": state["milestones"][task["milestone"]]["node_id"]}}
            last_write = wait_write(last_write)
            result = graphql("mutation($input: CreateIssueInput!) { createIssue(input:$input) { issue { id number url state databaseId body } } }", variables)["createIssue"]["issue"]
            state["issues"][tid] = {"number": result["number"], "node_id": result["id"], "id": result["databaseId"], "url": result["url"], "state": result["state"].lower()}
            write_json(STATE_PATH, state)
            if result["body"] != variables["input"]["body"]:
                raise RuntimeError(tid + ": server changed the published body; inspect before continuing.")
        if resumed and task["depends_on"]:
            actual = graphql('query($id:ID!) { node(id:$id) { ... on Issue { blockedBy(first:100) { nodes { id } } } } }', {"id": state["issues"][tid]["node_id"]})["node"]["blockedBy"]["nodes"]
            actual_ids = {item["id"] for item in actual}
            for parent in task["depends_on"]:
                if state["issues"][parent]["node_id"] in actual_ids:
                    relations.add((tid, parent))
                else:
                    relations.discard((tid, parent))
        missing = [parent for parent in task["depends_on"] if (tid, parent) not in relations]
        if missing:
            # Several relationship mutations in one request keep publication below
            # secondary content-request limits without concurrent write bursts.
            fields = []
            for n, parent in enumerate(missing):
                fields.append(f'r{n}: addBlockedBy(input: {{ issueId: "{state["issues"][tid]["node_id"]}", blockingIssueId: "{state["issues"][parent]["node_id"]}" }}) {{ clientMutationId }}')
            last_write = wait_write(last_write)
            graphql("mutation { " + " ".join(fields) + " }")
            for parent in missing:
                relations.add((tid, parent))
            state["relationships"] = sorted([list(edge) for edge in relations])
            write_json(STATE_PATH, state)
        print(f"{idx}/{len(tasks)} {tid} #{state['issues'][tid]['number']} ({len(task['depends_on'])} prerequisites)", flush=True)
    state["catalog_digest"] = catalog_digest
    write_json(STATE_PATH, state)
    render(tasks, state)
    return state


def verify_remote(tasks):
    state = read_json(STATE_PATH)
    if not state:
        raise ValueError("No publication state")
    by_number = {issue["number"]: issue for issue in paged(f"repos/{REPO}/issues?state=all")}
    errors = []
    for task in tasks:
        record = state["issues"].get(task["id"])
        issue = by_number.get(record["number"]) if record else None
        if not issue:
            errors.append(task["id"] + ": missing issue")
            continue
        if issue["title"] != f"[{task['id']}] {task['title']}":
            errors.append(task["id"] + ": title mismatch")
        if issue["body"] != body(task, state, remote=True):
            errors.append(task["id"] + ": body mismatch")
        managed = {label["name"] for label in issue["labels"] if label["name"].split(":", 1)[0] in {"type", "area", "priority", "scope", "status", "size"}}
        if set(labels(task, state)) != managed:
            errors.append(task["id"] + ": workflow label mismatch")
        if not issue["milestone"] or issue["milestone"]["number"] != state["milestones"][task["milestone"]]["number"]:
            errors.append(task["id"] + ": milestone mismatch")
    # Batch read the actual native relationships, not the local checkpoint claims.
    for start in range(0, len(tasks), 20):
        chunk = tasks[start:start + 20]
        fields = [f'q{n}: node(id:"{state["issues"][task["id"]]["node_id"]}") {{ ... on Issue {{ number blockedBy(first:100) {{ nodes {{ number }} }} }} }}' for n, task in enumerate(chunk)]
        result = graphql("query { " + " ".join(fields) + " }")
        for n, task in enumerate(chunk):
            actual = {item["number"] for item in result[f"q{n}"]["blockedBy"]["nodes"]}
            expected = {state["issues"][parent]["number"] for parent in task["depends_on"]}
            if actual != expected:
                errors.append(task["id"] + ": native dependency mismatch")
    if errors:
        raise ValueError("\n".join(errors))
    print(json.dumps({"repository": REPO, "verified_issues": len(tasks), "verified_native_dependencies": sum(len(t["depends_on"]) for t in tasks), "milestones": len(state["milestones"]), "errors": []}, indent=2))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=["validate", "render", "publish", "verify"])
    args = parser.parse_args()
    tasks = load()
    report = validate(tasks)
    if args.command == "validate":
        if (HERE / "catalog.json").exists():
            check_views(tasks, read_json(STATE_PATH, {}))
        print(json.dumps(report, indent=2))
    elif args.command == "render":
        render(tasks, read_json(STATE_PATH, {}))
        print(json.dumps(report, indent=2))
    elif args.command == "publish":
        publish(tasks)
    elif args.command == "verify":
        check_views(tasks, read_json(STATE_PATH, {}))
        verify_remote(tasks)


if __name__ == "__main__":
    try:
        main()
    except (ValueError, RuntimeError) as exc:
        print(str(exc), file=sys.stderr)
        sys.exit(1)
