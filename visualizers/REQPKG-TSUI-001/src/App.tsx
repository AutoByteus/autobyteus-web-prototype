import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";

type Direction = "focus" | "dense";
type Scene = "partial" | "comparable" | "filters" | "evidence" | "runs" | "narrow";
type Metric = "tokens" | "cost";
type RunGrouping = "task" | "model";

const usageRows = [
  { id: "codex", label: "Codex · GPT-5.6 Sol", context: "Runtime + model", input: "61,200", output: "18,800", tokens: "80,000", cost: "$0.42", share: 52.6, status: "Partial price", currency: "USD", cache: "11,280", thinking: "5,640" },
  { id: "claude", label: "Claude SDK · Sonnet 4.5", context: "Runtime + model", input: "36,900", output: "12,100", tokens: "49,000", cost: "$0.36", share: 32.2, status: "Estimated", currency: "USD", cache: "7,380", thinking: "2,420" },
  { id: "local", label: "Autobyteus · Local model", context: "Runtime + model", input: "16,900", output: "6,100", tokens: "23,000", cost: "No API bill", share: 15.2, status: "Local", currency: "—", cache: "2,600", thinking: "1,220" },
];

function Icon({ name, size = 16 }: { name: "filter" | "download" | "chevron" | "info" | "check" | "table"; size?: number }) {
  const paths: Record<typeof name, ReactNode> = {
    filter: <path d="M3 5h18M6 12h12M10 19h4" />,
    download: <><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></>,
    chevron: <path d="m8 10 4 4 4-4" />,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    table: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M9 9v11" /></>,
  };
  return <svg aria-hidden="true" className="icon" fill="none" height={size} viewBox="0 0 24 24" width={size}>{paths[name]}</svg>;
}

function readDirection(): Direction {
  return new URLSearchParams(window.location.search).get("direction") === "dense" ? "dense" : "focus";
}

function readScene(): Scene {
  const value = new URLSearchParams(window.location.search).get("scene");
  return value === "comparable" || value === "filters" || value === "evidence" || value === "runs" || value === "narrow" ? value : "partial";
}

