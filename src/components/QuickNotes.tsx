import { defaultMessages } from "@/lib/defaultMessages";

interface QuickNotesProps {
  onSelect: (message: string) => void;
}

export function QuickNotes({ onSelect }: QuickNotesProps) {
  const options = [
    { label: "Funny 😂", key: "funny" },
    { label: "Sweet 💕", key: "sweet" },
    { label: "Short 👋", key: "short" },
    { label: "Deep 🌊", key: "deep" },
  ] as const;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {options.map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => onSelect(defaultMessages[opt.key])}
          className="px-3 py-1.5 text-sm font-bold bg-white border-2 border-black rounded-full hover:bg-gray-100 transition-all focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
