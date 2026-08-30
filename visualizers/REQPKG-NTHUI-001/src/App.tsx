import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Chevron, MoreGlyph, TeamGlyph, TreeNode } from "./TreeComponents";
import {
  ancestorsFor,
  currentOption,
  decisions,
  fixture,
  grammarOptions,
  identityOptions,
  metadataOptions,
  nodeById,
  scenarioExpansions,
  scenarioLabels,
  type DecisionId,
  type FontPreset,
  type Grammar,
  type IdentityMode,
  type MetadataMode,
  type PanelWidth,
  type Scenario,
  type TeamNode,
} from "./model";

export default function App() {
  const [activeDecision, setActiveDecision] = useState<DecisionId>("DEC-001");
  const [grammar, setGrammar] = useState<Grammar>("hybrid");
  const [metadata, setMetadata] = useState<MetadataMode>("responsive");
  const [identity, setIdentity] = useState<IdentityMode>("icon-label");
  const [reviewed, setReviewed] = useState<Set<DecisionId>>(new Set());
  const [panelWidth, setPanelWidth] = useState<PanelWidth>(320);
  const [fontPreset, setFontPreset] = useState<FontPreset>("default");
  const [scenario, setScenario] = useState<Scenario>("selected");
  const [expanded, setExpanded] = useState<Set<string>>(new Set(scenarioExpansions.selected));
  const [selectedId, setSelectedId] = useState<string | null>("api_e2e_engineer");
  const [focusedId, setFocusedId] = useState("coordinator");
  const [definitionExpanded, setDefinitionExpanded] = useState(true);
  const [expandedRun, setExpandedRun] = useState("run-current");
  const [openRunMenu, setOpenRunMenu] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("Diagnostic fixture ready. Starting treatments are previews, not recommendations.");
  const [stressOpen, setStressOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const treeRef = useRef<HTMLDivElement>(null);

  const selectedAncestors = useMemo(() => new Set(ancestorsFor(selectedId)), [selectedId]);
  const activeDefinition = decisions.find((decision) => decision.id === activeDecision)!;
  const activeOptions = activeDecision === "DEC-001"
    ? grammarOptions
    : activeDecision === "DEC-002"
      ? metadataOptions
      : identityOptions;
  const activeValue = activeDecision === "DEC-001" ? grammar : activeDecision === "DEC-002" ? metadata : identity;
  const selectedOption = activeOptions.find((option) => option.id === activeValue)!;

  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".run-menu-wrap")) setOpenRunMenu(null);
    };
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  const recordTreatment = (id: string) => {
    if (activeDecision === "DEC-001") setGrammar(id as Grammar);
    if (activeDecision === "DEC-002") setMetadata(id as MetadataMode);
    if (activeDecision === "DEC-003") setIdentity(id as IdentityMode);
    setReviewed((previous) => new Set(previous).add(activeDecision));
    const option = activeOptions.find((candidate) => candidate.id === id)!;
    setAnnouncement(`${activeDecision} preference recorded as ${option.label}. Fixture content and state were not changed.`);
  };

  const applyScenario = (nextScenario: Scenario) => {
    setScenario(nextScenario);
    setExpanded(new Set(scenarioExpansions[nextScenario]));
    const nextSelection = nextScenario === "selected" ? "api_e2e_engineer" : null;
    setSelectedId(nextSelection);
    setFocusedId(nextSelection ?? "coordinator");
    setAnnouncement(`${scenarioLabels[nextScenario]} applied. Treatment choices and fixture identities remain unchanged.`);
  };

  const activateNode = (node: TeamNode) => {
    if (node.children?.length) {
      setExpanded((previous) => {
        const next = new Set(previous);
        const willOpen = !next.has(node.id);
        if (willOpen) next.add(node.id);
        else next.delete(node.id);
        setAnnouncement(`${node.role}: ${node.name} ${willOpen ? "expanded" : "collapsed"}. Concrete member selection was not changed.`);
        return next;
      });
      return;
    }
    setSelectedId(node.id);
    setExpanded((previous) => new Set([...previous, ...ancestorsFor(node.id)]));
    setAnnouncement(`${node.role}: ${node.name} selected. Its ancestor chain remains revealed.`);
  };

  const visibleTreeItems = () => Array.from(treeRef.current?.querySelectorAll<HTMLElement>("[data-treeitem]") ?? []);

  const focusTreeItem = (item: HTMLElement | undefined) => {
    if (!item) return;
    setFocusedId(item.dataset.treeitem!);
    requestAnimationFrame(() => item.focus());
  };

  const handleTreeKeyDown = (event: KeyboardEvent<HTMLDivElement>, node: TeamNode) => {
    const items = visibleTreeItems();
    const currentIndex = items.findIndex((item) => item.dataset.treeitem === node.id);
    const parentId = nodeById.get(node.id)?.parentId;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusTreeItem(items[Math.min(items.length - 1, currentIndex + 1)]);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      focusTreeItem(items[Math.max(0, currentIndex - 1)]);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusTreeItem(items[0]);
    } else if (event.key === "End") {
      event.preventDefault();
      focusTreeItem(items.at(-1));
    } else if (event.key === "ArrowRight" && node.children?.length) {
      event.preventDefault();
      if (!expanded.has(node.id)) activateNode(node);
      else focusTreeItem(items.find((item) => item.dataset.parent === node.id));
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      if (node.children?.length && expanded.has(node.id)) activateNode(node);
      else if (parentId) focusTreeItem(items.find((item) => item.dataset.treeitem === parentId));
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activateNode(node);
    }
  };

  const revealSelected = () => {
    const target = selectedId ?? "api_e2e_engineer";
    setSelectedId(target);
    setExpanded((previous) => new Set([...previous, ...ancestorsFor(target)]));
    setFocusedId(target);
    setAnnouncement(`Selected leaf ${nodeById.get(target)?.name} revealed with all ancestors. No other subtree was reset.`);
    requestAnimationFrame(() => treeRef.current?.querySelector<HTMLElement>(`[data-treeitem="${target}"]`)?.focus());
  };

  const quietRefresh = () => {
    setAnnouncement(`Quiet refresh complete: ${expanded.size} expansion choices and ${selectedId ? "the selected member" : "the empty selection"} were preserved.`);
  };

  const resetTree = () => {
    setScenario("selected");
    setExpanded(new Set(scenarioExpansions.selected));
    setSelectedId("api_e2e_engineer");
    setFocusedId("coordinator");
    setDefinitionExpanded(true);
    setExpandedRun("run-current");
    setAnnouncement("Tree reset to the diagnostic selected-leaf state. Review choices were preserved.");
  };

  const reviewSummary = [
    { id: "DEC-001" as DecisionId, label: currentOption(grammarOptions, grammar).label },
    { id: "DEC-002" as DecisionId, label: currentOption(metadataOptions, metadata).label },
    { id: "DEC-003" as DecisionId, label: currentOption(identityOptions, identity).label },
  ];

  const copySummary = async () => {
    const text = reviewSummary.map((item) => `${item.id}: ${reviewed.has(item.id) ? item.label : "Not reviewed"}`).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setAnnouncement("Review choices copied. Requirements Engineering still records and confirms the user's decisions.");
    } catch {
      setAnnouncement("Clipboard access was unavailable. The visible Review choices summary remains available to copy manually.");
    }
  };

  const runs = [
    { id: "run-current", title: "Improve nested Agent Team hierarchy", age: "6m", active: true },
    { id: "run-previous", title: "Review token statistics navigation", age: "23h", active: false },
    { id: "run-older", title: "Compare message and delegation semantics", age: "2d", active: false },
  ];

  return (
    <main className="visualizer-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Requirements visualizer · exploratory · RV-001</p>
          <h1>Which compact tree makes team ancestry obvious?</h1>
          <p className="lede">Compare one visual rule at a time against the same deep Workspace-history fixture. Nothing here is approved or production behavior.</p>
        </div>
        <button className="summary-button" type="button" onClick={() => setSummaryOpen((open) => !open)} aria-expanded={summaryOpen}>
          <span>Review choices</span>
          <strong>{reviewed.size}/3 reviewed</strong>
        </button>
      </header>

      {summaryOpen ? (
        <section className="review-summary" aria-label="Current review choices">
          {reviewSummary.map((item) => (
            <div className="summary-item" key={item.id}><span>{item.id}</span><strong>{reviewed.has(item.id) ? item.label : "Not reviewed"}</strong></div>
          ))}
          <button type="button" className="text-button" onClick={copySummary}>Copy choices</button>
          <p>User preference is evidence, not approval. Requirements Engineering records any accepted decision.</p>
        </section>
      ) : null}

      <nav className="decision-tabs" aria-label="Decisions to compare">
        {decisions.map((decision, index) => (
          <button
            type="button"
            key={decision.id}
            className={activeDecision === decision.id ? "decision-tab is-active" : "decision-tab"}
            onClick={() => setActiveDecision(decision.id)}
            aria-current={activeDecision === decision.id ? "step" : undefined}
          >
            <span className="decision-number">{index + 1}</span>
            <span><small>{decision.id}</small>{decision.short}</span>
            <span className={`review-state${reviewed.has(decision.id) ? " is-reviewed" : ""}`}>{reviewed.has(decision.id) ? "Reviewed" : "Open"}</span>
          </button>
        ))}
      </nav>

      <section className="decision-panel" aria-labelledby="decision-question">
        <div className="decision-copy">
          <p>{activeDefinition.id} · change one variable</p>
          <h2 id="decision-question">{activeDefinition.question}</h2>
        </div>
        <div className="treatment-options" role="radiogroup" aria-label={`${activeDefinition.id} treatment choices`}>
          {activeOptions.map((option) => (
            <button
              type="button"
              role="radio"
              aria-checked={activeValue === option.id}
              className={activeValue === option.id ? "treatment-option is-active" : "treatment-option"}
              key={option.id}
              onClick={() => recordTreatment(option.id)}
            >
              <span className="radio-mark" aria-hidden="true" />
              <strong>{option.label}</strong>
              <span>{option.summary}</span>
            </button>
          ))}
        </div>
      </section>

      <details className="stress-controls" open={stressOpen} onToggle={(event) => setStressOpen(event.currentTarget.open)}>
        <summary>
          <span>Stress test the same fixture</span>
          <small>{panelWidth}px · {fontPreset === "default" ? "Default" : "Extra Large"} · {scenarioLabels[scenario]}</small>
        </summary>
        <div className="stress-grid">
          <fieldset>
            <legend>Panel width</legend>
            <div className="compact-options">
              {([260, 320, 520] as PanelWidth[]).map((width) => <button type="button" className={panelWidth === width ? "is-active" : ""} key={width} onClick={() => setPanelWidth(width)}>{width}px</button>)}
            </div>
          </fieldset>
          <fieldset>
            <legend>App font</legend>
            <div className="compact-options">
              {(["default", "extra-large"] as FontPreset[]).map((font) => <button type="button" className={fontPreset === font ? "is-active" : ""} key={font} onClick={() => setFontPreset(font)}>{font === "default" ? "Default" : "Extra Large"}</button>)}
            </div>
          </fieldset>
          <label className="select-control">
            <span>Fixture state</span>
            <select value={scenario} onChange={(event) => applyScenario(event.target.value as Scenario)}>
              {(Object.keys(scenarioLabels) as Scenario[]).map((key) => <option value={key} key={key}>{scenarioLabels[key]}</option>)}
            </select>
          </label>
          <div className="stress-actions">
            <button type="button" onClick={revealSelected}>Reveal selected leaf</button>
            <button type="button" onClick={quietRefresh}>Quiet refresh</button>
            <button type="button" onClick={resetTree}>Reset tree</button>
          </div>
        </div>
      </details>

      <section className="comparison-stage" aria-label="Interactive Workspace history comparison">
        <div className="stage-toolbar">
          <div><span className="live-dot" aria-hidden="true" />Interactive fixture</div>
          <div className="stage-badges"><span>{panelWidth}px actual width</span><span>{fontPreset === "default" ? "100% type" : "125% type"}</span></div>
        </div>
        <div className="stage-body">
          <div className="prototype-column">
            <div className="panel-ruler" style={{ width: panelWidth }} aria-hidden="true"><span>← {panelWidth}px →</span></div>
            <aside
              className={`history-panel grammar-${grammar} metadata-${metadata} identity-${identity} font-${fontPreset}`}
              style={{ width: panelWidth }}
              data-panel-width={panelWidth}
              aria-label={`Workspace history, ${panelWidth} pixels, ${fontPreset} font`}
            >
              <header className="history-header">
                <div><span className="history-kicker">Workspace</span><h3>History</h3></div>
                <span className="sync-state">Synced quietly</span>
              </header>
              <div className="definition-group">
                <button type="button" className="definition-row" aria-expanded={definitionExpanded} onClick={() => setDefinitionExpanded((open) => !open)}>
                  <Chevron open={definitionExpanded} />
                  <span className="definition-mark" aria-hidden="true"><TeamGlyph /></span>
                  <span className="definition-copy"><small>Team definition · 3 runs</small><strong>Software Development Department</strong></span>
                </button>
                {definitionExpanded ? (
                  <div className="run-list">
                    {runs.map((run) => {
                      const isOpen = expandedRun === run.id;
                      return (
                        <div className={`run-wrap${isOpen ? " is-open" : ""}`} key={run.id}>
                          <div className="run-row">
                            <button
                              type="button"
                              className="run-main"
                              aria-expanded={isOpen}
                              onClick={() => {
                                setExpandedRun(run.id);
                                setAnnouncement(`${run.title} expanded. Other task/team runs remain grouped under the same definition.`);
                              }}
                            >
                              <Chevron open={isOpen} />
                              <span className={`run-state${run.active ? " is-active" : ""}`} aria-hidden="true" />
                              <span className="run-copy"><small>{run.active ? "Active team run" : "Team run"}</small><strong>{run.title}</strong></span>
                            </button>
                            <span className="run-age">{run.age}</span>
                            <div className="run-menu-wrap">
                              <button
                                type="button"
                                className="icon-button"
                                aria-label={`Actions for ${run.title}`}
                                aria-haspopup="menu"
                                aria-expanded={openRunMenu === run.id}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setOpenRunMenu((current) => current === run.id ? null : run.id);
                                }}
                              ><MoreGlyph /></button>
                              {openRunMenu === run.id ? (
                                <div className="run-menu" role="menu">
                                  {run.active ? <button type="button" role="menuitem" onClick={() => setAnnouncement("Terminate run remains available; this visualizer does not execute it.")}>Terminate run</button> : (
                                    <><button type="button" role="menuitem" onClick={() => setAnnouncement("Archive remains available; this visualizer does not execute it.")}>Archive history</button><button type="button" role="menuitem" onClick={() => setAnnouncement("Delete remains available; this visualizer does not execute it.")}>Delete permanently</button></>
                                  )}
                                </div>
                              ) : null}
                            </div>
                          </div>
                          {isOpen ? (
                            <div className="team-tree" role="tree" aria-label={`Execution hierarchy for ${run.title}`} ref={treeRef}>
                              {fixture.map((node, index) => (
                                <TreeNode
                                  key={node.id}
                                  node={node}
                                  level={1}
                                  index={index}
                                  setSize={fixture.length}
                                  expanded={expanded}
                                  selectedId={selectedId}
                                  selectedAncestors={selectedAncestors}
                                  focusedId={focusedId}
                                  identity={identity}
                                  metadata={metadata}
                                  panelWidth={panelWidth}
                                  onActivate={activateNode}
                                  onFocus={setFocusedId}
                                  onKeyDown={handleTreeKeyDown}
                                />
                              ))}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </aside>
          </div>

          <aside className="inspection-card" aria-label="What to inspect">
            <span>{activeDecision} · previewing</span>
            <h3>{selectedOption.label}</h3>
            <p>{selectedOption.evidence}</p>
            <dl>
              <div><dt>Fixture</dt><dd>Identical across treatments</dd></div>
              <div><dt>Selection</dt><dd>{selectedId ? nodeById.get(selectedId)?.name : "None"}</dd></div>
              <div><dt>Open teams</dt><dd>{expanded.size}</dd></div>
            </dl>
            <details>
              <summary>Keyboard + identity help</summary>
              <p>Tab into the tree. Use ↑/↓ to move, ←/→ to collapse or enter a team, and Enter/Space to toggle or select. Focus or hover any truncated row for its full name, role, status, and age.</p>
            </details>
            <details>
              <summary>Model boundary</summary>
              <p>Status, age, refresh, actions, and topology are deterministic synthetic fixtures. Exact/aggregate labels are preserved for review; no backend or persistence behavior is exercised.</p>
            </details>
          </aside>
        </div>
      </section>

      <div className="sr-announcement" role="status" aria-live="polite">{announcement}</div>
      <footer className="page-footer">
        <p><strong>Review signal:</strong> Can you trace the selected leaf to its immediate and root teams, then name one preferred treatment for each decision?</p>
        <p>Package <code>nested-team-hierarchy-ui</code> · Product ticket <code>REQPKG-NTHUI-001</code> · exploratory evidence only</p>
      </footer>
    </main>
  );
}
