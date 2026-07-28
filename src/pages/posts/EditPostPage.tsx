import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { PostForm } from "../../components/PostForm";
import { useDeletePostAdmin, usePostAdmin, useUpdatePostAdmin } from "../../hooks/posts.hooks";
import type { CreatePostInput } from "../../api/posts";

export default function EditPostPage() {
  const { id } = useParams();
  const postId = Number(id);
  const navigate = useNavigate();
  const { data: post, isLoading, isError } = usePostAdmin(postId);
  const updatePost = useUpdatePostAdmin();
  const deletePost = useDeletePostAdmin();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: CreatePostInput) => {
    setError(null);
    try {
      await updatePost.mutateAsync({ id: postId, input: values });
      navigate("/posts");
    } catch {
      setError("Couldn't save post.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this post? This can't be undone.")) return;
    await deletePost.mutateAsync(postId);
    navigate("/posts");
  };

  if (isLoading) return <p>Loading…</p>;
  if (isError || !post) return <p className="form-error">Couldn't load this post.</p>;

  return (
    <div>
      <div className="page-header">
        <h1>Edit post</h1>
        <button className="button-link danger" onClick={handleDelete}>
          Delete
        </button>
      </div>
      <PostForm
        initialValues={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? "",
          content: post.content,
          published: post.published,
        }}
        submitLabel="Save changes"
        isSubmitting={updatePost.isPending}
        error={error}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
