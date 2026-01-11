import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase } from "@/lib/db/data-source";
import { Appointment, AppointmentStatus } from "@/lib/db/entities/Appointment";
import { appointmentSchema } from "@/lib/validations/appointment";
import { AppDataSource } from "@/lib/db/data-source";
import { Between, Like } from "typeorm";
import { createAuditLog, getIpFromRequest } from "@/lib/audit";
import { AuditAction, AuditEntity } from "@/lib/db/entities/AuditLog";

// GET - Listar citas con filtros opcionales
export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();
    const appointmentRepository = AppDataSource.getRepository(Appointment);
    
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const patientName = searchParams.get("patientName");

    let whereCondition: any = {};

    // Filtro por fecha
    if (date) {
      whereCondition.date = date;
    }

    // Filtro por nombre de paciente (búsqueda parcial)
    if (patientName) {
      whereCondition.patientName = Like(`%${patientName}%`);
    }

    const appointments = await appointmentRepository.find({
      where: Object.keys(whereCondition).length > 0 ? whereCondition : undefined,
      order: { date: "DESC", time: "DESC" }
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error al obtener citas:", error);
    return NextResponse.json(
      { error: "Error al obtener citas" },
      { status: 500 }
    );
  }
}

// POST - Crear nueva cita
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar datos con Zod
    const validatedData = appointmentSchema.parse(body);

    // Validar que la cita no sea en el pasado
    const appointmentDate = new Date(`${validatedData.date}T${validatedData.time}`);
    const now = new Date();
    
    if (appointmentDate < now) {
      return NextResponse.json(
        { error: "No se pueden crear citas en el pasado" },
        { status: 400 }
      );
    }

    await initializeDatabase();
    const appointmentRepository = AppDataSource.getRepository(Appointment);
    
    // Validar solapamiento (60 minutos por cita)
    const [hours, minutes] = validatedData.time.split(":").map(Number);
    const startTime = new Date(`${validatedData.date}T${validatedData.time}`);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // +60 minutos

    // Buscar citas en la misma fecha
    const existingAppointments = await appointmentRepository.find({
      where: { 
        date: validatedData.date,
        status: AppointmentStatus.SCHEDULED // Solo considerar citas agendadas
      }
    });

    // Verificar solapamiento
    for (const existing of existingAppointments) {
      const existingStart = new Date(`${existing.date}T${existing.time}`);
      const existingEnd = new Date(existingStart.getTime() + 60 * 60 * 1000);

      // Si hay solapamiento
      if (
        (startTime >= existingStart && startTime < existingEnd) ||
        (endTime > existingStart && endTime <= existingEnd) ||
        (startTime <= existingStart && endTime >= existingEnd)
      ) {
        return NextResponse.json(
          { 
            error: "Conflicto de horario. Ya existe una cita en ese horario.",
            details: `Cita existente: ${existing.time} - ${existing.patientName}`
          },
          { status: 409 }
        );
      }
    }
    
    // Crear cita
    const appointment = new Appointment();
    appointment.patientName = validatedData.patientName;
    appointment.date = validatedData.date;
    appointment.time = validatedData.time;
    appointment.notes = validatedData.notes || "";
    appointment.status = validatedData.status as any || "agendada";
    
    await appointmentRepository.save(appointment);

    // Registrar acción en auditoría
    await createAuditLog({
      action: AuditAction.CREATE,
      entity: AuditEntity.APPOINTMENT,
      entityId: appointment.id,
      description: `Cita creada para ${appointment.patientName} el ${appointment.date} a las ${appointment.time}`,
      metadata: {
        patientName: appointment.patientName,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status
      },
      ipAddress: getIpFromRequest(request)
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error: any) {
    console.error("Error al crear cita:", error);
    
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error al crear cita" },
      { status: 500 }
    );
  }
}