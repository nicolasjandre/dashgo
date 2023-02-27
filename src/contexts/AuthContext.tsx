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
  avatar: string;
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
  const [avatar, setAvatar] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;

  useEffect(() => {
    const { "dashgo.token": token } = parseCookies();

    if (token) {
      authApi
        .get("/me")
        .then((response) => {
          const { email, permissions, roles, name } = response.data;

          let formatedAvatar = `https://ui-avatars.com/api/?name=${name}`;
          formatedAvatar = formatedAvatar.replace(" ", "+");

          setAvatar(formatedAvatar);

          setUser({
            name,
            email,
            permissions,
            roles,
            avatar,
          });
        })
        .catch(() => {
          signOut();
          router.push('/')
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

      let formatedAvatar = `https://ui-avatars.com/api/?name=${name}`;
      formatedAvatar = formatedAvatar.replace(" ", "+");

      setAvatar(formatedAvatar);

      setUser({
        name,
        email,
        permissions,
        roles,
        avatar,
      });

      authApi.defaults.headers["Authorization"] = `Bearer ${token}`;

      if (response.status !== 401) router.push("/dashboard");
    } catch (err) {
      console.log("Error:", err);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}
