import { AppDataSource } from "./data-source";
import { User } from "./entities/User";
import bcrypt from "bcryptjs";

export async function seedDatabase() {
  try {
    const userRepository = AppDataSource.getRepository(User);
    
    // Verificar si ya existe el admin
    const existingAdmin = await userRepository.findOne({
      where: { email: process.env.ADMIN_EMAIL || "admin@consultoriodental.com" }
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt. hash(
        process.env.ADMIN_PASSWORD || "Admin123!",
        10
      );

      const admin = userRepository.create({
        email: process.env.ADMIN_EMAIL || "admin@consultoriodental.com",
        password: hashedPassword,
        name: "Dr. Administrador",
        role: "admin"
      });

      await userRepository.save(admin);
      console.log("Usuario admin creado correctamente");
      console.log("Email:", process.env.ADMIN_EMAIL || "admin@consultoriodental.com");
    } else {
      console.log("ℹUsuario admin ya existe");
    }
  } catch (error) {
    console.error("Error al crear seed:", error);
  }
}