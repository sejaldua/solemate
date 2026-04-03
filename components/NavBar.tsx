"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_STEPS, BASE_PATH } from "@/utils/constants";

export default function NavBar() {
  const pathname = usePathname();

  // Don't show nav on landing page
  const normalizedPath = pathname.replace(BASE_PATH, "") || "/";
  if (normalizedPath === "/") return null;

  const currentIndex = NAV_STEPS.findIndex(
    (s) => s.path === normalizedPath || normalizedPath.startsWith(s.path + "/")
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/90 backdrop-blur border-b border-border px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center gap-1">
        <Link href="/" className="text-neon-green font-semibold mr-6 text-sm hover:opacity-80">
          SoleMate
        </Link>
        <div className="flex items-center gap-0.5 text-xs">
          {NAV_STEPS.slice(1).map((step, i) => {
            const isActive = i + 1 === currentIndex;
            const isPast = i + 1 < currentIndex;
            return (
              <Link
                key={step.path}
                href={step.path}
                className={`px-3 py-1 rounded-full transition-colors ${
                  isActive
                    ? "text-white bg-neon-green"
                    : isPast
                      ? "text-text-secondary hover:text-text-primary"
                      : "text-text-muted hover:text-text-secondary"
                }`}
              >
                {step.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
