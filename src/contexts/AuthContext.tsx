import { AxiosError } from "axios";
import router from "next/router";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import { createContext, ReactNode, useEffect, useState } from "react";
import { authApi } from "../services/axios-api";

type AuthProviderProps = {
  children: ReactNode;
};

type signInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn(credentials: signInCredentials): Promise<void>;
  isAuthenticated: boolean;
  user: User;
};

type User = {
  name: string;
  email: string;
  permissions: string[];
  roles: string[];
} | null;

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  destroyCookie(undefined, "dashgo.token");
  destroyCookie(undefined, "dashgo.refreshToken");
  router.push("/");
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;

  useEffect(() => {
    const { "dashgo.token": token } = parseCookies();

    if (token) {
      authApi
        .get("/me")
        .then((response) => {
          const { email, permissions, roles, name } = response.data;

          setUser({
            name,
            email,
            permissions,
            roles,
          });
        })
        .catch(() => {
          signOut();
          router.push("/");
        });
    }
  }, []);

  async function signIn({ email, password }: signInCredentials) {
    try {
      const response = await authApi.post("sessions", {
        email,
        password,
      });

      const { token, refreshToken, permissions, roles, name } = response.data;

      setCookie(undefined, "dashgo.token", token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });
      setCookie(undefined, "dashgo.refreshToken", refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });

      setUser({
        name,
        email,
        permissions,
        roles,
      });

      authApi.defaults.headers["Authorization"] = `Bearer ${token}`;

      if (response.status !== 401) {
        alert('Bem vindo!')
        router.push("/dashboard");
      }

    } catch (err: AxiosError | any) {
      if (err.response.data.message === "E-mail or password incorrect.") {
        throw new Error("E-mail ou senha incorretos.");
      }
      throw new Error("Erro ao realizar login.");
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}
