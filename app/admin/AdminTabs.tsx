"use client";

import { useState, type ReactNode } from "react";
import { CalendarDays, KeyRound, ListChecks, Mail } from "lucide-react";

type Tab = "mail" | "posts" | "questions" | "account";

export default function AdminTabs({
  mail,
  posts,
  questions,
  account,
  mailUnreadCount,
}: {
  mail: ReactNode;
  posts: ReactNode;
  questions: ReactNode;
  account: ReactNode;
  mailUnreadCount: number;
}) {
  const [tab, setTab] = useState<Tab>("posts");

  const tabClass = (id: Tab) =>
    `flex flex-1 min-w-0 items-center justify-center gap-1.5 rounded-full px-2 py-2.5 text-sm font-medium transition-colors sm:gap-2 sm:px-3 ${
      tab === id ? "bg-sage text-ivory shadow-sm" : "text-text-secondary hover:text-text-primary"
    }`;

  const labelClass = (id: Tab) =>
    `truncate ${tab === id ? "inline" : "hidden sm:inline"}`;

  return (
    <div className="mt-6">
      <div className="flex gap-1 rounded-full bg-white/70 p-1 shadow-sm ring-1 ring-black/5 backdrop-blur-xl">
        <button
          type="button"
          onClick={() => setTab("mail")}
          className={tabClass("mail")}
          aria-label="Briefe"
        >
          <Mail className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          <span className={labelClass("mail")}>Briefe</span>
          {mailUnreadCount > 0 && (
            <span
              className={`shrink-0 rounded-full px-1.5 py-0.5 text-xs font-medium ${
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
          className={tabClass("posts")}
          aria-label="Blog"
        >
          <CalendarDays className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          <span className={labelClass("posts")}>Blog</span>
        </button>
        <button
          type="button"
          onClick={() => setTab("questions")}
          className={tabClass("questions")}
          aria-label="Fragen"
        >
          <ListChecks className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          <span className={labelClass("questions")}>Fragen</span>
        </button>
        <button
          type="button"
          onClick={() => setTab("account")}
          className={tabClass("account")}
          aria-label="Zugang"
        >
          <KeyRound className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          <span className={labelClass("account")}>Zugang</span>
        </button>
      </div>

      <div className="mt-6">
        {tab === "mail"
          ? mail
          : tab === "posts"
            ? posts
            : tab === "questions"
              ? questions
              : account}
      </div>
    </div>
  );
}
