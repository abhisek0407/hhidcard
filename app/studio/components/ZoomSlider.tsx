/**
 * ZoomSlider — range input for photo zoom.
 */
export function ZoomSlider(props: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center gap-3 mt-[14px]">
      <label htmlFor={props.id} className="font-mono text-[10px] font-bold tracking-[0.12em] uppercase text-ink/55 flex-none">
        {props.label}
      </label>
      <input
        id={props.id}
        type="range"
        min={1}
        max={3}
        step={0.01}
        value={props.value}
        onChange={(e) => props.onChange(Number(e.target.value))}
      />
    </div>
  );
}