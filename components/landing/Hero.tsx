"use client";

import { Button } from "@/components/ui/button";
import { Calendar, Clock, Shield, Stethoscope, Phone, Mail, MapPin, User } from "lucide-react";
import { useRouter } from "next/navigation";

export function Hero() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Calendar className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Consultorio Dental Dr. García
          </h1>
        </div>
        <Button 
          onClick={() => router.push("/login")}
          variant="outline"
        >
          Iniciar Sesión
        </Button>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Tu Sonrisa, Nuestra Prioridad
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Consultorio odontológico profesional con más de 15 años de experiencia.
            Cuidamos tu salud dental con tecnología moderna y atención personalizada.
          </p>

          <Button 
            onClick={() => router.push("/login")}
            size="lg"
            className="text-lg px-8 py-6"
          >
            Sistema de Gestión
          </Button>
        </div>
      </section>

      {/* Servicios */}
      <section className="container mx-auto px-4 py-16 bg-white">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Nuestros Servicios
        </h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-blue-50 p-6 rounded-lg shadow-md text-center">
            <Stethoscope className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-2">Odontología General</h4>
            <p className="text-gray-600">
              Revisiones, limpiezas, empastes y tratamientos preventivos para toda la familia
            </p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg shadow-md text-center">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-2">Endodoncia</h4>
            <p className="text-gray-600">
              Tratamientos de conducto con tecnología moderna y sin dolor
            </p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg shadow-md text-center">
            <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-2">Ortodoncia</h4>
            <p className="text-gray-600">
              Brackets y alineadores invisibles para una sonrisa perfecta
            </p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg shadow-md text-center">
            <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-2">Estética Dental</h4>
            <p className="text-gray-600">
              Blanqueamiento, carillas y diseño de sonrisa personalizado
            </p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg shadow-md text-center">
            <Stethoscope className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-2">Implantología</h4>
            <p className="text-gray-600">
              Implantes dentales con garantía y seguimiento completo
            </p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg shadow-md text-center">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-2">Odontopediatría</h4>
            <p className="text-gray-600">
              Cuidado dental especializado para niños en ambiente amigable
            </p>
          </div>
        </div>
      </section>

      {/* Horarios */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Horarios de Atención
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-blue-600" />
              <div>
                <p className="font-semibold">Lunes a Viernes</p>
                <p className="text-gray-600">9:00 AM - 7:00 PM</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-blue-600" />
              <div>
                <p className="font-semibold">Sábados</p>
                <p className="text-gray-600">9:00 AM - 2:00 PM</p>
              </div>
            </div>
          </div>
          <p className="text-center text-gray-500 mt-6 text-sm">
            * Domingos y festivos cerrado
          </p>
        </div>
      </section>

      {/* Información del Odontólogo */}
      <section className="container mx-auto px-4 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Nuestro Especialista
          </h3>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-48 h-48 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-24 w-24 text-blue-600" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-2xl font-bold text-gray-900 mb-2">
                Dr. Carlos García Mendoza
              </h4>
              <p className="text-blue-600 font-semibold mb-4">
                Odontólogo - Especialista en Endodoncia
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Licenciado en Odontología - Universidad Nacional</li>
                <li>✓ Especialista en Endodoncia - Universidad de Barcelona</li>
                <li>✓ Certificado en Implantología Oral Avanzada</li>
                <li>✓ Miembro de la Sociedad Colombiana de Odontología</li>
                <li>✓ Más de 15 años de experiencia profesional</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-xl p-8 text-white">
          <h3 className="text-3xl font-bold text-center mb-8">
            Contáctanos
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <Phone className="h-10 w-10 mb-3" />
              <p className="font-semibold mb-1">Teléfono</p>
              <a href="tel:+573001234567" className="hover:underline">
                +57 300 123 4567
              </a>
            </div>
            <div className="flex flex-col items-center text-center">
              <Mail className="h-10 w-10 mb-3" />
              <p className="font-semibold mb-1">Email</p>
              <a href="mailto:contacto@consultoriodental.com" className="hover:underline">
                contacto@consultoriodental.com
              </a>
            </div>
            <div className="flex flex-col items-center text-center">
              <MapPin className="h-10 w-10 mb-3" />
              <p className="font-semibold mb-1">Dirección</p>
              <p className="text-sm">
                Calle 123 #45-67<br />Bogotá, Colombia
              </p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Button 
              onClick={() => window.open('https://wa.me/573001234567', '_blank')}
              className="bg-white text-blue-600 hover:bg-gray-100"
              size="lg"
            >
              Escríbenos por WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600 border-t">
        <p>© 2026 Consultorio Dental Dr. García - Todos los derechos reservados</p>
        <p className="text-sm mt-2">Desarrollado con Next.js, TypeScript y TypeORM</p>
      </footer>
    </div>
  );
}