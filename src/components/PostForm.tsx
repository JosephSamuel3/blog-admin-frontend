import { useState, type FormEvent } from "react";
import { Editor } from "@tinymce/tinymce-react";
import type { CreatePostInput } from "../api/posts";

const TINYMCE_API_KEY = import.meta.env.VITE_TINYMCE_API_KEY;

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
  const [contentError, setContentError] = useState<string | null>(null);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (content.trim() === "") {
      setContentError("Content can't be empty.");
      return;
    }
    setContentError(null);
    onSubmit({ title, slug, excerpt: excerpt || undefined, content, published });
  };

  return (
    <form className="card post-form" onSubmit={handleSubmit}>
      {error && <p className="form-error">{error}</p>}
      <label>
        Title
        <input value={title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="How to center a div" required />
      </label>
      <label>
        Slug
        <input
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          placeholder="how-to-center-a-div"
          required
        />
      </label>
      <label>
        Excerpt
        <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} 
        placeholder="A quick guide to centering elements in CSS using flexbox and grid."
 rows={2} />
      </label>
      <label>
        Content
        <Editor
          apiKey={TINYMCE_API_KEY}
          value={content}
          onEditorChange={(newContent) => setContent(newContent)}
          init={{
            height: 400,
            menubar: true,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "help",
              "wordcount",
            ],
            toolbar:
              "undo redo | blocks | bold italic underline strikethrough | forecolor backcolor | " +
              "alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | " +
              "link image media table charmap | removeformat | code fullscreen preview | help",
          }}
        />
        {contentError && <p className="form-error">{contentError}</p>}
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
