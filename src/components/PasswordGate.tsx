import { useEffect, useState } from "react";
import { Lock } from "lucide-react";

export function PasswordGate({
  storageKey,
  expected,
  title,
  children,
}: {
  storageKey: string;
  expected: string;
  title: string;
  children: React.ReactNode;
}) {
  const [ok, setOk] = useState(false);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(storageKey) === "1") {
      setOk(true);
    }
  }, [storageKey]);

  if (ok) return <>{children}</>;

  return (
    <div className="mx-auto mt-16 max-w-md px-4">
      <div className="glass-strong rounded-2xl p-8">
        <div className="mb-4 flex items-center gap-2 text-primary">
          <Lock className="h-5 w-5" />
          <span className="font-display text-xl">{title}</span>
        </div>
        <p className="mb-6 text-sm text-muted-foreground">
          Enter the access password to continue.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (pw === expected) {
              sessionStorage.setItem(storageKey, "1");
              setOk(true);
            } else {
              setErr("Incorrect password.");
            }
          }}
          className="space-y-3"
        >
          <input
            type="password"
            value={pw}
            onChange={(e) => { setPw(e.target.value); setErr(""); }}
            placeholder="Password"
            className="input-glass"
            autoFocus
          />
          {err && <div className="text-sm text-destructive">{err}</div>}
          <button type="submit" className="btn-primary w-full">Unlock</button>
        </form>
      </div>
    </div>
  );
}
