interface Props {
  quality: number; // [0, 1]
}

/** Small colored badge summarizing translation quality. Pure presentational. */
export default function QualityBadge({ quality }: Props) {
  const pct = Math.round(quality * 100);
  const label = quality >= 0.75 ? "Good" : quality >= 0.5 ? "Fair" : "Low";
  const color = quality >= 0.75 ? "#1a7f37" : quality >= 0.5 ? "#9a6700" : "#cf222e";
  return (
    <span style={{ color, fontWeight: 600 }} title={`Quality ${pct}%`}>
      {label} ({pct}%)
    </span>
  );
}
