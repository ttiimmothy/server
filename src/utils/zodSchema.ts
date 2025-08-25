import z from "zod";

export const planSchema = z.object({
  planId: z.enum(["plan_monthly", "plan_annual"]),
});