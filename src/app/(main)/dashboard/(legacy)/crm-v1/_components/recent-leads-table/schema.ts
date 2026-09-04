import z from "zod";

const recentLeadsSchema = z.object({
  id: z.string(),
  name: z.string(),
  company: z.string(),
  status: z.string(),
  source: z.string(),
  lastActivityValue: z.number(),
  lastActivityUnit: z.enum(["minutes", "hours", "days"]),
});

export type RecentLeadRow = z.infer<typeof recentLeadsSchema>;
