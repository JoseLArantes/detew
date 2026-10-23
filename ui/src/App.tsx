/* SPDX-License-Identifier: MIT */
type FoundationStep = {
  number: string;
  title: string;
  detail: string;
  state: string;
  stateClass: "recorded" | "building" | "pending";
};

const foundationSteps: FoundationStep[] = [
  {
    number: "01",
    title: "Open source by design",
    detail: "MIT is the project license. Third-party software and data are reviewed separately.",
    state: "Recorded",
    stateClass: "recorded",
  },
  {
    number: "02",
    title: "A portable foundation",
    detail: "Shared contracts and the local interface are taking shape before enforcement work.",
    state: "Building",
    stateClass: "building",
  },
  {
    number: "03",
    title: "A safe native lab",
    detail: "Console access is available. Network isolation still needs to be established.",
    state: "Pending",
    stateClass: "pending",
  },
];

const plannedSections = ["Policies", "Categories", "Activity"];

export function App() {
  return (
    <div className="detew-preview">
      <a className="skip-link" href="#overview">
        Skip to main content
      </a>
      <aside className="manual-rail" aria-label="Detew preview navigation">
        <a className="brand" href="#overview" aria-label="Detew overview">
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="brand-type">
            <span className="brand-name">detew</span>
            <span className="brand-caption">NETWORK POLICY</span>
          </span>
        </a>

        <div className="rail-heading">
          <span className="punch" aria-hidden="true" />
          <span>Workspace</span>
        </div>

        <nav className="section-tabs" aria-label="Workspace sections">
          <a className="section-tab selected" href="#overview" aria-current="page">
            <span className="tab-number">01</span>
            <span>Overview</span>
            <span className="tab-punch" aria-hidden="true" />
          </a>
          {plannedSections.map((section, index) => (
            <div className="section-tab unavailable" aria-disabled="true" key={section}>
              <span className="tab-number">0{index + 2}</span>
              <span>{section}</span>
              <span className="tab-state">Planned</span>
            </div>
          ))}
        </nav>

        <div className="rail-footer">
          <div className="edition-label">LOCAL PREVIEW</div>
          <div className="build-chip">
            <span className="build-dot" aria-hidden="true" />
            <span>Development build</span>
          </div>
          <p>No network activity is collected by this preview.</p>
        </div>
      </aside>

      <main className="manual-page" id="overview">
        <header className="page-topline">
          <div className="breadcrumb">
            <span>Detew</span>
            <span className="breadcrumb-slash" aria-hidden="true">
              /
            </span>
            <span>Development</span>
          </div>
          <div className="milestone-chip">
            <span className="milestone-dot" aria-hidden="true" />
            Milestone 00 <span className="chip-divider">·</span> Bootstrap
          </div>
        </header>

        <section className="welcome" aria-labelledby="welcome-title">
          <div className="welcome-copy">
            <p className="eyebrow">
              <span className="eyebrow-line" /> Foundation / 00
            </p>
            <h1 id="welcome-title">A clearer way to shape network policy.</h1>
            <p className="welcome-description">
              Detew is building a consistent policy core and a simpler way to understand it. This
              local preview shows the foundation taking shape.
            </p>
          </div>
          <div className="chapter-stamp" role="img" aria-label="Foundation, chapter zero">
            <span className="stamp-ring" aria-hidden="true" />
            <span className="stamp-caption">CHAPTER</span>
            <span className="stamp-number">00</span>
            <span className="stamp-caption">FOUNDATION</span>
          </div>
        </section>

        <output className="safety-notice" aria-label="Preview status">
          <div className="notice-mark" aria-hidden="true">
            <span />
          </div>
          <div className="notice-copy">
            <p className="notice-label">Traffic inspection</p>
            <h2>Not active in this preview</h2>
            <p>This build does not inspect traffic or apply firewall changes.</p>
          </div>
          <span className="notice-state">ENGINE NOT CONNECTED</span>
        </output>

        <section className="foundation-section" aria-labelledby="foundation-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                <span className="eyebrow-line" /> Current chapter
              </p>
              <h2 id="foundation-title">Foundation notes</h2>
            </div>
            <p className="section-summary">The groundwork before Detew can make a decision.</p>
          </div>

          <ol className="foundation-list">
            {foundationSteps.map((step) => (
              <li className="foundation-row" key={step.number}>
                <span className="row-number">{step.number}</span>
                <div className="row-copy">
                  <h3>{step.title}</h3>
                  <p>{step.detail}</p>
                </div>
                <span className={`row-state ${step.stateClass}`}>
                  <span className="row-state-punch" aria-hidden="true" />
                  {step.state}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <footer className="page-footer">
          <span>DETEW / FOUNDATION BUILD</span>
          <span>LOCAL · NO ENFORCEMENT</span>
        </footer>
      </main>
    </div>
  );
}
