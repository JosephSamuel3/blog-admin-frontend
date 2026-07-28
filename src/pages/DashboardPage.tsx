import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { usePostsAdmin } from "../hooks/posts.hooks";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading, isError } = usePostsAdmin({ page: 1, limit: 5 });

  const posts = data?.posts ?? [];
  const publishedCount = posts.filter((post) => post.published).length;

  return (
    <div>
      <h1>Welcome back{user ? `, ${user.username}` : ""}</h1>
      <p className="muted">Here's a quick look at your blog.</p>

      <div className="stat-grid">
        <div className="card stat-card">
          <span className="stat-label">Total posts</span>
          <span className="stat-value">{data ? data.pagination.total : isLoading ? "…" : 0}</span>
        </div>
        <div className="card stat-card">
          <span className="stat-label">Published (recent)</span>
          <span className="stat-value">{publishedCount}</span>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Recent posts</h2>
          <Link to="/posts/new" className="button">New post</Link>
        </div>
        {isLoading && <p>Loading…</p>}
        {isError && <p className="form-error">Couldn't load posts.</p>}
        {!isLoading && posts.length === 0 && <p className="muted">No posts yet.</p>}
        {posts.length > 0 && (
          <ul className="post-list">
            {posts.map((post) => (
              <li key={post.id}>
                <Link to={`/posts/${post.id}/edit`}>{post.title}</Link>
                <span className={post.published ? "badge badge-published" : "badge badge-draft"}>
                  {post.published ? "Published" : "Draft"}
                </span>
              </li>
            ))}
          </ul>
        )}
        <Link to="/posts">View all posts →</Link>
      </div>
    </div>
  );
}
