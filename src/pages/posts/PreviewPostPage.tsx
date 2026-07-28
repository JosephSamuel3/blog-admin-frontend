import { Link, useParams } from "react-router";
import { usePostAdmin } from "../../hooks/posts.hooks";

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
      <div className="preview-content">
        {post.content.split("\n\n").map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
