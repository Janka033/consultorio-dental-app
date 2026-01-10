import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Appointment } from "./entities/Appointment";

export const AppDataSource = new DataSource({
  type:  "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true, // Solo en desarrollo - crea las tablas automáticamente
  logging: false,
  entities: [User, Appointment],
  migrations: [],
  subscribers: [],
});

// Función para inicializar la conexión
export const initializeDatabase = async () => {
  if (! AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    console.log("✅ Database connected successfully");
  }
  return AppDataSource;
};