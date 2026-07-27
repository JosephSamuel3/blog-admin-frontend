import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllPostsAdmin,
  getPostAdmin,
  createPostAdmin,
  updatePostAdmin,
  patchPostAdmin,
  deletePostAdmin,
  type PaginationParams,
  type CreatePostInput,
  type UpdatePostInput,
  type PatchPostInput,
} from "../api/posts";

const postsAdminKey = (params?: PaginationParams) => ["posts", "admin", params] as const;
const postAdminKey = (id: number) => ["posts", "admin", id] as const;

export function usePostsAdmin(params?: PaginationParams) {
  return useQuery({
    queryKey: postsAdminKey(params),
    queryFn: () => getAllPostsAdmin(params),
  });
}

export function usePostAdmin(id: number) {
  return useQuery({
    queryKey: postAdminKey(id),
    queryFn: () => getPostAdmin(id),
    enabled: !!id,
  });
}

export function useCreatePostAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePostInput) => createPostAdmin(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", "admin"] });
    },
  });
}

export function useUpdatePostAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdatePostInput }) =>
      updatePostAdmin(id, input),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["posts", "admin"] });
      queryClient.invalidateQueries({ queryKey: postAdminKey(id) });
    },
  });
}

export function usePatchPostAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: PatchPostInput }) =>
      patchPostAdmin(id, input),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["posts", "admin"] });
      queryClient.invalidateQueries({ queryKey: postAdminKey(id) });
    },
  });
}

export function useDeletePostAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deletePostAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", "admin"] });
    },
  });
}