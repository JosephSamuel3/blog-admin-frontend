import client from "./client";
import { getProfile } from "./user";

export type Role = "ADMIN" | "USER";

export type LoginInput = {
  email: string;
  password: string;
};

export type SignUpInput = {
  email: string;
  username: string;
  password: string;
};

export type AuthUser = {
    id: number,
    email: string,
    username: string,
    role: Role
}


export type AuthResponse = {
  accessToken: string;
  user: AuthUser
};

export type LoginResponse = {
  accessToken: string;
};

export const login = async (input: LoginInput) => {
  const { data } = await client.post<LoginResponse>("/auth/login", input);
  localStorage.setItem("accessToken", data.accessToken);
  const user = await getProfile();
  return { accessToken: data.accessToken, user };
};

export const signUp = async (input: SignUpInput) => {
  const { data } = await client.post<AuthResponse>("/auth/signup", input);
  localStorage.setItem("accessToken", data.accessToken);
  return data;
};

export const logout = async () => {
  await client.post("/auth/logout");
  localStorage.removeItem("accessToken");
};
