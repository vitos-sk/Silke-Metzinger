import Link from "next/link";
import {
  CalendarDays,
  Compass,
  Eye,
  ImageOff,
  Mail,
  Pencil,
  Pin,
  Plus,
} from "lucide-react";
import { isPastEvent, listPosts } from "@/lib/posts";
import { listSubmissions } from "@/lib/submissions";
import { getQuestionnaire } from "@/lib/questionnaire";
import { questionLabel } from "@/lib/questionnaireLabel";
import { getAdminAccount } from "@/lib/adminAccount";
import { formatEventDate, formatTimestampShort } from "@/lib/postDate";
import { POST_TYPE_LABELS, type Post } from "@/types/post";
import type { ContactSubmission, LeadMagnetSubmission } from "@/types/submission";
import LogoutButton from "./LogoutButton";
import DeletePostButton from "./DeletePostButton";
import SubmissionActions from "./SubmissionActions";
import SendQuestionsButton from "./SendQuestionsButton";
import QuestionnaireForm from "./QuestionnaireForm";
import AdminTabs from "./AdminTabs";
import AccountForm from "./AccountForm";

export const dynamic = "force-dynamic";

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

function PostRow({ post }: { post: Post }) {
  const past = isPastEvent(post);
  const previewHref =
    post.status === "draft" ? `/blog/${post.slug}?preview=1` : `/blog/${post.slug}`;

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white/70 p-3 shadow-sm ring-1 ring-black/5 backdrop-blur-xl transition-shadow hover:shadow-md sm:gap-4 sm:p-4">
      <div className="relative aspect-square h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-linear-to-br from-gold/20 to-sage/20 sm:h-16 sm:w-16">
        {post.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.coverImageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageOff className="h-5 w-5 text-text-secondary/50" strokeWidth={1.5} />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          {post.pinned && <Pin className="h-3.5 w-3.5 shrink-0 text-gold" strokeWidth={2} />}
          <p className="truncate font-serif text-text-primary">{post.title}</p>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="rounded-full bg-sage/15 px-2 py-0.5 text-sage">
            {POST_TYPE_LABELS[post.type]}
          </span>
          {post.status === "draft" && (
            <span className="rounded-full bg-gold/20 px-2 py-0.5 text-text-primary">Entwurf</span>
          )}
          {past && (
            <span className="rounded-full bg-black/10 px-2 py-0.5 text-text-secondary">
              Vergangen
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-text-secondary">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
            {post.type === "event" && post.eventDate
              ? formatEventDate(post.eventDate)
              : formatTimestampShort(post.publishedAt)}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-0.5">
        <a
          href={previewHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`„${post.title}“ in der Vorschau öffnen`}
          className="flex min-h-11 items-center gap-1.5 rounded-lg px-2.5 text-sm text-text-secondary transition-colors hover:bg-black/5"
        >
          <Eye className="h-4 w-4" strokeWidth={1.75} />
          <span className="hidden sm:inline">Vorschau</span>
        </a>
        <Link
          href={`/admin/posts/${post.id}/edit`}
          aria-label={`„${post.title}“ bearbeiten`}
          className="flex min-h-11 items-center gap-1.5 rounded-lg px-2.5 text-sm text-sage transition-colors hover:bg-sage/10"
        >
          <Pencil className="h-4 w-4" strokeWidth={1.75} />
          <span className="hidden sm:inline">Bearbeiten</span>
        </Link>
        <DeletePostButton id={post.id} title={post.title} />
      </div>
    </div>
  );
}

export default async function AdminPage() {
  const [posts, submissions, questionnaire, account] = await Promise.all([
    listPosts(),
    listSubmissions(),
    getQuestionnaire(),
    getAdminAccount().catch(() => null),
  ]);
  const drafts = posts.filter((post) => post.status === "draft");
  const published = posts.filter((post) => post.status === "published");

  const contactSubmissions = submissions.filter(
    (s): s is ContactSubmission => s.type === "contact",
  );
  const leadMagnetSubmissions = submissions.filter(
    (s): s is LeadMagnetSubmission => s.type === "lead-magnet",
  );
  const unreadContact = contactSubmissions.filter((s) => !s.read).length;
  const unreadLeadMagnet = leadMagnetSubmissions.filter((s) => !s.read).length;
  const questionCount = questionnaire.questions.length;

  const mailContent = (
    <>
      <section>
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-sage" strokeWidth={1.75} />
          <h2 className="font-serif text-lg text-text-primary sm:text-xl">
            Kontaktanfragen
          </h2>
          {unreadContact > 0 && (
            <span className="rounded-full bg-gold/20 px-2 py-0.5 text-xs font-medium text-text-primary">
              {unreadContact} neu
            </span>
          )}
        </div>

        <div className="mt-3 space-y-3">
          {contactSubmissions.length === 0 && (
            <div className="rounded-2xl bg-white/70 px-6 py-8 text-center text-sm text-text-secondary shadow-sm ring-1 ring-black/5 backdrop-blur-xl">
              Noch keine Kontaktanfragen.
            </div>
          )}

          {contactSubmissions.map((submission) => (
            <div
              key={submission.id}
              className={`flex items-start gap-4 rounded-2xl p-3.5 shadow-sm ring-1 backdrop-blur-xl sm:p-4 ${
                submission.read ? "bg-white/70 ring-black/5" : "bg-white ring-sage/30"
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-serif text-text-primary">
                    {submission.firstName} {submission.lastName}
                  </p>
                  {!submission.read && (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-gold" aria-hidden />
                  )}
                </div>
                <a
                  href={`mailto:${submission.email}`}
                  className="text-sm text-sage hover:underline"
                >
                  {submission.email}
                </a>
                <p className="mt-2 whitespace-pre-wrap text-sm text-text-secondary">
                  {submission.message}
                </p>
                <p className="mt-2 text-xs text-text-secondary/70">
                  {formatDate(submission.createdAt)}
                </p>
              </div>
              <SubmissionActions
                id={submission.id}
                read={submission.read}
                label={`${submission.firstName} ${submission.lastName}`}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center gap-2">
          <Compass className="h-5 w-5 text-sage" strokeWidth={1.75} />
          <h2 className="font-serif text-lg text-text-primary sm:text-xl">
            Anfragen: {questionCount} {questionLabel(questionCount)}
          </h2>
          {unreadLeadMagnet > 0 && (
            <span className="rounded-full bg-gold/20 px-2 py-0.5 text-xs font-medium text-text-primary">
              {unreadLeadMagnet} neu
            </span>
          )}
        </div>

        <div className="mt-3 space-y-3">
          {leadMagnetSubmissions.length === 0 && (
            <div className="rounded-2xl bg-white/70 px-6 py-8 text-center text-sm text-text-secondary shadow-sm ring-1 ring-black/5 backdrop-blur-xl">
              Noch keine Anfragen.
            </div>
          )}

          {leadMagnetSubmissions.map((submission) => (
            <div
              key={submission.id}
              className={`rounded-2xl p-3.5 shadow-sm ring-1 backdrop-blur-xl sm:p-4 ${
                submission.read ? "bg-white/70 ring-black/5" : "bg-white ring-sage/30"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-serif text-text-primary">{submission.fullName}</p>
                    {!submission.read && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-gold" aria-hidden />
                    )}
                  </div>
                  <a
                    href={`mailto:${submission.email}`}
                    className="text-sm text-sage hover:underline"
                  >
                    {submission.email}
                  </a>
                  <p className="mt-2 text-xs text-text-secondary/70">
                    {formatDate(submission.createdAt)}
                  </p>
                </div>
                <SubmissionActions
                  id={submission.id}
                  read={submission.read}
                  label={submission.fullName}
                />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-black/5 pt-3">
                <SendQuestionsButton
                  id={submission.id}
                  name={submission.fullName}
                  email={submission.email}
                  sentAt={submission.questionsSentAt}
                  count={questionCount}
                />
                <span className="text-xs text-text-secondary">
                  {submission.questionsSentAt
                    ? `Fragen gesendet am ${formatDate(submission.questionsSentAt)}`
                    : "Fragen noch nicht gesendet"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );

  const postsContent = (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-lg text-text-primary sm:text-xl">Blog</h2>
          <p className="text-xs text-text-secondary sm:text-sm">
            {posts.length} {posts.length === 1 ? "Beitrag" : "Beiträge"}
          </p>
        </div>
      </div>

      <Link
        href="/admin/posts/new"
        className="group relative mt-6 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-sage px-5 py-3.5 text-sm font-medium text-ivory shadow-[0_8px_24px_-6px_rgba(143,175,138,0.55)] ring-1 ring-sage/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-6px_rgba(143,175,138,0.65)] active:translate-y-0 sm:w-auto"
      >
        <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-ivory/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
        <Plus className="h-4 w-4" strokeWidth={2} />
        Neuer Beitrag
      </Link>

      {posts.length === 0 && (
        <div className="mt-6 flex flex-col items-center gap-2 rounded-2xl bg-white/70 px-6 py-12 text-center shadow-sm ring-1 ring-black/5 backdrop-blur-xl">
          <CalendarDays className="h-8 w-8 text-text-secondary/60" strokeWidth={1.5} />
          <p className="text-sm text-text-secondary">Noch keine Beiträge angelegt.</p>
        </div>
      )}

      {drafts.length > 0 && (
        <section className="mt-6">
          <h3 className="text-sm font-medium text-text-secondary">Entwürfe</h3>
          <div className="mt-3 space-y-3">
            {drafts.map((post) => (
              <PostRow key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {published.length > 0 && (
        <section className="mt-6">
          {drafts.length > 0 && (
            <h3 className="text-sm font-medium text-text-secondary">Veröffentlicht</h3>
          )}
          <div className="mt-3 space-y-3">
            {published.map((post) => (
              <PostRow key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}
    </>
  );

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/70 px-4 py-3.5 shadow-sm ring-1 ring-black/5 backdrop-blur-xl sm:px-5">
          <div>
            <h1 className="font-serif text-xl text-text-primary sm:text-2xl">Admin</h1>
            <p className="text-xs text-text-secondary sm:text-sm">Übersicht</p>
          </div>
          <LogoutButton />
        </div>

        <AdminTabs
          mail={mailContent}
          posts={postsContent}
          questions={<QuestionnaireForm initial={questionnaire} />}
          account={<AccountForm initialEmail={account?.email ?? ""} />}
          mailUnreadCount={unreadContact + unreadLeadMagnet}
        />
      </div>
    </main>
  );
}
