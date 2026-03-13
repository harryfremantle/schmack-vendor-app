import { z } from "zod";
export const employeeSchema = z.object({
  name: z.string().min(2), email: z.string().email().optional().or(z.literal("")), title: z.string().optional(), countryId: z.string().optional(),
  teamIds: z.array(z.string()).default([]), notes: z.string().optional(), status: z.enum(["ACTIVE", "ARCHIVED"]).default("ACTIVE")
});
