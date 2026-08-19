import client from "./client";

export type CommentItem = {
  id: number;
  content: string;
  createdAt: string;
  author: { id: number; username: string };
};

export const getCommentsBySlug = async (slug: string) => {
  const { data } = await client.get<{ comments: CommentItem[] }>(`/posts/${slug}/comments`);
  return data.comments;
};

export const deleteCommentAdmin = async (id: number) => {
  await client.delete(`/admin/comments/${id}`);
};
