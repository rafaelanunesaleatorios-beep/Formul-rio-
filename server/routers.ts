import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { getSessionCookieOptions } from "./_core/cookies";
import { COOKIE_NAME } from "@shared/const";
import { applications as applicationsTable } from "../drizzle/schema";
import {
  createApplication,
  listApplications,
  listMiddlemanRoles,
  listMiddlemen,
  updateApplicationStatus,
} from "./db";
import { TRPCError } from "@trpc/server";
import { desc } from "drizzle-orm";
import { getDb } from "./db";

const ADMIN_CODE = process.env.MILLENIUM_ADMIN_CODE || "99!-@Mulra";

const defaultRoles = [
  { id: 1, name: "Middleman Principal", description: "Coordena negociações de maior valor e garante que o protocolo seja seguido.", color: "green", active: 1 },
  { id: 2, name: "Middleman de Suporte", description: "Acompanha trocas, orienta membros e escala situações sensíveis.", color: "blue", active: 1 },
  { id: 3, name: "Middleman em Treinamento", description: "Aprende o fluxo com acompanhamento de um Middleman experiente.", color: "amber", active: 1 },
];

const applicationInput = z.object({
  discordId: z.string().trim().min(2).max(64),
  discordTag: z.string().trim().min(2).max(120),
  ageRange: z.string().trim().min(1).max(40),
  timezone: z.string().trim().min(1).max(80),
  experience: z.string().trim().min(20).max(4000),
  availability: z.string().trim().min(10).max(2000),
  motivation: z.string().trim().min(20).max(4000),
  trust: z.string().trim().min(20).max(4000),
  scenario: z.string().trim().min(20).max(4000),
  references: z.string().trim().max(2000).optional(),
  extra: z.string().trim().max(2000).optional(),
});

const adminInput = z.object({ code: z.string().min(1).max(128) });

const memoryApplications: Array<z.infer<typeof applicationInput> & { id: number; protocol: string; status: "pending" | "approved" | "rejected"; createdAt: Date; updatedAt: Date }> = [];
let nextMemoryId = 1;

function ensureAdmin(code: string) {
  if (code !== ADMIN_CODE) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Código de administração inválido." });
  }
}

async function dashboardData() {
  const dbApplications = await listApplications();
  const dbRoles = await listMiddlemanRoles();
  const dbMiddlemen = await listMiddlemen();
  return {
    applications: dbApplications.length ? dbApplications : memoryApplications,
    roles: dbRoles.length ? dbRoles : defaultRoles,
    middlemen: dbMiddlemen,
  };
}

export const appRouter = router({
  system: router({
    health: publicProcedure.query(() => ({ status: "ok" as const })),
  }),
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  applications: router({
    submit: publicProcedure.input(applicationInput).mutation(async ({ input }) => {
      const now = new Date();
      const protocol = `MLN-${Date.now().toString(36).toUpperCase()}`;
      const record = { ...input, protocol, status: "pending" as const, createdAt: now, updatedAt: now };
      const saved = await createApplication(record);
      if (!saved) {
        memoryApplications.unshift({ ...record, id: nextMemoryId++ });
      }
      return { success: true as const, protocol };
    }),
  }),
  admin: router({
    verify: publicProcedure.input(adminInput).mutation(async ({ input }) => {
      ensureAdmin(input.code);
      const data = await dashboardData();
      return { success: true as const, ...data };
    }),
    dashboard: publicProcedure.input(adminInput).query(async ({ input }) => {
      ensureAdmin(input.code);
      return dashboardData();
    }),
    updateStatus: publicProcedure.input(adminInput.extend({
      id: z.number().int().positive(),
      status: z.enum(["pending", "approved", "rejected"]),
    })).mutation(async ({ input }) => {
      ensureAdmin(input.code);
      const updated = await updateApplicationStatus(input.id, input.status);
      const memory = memoryApplications.find(application => application.id === input.id);
      if (memory) memory.status = input.status;
      return { success: true as const, application: updated ?? memory ?? null };
    }),
  }),
});

export type AppRouter = typeof appRouter;
