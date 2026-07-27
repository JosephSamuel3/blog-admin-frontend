import client from "./client";

export type PaginationParams = {
  page?: number;
  limit?: number;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PostListItem = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  createdAt: string;
  author: { username: string };
};

export type PostDetail = {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  createdAt: string;
  updatedAt: string;
  author: { id: number; username: string };
};

export type PostAdmin = {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  author: { id: number; username: string };
};

export type PaginatedPosts<T> = {
  posts: T[];
  pagination: PaginationMeta;
};

export type CreatePostInput = {
  title: string;
  content: string;
  slug: string;
  excerpt?: string;
  published?: boolean;
};

export type UpdatePostInput = CreatePostInput;
export type PatchPostInput = Partial<CreatePostInput>;


// Admin endpoints

export const getAllPostsAdmin = async (params?: PaginationParams) => {
  const { data } = await client.get<PaginatedPosts<PostAdmin>>("/admin/posts", { params });
  return data;
};

export const getPostAdmin = async (id: number) => {
  const { data } = await client.get<PostAdmin>(`/admin/posts/${id}`);
  return data;
};

export const createPostAdmin = async (input: CreatePostInput) => {
  const { data } = await client.post<PostAdmin>("/admin/posts", input);
  return data;
};

export const updatePostAdmin = async (id: number, input: UpdatePostInput) => {
  const { data } = await client.put<PostAdmin>(`/admin/posts/${id}`, input);
  return data;
};

export const patchPostAdmin = async (id: number, input: PatchPostInput) => {
  const { data } = await client.patch<PostAdmin>(`/admin/posts/${id}`, input);
  return data;
};

export const deletePostAdmin = async (id: number) => {
  await client.delete(`/admin/posts/${id}`);
};
