import { NextResponse } from "next/server";
import { initializeDatabase } from "@/lib/db/data-source";
import { seedDatabase } from "@/lib/db/seed";

// Endpoint temporal para inicializar la base de datos
export async function GET() {
  try {
    await initializeDatabase();
    await seedDatabase();
    
    return NextResponse.json({ 
      message: "Base de datos inicializada correctamente",
      credentials: {
        email: "admin@consultorio.com",
        password: "admin123"
      }
    });
  } catch (error) {
    console.error("Error al inicializar:", error);
    return NextResponse.json(
      { error: "Error al inicializar base de datos", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
