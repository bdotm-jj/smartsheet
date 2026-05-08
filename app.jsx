// Main app — masthead + controls + grid (Dossier theme)
const { useState, useMemo, useCallback, useEffect } = React;

function App() {
  const [query, setQuery] = useState("");
  const [activePerson, setActivePerson] = useState(null);

  // Stats
  const allPeople = useMemo(() => {
    const set = new Set();
    window.PODS.forEach(p => Object.values(p.roster).forEach(l => l.forEach(n => set.add(n))));
    return [...set];
  }, []);
  const totalPjms = window.PJMS.length;
  const totalPods = window.PODS.length;
  const totalDevQa = useMemo(() => {
    return window.PODS.reduce((a, p) => a + p.roster.Dev.length + p.roster.QA.length, 0);
  }, []);

  const personOnPods = useMemo(() => {
    if (!activePerson) return [];
    return window.PODS.filter(p => window.podHelpers.podHasPerson(p, activePerson)).map(p => p.name);
  }, [activePerson]);

  // What pods to show / dim
  const podMatchesQuery = useCallback((pod) => {
    if (!query) return true;
    if (pod.name.toLowerCase().includes(query.toLowerCase())) return true;
    if (pod.lob.toLowerCase().includes(query.toLowerCase())) return true;
    return Object.values(pod.roster).some(list => list.some(n => window.podHelpers.nameMatches(n, query)));
  }, [query]);

  const podActive = useCallback((pod) => {
    if (!podMatchesQuery(pod)) return false;
    if (activePerson && !window.podHelpers.podHasPerson(pod, activePerson)) return false;
    return true;
  }, [podMatchesQuery, activePerson]);

  const visibleCount = window.PODS.filter(podActive).length;

  const onPersonClick = useCallback((name) => {
    setActivePerson(prev => prev === name ? null : name);
  }, []);

  return (
    <div className="page v-dossier">
      {/* ─── COVER ─── */}
      <header className="cover">
        <div className="cover-meta">
          <div className="l">J&amp;J <strong>DIT</strong> — Internal Directory</div>
          <div className="c">VOL. <strong>I</strong> · ISSUE <strong>05 / 2026</strong></div>
          <div className="r">A Roster of Working Groups</div>
        </div>

        <div className="cover-title">
          <h1>The Pods<span className="amp">.</span></h1>
          <div className="cover-issue">
            <span className="num">№ 09</span>
            Pods on Record
          </div>
        </div>

        <div className="cover-toc">
          <div className="toc-item">
            <div className="toc-num">I.</div>
            <div className="toc-head">Working Groups</div>
            <div className="toc-sub">{totalPods} pods, organized by line of business.</div>
          </div>
          <div className="toc-item">
            <div className="toc-num">II.</div>
            <div className="toc-head">Project Managers</div>
            <div className="toc-sub">{totalPjms} PJMs across the org.</div>
          </div>
          <div className="toc-item">
            <div className="toc-num">III.</div>
            <div className="toc-head">Engineering</div>
            <div className="toc-sub">{totalDevQa} Dev &amp; QA practitioners.</div>
          </div>
          <div className="toc-item">
            <div className="toc-num">IV.</div>
            <div className="toc-head">Practice</div>
            <div className="toc-sub">{allPeople.length} unique people on the floor.</div>
          </div>
        </div>
      </header>

      {/* ─── CONTROLS ─── */}
      <div className="controls">
        <div className={`search-box${query ? " has-value" : ""}`}>
          <span className="glyph">⌕</span>
          <input
            type="text"
            placeholder="Search a name, a pod, a line of business…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="clear" onClick={() => setQuery("")}>Clear</button>
        </div>

      </div>

      <div className="result-strip">
        <div>
          <span className="echo"><em>{visibleCount}</em> of {totalPods} pods shown</span>
          {(query || activePerson) && (
            <span style={{marginLeft: 14, color: "var(--ink-40)"}}>
              · filters active
            </span>
          )}
        </div>
        <div>Sourced from Smartsheet · Pods sheet</div>
      </div>

      {/* ─── PERSON HIGHLIGHT BANNER ─── */}
      {activePerson && (
        <div className="highlight-banner">
          <div className="who">
            <em>Highlighting</em>{activePerson}
          </div>
          <div className="meta">
            Appears on {personOnPods.length} pod{personOnPods.length === 1 ? "" : "s"} ·
            {" "}{personOnPods.join(" · ")}
          </div>
          <button className="clear" onClick={() => setActivePerson(null)}>Clear</button>
        </div>
      )}

      {/* ─── GRID ─── */}
      <div className="grid">
        {window.PODS.map((pod, idx) => {
          const active = podActive(pod);
          const isHit = activePerson && window.podHelpers.podHasPerson(pod, activePerson);
          const Card = window.PodCard.DossierCard;
          return (
            <div
              key={pod.id}
              className={`pod-wrap ${active ? "" : "dim-wrap"} ${isHit ? "hit-wrap" : ""}`}
              style={{ display: "contents" }}
            >
              <div className={`pod-shell ${!active ? "dim" : ""} ${isHit ? "hit" : ""}`} style={{ display: "contents" }}>
                {/* Card itself */}
                <CardWrapper active={active} hit={isHit}>
                  <Card
                    pod={pod}
                    idx={idx}
                    query={query}
                    activePerson={activePerson}
                    onPersonClick={onPersonClick}
                  />
                </CardWrapper>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── COLOPHON ─── */}
      <div className="colophon">
        <div className="colophon-block">
          <h4>On Method</h4>
          <p>
            Each pod is a small, durable working group. A pod is anchored by a Product
            Manager and a Project Manager, supported by a Development Team and Quality
            Analysts. Pods are organized first by line of business, second by initiative.
          </p>
        </div>
        <div className="colophon-block">
          <h4>Glossary</h4>
          <ul className="legend-list">
            <li><code>PM</code> Product Manager</li>
            <li><code>PJM</code> Project Manager</li>
            <li><code>Dev</code> Software Engineer</li>
            <li><code>QA</code> Quality Analyst</li>
            <li><code>LOB</code> Line of Business</li>
            <li><code>№</code> Pod Code</li>
          </ul>
        </div>
      </div>

      <div className="signoff">
        <div>J&amp;J Insurance · DIT</div>
        <div className="pharrell">Quietly assembled, May 2026</div>
        <div>Edition I · 05 · 26</div>
      </div>

      {/* Tweaks removed — design locked to Dossier */}
    </div>
  );
}

// Wrapper handles dim/hit visual state because CardWrapper sits at the grid item level
function CardWrapper({ active, hit, children }) {
  return (
    <div
      className={`pod-cell ${active ? "" : "is-dim"} ${hit ? "is-hit" : ""}`}
      style={{
        opacity: active ? 1 : 0.16,
        filter: active ? "none" : "saturate(0.4)",
        transition: "opacity .25s, filter .25s",
        boxShadow: hit ? "0 0 0 2px var(--accent), 0 6px 20px rgba(0,0,0,.08)" : "none",
        position: "relative"
      }}
    >
      {children}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
