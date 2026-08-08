/**
 * IdFormFields — name / role / builder title inputs + reroll button.
 */
const inputCls =
  "w-full font-display text-base text-ink bg-white border border-green/28 rounded-xl px-[13px] py-3 focus:outline-none focus:border-pink focus:shadow-[0_0_0_3px_rgba(255,0,128,0.16)]";
const labelCls =
  "block font-mono text-[10px] font-bold tracking-[0.12em] uppercase text-ink/55 mb-[6px]";

export function IdFormFields(props: {
  name: string;
  role: string;
  title: string;
  onNameChange: (v: string) => void;
  onRoleChange: (v: string) => void;
  onTitleChange: (v: string) => void;
  onReroll: () => void;
}) {
  return (
    <div className="grid gap-3 mt-4">
      <div>
        <label htmlFor="fName" className={labelCls}>Name</label>
        <input id="fName" maxLength={22} placeholder="Krishna" value={props.name}
          onChange={(e) => props.onNameChange(e.target.value)}
          className={inputCls} />
      </div>
      <div>
        <label htmlFor="fRole" className={labelCls}>Stack / role</label>
        <input id="fRole" maxLength={26} placeholder="Full-stack · Web3" value={props.role}
          onChange={(e) => props.onRoleChange(e.target.value)}
          className={inputCls} />
      </div>
      <div>
        <label htmlFor="fTitle" className={labelCls}>Builder title</label>
        <input id="fTitle" maxLength={24} placeholder="generated for you" value={props.title}
          onChange={(e) => props.onTitleChange(e.target.value)}
          className={inputCls} />
      </div>
      <button
        className="appearance-none border-0 bg-pink/12 text-pink font-mono text-[10px] font-bold tracking-[0.1em] uppercase px-3 py-[9px] rounded-lg cursor-pointer justify-self-start hover:bg-pink/20"
        onClick={props.onReroll}
      >
        ↻ Roll a new title
      </button>
    </div>
  );
}