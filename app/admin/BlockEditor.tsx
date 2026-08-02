"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentType,
  type TextareaHTMLAttributes,
} from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Copy,
  Heading2,
  ImagePlus,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Minus,
  MousePointerClick,
  Plus,
  Quote,
  Text,
  Trash2,
  X,
} from "lucide-react";
import type { PostBlock } from "@/types/post";
import { isEmptyBlock } from "@/lib/postContent";
import { uploadImage } from "./uploadImage";

type BlockType = PostBlock["type"];

const BLOCK_TYPES: Array<{
  type: BlockType;
  label: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
}> = [
  { type: "paragraph", label: "Absatz", icon: Text },
  { type: "heading", label: "Überschrift", icon: Heading2 },
  { type: "image", label: "Foto", icon: ImagePlus },
  { type: "quote", label: "Zitat", icon: Quote },
  { type: "list", label: "Liste", icon: List },
  { type: "button", label: "Button", icon: MousePointerClick },
  { type: "divider", label: "Trenner", icon: Minus },
];

const BLOCK_LABELS: Record<BlockType, string> = {
  paragraph: "Absatz",
  heading: "Überschrift",
  image: "Foto",
  quote: "Zitat",
  list: "Liste",
  button: "Button",
  divider: "Trenner",
};

const fieldClass =
  "w-full rounded-xl border border-black/10 bg-white px-3.5 py-3 text-base text-text-primary outline-none transition-colors focus:border-sage focus:ring-2 focus:ring-sage/20";

const smallLabelClass = "text-xs font-medium text-text-secondary";

// Mindestens 44 px Tap-Fläche, damit die Steuerung am Telefon bedienbar bleibt.
const iconButtonClass =
  "flex h-11 w-11 items-center justify-center rounded-xl text-text-secondary transition-colors hover:bg-black/5 active:bg-black/10 disabled:opacity-30";

export function newBlockId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function createBlock(type: BlockType): PostBlock {
  const id = newBlockId();
  switch (type) {
    case "heading":
      return { id, type: "heading", text: "", level: 2 };
    case "image":
      return { id, type: "image", url: "", alt: "", caption: null, width: "normal" };
    case "quote":
      return { id, type: "quote", text: "", author: null };
    case "list":
      return { id, type: "list", style: "bullet", items: [""] };
    case "button":
      return { id, type: "button", label: "", href: "" };
    case "divider":
      return { id, type: "divider" };
    default:
      return { id, type: "paragraph", text: "" };
  }
}

function duplicateBlock(block: PostBlock): PostBlock {
  return block.type === "list"
    ? { ...block, id: newBlockId(), items: [...block.items] }
    : { ...block, id: newBlockId() };
}

function AutoTextarea({
  value,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { value: string }) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return <textarea ref={ref} value={value} rows={2} {...props} />;
}

function AddBlockButtons({ onSelect }: { onSelect: (type: BlockType) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {BLOCK_TYPES.map(({ type, label, icon: Icon }) => (
        <button
          key={type}
          type="button"
          onClick={() => onSelect(type)}
          className="flex min-h-11 items-center gap-1.5 rounded-xl border border-dashed border-sage/40 bg-sage/5 px-3.5 text-sm text-sage transition-colors hover:bg-sage/10"
        >
          <Icon className="h-4 w-4" strokeWidth={1.75} />
          {label}
        </button>
      ))}
    </div>
  );
}

/** Einfügepunkt zwischen zwei Blöcken. */
function GapInserter({ onSelect }: { onSelect: (type: BlockType) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="group relative -my-1 py-1">
      <div className="flex items-center gap-2">
        <span className="h-px flex-1 bg-black/5" />
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-label="Block hier einfügen"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-dashed border-sage/40 bg-white text-sage transition-all hover:bg-sage/10 md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
        </button>
        <span className="h-px flex-1 bg-black/5" />
      </div>

      {isOpen && (
        <div className="mt-2 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5">
          <AddBlockButtons
            onSelect={(type) => {
              setIsOpen(false);
              onSelect(type);
            }}
          />
        </div>
      )}
    </div>
  );
}

