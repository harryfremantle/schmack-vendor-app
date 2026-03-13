"use server";

import { db } from "@/lib/db";

type Assignment = {
  id: string;
  employeeId: string;
  status: string;
};

export async function setVendorAssignments(vendorId: string, employeeIds: string[]) {
  const existing: Assignment[] = await db.vendorAssignment.findMany({
    where: { vendorId },
  });

  const existingIds = new Set(
    existing
      .filter((a) => a.status === "ACTIVE")
      .map((a) => a.employeeId)
  );

  const nextIds = new Set(employeeIds);

  // deactivate removed assignments
  for (const assignment of existing) {
    if (existingIds.has(assignment.employeeId) && !nextIds.has(assignment.employeeId)) {
      await db.vendorAssignment.update({
        where: { id: assignment.id },
        data: { status: "REMOVED" },
      });
    }
  }

  // add or reactivate assignments
  for (const employeeId of employeeIds) {
    const found = existing.find((a) => a.employeeId === employeeId);

    if (!found) {
      await db.vendorAssignment.create({
        data: {
          vendorId,
          employeeId,
          status: "ACTIVE",
        },
      });
    } else if (found.status !== "ACTIVE") {
      await db.vendorAssignment.update({
        where: { id: found.id },
        data: { status: "ACTIVE" },
      });
    }
  }
}