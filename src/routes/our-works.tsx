import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/SiteHeader";
import { getLatest, getFileContent } from "@/lib/drive.functions";
import { Download, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/our-works")({
  head: () => ({
    meta: [
      { title: "Our Works — Library Readers Association" },
      { name: "description", content: "Read and download the latest editor posts and author captions from the LRA library." },
      { property: "og:title", content: "Our Works — LRA" },
      { property: "og:description", content: "Latest editor posts and author captions, organised by Special days and Poya days." },
    ],
  }),
  component: OurWorks,
});

type Cat = "poya_text" | "poya_image" | "special_text" | "special_image";

const CARDS: { key: Cat; title: string; kind: "text" | "image" }[] = [
  { key: "special_image", title: "Latest Special Day — Editor Post", kind: "image" },
  { key: "special_text", title: "Latest Special Day — Author Caption", kind: "text" },
  { key: "poya_image", title: "Latest Poya Day — Editor Post", kind: "image" },
  { key: "poya_text", title: "Latest Poya Day — Author Caption", kind: "text" },
];

function OurWorks() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-12">
        <header className="mb-10">
          <h1 className="font-display text-4xl md:text-5xl">Our Works</h1>
          <p className="mt-2 text-muted-foreground">
            The most recent upload from each category — read, view, and download.
          </p>
        </header>
        <div className="grid gap-6 md:grid-cols-2">
          {CARDS.map((c) => (
            <LatestCard key={c.key} catKey={c.key} title={c.title} kind={c.kind} />
          ))}
        </div>
      </main>
    </div>
  );
}

function LatestCard({ catKey, title, kind }: { catKey: Cat; title: string; kind: "text" | "image" }) {
  const fetchLatest = useServerFn(getLatest);
  const fetchContent = useServerFn(getFileContent);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["latest", catKey],
    queryFn: () => fetchLatest({ data: { category: catKey } }),
  });
  const file = data?.file ?? null;

  const [content, setContent] = useState<{ mimeType: string; base64: string } | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);

  const load = async () => {
    if (!file) return;
    setLoadingContent(true);
    try {
      const r = await fetchContent({ data: { id: file.id } });
      setContent(r);
    } finally {
      setLoadingContent(false);
    }
  };

  const download = () => {
    if (!content || !file) return;
    const a = document.createElement("a");
    a.href = `data:${content.mimeType};base64,${content.base64}`;
    a.download = file.name;
    a.click();
  };

  return (
    <div className="glass flex flex-col p-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {kind === "image" ? <ImageIcon className="h-4 w-4 text-primary" /> : <FileText className="h-4 w-4 text-primary" />}
        {title}
      </div>
      <div className="mt-4 flex-1">
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
        ) : error ? (
          <div className="text-sm text-destructive">Failed to load. <button onClick={() => refetch()} className="underline">Retry</button></div>
        ) : !file ? (
          <div className="text-sm text-muted-foreground">No uploads yet.</div>
        ) : (
          <div className="space-y-3">
            <div className="font-display text-xl">{file.name}</div>
            <div className="text-xs text-muted-foreground">
              Uploaded {new Date(file.createdTime).toLocaleString()}
            </div>
            {content && kind === "image" && (
              <img
                src={`data:${content.mimeType};base64,${content.base64}`}
                alt={file.name}
                className="mt-2 max-h-80 w-full rounded-xl object-contain"
              />
            )}
            {content && kind === "text" && (
              <pre className="mt-2 max-h-80 overflow-auto whitespace-pre-wrap rounded-xl bg-black/30 p-4 text-sm">
                {atob(content.base64)}
              </pre>
            )}
          </div>
        )}
      </div>
      {file && (
        <div className="mt-4 flex flex-wrap gap-2">
          {!content ? (
            <button onClick={load} disabled={loadingContent} className="btn-ghost">
              {loadingContent ? <Loader2 className="h-4 w-4 animate-spin" /> : kind === "image" ? "View" : "Read"}
            </button>
          ) : null}
          <button onClick={async () => { if (!content) await load(); download(); }} className="btn-primary inline-flex items-center gap-2">
            <Download className="h-4 w-4" /> Download
          </button>
        </div>
      )}
    </div>
  );
}
