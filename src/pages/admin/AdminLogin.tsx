import { useEffect, useState, type FormEvent } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../../lib/AuthContext";

export function AdminLogin() {
  const { user, adminProfile, isAdmin, signIn } = useAuth();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdmin) navigate("/admin", { replace: true });
  }, [isAdmin, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
    } catch {
      setError("登入失敗，請確認 Email 與密碼是否正確。");
    } finally {
      setLoading(false);
    }
  };

  const resolved = user !== undefined && adminProfile !== undefined;
  const showInactiveNotice = resolved && user && !isAdmin;

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-container-low px-4 font-body-md">
      <div className="w-full max-w-sm rounded-xl bg-surface-container-lowest border border-outline-variant p-8 flex flex-col gap-6 shadow-sm">
        <div className="flex flex-col items-center gap-2">
          {/* The old /yellow_house.png is white artwork — invisible on this
              light card. Use the brand-coloured lockup instead. */}
          <img src="/brand/yh-logo.svg" alt="Yellow House" className="h-12 object-contain" />
          <h1 className="font-headline-md text-lg text-primary font-medium">客戶後台登入</h1>
        </div>

        {showInactiveNotice && (
          <p className="rounded-md px-4 py-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs">
            此帳號尚未取得後台權限，請聯繫網站管理者確認。
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-on-surface-variant">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-md p-3 border border-outline-variant bg-surface focus:border-primary focus:outline-none text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-on-surface-variant">密碼</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-md p-3 border border-outline-variant bg-surface focus:border-primary focus:outline-none text-sm"
            />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="rounded-md py-3 bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? "登入中..." : "登入"}
          </button>
        </form>
      </div>
    </div>
  );
}
