import { AppDataSource } from "./data-source";
import { User } from "./entities/User";
import bcrypt from "bcryptjs";

export async function seedDatabase() {
  try {
    const userRepository = AppDataSource.getRepository(User);
    
    // Verificar si ya existe el admin
    const existingAdmin = await userRepository.findOne({
      where: { email: process.env.ADMIN_EMAIL || "admin@consultorio.com" }
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD || "admin123",
        10
      );

      const admin = userRepository.create({
        email: process.env.ADMIN_EMAIL || "admin@consultorio.com",
        password: hashedPassword,
        name: "Dr. Administrador",
        role: "admin"
      });

      await userRepository.save(admin);
      console.log("✅ Usuario admin creado correctamente");
      console.log("📧 Email:", process.env.ADMIN_EMAIL || "admin@consultorio.com");
    } else {
      console.log("ℹ️ Usuario admin ya existe");
    }
  } catch (error) {
    console.error("Error al crear seed:", error);
  }
}