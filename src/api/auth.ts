import client from "./client";

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

export type AuthResponse = {
  accessToken: string;
};

export type SignUpResponse = AuthResponse & {
  user: {
    id: number;
    email: string;
    username: string;
    role: Role;
  };
};

export const login = async (input: LoginInput) => {
  const { data } = await client.post<AuthResponse>("/auth/login", input);
  localStorage.setItem("accessToken", data.accessToken);
  return data;
};

export const signUp = async (input: SignUpInput) => {
  const { data } = await client.post<SignUpResponse>("/auth/signup", input);
  localStorage.setItem("accessToken", data.accessToken);
  return data;
};

export const logout = async () => {
  await client.post("/auth/logout");
  localStorage.removeItem("accessToken");
};
