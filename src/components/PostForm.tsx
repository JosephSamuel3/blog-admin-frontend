import { useState, type FormEvent } from "react";
import type { CreatePostInput } from "../api/posts";

type PostFormProps = {
  initialValues?: Partial<CreatePostInput>;
  submitLabel: string;
  isSubmitting: boolean;
  error?: string | null;
  onSubmit: (values: CreatePostInput) => void;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function PostForm({ initialValues, submitLabel, isSubmitting, error, onSubmit }: PostFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [slug, setSlug] = useState(initialValues?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initialValues?.excerpt ?? "");
  const [content, setContent] = useState(initialValues?.content ?? "");
  const [published, setPublished] = useState(initialValues?.published ?? false);
  const [slugTouched, setSlugTouched] = useState(!!initialValues?.slug);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit({ title, slug, excerpt: excerpt || undefined, content, published });
  };

  return (
    <form className="card post-form" onSubmit={handleSubmit}>
      {error && <p className="form-error">{error}</p>}
      <label>
        Title
        <input value={title} onChange={(e) => handleTitleChange(e.target.value)} required />
      </label>
      <label>
        Slug
        <input
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          required
        />
      </label>
      <label>
        Excerpt
        <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} />
      </label>
      <label>
        Content
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={14} required />
      </label>
      <label className="checkbox-label">
        <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
        Published
      </label>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
