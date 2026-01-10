import { z } from "zod";

export const appointmentSchema = z.object({
  patientName: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Formato de hora inválido"),
  notes: z.string().optional(),
  status: z.enum(["agendada", "cancelada", "finalizada"]).optional(),
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;