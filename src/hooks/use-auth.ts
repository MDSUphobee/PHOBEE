import { useEffect, useState } from "react";

export type AuthUser = {
  id?: number | string;
  username?: string;
  email: string;
};

type AuthSession = {
  token: string;
  user: AuthUser;
};

const STORAGE_TOKEN = "auth_token";
const STORAGE_USER = "auth_user";

const getFromStorage = (key: string) => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
};

export const getStoredSession = (): AuthSession | null => {
  const token = getFromStorage(STORAGE_TOKEN);
  const rawUser = getFromStorage(STORAGE_USER);
  if (!token || !rawUser) return null;
  try {
    const user = JSON.parse(rawUser) as AuthUser;
    return { token, user };
  } catch {
    return null;
  }
};

export const saveAuthSession = (token: string, user: AuthUser) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_TOKEN, token);
  localStorage.setItem(STORAGE_USER, JSON.stringify(user));
};

export const clearAuthSession = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_TOKEN);
  localStorage.removeItem(STORAGE_USER);
};

export const useAuthSession = () => {
  const [session, setSession] = useState<AuthSession | null>(() => getStoredSession());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const refresh = () => setSession(getStoredSession());
    refresh();
    setHydrated(true);

    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_TOKEN || event.key === STORAGE_USER) {
        refresh();
      }
    };
    const onFocus = () => refresh();

    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const logout = () => {
    clearAuthSession();
    setSession(null);
  };

  return {
    session,
    isAuthenticated: Boolean(session?.token),
    hydrated,
    logout,
  };
};

