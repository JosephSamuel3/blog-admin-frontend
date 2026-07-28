import { useState } from "react";
import { useNavigate } from "react-router";
import { PostForm } from "../../components/PostForm";
import { useCreatePostAdmin } from "../../hooks/posts.hooks";
import type { CreatePostInput } from "../../api/posts";

export default function NewPostPage() {
  const navigate = useNavigate();
  const createPost = useCreatePostAdmin();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: CreatePostInput) => {
    setError(null);
    try {
      const post = await createPost.mutateAsync(values);
      navigate(`/posts/${post.id}/edit`);
    } catch {
      setError("Couldn't create post. Check the slug isn't already taken.");
    }
  };

  return (
    <div>
      <h1>New post</h1>
      <PostForm
        submitLabel="Create post"
        isSubmitting={createPost.isPending}
        error={error}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