function BlockShell({
  block,
  index,
  total,
  onMove,
  onDuplicate,
  onRemove,
  children,
}: {
  block: PostBlock;
  index: number;
  total: number;
  onMove: (direction: -1 | 1) => void;
  onDuplicate: () => void;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white/70 p-3 shadow-sm ring-1 ring-black/5 sm:p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium tracking-wide text-text-secondary uppercase">
          {BLOCK_LABELS[block.type]}
        </span>
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={index === 0}
            aria-label="Block nach oben"
            className={iconButtonClass}
          >
            <ArrowUp className="h-4.5 w-4.5" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            aria-label="Block nach unten"
            className={iconButtonClass}
          >
            <ArrowDown className="h-4.5 w-4.5" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={onDuplicate}
            aria-label="Block duplizieren"
            className={iconButtonClass}
          >
            <Copy className="h-4.5 w-4.5" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={onRemove}
            aria-label="Block löschen"
            className={`${iconButtonClass} text-red-600 hover:bg-red-50`}
          >
            <Trash2 className="h-4.5 w-4.5" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <div className="mt-2">{children}</div>
    </div>
  );
}

function ListBlockEditor({
  block,
  onChange,
}: {
  block: Extract<PostBlock, { type: "list" }>;
  onChange: (items: string[]) => void;
}) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  // Fokus-Wunsch als Ref: Er soll nach dem nächsten Render einmal ausgeführt
  // werden, ohne selbst ein weiteres Render auszulösen.
  const pendingFocus = useRef<number | null>(null);

  useEffect(() => {
    if (pendingFocus.current === null) return;
    inputsRef.current[pendingFocus.current]?.focus();
    pendingFocus.current = null;
  });

  function updateItem(index: number, value: string) {
    onChange(block.items.map((item, i) => (i === index ? value : item)));
  }

  function addItem(afterIndex: number) {
    const next = [...block.items];
    next.splice(afterIndex + 1, 0, "");
    pendingFocus.current = afterIndex + 1;
    onChange(next);
  }

  function removeItem(index: number) {
    const next = block.items.filter((_, i) => i !== index);
    onChange(next.length > 0 ? next : [""]);
  }

  return (
    <div className="space-y-2">
      {block.items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className="w-5 shrink-0 text-center text-sm text-text-secondary">
            {block.style === "number" ? `${index + 1}.` : "•"}
          </span>
          <input
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            value={item}
            onChange={(e) => updateItem(index, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addItem(index);
              }
            }}
            aria-label={`Punkt ${index + 1}`}
            className={fieldClass}
          />
          <button
            type="button"
            onClick={() => removeItem(index)}
            aria-label={`Punkt ${index + 1} löschen`}
            className={`${iconButtonClass} shrink-0`}
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => addItem(block.items.length - 1)}
        className="flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-sm text-sage transition-colors hover:bg-sage/10"
      >
        <Plus className="h-4 w-4" strokeWidth={2} />
        Punkt hinzufügen
      </button>
    </div>
  );
}

