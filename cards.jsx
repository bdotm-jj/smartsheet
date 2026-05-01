// Pod card component — Dossier theme
// Loaded after data.js. Exposes window.PodCard, window.podHelpers.

function nameMatches(name, query) {
  if (!query) return true;
  return name.toLowerCase().includes(query.toLowerCase());
}

function podHasPerson(pod, personName) {
  if (!personName) return false;
  return Object.values(pod.roster).some(list => list.includes(personName));
}

function totalCount(pod) {
  return Object.values(pod.roster).reduce((a, l) => a + l.length, 0);
}

function Person({ name, query, activePerson, onClick }) {
  const isActive = activePerson === name;
  const isHit = query && nameMatches(name, query);
  let label = name;
  if (isHit && query) {
    const i = name.toLowerCase().indexOf(query.toLowerCase());
    label = (
      <>
        {name.slice(0, i)}
        <mark style={{
          background: "transparent",
          color: "var(--accent-deep)",
          fontStyle: "italic",
          fontWeight: 600,
          textDecoration: "underline",
          textDecorationColor: "var(--accent)",
          textUnderlineOffset: "3px",
        }}>{name.slice(i, i + query.length)}</mark>
        {name.slice(i + query.length)}
      </>
    );
  }
  return (
    <button
      className={`person${isActive ? " active" : ""}`}
      onClick={(e) => { e.stopPropagation(); onClick(name); }}
    >{label}</button>
  );
}

// ── DOSSIER CARD ──────────────────────────────────────────────
function DossierCard({ pod, query, activePerson, onPersonClick }) {
  const rows = [
    { key: "PM",  list: pod.roster.PM  },
    { key: "PJM", list: pod.roster.PJM },
    { key: "Dev", list: pod.roster.Dev },
    { key: "QA",  list: pod.roster.QA  }
  ];
  return (
    <div className="pod">
      <span className="tick-bl"></span><span className="tick-br"></span>
      <div className="pod-mark">
        <div className="pod-name">{pod.name}</div>
        <div className="pod-meta-stack">
          <div className="pod-code">№ {pod.code}</div>
          <div className="pod-lob">{pod.lob}</div>
        </div>
      </div>

      <div className="roster">
        {rows.map(({ key, list }) => (
          <div className={`row${list.length === 0 ? " empty" : ""}`} key={key}>
            <div className="role-key">{key}<span style={{marginLeft:6, color:"var(--ink-40)"}}>{String(list.length).padStart(2,"0")}</span></div>
            <div>
              {list.length === 0 && <span style={{fontFamily:"var(--serif)", fontStyle:"italic", color:"var(--ink-40)"}}>— vacant —</span>}
              {list.map(n => (
                <Person key={n} name={n} query={query} activePerson={activePerson} onClick={onPersonClick} />
              ))}
            </div>
            <div className="role-rule"></div>
          </div>
        ))}
      </div>

      <div className="pod-foot">
        <span>Members</span>
        <span>{totalCount(pod)}</span>
      </div>
    </div>
  );
}

window.PodCard = { DossierCard };
window.podHelpers = { totalCount, podHasPerson, nameMatches };
