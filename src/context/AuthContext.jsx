import { createContext, useContext, useState } from "react";

const AuthContext = createContext();


export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);


  const login = async (username, password) => {

    const res = await fetch(
      "http://localhost:5000/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      }
    );

    const data = await res.json();

    if (!res.ok) throw new Error(data.error);

    setUser(data.user);

    return data.user;
  };

const refreshUser = async () => {

  const res = await fetch(
    "http://localhost:5000/api/auth/me",
    {
      credentials: "include",
    }
  );

  const data = await res.json();

  if (res.ok) {
    setUser(data.user);
  }
};


  const logout = async () => {

    await fetch(
      "http://four6-backend.onrender.com/api/auth/logout",
      {
        method: "POST",
        credentials: "include",
      }
    );

    setUser(null);
  };


  return (
    <AuthContext.Provider
  value={{ user, setUser, login, logout, refreshUser }}
>

      {children}
    </AuthContext.Provider>
  );
}


export function useUser() {
  return useContext(AuthContext);
}