function ImageBlockEditor({
  block,
  onChange,
  onUnauthorized,
}: {
  block: Extract<PostBlock, { type: "image" }>;
  onChange: (patch: Partial<Extract<PostBlock, { type: "image" }>>) => void;
  onUnauthorized: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    const result = await uploadImage(file);
    setUploading(false);

    if (!result.ok) {
      if (result.unauthorized) {
        onUnauthorized();
        return;
      }
      setError(result.error);
      return;
    }

    onChange({ url: result.url });
  }

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={handleFileChange}
        className="hidden"
      />

      {block.url ? (
        <div className="relative overflow-hidden rounded-xl ring-1 ring-black/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={block.url} alt="" className="h-40 w-full object-cover" />
          <button
            type="button"
            onClick={() => {
              onChange({ url: "" });
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            aria-label="Foto entfernen"
            className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="flex min-h-11 items-center gap-2 rounded-xl border border-dashed border-sage/40 bg-sage/5 px-4 text-sm text-sage transition-colors hover:bg-sage/10 disabled:opacity-50"
      >
        {uploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
            Lädt hoch…
          </>
        ) : (
          <>
            <ImagePlus className="h-4 w-4" strokeWidth={1.75} />
            {block.url ? "Foto ersetzen" : "Foto auswählen"}
          </>
        )}
      </button>

      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
          {error}
        </p>
      )}

      <div>
        <label className={smallLabelClass} htmlFor={`alt-${block.id}`}>
          Alt-Text (beschreibt das Bild, Pflichtfeld)
        </label>
        <input
          id={`alt-${block.id}`}
          value={block.alt}
          onChange={(e) => onChange({ alt: e.target.value })}
          placeholder="z. B. Frisches Gemüse auf einem Holzbrett"
          className={`mt-1 ${fieldClass}`}
        />
      </div>

      <div>
        <label className={smallLabelClass} htmlFor={`caption-${block.id}`}>
          Bildunterschrift (optional)
        </label>
        <input
          id={`caption-${block.id}`}
          value={block.caption ?? ""}
          onChange={(e) => onChange({ caption: e.target.value || null })}
          className={`mt-1 ${fieldClass}`}
        />
      </div>

      <div>
        <span className={smallLabelClass}>Breite</span>
        <div className="mt-1 grid grid-cols-2 gap-2">
          {(["normal", "wide"] as const).map((width) => (
            <button
              key={width}
              type="button"
              onClick={() => onChange({ width })}
              aria-pressed={block.width === width}
              className={`min-h-11 rounded-xl border text-sm font-medium transition-colors ${
                block.width === width
                  ? "border-sage bg-sage/10 text-sage"
                  : "border-black/10 bg-white text-text-secondary hover:bg-black/5"
              }`}
            >
              {width === "normal" ? "Normal" : "Breit"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BlockEditor({
  blocks,
  onChange,
  onUnauthorized,
}: {
  blocks: PostBlock[];
  onChange: (blocks: PostBlock[]) => void;
  onUnauthorized: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const focusBlockId = useRef<string | null>(null);

  useEffect(() => {
    const id = focusBlockId.current;
    if (!id) return;
    focusBlockId.current = null;
    containerRef.current
      ?.querySelector<HTMLElement>(
        `[data-block-id="${id}"] textarea, [data-block-id="${id}"] input:not([type="file"])`,
      )
      ?.focus();
  });

  function insertAt(index: number, type: BlockType) {
    const block = createBlock(type);
    const next = [...blocks];
    next.splice(index, 0, block);
    // Direkt weiterschreiben können, ohne erst ins neue Feld tippen zu müssen.
    focusBlockId.current = block.id;
    onChange(next);
  }

  function moveBlock(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function removeBlock(index: number) {
    const block = blocks[index];
    if (!isEmptyBlock(block) && !confirm("Diesen Block wirklich löschen?")) return;
    onChange(blocks.filter((_, i) => i !== index));
  }

  function duplicate(index: number) {
    const next = [...blocks];
    next.splice(index + 1, 0, duplicateBlock(blocks[index]));
    onChange(next);
  }

  function patchBlock(index: number, patch: Partial<PostBlock>) {
    onChange(
      blocks.map((block, i) => (i === index ? ({ ...block, ...patch } as PostBlock) : block)),
    );
  }

  function renderEditor(block: PostBlock, index: number) {
    switch (block.type) {
      case "paragraph":
        return (
          <AutoTextarea
            value={block.text}
            onChange={(e) => patchBlock(index, { text: e.target.value })}
            placeholder="Schreib hier deinen Text. Eine leere Zeile beginnt einen neuen Absatz."
            aria-label="Absatztext"
            className={`${fieldClass} resize-none`}
          />
        );

      case "heading":
        return (
          <div className="space-y-2">
            <input
              value={block.text}
              onChange={(e) => patchBlock(index, { text: e.target.value })}
              placeholder="Überschrift"
              aria-label="Überschrift"
              className={fieldClass}
            />
            <div className="grid grid-cols-2 gap-2">
              {([2, 3] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => patchBlock(index, { level })}
                  aria-pressed={block.level === level}
                  className={`min-h-11 rounded-xl border text-sm font-medium transition-colors ${
                    block.level === level
                      ? "border-sage bg-sage/10 text-sage"
                      : "border-black/10 bg-white text-text-secondary hover:bg-black/5"
                  }`}
                >
                  {level === 2 ? "Gross (H2)" : "Klein (H3)"}
                </button>
              ))}
            </div>
          </div>
        );

      case "image":
        return (
          <ImageBlockEditor
            block={block}
            onChange={(patch) => patchBlock(index, patch)}
            onUnauthorized={onUnauthorized}
          />
        );

      case "quote":
        return (
          <div className="space-y-2">
            <AutoTextarea
              value={block.text}
              onChange={(e) => patchBlock(index, { text: e.target.value })}
              placeholder="Zitat"
              aria-label="Zitat"
              className={`${fieldClass} resize-none font-script text-lg italic`}
            />
            <input
              value={block.author ?? ""}
              onChange={(e) => patchBlock(index, { author: e.target.value || null })}
              placeholder="Autor (optional)"
              aria-label="Autor des Zitats"
              className={fieldClass}
            />
          </div>
        );

      case "list":
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {(["bullet", "number"] as const).map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => patchBlock(index, { style })}
                  aria-pressed={block.style === style}
                  className={`flex min-h-11 items-center justify-center gap-2 rounded-xl border text-sm font-medium transition-colors ${
                    block.style === style
                      ? "border-sage bg-sage/10 text-sage"
                      : "border-black/10 bg-white text-text-secondary hover:bg-black/5"
                  }`}
                >
                  {style === "bullet" ? (
                    <List className="h-4 w-4" strokeWidth={1.75} />
                  ) : (
                    <ListOrdered className="h-4 w-4" strokeWidth={1.75} />
                  )}
                  {style === "bullet" ? "Punkte" : "Nummern"}
                </button>
              ))}
            </div>
            <ListBlockEditor
              block={block}
              onChange={(items) => patchBlock(index, { items })}
            />
          </div>
        );

      case "button":
        return (
          <div className="space-y-2">
            <input
              value={block.label}
              onChange={(e) => patchBlock(index, { label: e.target.value })}
              placeholder="Beschriftung, z. B. Jetzt anmelden"
              aria-label="Button-Beschriftung"
              className={fieldClass}
            />
            <div className="relative">
              <Link2
                aria-hidden
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
                strokeWidth={1.75}
              />
              <input
                value={block.href}
                onChange={(e) => patchBlock(index, { href: e.target.value })}
                placeholder="#kontakt oder https://…"
                aria-label="Button-Link"
                className={`${fieldClass} pl-10`}
              />
            </div>
          </div>
        );

      case "divider":
        return (
          <div aria-hidden className="relative flex items-center justify-center py-3">
            <div className="h-px w-full bg-linear-to-r from-transparent via-gold/35 to-transparent" />
            <span className="absolute h-1.5 w-1.5 rotate-45 bg-gold/50" />
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <div ref={containerRef} className="space-y-2">
      {blocks.length === 0 && (
        <p className="rounded-2xl bg-white/50 px-4 py-6 text-center text-sm text-text-secondary">
          Noch kein Inhalt — füge unten den ersten Block hinzu.
        </p>
      )}

      {blocks.map((block, index) => (
        <div key={block.id} data-block-id={block.id}>
          {index > 0 && <GapInserter onSelect={(type) => insertAt(index, type)} />}
          <BlockShell
            block={block}
            index={index}
            total={blocks.length}
            onMove={(direction) => moveBlock(index, direction)}
            onDuplicate={() => duplicate(index)}
            onRemove={() => removeBlock(index)}
          >
            {renderEditor(block, index)}
          </BlockShell>
        </div>
      ))}

      <div className="rounded-2xl border border-dashed border-black/10 p-3">
        <p className="mb-2 text-xs text-text-secondary">Block hinzufügen</p>
        <AddBlockButtons onSelect={(type) => insertAt(blocks.length, type)} />
      </div>
    </div>
  );
}
