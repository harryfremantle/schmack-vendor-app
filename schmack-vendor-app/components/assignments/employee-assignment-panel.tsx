"use client";
import { useMemo, useState, useTransition } from "react";
import { setVendorAssignments } from "@/app/actions/assignments";
import { useRouter } from "next/navigation";
type VendorOption = { id: string; name: string; tagNames: string[]; assigned: boolean };
export function EmployeeAssignmentPanel({ employeeId, vendors }: { employeeId: string; vendors: VendorOption[] }) {
  const router = useRouter(); const [query, setQuery] = useState(""); const [isPending, startTransition] = useTransition(); const [selected, setSelected] = useState<string[]>(vendors.filter((v) => v.assigned).map((v) => v.id));
  const filtered = useMemo(() => { const lower = query.toLowerCase(); return vendors.filter((vendor) => [vendor.name, vendor.tagNames.join(" ")].join(" ").toLowerCase().includes(lower)); }, [vendors, query]);
  function toggle(id: string) { setSelected((current) => current.includes(id) ? current.filter((v) => v !== id) : [...current, id]); }
  function save() { startTransition(async () => { await setEmployeeAssignments(employeeId, selected); router.refresh(); }); }
  return <div className="rounded-2xl border bg-white p-5"><div className="mb-4 flex items-center justify-between gap-4"><div><h3 className="font-semibold">Manage Platform Access</h3><p className="text-sm text-slate-500">Assigned: {selected.length}</p></div><input className="w-72 rounded-xl border px-3 py-2 text-sm" placeholder="Search vendors" value={query} onChange={(e) => setQuery(e.target.value)} /></div><div className="space-y-2">{filtered.map((vendor) => { const checked = selected.includes(vendor.id); return <label key={vendor.id} className="flex items-center justify-between rounded-xl border p-3"><div><div className="font-medium">{vendor.name}</div><div className="text-sm text-slate-500">{vendor.tagNames.join(", ")}</div></div><input type="checkbox" checked={checked} onChange={() => toggle(vendor.id)} className="h-4 w-4" /></label>; })}</div><div className="mt-4 flex justify-end"><button disabled={isPending} onClick={save} className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white">{isPending ? "Saving..." : "Save access"}</button></div></div>;
}
