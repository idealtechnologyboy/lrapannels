import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, BookOpen } from "lucide-react";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const links = [
    { to: "/", label: "Home" },
    { to: "/our-works", label: "Our Works" },
    { to: "/editor", label: "Editor Panel" },
    { to: "/author", label: "Author Panel" },
  ];

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <div className="glass mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-lg">
          <BookOpen className="h-5 w-5 text-primary" />
          <span>LRA</span>
          <span className="hidden text-muted-foreground sm:inline">· Library Readers Association</span>
        </Link>
        <nav className="hidden gap-1 md:flex">
          {links.slice(1).map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-full px-4 py-2 text-sm text-muted-foreground transition hover:bg-white/10 hover:text-foreground"
              activeProps={{ className: "rounded-full px-4 py-2 text-sm bg-white/10 text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="btn-ghost md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <button
          aria-label="Quick menu"
          onClick={() => setOpen(true)}
          className="btn-ghost hidden md:inline-flex"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="glass-strong absolute right-4 top-4 w-[min(360px,calc(100vw-2rem))] rounded-2xl p-6">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-display text-lg">Menu</span>
              <button aria-label="Close" onClick={() => setOpen(false)} className="btn-ghost">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-base hover:bg-white/10"
                  activeProps={{ className: "rounded-xl px-4 py-3 text-base bg-white/10 text-primary" }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
