"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import PostArticle, { type PostArticleData } from "@/components/Blog/PostArticle";

export default function PostPreview({
  post,
  onClose,
}: {
  post: PostArticleData;
  onClose: () => void;
}) {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Vorschau"
      className="fixed inset-0 z-50 overflow-y-auto bg-ivory"
    >
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-black/5 bg-ivory/90 px-4 py-3 backdrop-blur-xl sm:px-6">
        <p className="text-sm text-text-secondary">
          Vorschau &mdash; so sieht der Beitrag auf der Website aus.
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Vorschau schliessen"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-black/5"
        >
          <X className="h-5 w-5" strokeWidth={2} />
        </button>
      </div>

      <div className="px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <PostArticle post={post} />
        </div>
      </div>
    </div>,
    document.body,
  );
}
