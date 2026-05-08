import type { ReactNode } from "react";

interface AdminShellProps {
  title: string;
  children?: ReactNode;
}

const menus = [
  { label: "Pages", href: "/admin/pages" },
  { label: "Navigation", href: "/admin/navigation" },
  { label: "Media", href: "/admin/media" },
  { label: "SEO", href: "/admin/seo" },
  { label: "Settings", href: "/admin/settings" }
];

export default function AdminShell({ title, children }: AdminShellProps) {
  return (
    <div className="grid gap-6 md:grid-cols-[220px_1fr]">
      <aside className="rounded-panel border border-slate-200 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Admin</p>
        <nav className="mt-3 flex flex-col gap-1">
          {menus.map((menu) => (
            <a key={menu.href} href={menu.href} className="rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
              {menu.label}
            </a>
          ))}
        </nav>
      </aside>
      <section className="rounded-panel border border-slate-200 bg-white p-6">
        <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
        <div className="mt-4">{children}</div>
      </section>
    </div>
  );
}
