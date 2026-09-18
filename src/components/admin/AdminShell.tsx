import { Link, useLocation } from "wouter";
import type { ReactNode } from "react";
import { useAuth } from "../../lib/AuthContext";

const NAV = [
  { href: "/admin", label: "儀表板", exact: true },
  { href: "/admin/settings", label: "網站設定" },
  { href: "/admin/news", label: "最新消息" },
  { href: "/admin/cases", label: "實績案例" },
  { href: "/admin/properties", label: "在售物件" },
  { href: "/admin/forms", label: "表單收件匣" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { user, adminProfile, signOut } = useAuth();

  return (
    <div className="min-h-screen flex bg-surface-container-low font-body-md text-on-surface">
      <aside className="w-64 shrink-0 bg-primary text-white flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <span className="font-headline-md text-lg font-medium">Yellow House 後台</span>
        </div>
        <nav className="flex-1 flex flex-col gap-1 p-4">
          {NAV.map((item) => {
            const isActive = item.exact ? location === item.href : location.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-4 py-3 text-sm font-label-caps tracking-wide transition-colors ${
                  isActive ? "bg-brand-500 text-primary font-semibold" : "text-white/75 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10 flex flex-col gap-2">
          <span className="text-xs text-white/60 truncate">{adminProfile?.displayName || user?.email}</span>
          <button
            onClick={() => signOut()}
            className="rounded-md px-4 py-2 text-xs font-label-caps uppercase tracking-wider border border-white/20 hover:border-brand-500 hover:text-brand-500 transition-colors"
          >
            登出
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-8 md:p-12">{children}</div>
      </main>
    </div>
  );
}
