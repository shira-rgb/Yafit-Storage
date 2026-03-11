import type { AuthProvider } from "@refinedev/core";

const VALID_USERNAME = "Yafit";
const VALID_PASSWORD = "Yafit12323!";

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      localStorage.setItem("yafit_auth", JSON.stringify({ username }));
      return { success: true, redirectTo: "/" };
    }
    return {
      success: false,
      error: { name: "Login Error", message: "שם משתמש או סיסמה שגויים" },
    };
  },
  logout: async () => {
    localStorage.removeItem("yafit_auth");
    return { success: true, redirectTo: "/login" };
  },
  check: async () => {
    const auth = localStorage.getItem("yafit_auth");
    if (auth) {
      return { authenticated: true };
    }
    return { authenticated: false, redirectTo: "/login" };
  },
  getIdentity: async () => {
    const auth = localStorage.getItem("yafit_auth");
    if (auth) {
      const { username } = JSON.parse(auth);
      return { id: 1, name: username };
    }
    return null;
  },
  onError: async (error) => {
    return { error };
  },
};
