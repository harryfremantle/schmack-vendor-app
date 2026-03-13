"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
export async function setVendorAssignments(vendorId: string, employeeIds: string[]) {
  const existing = await db.vendorAssignment.findMany({ where: { vendorId } });
  const existingIds = new Set(existing.filter((a) => a.status === "ACTIVE").map((a) => a.employeeId));
  const nextIds = new Set(employeeIds);
  for (const assignment of existing) if (existingIds.has(assignment.employeeId) && !nextIds.has(assignment.employeeId)) await db.vendorAssignment.update({ where: { id: assignment.id }, data: { status: "REMOVED", removedAt: new Date() } });
  for (const employeeId of employeeIds) {
    const found = existing.find((a) => a.employeeId === employeeId);
    if (!found) await db.vendorAssignment.create({ data: { vendorId, employeeId, status: "ACTIVE" } });
    else if (found.status !== "ACTIVE") await db.vendorAssignment.update({ where: { id: found.id }, data: { status: "ACTIVE", removedAt: null } });
  }
  revalidatePath(`/vendors/${vendorId}`); revalidatePath("/vendors"); revalidatePath("/employees"); revalidatePath("/dashboard");
}
export async function setEmployeeAssignments(employeeId: string, vendorIds: string[]) {
  const existing = await db.vendorAssignment.findMany({ where: { employeeId } });
  const existingIds = new Set(existing.filter((a) => a.status === "ACTIVE").map((a) => a.vendorId));
  const nextIds = new Set(vendorIds);
  for (const assignment of existing) if (existingIds.has(assignment.vendorId) && !nextIds.has(assignment.vendorId)) await db.vendorAssignment.update({ where: { id: assignment.id }, data: { status: "REMOVED", removedAt: new Date() } });
  for (const vendorId of vendorIds) {
    const found = existing.find((a) => a.vendorId === vendorId);
    if (!found) await db.vendorAssignment.create({ data: { vendorId, employeeId, status: "ACTIVE" } });
    else if (found.status !== "ACTIVE") await db.vendorAssignment.update({ where: { id: found.id }, data: { status: "ACTIVE", removedAt: null } });
  }
  revalidatePath(`/employees/${employeeId}`); revalidatePath("/employees"); revalidatePath("/vendors"); revalidatePath("/dashboard");
}
