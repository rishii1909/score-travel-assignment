// stores/authStore.js
import { create } from "zustand";
import Cookies from "js-cookie";
import { oryClient } from "../clients/oryClient";
import { apiClient } from "../clients/apiClient";
import { Session } from "@ory/client";

interface OryAuthState {
  isAuthenticated: boolean;
  authSession?: Session;
  roles?: string[];
  userData?: { [key: string]: string };
  checkIsAuthenticated: () => Promise<boolean>;
  resetAuthStatus: () => Promise<boolean>;
  refreshAuthSessionFromCookie: () => void;
  login: () => void;
  logout: () => void;
  hasMetadata: () => boolean;
}

export const useOryAuthStore = create<OryAuthState>((set, get) => ({
  isAuthenticated: false,
  authSession: undefined,
  roles: undefined,
  userData: undefined,

  checkIsAuthenticated: async () => {
    if (get().isAuthenticated) return true;
    return get().resetAuthStatus();
  },

  resetAuthStatus: async () => {
    try {
      const response = await oryClient.toSession();

      const apiResponse = await apiClient.put("/users/login");
      const { user, roles } = apiResponse.data;
      set({
        isAuthenticated: true,
        authSession: response.data,
        roles,
        userData: user,
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  refreshAuthSessionFromCookie: () => {
    const session = Cookies.get("ory_session");
    set({ isAuthenticated: !!session });
    if (session) set({ authSession: <Session>JSON.parse(session) });
  },
  login: () => {
    const session = Cookies.get("ory_session");
    set({ isAuthenticated: !!session });
  },
  logout: () => {
    Cookies.remove("ory_session");
    set({ isAuthenticated: false });
  },

  setRoles: (roles: string[]) => {
    set({ roles });
  },

  hasMetadata: () => {
    const { userData, roles } = get();
    return !!userData && !!roles;
  },
}));
