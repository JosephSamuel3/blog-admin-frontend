import { useState } from "react";
import { Link } from "react-router";
import { useDeletePostAdmin, usePostsAdmin } from "../../hooks/posts.hooks";

const PAGE_SIZE = 10;

export default function PostsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = usePostsAdmin({ page, limit: PAGE_SIZE });
  const deletePost = useDeletePostAdmin();
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const posts = data?.posts ?? [];
  const pagination = data?.pagination;

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this post? This can't be undone.")) return;
    setPendingDeleteId(id);
    try {
      await deletePost.mutateAsync(id);
    } finally {
      setPendingDeleteId(null);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Posts</h1>
        <Link to="/posts/new" className="button">New post</Link>
      </div>

      {isLoading && <p>Loading…</p>}
      {isError && <p className="form-error">Couldn't load posts.</p>}
      {!isLoading && posts.length === 0 && (
        <p className="muted">No posts yet. Create your first one.</p>
      )}

      {posts.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Status</th>
              <th>Updated</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>{post.author.username}</td>
                <td>
                  <span className={post.published ? "badge badge-published" : "badge badge-draft"}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td>{new Date(post.updatedAt).toLocaleDateString()}</td>
                <td className="table-actions">
                  <Link to={`/posts/${post.id}/preview`}>Preview</Link>
                  <Link to={`/posts/${post.id}/edit`}>Edit</Link>
                  <button
                    className="button-link danger"
                    onClick={() => handleDelete(post.id)}
                    disabled={pendingDeleteId === post.id}
                  >
                    {pendingDeleteId === post.id ? "Deleting…" : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </button>
          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button disabled={page >= pagination.totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
