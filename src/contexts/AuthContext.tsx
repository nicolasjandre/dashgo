import { createContext, ReactNode } from "react";

type AuthProviderProps = {
  children: ReactNode;
};

type signInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn(credentials: signInCredentials): Promise<SignIn>;
  isAuthenticated: boolean;
};

type SignIn = {
    token: string;
    refreshToken: string;
    roles: [];
    permissions: []
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const isAuthenticated = false;

    async function signIn({ email, password }: signInCredentials) {
        /* Was necessary use fetch because axios doesn't works properly with   
           mirageJS. The passthrough function seens to not work when using
           axios to make the api call */
      try {
        const response = await fetch("http://localhost:3333/sessions", {
          method: "POST",
          body: JSON.stringify({
            email,
            password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .catch((error) => {
            throw new Error(error);
          });

        return response;
      } catch (err) {
        console.log("Error:", err);
      }
    }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