function App() {
  const direction = readDirection();
  const initialScene = readScene();
  const [scene, setScene] = useState<Scene>(initialScene);
  const [navWidth, setNavWidth] = useState(initialScene === "narrow" ? 300 : 216);
  const [metric, setMetric] = useState<Metric>("tokens");
  const [filterOpen, setFilterOpen] = useState(initialScene === "filters");
  const [filterApplied, setFilterApplied] = useState(initialScene === "filters");
  const [rangeOpen, setRangeOpen] = useState(false);
  const [evidenceOpen, setEvidenceOpen] = useState<string | null>(initialScene === "evidence" ? "codex" : null);
  const [runGrouping, setRunGrouping] = useState<RunGrouping>("task");
  const [teamExpanded, setTeamExpanded] = useState(true);
  const [exported, setExported] = useState(false);
  const dragOrigin = useRef<{ x: number; width: number } | null>(null);

  const isFull = scene === "comparable";
  const isNarrow = scene === "narrow";
  const filtersVisible = scene === "filters" || filterOpen;
  const exactVisible = scene === "evidence";

  const selectScene = (next: Scene) => {
    setScene(next);
    setFilterOpen(next === "filters");
    setFilterApplied(next === "filters");
    setEvidenceOpen(next === "evidence" ? "codex" : null);
    setExported(false);
    const params = new URLSearchParams(window.location.search);
    params.set("direction", direction);
    if (next === "partial") params.delete("scene");
    else params.set("scene", next);
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
  };

  const selectRange = (preset: string) => {
    setRangeOpen(false);
    if (preset === "Last month") selectScene("comparable");
    else if (preset === "This month") selectScene("partial");
  };

  const beginResize = (event: PointerEvent<HTMLDivElement>) => {
    dragOrigin.current = { x: event.clientX, width: navWidth };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const resize = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragOrigin.current) return;
    setNavWidth(Math.min(300, Math.max(176, dragOrigin.current.width + event.clientX - dragOrigin.current.x)));
  };
  const endResize = (event: PointerEvent<HTMLDivElement>) => {
    dragOrigin.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const resizeWithKeyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      setNavWidth((current) => Math.min(300, Math.max(176, current + (event.key === "ArrowRight" ? 8 : -8))));
    }
  };

  return (
    <main className="review-app">
      <section className={`frame-stage ${isNarrow ? "is-constrained" : ""}`} aria-label={`Token Statistics ${direction === "focus" ? "focused hierarchy" : "dense explorer"}`}>
        <div className={`product-frame direction-${direction}`} style={{ "--nav-width": `${navWidth}px` } as CSSProperties}>
          <SettingsNav />
          <div
            aria-label="Resize Settings navigation"
            aria-orientation="vertical"
            aria-valuemax={300}
            aria-valuemin={176}
            aria-valuenow={navWidth}
            className="nav-resizer"
            onKeyDown={resizeWithKeyboard}
            onPointerDown={beginResize}
            onPointerMove={resize}
            onPointerUp={endResize}
            role="separator"
            tabIndex={0}
            title="Drag or use arrow keys"
          ><span /></div>
          <section className="settings-content">
            <div className="view-tabs" role="tablist" aria-label="Token Statistics views">
              <button aria-selected={scene !== "runs"} onClick={() => selectScene("partial")} role="tab" type="button">Analytics</button>
              <button aria-selected={scene === "runs"} onClick={() => selectScene("runs")} role="tab" type="button">Run details</button>
            </div>
            {scene === "runs" ? (
              <RunDetails direction={direction} grouping={runGrouping} setGrouping={setRunGrouping} teamExpanded={teamExpanded} setTeamExpanded={setTeamExpanded} />
            ) : (
              <Analytics
                direction={direction}
                exactVisible={exactVisible}
                evidenceOpen={evidenceOpen}
                exported={exported}
                filterApplied={filterApplied}
                filtersVisible={filtersVisible}
                full={isFull}
                metric={metric}
                onRangeSelection={selectRange}
                rangeOpen={rangeOpen}
                setEvidenceOpen={setEvidenceOpen}
                setExported={setExported}
                setFilterApplied={setFilterApplied}
                setFilterOpen={setFilterOpen}
                setMetric={setMetric}
                setRangeOpen={setRangeOpen}
              />
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
function SettingsNav() {
  const items = ["API Keys", "Token Statistics", "Messaging", "Display", "Language", "Local Tools", "MCP Servers", "Application Packages", "Agent Packages", "Server Settings", "Extensions", "Updates"];
  return <aside className="settings-nav" aria-label="Settings navigation">
    <button className="back-link" type="button"><span aria-hidden="true">←</span> Back to Workspace</button>
    <nav><ul>{items.map((item) => <li key={item}><button aria-current={item === "Token Statistics" ? "page" : undefined} type="button">{item}</button></li>)}</ul></nav>
  </aside>;
}

type AnalyticsProps = {
  direction: Direction;
  exactVisible: boolean;
  evidenceOpen: string | null;
  exported: boolean;
  filterApplied: boolean;
  filtersVisible: boolean;
  full: boolean;
  metric: Metric;
  rangeOpen: boolean;
  onRangeSelection: (preset: string) => void;
  setEvidenceOpen: (value: string | null) => void;
  setExported: (value: boolean) => void;
  setFilterApplied: (value: boolean) => void;
  setFilterOpen: (value: boolean) => void;
  setMetric: (value: Metric) => void;
  setRangeOpen: (value: boolean) => void;
};

function Analytics(props: AnalyticsProps) {
  const total = props.filterApplied ? "80K" : "152K";
  const totalExact = props.filterApplied ? "80,000" : "152,000";
  const cost = props.filterApplied ? "$0.42" : props.full ? "$1.17" : "$0.87";
  const composition = props.filterApplied
    ? { uncached: "49.92K", cached: "11.28K", output: "18.8K", input: "61.2K", cacheRate: "18.4%" }
    : { uncached: "93.74K", cached: "21.26K", output: "37K", input: "115K", cacheRate: "18.5%" };
  const usageData = props.filterApplied ? usageRows.slice(0, 1) : usageRows;

  if (props.direction === "dense") {
    return <div className="analytics dense-layout">
      <DenseControls {...props} />
      <div className={`dense-status ${props.full ? "full" : "partial"}`}>
        <span><span className="status-dot" /> {props.full ? "Full analytics coverage" : "Partial coverage since Aug 11"}</span>
        <span>{props.full ? "Complete pricing" : "Some usage is unpriced"}</span>
      </div>
      <section className="metric-ledger composition-ledger" aria-label="Usage and cache summary">
        <div className="metric-primary"><span>Total tokens</span><strong>{total}</strong><small>{totalExact} exact</small></div>
        <div><span>Uncached input</span><strong>{composition.uncached}</strong><small>Standard-rate input</small></div>
        <div><span>Cached input</span><strong>{composition.cached}</strong><small>Cache reads</small></div>
        <div><span>Output</span><strong>{composition.output}</strong><small>Generated tokens</small></div>
        <div><span>Estimated API cost</span><strong>{cost}</strong><small>{props.full ? "Complete estimate" : "Partial estimate"}</small></div>
        <div><span>Cache hit rate</span><strong>{composition.cacheRate}</strong><small>{composition.cached} of {composition.input} input</small></div>
      </section>
      <div className="dense-analysis-grid essentials-only">
        <section className="plain-section trend-section"><SectionHeading title="Usage over time" meta="Aug 1–29 · UTC" /><TrendChart compact filtered={props.filterApplied} metric={props.metric} full={props.full} /></section>
      </div>
      <DenseEvidence exactVisible={props.exactVisible} evidenceOpen={props.evidenceOpen} rows={usageData} setEvidenceOpen={props.setEvidenceOpen} />
      {props.exported && <div className="toast" role="status"><Icon name="check" /> Local CSV prepared for the applied result.</div>}
    </div>;
  }

  return <div className="analytics focus-layout">
    <FocusControls {...props} />
    {props.filtersVisible && <FilterPanel applied={props.filterApplied} setApplied={props.setFilterApplied} />}
    <section className="hero-summary even-summary" aria-label="Usage and cache summary">
      <div className="summary-context"><span className={`coverage-badge ${props.full ? "full" : "partial"}`}><span className="status-dot" /> {props.full ? "Full coverage" : "Partial coverage"}</span><span>Aug 1–29 · UTC</span></div>
      <div className="summary-metric summary-primary"><span>Total tokens</span><strong>{total}</strong><small>{totalExact} exact</small></div>
      <div className="summary-metric"><span>Uncached input</span><strong>{composition.uncached}</strong><small>Standard-rate input</small></div>
      <div className="summary-metric"><span>Cached input</span><strong>{composition.cached}</strong><small>Cache reads</small></div>
      <div className="summary-metric"><span>Output</span><strong>{composition.output}</strong><small>Generated tokens</small></div>
      <div className="summary-metric"><span>Estimated API cost</span><strong>{cost}</strong><small>{props.full ? "Complete estimate" : "Partial · some usage unpriced"}</small></div>
      <div className="summary-metric"><span>Cache hit rate</span><strong>{composition.cacheRate}</strong><small>{composition.cached} of {composition.input} input</small></div>
    </section>
    <div className="focus-analysis-grid essentials-only">
      <section className="surface-section trend-section"><SectionHeading title="Usage over time" meta="Daily points · exact buckets remain available" /><TrendChart filtered={props.filterApplied} metric={props.metric} full={props.full} /></section>
    </div>
    <FocusEvidence exactVisible={props.exactVisible} evidenceOpen={props.evidenceOpen} rows={usageData} setEvidenceOpen={props.setEvidenceOpen} />
    {props.exported && <div className="toast" role="status"><Icon name="check" /> Local CSV prepared for the applied result.</div>}
  </div>;
}

function FocusControls(props: AnalyticsProps) {
  const activeRange = props.full ? "Last month" : "This month";
  return <section className="focus-toolbar" aria-label="Analytics controls">
    <div className="range-control">
      <button aria-expanded={props.rangeOpen} className="toolbar-button range-button" onClick={() => props.setRangeOpen(!props.rangeOpen)} type="button"><span><small>UTC range</small>{activeRange}</span><Icon name="chevron" /></button>
      {props.rangeOpen && <div className="range-menu" role="menu">
        {["This month", "Last month", "Last 3 months", "Last 12 months", "Custom…"].map((item) => <button className={item === activeRange ? "active" : ""} key={item} onClick={() => props.onRangeSelection(item)} role="menuitem" type="button">{item}{item === activeRange && <Icon name="check" />}</button>)}
        <p>Preset and Custom dates use fixed UTC boundaries.</p>
      </div>}
    </div>
    <button aria-expanded={props.filtersVisible} className={`toolbar-button ${props.filterApplied ? "active" : ""}`} onClick={() => props.setFilterOpen(!props.filtersVisible)} type="button"><Icon name="filter" /> Filters {props.filterApplied && <span className="count">1</span>}</button>
    <div className="metric-toggle" role="radiogroup" aria-label="Metric"><button aria-checked={props.metric === "tokens"} onClick={() => props.setMetric("tokens")} role="radio" type="button">Tokens</button><button aria-checked={props.metric === "cost"} onClick={() => props.setMetric("cost")} role="radio" type="button">Cost</button></div>
    <div className="context-summary"><span>{props.filterApplied ? "Runtime: Codex" : "All tracked usage"}</span>{props.filterApplied && <button onClick={() => props.setFilterApplied(false)} type="button">Clear</button>}</div>
    <button className="toolbar-button export-button" onClick={() => props.setExported(true)} type="button"><Icon name="download" /> Export CSV</button>
  </section>;
}

function DenseControls(props: AnalyticsProps) {
  return <section className="dense-toolbar" aria-label="Analytics controls">
    <label><span>UTC range</span><select value={props.full ? "last" : "this"} onChange={(event) => props.onRangeSelection(event.target.value === "last" ? "Last month" : event.target.value === "this" ? "This month" : event.target.value)}><option value="this">This month</option><option value="last">Last month</option><option value="Last 3 months">Last 3 months</option><option value="Last 12 months">Last 12 months</option><option value="Custom…">Custom…</option></select></label>
    <label><span>Runtime</span><select value={props.filterApplied ? "codex" : "all"} onChange={(e) => props.setFilterApplied(e.target.value !== "all")}><option value="all">All</option><option value="codex">Codex</option><option value="auto">Autobyteus</option></select></label>
    <label><span>Provider</span><select><option>All</option><option>OpenAI</option><option>Anthropic</option><option>Local</option></select></label>
    <label><span>Model</span><select><option>All</option><option>GPT-5.6 Sol</option><option>Sonnet 4.5</option></select></label>
    <div className="metric-toggle compact" role="radiogroup" aria-label="Metric"><button aria-checked={props.metric === "tokens"} onClick={() => props.setMetric("tokens")} role="radio" type="button">Tokens</button><button aria-checked={props.metric === "cost"} onClick={() => props.setMetric("cost")} role="radio" type="button">Cost</button></div>
    <button className="icon-button" onClick={() => props.setExported(true)} title="Export current result as CSV" type="button"><Icon name="download" /><span>CSV</span></button>
  </section>;
}

function FilterPanel({ applied, setApplied }: { applied: boolean; setApplied: (value: boolean) => void }) {
  return <section className="filter-panel" aria-label="Filters">
    <div className="filter-panel-heading"><div><strong>Filter current result</strong><span>Selections refetch one coherent result.</span></div><button onClick={() => setApplied(false)} type="button">Clear all</button></div>
    <div className="filter-fields">
      <label><span>Runtime</span><select defaultValue={applied ? "codex" : "all"}><option value="all">All runtimes</option><option value="codex">Codex</option><option>Autobyteus</option><option>Claude SDK</option></select></label>
      <label><span>Provider</span><select><option>All providers</option><option>OpenAI</option><option>Anthropic</option><option>Local</option></select></label>
      <label><span>Model</span><select><option>All models</option><option>GPT-5.6 Sol</option><option>Claude Sonnet 4.5</option><option>Prototype Local Model</option></select></label>
      <button className="apply-button" onClick={() => setApplied(true)} type="button">Apply filters</button>
    </div>
  </section>;
}

function SectionHeading({ title, meta }: { title: string; meta: string }) {
  return <div className="section-heading"><div><h3>{title}</h3><p>{meta}</p></div><button aria-label={`More options for ${title}`} type="button">•••</button></div>;
}

function TrendChart({ compact = false, filtered, metric, full }: { compact?: boolean; filtered: boolean; metric: Metric; full: boolean }) {
  const tokenValues = filtered
    ? [2, 2, 0, 3, 4, 3, 2, 4, 3, 0, 4, 2, 3, 5, 3, 2, 0, 2, 4, 4, 3, 3, 2, 5, 3, 2, 3, 4, 3]
    : [3, 4, 0, 6, 7, 5, 4, 8, 5, 0, 7, 4, 6, 9, 5, 3, 0, 4, 8, 7, 5, 6, 4, 10, 5, 3, 6, 8, 10];
  const costTotal = filtered ? 0.42 : full ? 1.17 : 0.87;
  const tokenTotal = tokenValues.reduce((sum, value) => sum + value, 0);
  const values = metric === "tokens" ? tokenValues : tokenValues.map((value) => value * costTotal / tokenTotal);
  const max = Math.max(...values);
  const points = values.map((value, index) => ({
    day: index + 1,
    value,
    x: 2 + (index / (values.length - 1)) * 96,
    y: 88 - (value / max) * 76,
  }));
  const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const emphasisDays = new Set([1, 8, 15, 22, 29]);
  const formatValue = (value: number) => metric === "tokens" ? `${value}K` : `$${value.toFixed(2)}`;
  const exactSeries = points.map((point) => `Aug ${point.day}: ${metric === "tokens" ? `${point.value * 1000} tokens` : `$${point.value.toFixed(4)}`}`).join(", ");
  return <div className={`trend-chart ${compact ? "compact" : ""}`}>
    <div aria-hidden="true" className="chart-y-axis">
      <strong>{metric === "tokens" ? "Tokens" : "Cost (USD)"}</strong>
      <div className="chart-y-labels"><span>{formatValue(max)}</span><span>{formatValue(max / 2)}</span><span>0</span></div>
    </div>
    <div className="line-chart-shell" role="img" aria-label={`${metric === "tokens" ? "Token" : "Estimated cost"} usage across 29 daily UTC buckets. X-axis: date in UTC. Y-axis: ${metric === "tokens" ? "tokens" : "estimated cost in USD"}. ${exactSeries}`}>
      <div className="line-plot">
        <svg aria-hidden="true" className="trend-line-svg" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path className="trend-line" d={linePath} vectorEffect="non-scaling-stroke" />
        </svg>
        {points.map((point) => <span className={`trend-point-wrap ${emphasisDays.has(point.day) ? "emphasis" : ""}`} key={point.day} style={{ left: `${point.x}%`, top: `${point.y}%` }}>
          {emphasisDays.has(point.day) && point.value > 0 && <span className="trend-point-value">{formatValue(point.value)}</span>}
          <span className="trend-point" />
        </span>)}
      </div>
      <div aria-hidden="true" className="line-x-labels"><span>Aug 1</span><span>Aug 8</span><span>Aug 15</span><span>Aug 22</span><span>Aug 29</span></div>
    </div>
  </div>;
}

function FocusEvidence({ exactVisible, evidenceOpen, rows, setEvidenceOpen }: { exactVisible: boolean; evidenceOpen: string | null; rows: typeof usageRows; setEvidenceOpen: (value: string | null) => void }) {
  return <section className={`surface-section evidence-section ${exactVisible ? "emphasis" : ""}`}>
    <div className="evidence-title"><div><h3>Detailed usage</h3><p>Usage by runtime and model. Open a row for exact token and cost details.</p></div><select aria-label="Breakdown grouping"><option>Runtime + model</option><option>Runtime</option><option>Provider</option><option>Model</option></select></div>
    <div className="priority-table" role="table" aria-label="Exact usage by runtime and model">
      <div className="priority-row header" role="row"><span role="columnheader">Runtime / model</span><span role="columnheader">Tokens</span><span role="columnheader">Estimated cost</span><span role="columnheader">Share</span><span role="columnheader">Details</span></div>
      {rows.map((row) => <div className="priority-row-wrap" key={row.id}>
        <div className="priority-row" role="row"><span className="row-identity" role="cell"><strong>{row.label}</strong><small>{row.context}</small></span><span className="tabular" role="cell">{row.tokens}</span><span className="tabular" role="cell">{row.cost}<small>{row.status}</small></span><span className="tabular" role="cell">{row.share}%</span><span role="cell"><button aria-expanded={evidenceOpen === row.id} className="evidence-button" onClick={() => setEvidenceOpen(evidenceOpen === row.id ? null : row.id)} type="button">{evidenceOpen === row.id ? "Hide" : "Details"}<Icon name="chevron" /></button></span></div>
        {evidenceOpen === row.id && <div className="row-evidence"><span><small>Input</small>{row.input}</span><span><small>Output</small>{row.output}</span><span><small>Cache read</small>{row.cache}</span><span><small>Thinking</small>{row.thinking}</span><span><small>Cost status</small>{row.status}</span><span><small>Currency</small>{row.currency}</span></div>}
      </div>)}
    </div>
  </section>;
}

function DenseEvidence({ exactVisible, evidenceOpen, rows, setEvidenceOpen }: { exactVisible: boolean; evidenceOpen: string | null; rows: typeof usageRows; setEvidenceOpen: (value: string | null) => void }) {
  const selected = rows.find((row) => row.id === evidenceOpen) ?? rows[0];
  const inspectorVisible = exactVisible || evidenceOpen !== null;
  return <section className={`plain-section dense-evidence ${inspectorVisible ? "with-inspector" : ""}`}>
    <div className="evidence-title"><div><h3>Detailed usage</h3><p>Usage by runtime and model with exact token and cost evidence.</p></div><select aria-label="Breakdown grouping"><option>Runtime + model</option><option>Runtime</option><option>Provider</option><option>Model</option></select></div>
    <div className="dense-evidence-body">
      <div className="dense-table-wrap"><table><thead><tr><th>Runtime / model</th><th>Input</th><th>Output</th><th>Total</th><th>Cost</th><th>Share</th></tr></thead><tbody>{rows.map((row) => <tr aria-selected={selected?.id === row.id} key={row.id} onClick={() => setEvidenceOpen(row.id)}><td><strong>{row.label}</strong><small>{row.status}</small></td><td>{row.input}</td><td>{row.output}</td><td>{row.tokens}</td><td>{row.cost}</td><td>{row.share}%</td></tr>)}</tbody></table></div>
      {inspectorVisible && selected && <aside className="evidence-inspector"><p>Selected evidence</p><h4>{selected.label}</h4><dl><div><dt>Cache read</dt><dd>{selected.cache}</dd></div><div><dt>Thinking</dt><dd>{selected.thinking}</dd></div><div><dt>Cost status</dt><dd>{selected.status}</dd></div><div><dt>Currency</dt><dd>{selected.currency}</dd></div></dl><span>Exact CSV fields remain unchanged.</span></aside>}
    </div>
  </section>;
}

function RunDetails({ direction, grouping, setGrouping, teamExpanded, setTeamExpanded }: { direction: Direction; grouping: RunGrouping; setGrouping: (value: RunGrouping) => void; teamExpanded: boolean; setTeamExpanded: (value: boolean) => void }) {
  const focus = direction === "focus";
  return <div className={`run-details ${focus ? "run-focus" : "run-dense"}`}>
    <section className="run-toolbar">
      <div className="run-range"><span className="run-kicker">Runs created</span><button type="button">Aug 22, 2026</button><span>to</span><button type="button">Aug 29, 2026</button></div>
      <div className="metric-toggle compact" role="radiogroup" aria-label="Run details grouping"><button aria-checked={grouping === "task"} onClick={() => setGrouping("task")} role="radio" type="button">Task</button><button aria-checked={grouping === "model"} onClick={() => setGrouping("model")} role="radio" type="button">Model</button></div>
      <button className="fetch-button" type="button">Fetch statistics</button>
      <p><Icon name="info" /> Range selects runs by creation time; totals show each selected run’s lifetime usage.</p>
    </section>
    {grouping === "model" ? <ModelRunTable focus={focus} /> : <TaskRunTable focus={focus} teamExpanded={teamExpanded} setTeamExpanded={setTeamExpanded} />}
  </div>;
}

function TaskRunTable({ focus, teamExpanded, setTeamExpanded }: { focus: boolean; teamExpanded: boolean; setTeamExpanded: (value: boolean) => void }) {
  return <section className="run-table-section"><div className="run-table-heading"><div><h3>Lifetime usage by task / run</h3><p>{focus ? "Primary totals stay scannable; diagnostics remain attached." : "Existing dense evidence retained inside the unified shell."}</p></div><span>2 results</span></div><div className="run-table-wrap"><table className="run-table"><thead><tr><th>Task / Run</th><th>Runtime</th><th>Model(s)</th><th>Input</th><th>Output</th><th>Total cost</th><th>Created</th></tr></thead><tbody><tr className="team-row"><td><button aria-expanded={teamExpanded} onClick={() => setTeamExpanded(!teamExpanded)} type="button"><span className="disclosure">{teamExpanded ? "▾" : "▸"}</span><span><strong>Product Review Team</strong><small>“Validate current Token Statistics experience”</small></span></button></td><td>Mixed</td><td>GPT-5.6 Sol<br />Sonnet 4.5</td><td>88,000</td><td>27,000</td><td><strong>$0.9900</strong></td><td>Aug 28, 09:00</td></tr>{teamExpanded && <><tr className="child-row"><td><span>↳ /researcher</span><small>Inspect selected source evidence</small></td><td>Codex</td><td>GPT-5.6 Sol</td><td>52,000</td><td>15,000</td><td>$0.5600</td><td>Lifetime total</td></tr><tr className="child-row"><td><span>↳ /writer</span><small>Prepare review package</small></td><td>Claude SDK</td><td>Sonnet 4.5</td><td>36,000</td><td>12,000</td><td>$0.4300</td><td>Lifetime total</td></tr></>}<tr><td><strong>Research Assistant</strong><small>“Inspect selected source evidence”</small></td><td>Autobyteus</td><td>GPT Prototype</td><td>21,000</td><td>6,500</td><td><strong>$0.2400</strong></td><td>Aug 27, 03:30</td></tr></tbody></table></div></section>;
}

function ModelRunTable({ focus }: { focus: boolean }) {
  return <section className="run-table-section"><div className="run-table-heading"><div><h3>Lifetime usage by model</h3><p>{focus ? "Same evidence language as Analytics." : "Dense diagnostics retained."}</p></div><span>3 models</span></div><div className="run-table-wrap"><table className="run-table"><thead><tr><th>Runtime / Model</th><th>Input</th><th>Output</th><th>Cache read</th><th>Thinking</th><th>Total cost</th></tr></thead><tbody><tr><td><strong>Codex · GPT-5.6 Sol</strong></td><td>61,200</td><td>18,800</td><td>11,280</td><td>5,640</td><td>$0.4200</td></tr><tr><td><strong>Claude SDK · Sonnet 4.5</strong></td><td>36,900</td><td>12,100</td><td>7,380</td><td>2,420</td><td>$0.3600</td></tr><tr><td><strong>Autobyteus · Local model</strong></td><td>16,900</td><td>6,100</td><td>2,600</td><td>1,220</td><td>No API bill</td></tr></tbody></table></div></section>;
}

export default App;
