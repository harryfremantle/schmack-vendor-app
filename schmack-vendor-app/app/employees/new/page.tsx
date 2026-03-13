export const dynamic = "force-dynamic";

import { EmployeeForm } from "@/components/forms/employee-form";
import { db } from "@/lib/db";
export default async function NewEmployeePage() {
  const [teams, countries] = await Promise.all([
    db.team.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    db.country.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } })
  ]);
  return <div className="space-y-6"><div><h2 className="text-2xl font-semibold">Add Employee</h2><p className="text-sm text-slate-500">Create a new employee record.</p></div><div className="rounded-2xl border bg-white p-6"><EmployeeForm teams={teams} countries={countries} /></div></div>;
}
