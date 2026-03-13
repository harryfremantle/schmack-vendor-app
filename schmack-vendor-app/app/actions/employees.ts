"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { employeeSchema } from "@/lib/validation/employee";
export async function createEmployee(input: unknown) {
  const parsed = employeeSchema.parse(input);
  const employee = await db.employee.create({ data: { name: parsed.name, email: parsed.email || null, title: parsed.title, countryId: parsed.countryId || null, notes: parsed.notes, status: parsed.status, teams: { create: parsed.teamIds.map((teamId) => ({ teamId })) } } });
  revalidatePath("/employees"); return employee;
}
export async function updateEmployee(id: string, input: unknown) {
  const parsed = employeeSchema.parse(input);
  await db.employeeTeam.deleteMany({ where: { employeeId: id } });
  const employee = await db.employee.update({ where: { id }, data: { name: parsed.name, email: parsed.email || null, title: parsed.title, countryId: parsed.countryId || null, notes: parsed.notes, status: parsed.status, teams: { create: parsed.teamIds.map((teamId) => ({ teamId })) } } });
  revalidatePath("/employees"); revalidatePath(`/employees/${id}`); return employee;
}
export async function archiveEmployee(id: string) { await db.employee.update({ where: { id }, data: { status: "ARCHIVED" } }); revalidatePath("/employees"); }
