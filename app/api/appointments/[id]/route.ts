import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase } from "@/lib/db/data-source";
import { Appointment } from "@/lib/db/entities/Appointment";
import { appointmentSchema } from "@/lib/validations/appointment";
import { AppDataSource } from "@/lib/db/data-source";

// PUT - Actualizar cita
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = appointmentSchema. parse(body);

    await initializeDatabase();
    const appointmentRepository = AppDataSource.getRepository(Appointment);
    
    const appointment = await appointmentRepository.findOne({
      where: { id: params.id }
    });

    if (!appointment) {
      return NextResponse. json(
        { error: "Cita no encontrada" },
        { status: 404 }
      );
    }

    // Actualizar campos
    appointment.patientName = validatedData.patientName;
    appointment.date = validatedData. date;
    appointment.time = validatedData.time;
    appointment.notes = validatedData. notes || "";
    appointment.status = validatedData.status as any || appointment.status;
    
    await appointmentRepository. save(appointment);

    return NextResponse.json(appointment);
  } catch (error: any) {
    console.error("Error al actualizar cita:", error);
    
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse. json(
      { error: "Error al actualizar cita" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar cita
export async function DELETE(
  request: NextRequest,
  { params }: { params:  { id: string } }
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

    await appointmentRepository.remove(appointment);

    return NextResponse.json({ message: "Cita eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar cita:", error);
    return NextResponse.json(
      { error: "Error al eliminar cita" },
      { status:  500 }
    );
  }
}