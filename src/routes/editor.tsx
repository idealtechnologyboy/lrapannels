import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { PasswordGate } from "@/components/PasswordGate";
import { UploadPanel } from "@/components/UploadPanel";
import { EDITOR_PASSWORD } from "@/lib/tasks";

export const Route = createFileRoute("/editor")({
  head: () => ({
    meta: [
      { title: "Editor Panel — LRA" },
      { name: "description", content: "Editor panel for uploading posts to the LRA library." },
      { property: "og:title", content: "Editor Panel — LRA" },
      { property: "og:description", content: "Editors upload visual posts for Special days and Poya days." },
    ],
  }),
  component: EditorPage,
});

function EditorPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 pb-24 pt-8">
        <PasswordGate storageKey="lra-editor" expected={EDITOR_PASSWORD} title="Editor Panel">
          <UploadPanel
            mode="image"
            title="Editor Panel"
            description="Upload your post image for the selected task."
          />
        </PasswordGate>
      </main>
    </div>
  );
}
