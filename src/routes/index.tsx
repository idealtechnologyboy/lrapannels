import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { BookOpen, Feather, Image as ImageIcon, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Library Readers Association — Home" },
      { name: "description", content: "Home of the Library Readers Association — a community of editors and authors creating posts and captions for special days and Poya days." },
      { property: "og:title", content: "Library Readers Association" },
      { property: "og:description", content: "A community of editors and authors creating posts and captions for special days and Poya days." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-16">
        <section className="glass overflow-hidden p-10 md:p-16">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            Library Readers Association
          </div>
          <h1 className="mt-4 font-display text-5xl leading-tight md:text-7xl">
            Where editors and authors <span className="text-primary">create together</span>.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            A calm, motivating home for the work of our editors and authors. Save your posts and captions
            for every special day and Poya day — and watch the library grow.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/our-works" className="btn-primary">Explore Our Works</Link>
            <Link to="/editor" className="btn-ghost">Editor Panel</Link>
            <Link to="/author" className="btn-ghost">Author Panel</Link>
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { icon: BookOpen, title: "Our Library", body: "Browse and download the latest posts and captions, neatly organized by task." },
            { icon: ImageIcon, title: "Editor Posts", body: "Editors upload visual posts for Special days and Poya days." },
            { icon: Feather, title: "Author Captions", body: "Authors craft captions that bring every post to life." },
          ].map((f) => (
            <div key={f.title} className="glass p-6">
              <f.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-3 font-display text-xl">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </section>

        <section className="glass mt-10 p-8 md:p-12">
          <h2 className="font-display text-3xl">About LRA</h2>
          <p className="mt-4 max-w-3xl text-muted-foreground">
            The Library Readers Association is a creative collective. Editors design posts and authors write
            captions for every important day — from World Press Freedom Day to Vesak Full Moon Poya Day.
            Every contribution becomes part of a living, downloadable library that motivates the next piece of work.
          </p>
        </section>
      </main>
    </div>
  );
}
