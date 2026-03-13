import Link from "next/link";
import { db } from "@/lib/db";
import { EmployeesTable } from "@/components/tables/employees-table";
export default async function EmployeesPage() {
  const employees = await db.employee.findMany({ include: { country: true, teams: { include: { team: true } }, assignments: { where: { status: "ACTIVE" } } }, orderBy: { name: "asc" } });
  const rows = employees.map((employee) => ({ id: employee.id, name: employee.name, email: employee.email ?? "—", teams: employee.teams.map((t) => t.team.name), country: employee.country?.name ?? "—", assignedVendors: employee.assignments.length }));
  return <div className="space-y-6"><div className="flex items-center justify-between"><div><h2 className="text-2xl font-semibold">Employees</h2><p className="text-sm text-slate-500">Manage who has access to which systems.</p></div><Link href="/employees/new" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">Add Employee</Link></div><EmployeesTable data={rows} /></div>;
}
