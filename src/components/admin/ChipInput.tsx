import { XCircle } from "lucide-react";
import { useState } from "react";

export function ChipInput({ values, setValues, placeholder }: { values: string[]; setValues: (v: string[]) => void; placeholder?: string; }) {
    const [text, setText] = useState("");
    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && text.trim()) {
            e.preventDefault();
            if (!values.includes(text.trim())) setValues([...values, text.trim()]);
            setText("");
        }
    };
    const remove = (v: string) => setValues(values.filter((x) => x !== v));
    return (
        <div className="flex flex-wrap gap-2 border p-2 rounded">
            {values.map((v) => (
                <span key={v} className="flex items-center gap-1 px-2 py-1 bg-muted rounded-full">
                    <span className="text-sm">{v}</span>
                    <XCircle size={16} className="cursor-pointer" onClick={() => remove(v)} />
                </span>
            ))}
            <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={placeholder ?? "Press Enter to add"}
                className="flex-1 outline-none p-1 min-w-[120px]"
            />
        </div>
    );
}