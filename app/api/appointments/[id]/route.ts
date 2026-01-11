import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase } from "@/lib/db/data-source";
import { Appointment, AppointmentStatus } from "@/lib/db/entities/Appointment";
import { appointmentSchema } from "@/lib/validations/appointment";
import { AppDataSource } from "@/lib/db/data-source";
import { createAuditLog, getIpFromRequest } from "@/lib/audit";
import { AuditAction, AuditEntity } from "@/lib/db/entities/AuditLog";

// GET - Obtener una cita específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initializeDatabase();
    const appointmentRepository = AppDataSource.getRepository(Appointment);
    
    const appointment = await appointmentRepository.findOne({
      where: { id: params.id }
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Cita no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Error al obtener cita:", error);
    return NextResponse.json(
      { error: "Error al obtener cita" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar cita
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = appointmentSchema.parse(body);

    // Validar que la cita no sea en el pasado
    const appointmentDate = new Date(`${validatedData.date}T${validatedData.time}`);
    const now = new Date();
    
    if (appointmentDate < now) {
      return NextResponse.json(
        { error: "No se pueden programar citas en el pasado" },
        { status: 400 }
      );
    }

    await initializeDatabase();
    const appointmentRepository = AppDataSource.getRepository(Appointment);
    
    const appointment = await appointmentRepository.findOne({
      where: { id: params.id }
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Cita no encontrada" },
        { status: 404 }
      );
    }

    // Validar solapamiento (60 minutos por cita) - solo si cambiamos fecha u hora
    if (appointment.date !== validatedData.date || appointment.time !== validatedData.time) {
      const startTime = new Date(`${validatedData.date}T${validatedData.time}`);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

      const existingAppointments = await appointmentRepository.find({
        where: { 
          date: validatedData.date,
          status: AppointmentStatus.SCHEDULED
        }
      });

      for (const existing of existingAppointments) {
        // No comparar consigo mismo
        if (existing.id === params.id) continue;

        const existingStart = new Date(`${existing.date}T${existing.time}`);
        const existingEnd = new Date(existingStart.getTime() + 60 * 60 * 1000);

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
    }

    // Actualizar campos
    appointment.patientName = validatedData.patientName;
    appointment.date = validatedData.date;
    appointment.time = validatedData.time;
    appointment.notes = validatedData.notes || "";
    appointment.status = validatedData.status as any || appointment.status;
    
    await appointmentRepository.save(appointment);

    // Registrar acción en auditoría
    await createAuditLog({
      action: AuditAction.UPDATE,
      entity: AuditEntity.APPOINTMENT,
      entityId: appointment.id,
      description: `Cita actualizada para ${appointment.patientName} - Estado: ${appointment.status}`,
      metadata: {
        patientName: appointment.patientName,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status
      },
      ipAddress: getIpFromRequest(request)
    });

    return NextResponse.json(appointment);
  } catch (error: any) {
    console.error("Error al actualizar cita:", error);
    
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error al actualizar cita" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar cita
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initializeDatabase();
    const appointmentRepository = AppDataSource.getRepository(Appointment);
    
    const appointment = await appointmentRepository.findOne({
      where: { id: params.id }
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Cita no encontrada" },
        { status: 404 }
      );
    }

    // Guardar datos antes de eliminar
    const deletedData = {
      patientName: appointment.patientName,
      date: appointment.date,
      time: appointment.time,
      status: appointment.status
    };

    await appointmentRepository.remove(appointment);

    // Registrar acción en auditoría
    await createAuditLog({
      action: AuditAction.DELETE,
      entity: AuditEntity.APPOINTMENT,
      entityId: params.id,
      description: `Cita eliminada: ${deletedData.patientName} - ${deletedData.date} ${deletedData.time}`,
      metadata: deletedData,
      ipAddress: getIpFromRequest(request)
    });

    return NextResponse.json({ message: "Cita eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar cita:", error);
    return NextResponse.json(
      { error: "Error al eliminar cita" },
      { status: 500 }
    );
  }
}