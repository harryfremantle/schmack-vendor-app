import "./globals.css";
import Link from "next/link";
import { ReactNode } from "react";
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en"><body className="min-h-screen bg-slate-50 text-slate-900"><div className="grid min-h-screen grid-cols-[240px_1fr]"><aside className="border-r border-slate-200 bg-white p-5"><div className="mb-8"><h1 className="text-xl font-semibold">SCHMACK</h1><p className="text-sm text-slate-500">Vendor Tracking</p></div><nav className="space-y-2 text-sm"><Link className="block rounded-lg px-3 py-2 hover:bg-slate-100" href="/dashboard">Dashboard</Link><Link className="block rounded-lg px-3 py-2 hover:bg-slate-100" href="/vendors">Vendors</Link><Link className="block rounded-lg px-3 py-2 hover:bg-slate-100" href="/employees">Employees</Link><Link className="block rounded-lg px-3 py-2 hover:bg-slate-100" href="/renewals">Renewals</Link><Link className="block rounded-lg px-3 py-2 hover:bg-slate-100" href="/settings">Settings</Link></nav></aside><main className="p-8">{children}</main></div></body></html>
  );
}
