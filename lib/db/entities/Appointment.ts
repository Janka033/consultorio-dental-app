import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

export enum AppointmentStatus {
  SCHEDULED = "agendada",
  CANCELLED = "cancelada",
  COMPLETED = "finalizada"
}

@Entity("appointments")
export class Appointment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  patientName!: string;

  @Column({ type: "date" })
  date!: string;

  @Column({ type:  "time" })
  time!: string;

  @Column({ type: "text", nullable: true })
  notes?: string;

  @Column({
    type: "enum",
    enum: AppointmentStatus,
    default: AppointmentStatus.SCHEDULED
  })
  status!: AppointmentStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}