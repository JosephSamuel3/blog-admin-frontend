import { useState } from "react";
import { Link, useParams } from "react-router";
import { usePostAdmin } from "../../hooks/posts.hooks";
import { useComments, useDeleteCommentAdmin } from "../../hooks/comments.hooks";

export default function PreviewPostPage() {
  const { id } = useParams();
  const postId = Number(id);
  const { data: post, isLoading, isError } = usePostAdmin(postId);

  if (isLoading) return <p>Loading…</p>;
  if (isError || !post) return <p className="form-error">Couldn't load this post.</p>;

  return (
    <article className="card preview-card">
      <div className="page-header">
        <span className={post.published ? "badge badge-published" : "badge badge-draft"}>
          {post.published ? "Published" : "Draft"}
        </span>
        <Link to={`/posts/${post.id}/edit`} className="button">
          Edit
        </Link>
      </div>
      <h1>{post.title}</h1>
      <p className="muted">
        By {post.author.username} · {new Date(post.createdAt).toLocaleDateString()}
      </p>
      {post.excerpt && <p className="excerpt">{post.excerpt}</p>}
      <div className="preview-content" dangerouslySetInnerHTML={{ __html: post.content }} />

      {post.published ? (
        <CommentsSection slug={post.slug} />
      ) : (
        <div className="card comments-section">
          <h2>Comments</h2>
          <p className="muted">Comments aren't available for drafts. Publish the post to see them.</p>
        </div>
      )}
    </article>
  );
}

function CommentsSection({ slug }: { slug: string }) {
  const { data: comments, isLoading, isError } = useComments(slug);
  const deleteComment = useDeleteCommentAdmin();
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this comment? This can't be undone.")) return;
    setPendingDeleteId(id);
    try {
      await deleteComment.mutateAsync({ id, slug });
    } finally {
      setPendingDeleteId(null);
    }
  };

  return (
    <div className="card comments-section">
      <div className="card-header">
        <h2>Comments{comments ? ` (${comments.length})` : ""}</h2>
      </div>

      {isLoading && <p>Loading…</p>}
      {isError && <p className="form-error">Couldn't load comments.</p>}
      {!isLoading && !isError && comments?.length === 0 && (
        <p className="muted">No comments yet.</p>
      )}

      {comments && comments.length > 0 && (
        <ul className="comment-list">
          {comments.map((comment) => (
            <li key={comment.id} className="comment-item">
              <div className="comment-body">
                <p className="comment-meta">
                  <strong>{comment.author.username}</strong>{" "}
                  <span className="muted">
                    · {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </p>
                <p className="comment-content">{comment.content}</p>
              </div>
              <button
                className="button-link danger"
                onClick={() => handleDelete(comment.id)}
                disabled={pendingDeleteId === comment.id}
              >
                {pendingDeleteId === comment.id ? "Deleting…" : "Delete"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
