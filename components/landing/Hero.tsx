"use client";

import { Button } from "@/components/ui/button";
import { Calendar, Clock, Shield } from "lucide-react";

export function Hero() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Calendar className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Consultorio Dental
          </h1>
        </div>
        <Button 
          onClick={() => alert("Login próximamente")}
          variant="outline"
        >
          Iniciar Sesión
        </Button>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Sistema de Gestión de Citas Dentales
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Administra tus citas de manera eficiente y profesional.
            Sistema moderno, seguro y fácil de usar.
          </p>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Gestión de Citas</h3>
              <p className="text-gray-600">
                Crea, edita y organiza citas de forma intuitiva
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">En Tiempo Real</h3>
              <p className="text-gray-600">
                Actualización instantánea de información
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">100% Seguro</h3>
              <p className="text-gray-600">
                Datos protegidos con autenticación robusta
              </p>
            </div>
          </div>

          <Button 
            onClick={() => alert("Login próximamente")}
            size="lg"
            className="text-lg px-8 py-6"
          >
            Acceder al Sistema
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600 border-t">
        <p>© 2026 Consultorio Dental App - Desarrollado con Next.js y TypeORM</p>
      </footer>
    </div>
  );
}