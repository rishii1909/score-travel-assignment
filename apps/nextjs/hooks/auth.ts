import { useEffect } from "react";
import { useRouter } from "next/router";
import { useOryAuthStore } from "../stores/ory-auth.store";

export const useRedirectIfAuthenticated = () => {
  const router = useRouter();
  const { isAuthenticated, checkIsAuthenticated } = useOryAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await checkIsAuthenticated();
      if (isAuthenticated) {
        router.push("/"); // Redirect to the desired path if authenticated
      }
    };

    checkAuth();
  }, [isAuthenticated, checkIsAuthenticated, router]);
};

export const useRedirectIfUnauthenticated = () => {
  const router = useRouter();
  const { isAuthenticated, checkIsAuthenticated } = useOryAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await checkIsAuthenticated();
      if (!isAuthenticated) {
        router.push("/auth/login");
      }
    };

    checkAuth();
  }, [isAuthenticated, checkIsAuthenticated, router]);
};
