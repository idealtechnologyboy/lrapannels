import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { PasswordGate } from "@/components/PasswordGate";
import { UploadPanel } from "@/components/UploadPanel";
import { AUTHOR_PASSWORD } from "@/lib/tasks";

export const Route = createFileRoute("/author")({
  head: () => ({
    meta: [
      { title: "Author Panel — LRA" },
      { name: "description", content: "Author panel for uploading captions to the LRA library." },
      { property: "og:title", content: "Author Panel — LRA" },
      { property: "og:description", content: "Authors upload captions for Special days and Poya days." },
    ],
  }),
  component: AuthorPage,
});

function AuthorPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 pb-24 pt-8">
        <PasswordGate storageKey="lra-author" expected={AUTHOR_PASSWORD} title="Author Panel">
          <UploadPanel
            mode="text"
            title="Author Panel"
            description="Write your caption for the selected task."
          />
        </PasswordGate>
      </main>
    </div>
  );
}
