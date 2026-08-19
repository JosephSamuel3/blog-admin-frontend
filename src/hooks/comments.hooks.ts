import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCommentsBySlug, deleteCommentAdmin } from "../api/comments";

const commentsKey = (slug: string) => ["comments", slug] as const;

export function useComments(slug: string) {
  return useQuery({
    queryKey: commentsKey(slug),
    queryFn: () => getCommentsBySlug(slug),
    enabled: !!slug,
  });
}

export function useDeleteCommentAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number; slug: string }) => deleteCommentAdmin(id),
    onSuccess: (_data, { slug }) => {
      queryClient.invalidateQueries({ queryKey: commentsKey(slug) });
    },
  });
}
