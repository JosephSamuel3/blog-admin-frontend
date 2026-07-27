import client from "./client";
import type { Role } from "./auth";

export type UserProfile = {
  id: number;
  email: string;
  username: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
};

export type UpdateProfileInput = {
  email?: string;
  username?: string;
};

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

export const getProfile = async () => {
  const { data } = await client.get<UserProfile>("/users/me");
  return data;
};

export const updateProfile = async (input: UpdateProfileInput) => {
  await client.patch("/users/me", input);
};

export const changePassword = async (input: ChangePasswordInput) => {
  await client.patch("/users/me/password", input);
};
