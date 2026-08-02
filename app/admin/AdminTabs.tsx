"use client";

import { useState, type ReactNode } from "react";
import { CalendarDays, Mail } from "lucide-react";

type Tab = "mail" | "posts";

export default function AdminTabs({
  mail,
  posts,
  mailUnreadCount,
}: {
  mail: ReactNode;
  posts: ReactNode;
  mailUnreadCount: number;
}) {
  const [tab, setTab] = useState<Tab>("mail");

  return (
    <div className="mt-6">
      <div className="flex gap-1 rounded-full bg-white/70 p-1 shadow-sm ring-1 ring-black/5 backdrop-blur-xl">
        <button
          type="button"
          onClick={() => setTab("mail")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
            tab === "mail"
              ? "bg-sage text-ivory shadow-sm"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <Mail className="h-4 w-4" strokeWidth={1.75} />
          Briefe
          {mailUnreadCount > 0 && (
            <span
              className={`rounded-full px-1.5 py-0.5 text-xs font-medium ${
                tab === "mail" ? "bg-ivory/25 text-ivory" : "bg-gold/20 text-text-primary"
              }`}
            >
              {mailUnreadCount}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setTab("posts")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
            tab === "posts"
              ? "bg-sage text-ivory shadow-sm"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <CalendarDays className="h-4 w-4" strokeWidth={1.75} />
          Blog
        </button>
      </div>

      <div className="mt-6">{tab === "mail" ? mail : posts}</div>
    </div>
  );
}
