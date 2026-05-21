import { useState } from "react";
import { TaskPicker, type TaskType } from "@/components/TaskPicker";
import { Upload, CheckCircle2, Loader2 } from "lucide-react";

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxF_CQlNaiX_POSjhZcRrHFd6fTdpEfsEEEP1md-H7TlwF8Rm-pR13l17JMVUnt9SyU/exec";

type Mode = "text" | "image";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onerror = () => reject(r.error);
    r.onload = () => {
      const s = String(r.result || "");
      resolve(s.includes(",") ? s.split(",")[1] : s);
    };
    r.readAsDataURL(file);
  });
}

export function UploadPanel({
  mode,
  title,
  description,
}: {
  mode: Mode;
  title: string;
  description: string;
}) {
  const [pick, setPick] = useState<{ type: TaskType | null; task: string | null }>({
    type: null,
    task: null,
  });
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setDone(null);
    if (!pick.type || !pick.task) {
      setErr("Select a task.");
      return;
    }
    if (mode === "text" && !text.trim()) {
      setErr("Write a caption.");
      return;
    }
    if (mode === "image" && !file) {
      setErr("Choose an image.");
      return;
    }

    setBusy(true);
    try {
      let payload: Record<string, unknown>;
      if (mode === "text") {
        const category = pick.type === "poya" ? "poya_text" : "special_text";
        payload = {
          type: "text",
          category,
          fileName: pick.task,
          author: name,
          content: text,
        };
      } else {
        const category = pick.type === "poya" ? "poya_image" : "special_image";
        const base64 = await fileToBase64(file!);
        payload = {
          type: "image",
          category,
          fileName: file!.name,
          contentType: file!.type || "image/jpeg",
          base64,
        };
      }

      const res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const responseText = await res.text();
      if (!res.ok) throw new Error(`Upload failed [${res.status}]: ${responseText}`);

      setDone(mode === "text" ? `${pick.task}` : file!.name);
      setText("");
      setFile(null);
    } catch (e: any) {
      setErr(e?.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="glass-strong rounded-2xl p-8">
      <h1 className="font-display text-3xl">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <form onSubmit={submit} className="mt-8 space-y-6">
        <TaskPicker value={pick} onChange={setPick} />

        {mode === "text" && (
          <>
            <div>
              <label className="mb-2 block text-sm text-muted-foreground">Author name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-glass"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-muted-foreground">Caption / Text</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={10}
                className="input-glass resize-y"
                placeholder="Write your caption here…"
              />
            </div>
          </>
        )}

        {mode === "image" && (
          <div>
            <label className="mb-2 block text-sm text-muted-foreground">Image file</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="input-glass file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1 file:text-primary-foreground"
            />
          </div>
        )}

        {err && (
          <div className="rounded-lg bg-destructive/15 px-3 py-2 text-sm text-destructive">
            {err}
          </div>
        )}
        {done && (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-500/15 px-3 py-2 text-sm text-emerald-200">
            <CheckCircle2 className="h-4 w-4" /> Uploaded {done}
          </div>
        )}

        <button type="submit" disabled={busy} className="btn-primary inline-flex items-center gap-2">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {busy ? "Uploading…" : "Upload"}
        </button>
      </form>
    </div>
  );
}
