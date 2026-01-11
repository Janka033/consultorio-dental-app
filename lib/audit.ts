import { AppDataSource } from "./db/data-source";
import { AuditLog, AuditAction, AuditEntity } from "./db/entities/AuditLog";

interface CreateAuditLogParams {
  action: AuditAction;
  entity: AuditEntity;
  entityId?: string;
  description: string;
  userEmail?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
}

/**
 * Registra una acción en el sistema de auditoría
 */
export async function createAuditLog(params: CreateAuditLogParams): Promise<void> {
  try {
    const auditLogRepository = AppDataSource.getRepository(AuditLog);
    
    const log = auditLogRepository.create({
      action: params.action,
      entity: params.entity,
      entityId: params.entityId,
      description: params.description,
      userEmail: params.userEmail,
      metadata: params.metadata,
      ipAddress: params.ipAddress,
    });

    await auditLogRepository.save(log);
  } catch (error) {
    // No fallar la operación principal si falla el log
    console.error("Error al crear log de auditoría:", error);
  }
}

/**
 * Obtiene logs de auditoría con filtros opcionales
 */
export async function getAuditLogs(filters?: {
  action?: AuditAction;
  entity?: AuditEntity;
  userEmail?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}) {
  try {
    const auditLogRepository = AppDataSource.getRepository(AuditLog);
    
    let query = auditLogRepository.createQueryBuilder("log");

    if (filters?.action) {
      query = query.andWhere("log.action = :action", { action: filters.action });
    }

    if (filters?.entity) {
      query = query.andWhere("log.entity = :entity", { entity: filters.entity });
    }

    if (filters?.userEmail) {
      query = query.andWhere("log.userEmail = :userEmail", { userEmail: filters.userEmail });
    }

    if (filters?.startDate) {
      query = query.andWhere("log.createdAt >= :startDate", { startDate: filters.startDate });
    }

    if (filters?.endDate) {
      query = query.andWhere("log.createdAt <= :endDate", { endDate: filters.endDate });
    }

    query = query.orderBy("log.createdAt", "DESC");

    if (filters?.limit) {
      query = query.take(filters.limit);
    }

    return await query.getMany();
  } catch (error) {
    console.error("Error al obtener logs de auditoría:", error);
    return [];
  }
}

/**
 * Extrae IP del request de Next.js
 */
export function getIpFromRequest(request: Request): string | undefined {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  
  return realIp || undefined;
}
