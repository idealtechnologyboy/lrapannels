import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY = "https://connector-gateway.lovable.dev/google_drive";

function authHeaders() {
  const lovable = process.env.LOVABLE_API_KEY;
  const drive = process.env.GOOGLE_DRIVE_API_KEY;
  if (!lovable) throw new Error("LOVABLE_API_KEY is not configured");
  if (!drive) throw new Error("GOOGLE_DRIVE_API_KEY is not configured");
  return {
    Authorization: `Bearer ${lovable}`,
    "X-Connection-Api-Key": drive,
  };
}

const FOLDERS: Record<string, string> = {
  poya_text: "1lUO_esE-ugQs-y_mWq3dAsELh8Oj5HHw",
  poya_image: "1J_ZCAaiGZoeY0t9Up8Xxs5x4u3yuyWpC",
  special_text: "1WcWkPrCHpkUA22sVPrXEk-QvTr8vcDLo",
  special_image: "1hxFd4kR630UF2SpS1k4nDbZit1U6V0bG",
};

function safeName(s: string) {
  return s.replace(/[^a-zA-Z0-9-_ ]/g, "_").slice(0, 80);
}

export const uploadText = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      category: z.enum(["poya_text", "special_text"]),
      task: z.string().min(1).max(200),
      text: z.string().min(1).max(20000),
    }).parse,
  )
  .handler(async ({ data }) => {
    const folderId = FOLDERS[data.category];
    const filename = `${safeName(data.task)} - ${new Date().toISOString().replace(/[:.]/g, "-")}.txt`;
    const metadata = { name: filename, parents: [folderId], mimeType: "text/plain" };

    const boundary = "----lov" + Math.random().toString(36).slice(2);
    const body =
      `--${boundary}\r\n` +
      `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
      JSON.stringify(metadata) +
      `\r\n--${boundary}\r\n` +
      `Content-Type: text/plain\r\n\r\n` +
      data.text +
      `\r\n--${boundary}--`;

    const res = await fetch(
      `${GATEWAY}/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true`,
      {
        method: "POST",
        headers: {
          ...authHeaders(),
          "Content-Type": `multipart/related; boundary=${boundary}`,
        },
        body,
      },
    );
    const json: any = await res.json();
    if (!res.ok) throw new Error(`Drive upload failed [${res.status}]: ${JSON.stringify(json)}`);
    return { id: json.id, name: filename };
  });

export const uploadImage = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      category: z.enum(["poya_image", "special_image"]),
      task: z.string().min(1).max(200),
      mimeType: z.string().min(1).max(100),
      filename: z.string().min(1).max(200),
      base64: z.string().min(1),
    }).parse,
  )
  .handler(async ({ data }) => {
    const folderId = FOLDERS[data.category];
    const ext = data.filename.includes(".") ? data.filename.split(".").pop() : "bin";
    const name = `${safeName(data.task)} - ${new Date().toISOString().replace(/[:.]/g, "-")}.${ext}`;
    const metadata = { name, parents: [folderId], mimeType: data.mimeType };
    const bin = Buffer.from(data.base64, "base64");

    const boundary = "----lov" + Math.random().toString(36).slice(2);
    const enc = new TextEncoder();
    const head = enc.encode(
      `--${boundary}\r\n` +
        `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
        JSON.stringify(metadata) +
        `\r\n--${boundary}\r\n` +
        `Content-Type: ${data.mimeType}\r\n` +
        `Content-Transfer-Encoding: binary\r\n\r\n`,
    );
    const tail = enc.encode(`\r\n--${boundary}--`);
    const body = new Uint8Array(head.length + bin.length + tail.length);
    body.set(head, 0);
    body.set(bin, head.length);
    body.set(tail, head.length + bin.length);

    const res = await fetch(
      `${GATEWAY}/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true`,
      {
        method: "POST",
        headers: {
          ...authHeaders(),
          "Content-Type": `multipart/related; boundary=${boundary}`,
        },
        body,
      },
    );
    const json: any = await res.json();
    if (!res.ok) throw new Error(`Drive upload failed [${res.status}]: ${JSON.stringify(json)}`);
    return { id: json.id, name };
  });

export const getLatest = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      category: z.enum(["poya_text", "poya_image", "special_text", "special_image"]),
    }).parse,
  )
  .handler(async ({ data }) => {
    const folderId = FOLDERS[data.category];
    const q = encodeURIComponent(`'${folderId}' in parents and trashed = false`);
    const url =
      `${GATEWAY}/drive/v3/files?q=${q}` +
      `&orderBy=createdTime desc&pageSize=1` +
      `&fields=files(id,name,mimeType,createdTime,webViewLink)` +
      `&supportsAllDrives=true&includeItemsFromAllDrives=true`;
    const res = await fetch(url, { headers: authHeaders() });
    const json: any = await res.json();
    if (!res.ok) throw new Error(`Drive list failed [${res.status}]: ${JSON.stringify(json)}`);
    const file = json.files?.[0];
    if (!file) return { file: null as null | { id: string; name: string; mimeType: string; createdTime: string } };
    return { file };
  });

export const getFileContent = createServerFn({ method: "GET" })
  .inputValidator(z.object({ id: z.string().min(1).max(100) }).parse)
  .handler(async ({ data }) => {
    const res = await fetch(
      `${GATEWAY}/drive/v3/files/${encodeURIComponent(data.id)}?alt=media&supportsAllDrives=true`,
      { headers: authHeaders() },
    );
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`Drive download failed [${res.status}]: ${t}`);
    }
    const ct = res.headers.get("content-type") || "application/octet-stream";
    const buf = Buffer.from(await res.arrayBuffer());
    return { mimeType: ct, base64: buf.toString("base64") };
  });
