import { useEffect } from "react";
import { useLocation } from "wouter";
import type { ReactNode } from "react";
import { useAuth } from "../../lib/AuthContext";

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, adminProfile, isAdmin } = useAuth();
  const [, navigate] = useLocation();

  const resolved = user !== undefined && adminProfile !== undefined;

  useEffect(() => {
    if (resolved && !isAdmin) {
      navigate("/admin/login", { replace: true });
    }
  }, [resolved, isAdmin, navigate]);

  if (!resolved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-container-low text-on-surface-variant font-body-md">
        載入中...
      </div>
    );
  }

  if (!isAdmin) return null;

  return <>{children}</>;
}
