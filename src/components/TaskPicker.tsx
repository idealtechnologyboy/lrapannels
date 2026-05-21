import { useState } from "react";
import { SPECIAL_DAYS, POYA_DAYS } from "@/lib/tasks";

export type TaskType = "special" | "poya";

export function TaskPicker({
  value,
  onChange,
}: {
  value: { type: TaskType | null; task: string | null };
  onChange: (v: { type: TaskType | null; task: string | null }) => void;
}) {
  const [type, setType] = useState<TaskType | null>(value.type);
  const list = type === "special" ? SPECIAL_DAYS : type === "poya" ? POYA_DAYS : [];

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm text-muted-foreground">Task</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => { setType("special"); onChange({ type: "special", task: null }); }}
            className={`flex-1 rounded-xl px-4 py-3 text-sm transition ${type === "special" ? "bg-primary text-primary-foreground" : "glass"}`}
          >
            Special Day
          </button>
          <button
            type="button"
            onClick={() => { setType("poya"); onChange({ type: "poya", task: null }); }}
            className={`flex-1 rounded-xl px-4 py-3 text-sm transition ${type === "poya" ? "bg-primary text-primary-foreground" : "glass"}`}
          >
            Poya Day
          </button>
        </div>
      </div>
      {type && (
        <div>
          <label className="mb-2 block text-sm text-muted-foreground">Select {type === "special" ? "Special Day" : "Poya Day"}</label>
          <select
            value={value.task ?? ""}
            onChange={(e) => onChange({ type, task: e.target.value || null })}
            className="input-glass"
          >
            <option value="">— Choose —</option>
            {list.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
