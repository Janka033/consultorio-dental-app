import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase } from "@/lib/db/data-source";
import { getAuditLogs } from "@/lib/audit";
import { AuditAction, AuditEntity } from "@/lib/db/entities/AuditLog";

// GET - Obtener logs de auditoría
export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") as AuditAction | undefined;
    const entity = searchParams.get("entity") as AuditEntity | undefined;
    const limit = searchParams.get("limit");

    const logs = await getAuditLogs({
      action,
      entity,
      limit: limit ? parseInt(limit) : 100
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error al obtener logs de auditoría:", error);
    return NextResponse.json(
      { error: "Error al obtener logs de auditoría" },
      { status: 500 }
    );
  }
}
