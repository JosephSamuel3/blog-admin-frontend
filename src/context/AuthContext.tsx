import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import * as authApi from "../api/auth";
import { getProfile } from "../api/user";
import { AUTH_EXPIRED_EVENT } from "../api/client";


type AuthContextValue = {
    user: authApi.AuthUser | null,
    login: (input: authApi.LoginInput) => Promise<void>,
    signUp: (input: authApi.SignUpInput) => Promise<void>,
    logout: () => Promise<void>,
    refreshUser: () => Promise<void>,
    isAuthenticated: boolean
    isLoading: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider ({ children }: { children: ReactNode }){
    const [user, setUser] = useState<authApi.AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            setIsLoading(false);
            return;
        }

        getProfile()
            .then(setUser)
            .catch(() => localStorage.removeItem("accessToken"))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        const handleAuthExpired = () => setUser(null);
        window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
        return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    }, []);

    const login = async(input: authApi.LoginInput) => {
        const { user } = await authApi.login(input);
        setUser(user)
    };

    const signUp = async(input: authApi.SignUpInput) => {
        const { user } = await authApi.signUp(input);
        setUser(user)
    };

    const logout = async() => {
        try {
            await authApi.logout();
        } finally {
            setUser(null);
        }
    };

    const refreshUser = async () => {
        const profile = await getProfile();
        setUser(profile);
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value = {{ user, login, signUp, logout, refreshUser, isLoading, isAuthenticated}}>
            { children }
        </AuthContext.Provider>
    )
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}