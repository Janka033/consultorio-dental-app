"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface Appointment {
  id:  string;
  patientName:  string;
  date: string;
  time: string;
  notes: string;
  status:  string;
}

interface AppointmentModalProps {
  appointment:  Appointment | null;
  onClose: () => void;
  onSave: () => void;
}

export function AppointmentModal({
  appointment,
  onClose,
  onSave,
}: AppointmentModalProps) {
  const [formData, setFormData] = useState({
    patientName: "",
    date: "",
    time: "",
    notes:  "",
    status: "agendada",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cargar datos si es edición
  useEffect(() => {
    if (appointment) {
      setFormData({
        patientName: appointment.patientName,
        date: appointment.date,
        time: appointment.time,
        notes: appointment.notes || "",
        status: appointment.status,
      });
    }
  }, [appointment]);

  // Validar formulario
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.patientName.trim()) {
      newErrors.patientName = "El nombre del paciente es requerido";
    }
    if (!formData.date) {
      newErrors.date = "La fecha es requerida";
    }
    if (!formData.time) {
      newErrors.time = "La hora es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar formulario
  const handleSubmit = async (e: React. FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const url = appointment
        ? `/api/appointments/${appointment.id}`
        : "/api/appointments";
      const method = appointment ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body:  JSON.stringify(formData),
      });

      if (response. ok) {
        alert(
          appointment
            ? "Cita actualizada correctamente"
            : "Cita creada correctamente"
        );
        onSave();
      } else {
        const data = await response.json();
        alert(`Error: ${data.error || "Error al guardar cita"}`);
      }
    } catch (error) {
      console.error("Error al guardar cita:", error);
      alert("Error al guardar cita");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {appointment ?  "Editar Cita" : "Nueva Cita"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nombre del Paciente */}
          <div>
            <Label htmlFor="patientName">Nombre del Paciente *</Label>
            <Input
              id="patientName"
              type="text"
              value={formData.patientName}
              onChange={(e) =>
                setFormData({ ...formData, patientName: e.target.value })
              }
              className={errors.patientName ? "border-red-500" : ""}
              placeholder="Ej: Juan Pérez"
            />
            {errors.patientName && (
              <p className="text-red-500 text-sm mt-1">{errors.patientName}</p>
            )}
          </div>

          {/* Fecha */}
          <div>
            <Label htmlFor="date">Fecha *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className={errors.date ?  "border-red-500" :  ""}
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date}</p>
            )}
          </div>

          {/* Hora */}
          <div>
            <Label htmlFor="time">Hora *</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
              className={errors.time ? "border-red-500" : ""}
            />
            {errors.time && (
              <p className="text-red-500 text-sm mt-1">{errors.time}</p>
            )}
          </div>

          {/* Estado */}
          <div>
            <Label htmlFor="status">Estado</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ... formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agendada">Agendada</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
                <SelectItem value="finalizada">Finalizada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notas */}
          <div>
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Notas adicionales (opcional)"
              rows={3}
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting
                ? "Guardando..."
                : appointment
                ? "Actualizar"
                : "Crear"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}