import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { EmployeeAssignmentPanel } from "@/components/assignments/employee-assignment-panel";
export default async function EmployeeDetailPage({ params }: { params: { id: string } }) {
  const [employee, vendors] = await Promise.all([
    db.employee.findUnique({ where: { id: params.id }, include: { country: true, teams: { include: { team: true } }, assignments: { include: { vendor: true } } } }),
    db.vendor.findMany({ where: { status: "ACTIVE" }, include: { tags: { include: { tag: true } } }, orderBy: { name: "asc" } })
  ]);
  if (!employee) notFound();
  const activeVendorIds = new Set(employee.assignments.filter((a) => a.status === "ACTIVE").map((a) => a.vendorId));
  return <div className="space-y-6"><div className="flex items-start justify-between"><div><h2 className="text-2xl font-semibold">{employee.name}</h2><p className="text-sm text-slate-500">{employee.email ?? employee.title ?? "Employee"}</p></div><Link href={`/employees/${employee.id}/edit`} className="rounded-xl border px-4 py-2 text-sm">Edit Employee</Link></div><div className="grid gap-4 md:grid-cols-3"><div className="rounded-2xl border bg-white p-4"><div className="text-sm text-slate-500">Teams</div><div className="mt-2 text-lg font-semibold">{employee.teams.map((t) => t.team.name).join(", ") || "—"}</div></div><div className="rounded-2xl border bg-white p-4"><div className="text-sm text-slate-500">Country</div><div className="mt-2 text-lg font-semibold">{employee.country?.name ?? "—"}</div></div><div className="rounded-2xl border bg-white p-4"><div className="text-sm text-slate-500">Assigned Vendors</div><div className="mt-2 text-lg font-semibold">{employee.assignments.filter((a) => a.status === "ACTIVE").length}</div></div></div><EmployeeAssignmentPanel employeeId={employee.id} vendors={vendors.map((vendor) => ({ id: vendor.id, name: vendor.name, tagNames: vendor.tags.map((t) => t.tag.name), assigned: activeVendorIds.has(vendor.id) }))} /></div>;
}
