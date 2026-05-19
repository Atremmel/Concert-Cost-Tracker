"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Music } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ThemeSelector } from "./ThemeSelector";
import { PageTransition } from "@/components/ui/PageTransition";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/concerts/add", label: "Add Concert" },
  { href: "/concerts", label: "My Concerts" },
];

type AppShellProps = {
  userEmail: string;
  children: React.ReactNode;
};

export function AppShell({ userEmail, children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-base-200">
      <header
        className="sticky top-0 z-30 border-b border-base-300 bg-base-100/95 backdrop-blur-sm"
        suppressHydrationWarning
      >
        <div className="page-container !pb-3 !pt-3">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <Music className="mt-1 h-8 w-8 shrink-0 text-primary" aria-hidden />
              <div className="min-w-0">
                <h1 className="text-xl font-bold">Concert Cost Tracker</h1>
                <p className="hidden text-sm text-base-content/70 sm:block">
                  Log shows, track spending, and see which concerts were worth it.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <ThemeSelector className="max-w-[10rem]" />
              <span
                className="badge badge-ghost max-w-[10rem] truncate text-xs sm:max-w-[14rem]"
                title={userEmail}
              >
                {userEmail}
              </span>
              <button
                type="button"
                className="btn btn-ghost btn-sm min-h-11 gap-1 hover:bg-base-200"
                onClick={handleLogout}
                aria-label="Log out"
              >
                <LogOut className="h-4 w-4" aria-hidden />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </div>
          </div>
        </div>

        <nav className="border-t border-base-300/80">
          <div className="page-container !py-0">
            <div className="nav-scroll-fade overflow-x-auto">
              <div
                role="tablist"
                className="tabs tabs-boxed min-h-12 w-max min-w-full gap-1 bg-transparent px-1 py-2"
              >
                {NAV.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    role="tab"
                    className={`tab min-h-10 whitespace-nowrap transition-all ${
                      pathname === href
                        ? "tab-active font-semibold"
                        : "hover:bg-base-200"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main className="page-container">
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
}
