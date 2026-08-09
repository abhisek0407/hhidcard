/**
 * ColorwaySelector — PFP frame colorway buttons.
 */
// import { COLORWAYS } from "@/lib/tokens";

// export function ColorwaySelector(props: {
//   colorway: string;
//   onChange: (id: string) => void;
// }) {
//   return (
//     <div className="flex gap-[6px] mt-[14px]" role="group" aria-label="Colourway">
//       {COLORWAYS.map((c) => (
//         <button
//           key={c.id}
//           className={
//             props.colorway === c.id
//               ? "flex-1 appearance-none border-2 border-transparent rounded-xl px-[2px] py-[10px] font-mono text-[9.5px] font-bold tracking-[0.06em] uppercase cursor-pointer opacity-100 -translate-y-0.5 transition-[opacity,transform] duration-180"
//               : "flex-1 appearance-none border-2 border-transparent rounded-xl px-[2px] py-[10px] font-mono text-[9.5px] font-bold tracking-[0.06em] uppercase cursor-pointer opacity-55 transition-[opacity,transform] duration-180"
//           }
//           style={{ background: c.ring, color: c.text, borderColor: c.accent }}
//           onClick={() => props.onChange(c.id)}
//           aria-pressed={props.colorway === c.id}
//         >
//           {c.label}
//         </button>
//       ))}
//     </div>
//   );
// }
/**
 * ColorwaySelector — PFP frame colorway buttons.
 */
import { COLORWAYS } from "@/lib/tokens";

export function ColorwaySelector(props: {
  colorway: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex gap-2">
      {COLORWAYS.map((c) => {
        const selected = props.colorway === c.id;

        return (
          <button
            key={c.id}
            className={
              selected
                ? "flex-1 appearance-none rounded-xl px-[2px] py-[10px] font-mono text-[9.5px] font-bold tracking-[0.06em] uppercase cursor-pointer opacity-100 -translate-y-0.5 transition-[opacity,transform,box-shadow] duration-180 shadow-md"
                : "flex-1 appearance-none rounded-xl px-[2px] py-[10px] font-mono text-[9.5px] font-bold tracking-[0.06em] uppercase cursor-pointer opacity-100 transition-[opacity,transform,box-shadow] duration-180 hover:-translate-y-0.5 hover:shadow-sm"
            }
            style={{
              background: c.ring,
              color: c.text,
              border: `2px solid ${c.accent}`,
              boxShadow: selected
                ? `0 0 0 2px ${c.accent}`
                : "none",
            }}
            onClick={() => props.onChange(c.id)}
            aria-pressed={selected}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}