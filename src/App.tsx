import { RouterProvider } from "react-router";
import { useEffect } from "react";
import { getServerInstanceId } from "./api/services/auth";
import { clearAuthUser, getAuthUser } from "./features/auth/authStorage";
import { router } from "./routes";

export default function App() {
  useEffect(() => {
    let checking = false;

    async function verifyServerSession() {
      const user = getAuthUser();
      if (!user || checking) return;

      checking = true;
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 5000);

      try {
        const currentInstanceId = await getServerInstanceId(controller.signal);
        if (currentInstanceId !== user.serverInstanceId) {
          clearAuthUser();
        }
      } catch {
        clearAuthUser();
      } finally {
        window.clearTimeout(timeout);
        checking = false;
      }
    }

    void verifyServerSession();
    const interval = window.setInterval(() => void verifyServerSession(), 10000);
    window.addEventListener("focus", verifyServerSession);
    window.addEventListener("localhub-auth-change", verifyServerSession);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", verifyServerSession);
      window.removeEventListener("localhub-auth-change", verifyServerSession);
    };
  }, []);

  return <RouterProvider router={router} />;
}