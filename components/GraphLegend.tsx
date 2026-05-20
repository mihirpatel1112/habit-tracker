export function GraphLegend() {
  return (
    <div aria-label="Graph legend" className="graph-legend" role="group">
      <span className="graph-legend-item">
        <span aria-hidden className="graph-legend-swatch graph-legend-swatch-done" />
        Done
      </span>
      <span className="graph-legend-item">
        <span aria-hidden className="graph-legend-swatch graph-legend-swatch-empty" />
        Missed
      </span>
    </div>
  );
}
