"use client";
import { useMemo, useState, useTransition } from "react";
import { setVendorAssignments } from "@/app/actions/assignments";
import { useRouter } from "next/navigation";
type EmployeeOption = { id: string; name: string; email?: string | null; teamNames: string[]; assigned: boolean };
export function VendorAssignmentPanel({ vendorId, employees }: { vendorId: string; employees: EmployeeOption[] }) {
  const router = useRouter(); const [query, setQuery] = useState(""); const [isPending, startTransition] = useTransition(); const [selected, setSelected] = useState<string[]>(employees.filter((e) => e.assigned).map((e) => e.id));
  const filtered = useMemo(() => { const lower = query.toLowerCase(); return employees.filter((employee) => [employee.name, employee.email ?? "", employee.teamNames.join(" ")].join(" ").toLowerCase().includes(lower)); }, [employees, query]);
  function toggle(id: string) { setSelected((current) => current.includes(id) ? current.filter((v) => v !== id) : [...current, id]); }
  function save() { startTransition(async () => { await setVendorAssignments(vendorId, selected); router.refresh(); }); }
  return <div className="rounded-2xl border bg-white p-5"><div className="mb-4 flex items-center justify-between gap-4"><div><h3 className="font-semibold">Manage Employee Access</h3><p className="text-sm text-slate-500">Assigned: {selected.length}</p></div><input className="w-72 rounded-xl border px-3 py-2 text-sm" placeholder="Search employees" value={query} onChange={(e) => setQuery(e.target.value)} /></div><div className="space-y-2">{filtered.map((employee) => { const checked = selected.includes(employee.id); return <label key={employee.id} className="flex items-center justify-between rounded-xl border p-3"><div><div className="font-medium">{employee.name}</div><div className="text-sm text-slate-500">{employee.teamNames.join(", ")}</div></div><input type="checkbox" checked={checked} onChange={() => toggle(employee.id)} className="h-4 w-4" /></label>; })}</div><div className="mt-4 flex justify-end"><button disabled={isPending} onClick={save} className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white">{isPending ? "Saving..." : "Save access"}</button></div></div>;
}
