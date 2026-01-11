import { NextResponse } from "next/server";
import { AppDataSource } from "@/lib/db/data-source";
import { seedDatabase } from "@/lib/db/seed";

// Endpoint temporal para inicializar la base de datos
export async function GET() {
  try {
    // Inicializar la conexión
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("✅ Database connected");
    }
    
    // FORZAR sincronización de tablas (solo para setup inicial)
    await AppDataSource.synchronize(false);
    console.log("✅ Tables created");
    
    // Crear usuario admin
    await seedDatabase();
    console.log("✅ Seed completed");
    
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
      { 
        error: "Error al inicializar base de datos", 
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
