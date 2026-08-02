export type UploadResult =
  | { ok: true; url: string }
  | { ok: false; unauthorized: true }
  | { ok: false; unauthorized?: false; error: string };

/** Lädt ein Bild hoch und übersetzt alle Fehlerfälle in deutsche Meldungen. */
export async function uploadImage(file: File): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);

  let res: Response;
  try {
    res = await fetch("/api/admin/upload", { method: "POST", body: formData });
  } catch {
    return {
      ok: false,
      error: "Foto-Upload fehlgeschlagen. Bitte prüfe deine Internetverbindung.",
    };
  }

  if (res.status === 401) return { ok: false, unauthorized: true };

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const message =
      data && typeof data.error === "string" ? data.error : "Foto-Upload fehlgeschlagen.";
    return { ok: false, error: message };
  }

  const data = (await res.json()) as { url: string };
  return { ok: true, url: data.url };
}
