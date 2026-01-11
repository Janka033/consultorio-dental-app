import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

export enum AuditAction {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LOGIN = "login",
  LOGOUT = "logout",
  EXPORT = "export"
}

export enum AuditEntity {
  APPOINTMENT = "appointment",
  USER = "user",
  SYSTEM = "system"
}

@Entity("audit_logs")
export class AuditLog {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    type: "enum",
    enum: AuditAction
  })
  action!: AuditAction;

  @Column({
    type: "enum",
    enum: AuditEntity
  })
  entity!: AuditEntity;

  @Column({ nullable: true })
  entityId?: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ nullable: true })
  userEmail?: string;

  @Column({ type: "jsonb", nullable: true })
  metadata?: Record<string, any>;

  @Column({ type: "inet", nullable: true })
  ipAddress?: string;

  @CreateDateColumn()
  createdAt!: Date;
}
