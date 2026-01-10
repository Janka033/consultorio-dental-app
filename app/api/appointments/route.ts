import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase } from "@/lib/db/data-source";
import { Appointment } from "@/lib/db/entities/Appointment";
import { appointmentSchema } from "@/lib/validations/appointment";
import { AppDataSource } from "@/lib/db/data-source";

// GET - Listar todas las citas
export async function GET() {
  try {
    await initializeDatabase();
    const appointmentRepository = AppDataSource.getRepository(Appointment);
    
    const appointments = await appointmentRepository.find({
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
export async function POST(request:  NextRequest) {
  try {
    const body = await request.json();
    
    // Validar datos con Zod
    const validatedData = appointmentSchema.parse(body);

    await initializeDatabase();
    const appointmentRepository = AppDataSource.getRepository(Appointment);
    
    // Crear cita directamente con los campos
    const appointment = new Appointment();
    appointment.patientName = validatedData.patientName;
    appointment.date = validatedData.date;
    appointment.time = validatedData.time;
    appointment.notes = validatedData.notes || "";
    appointment.status = validatedData.status as any || "agendada";
    
    await appointmentRepository.save(appointment);

    return NextResponse.json(appointment, { status: 201 });
  } catch (error:  any) {
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