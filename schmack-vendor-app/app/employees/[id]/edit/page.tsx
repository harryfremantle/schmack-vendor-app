import { notFound } from "next/navigation";
import { EmployeeForm } from "@/components/forms/employee-form";
import { db } from "@/lib/db";
export default async function EditEmployeePage({ params }: { params: { id: string } }) {
  const [employee, teams, countries] = await Promise.all([
    db.employee.findUnique({ where: { id: params.id }, include: { teams: true } }),
    db.team.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    db.country.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } })
  ]);
  if (!employee) notFound();
  return <div className="space-y-6"><div><h2 className="text-2xl font-semibold">Edit Employee</h2><p className="text-sm text-slate-500">Update employee metadata and access context.</p></div><div className="rounded-2xl border bg-white p-6"><EmployeeForm employee={{ id: employee.id, name: employee.name, email: employee.email ?? "", title: employee.title ?? "", countryId: employee.countryId ?? "", teamIds: employee.teams.map((team) => team.teamId), notes: employee.notes ?? "", status: employee.status }} teams={teams} countries={countries} /></div></div>;
}
