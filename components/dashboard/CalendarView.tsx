"use client";

import { useState } from "react";
import { format, isSameDay, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  notes: string;
  status: string;
}

interface CalendarViewProps {
  appointments: Appointment[];
  onEdit: (appointment: Appointment) => void;
  onCreateForDate: (date: string) => void;
}

export function CalendarView({
  appointments,
  onEdit,
  onCreateForDate,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Obtener días del mes actual
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    return { daysInMonth, startDayOfWeek, year, month };
  };

  const { daysInMonth, startDayOfWeek, year, month } = getDaysInMonth(currentDate);

  // Navegar meses
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Obtener citas para un día específico
  const getAppointmentsForDay = (day: number) => {
    const dateStr = format(new Date(year, month, day), "yyyy-MM-dd");
    return appointments.filter((apt) => {
      const aptDate = apt.date.split('T')[0];
      return aptDate === dateStr;
    });
  };

  // Generar días del calendario
  const renderCalendarDays = () => {
    const days = [];
    const totalCells = 42; // 6 semanas x 7 días

    // Días vacíos antes del primer día del mes
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="min-h-[120px] bg-gray-50 border border-gray-200" />
      );
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const dayAppointments = getAppointmentsForDay(day);
      const currentDateObj = new Date(year, month, day);
      const isToday = isSameDay(currentDateObj, new Date());
      const dateStr = format(currentDateObj, "yyyy-MM-dd");

      days.push(
        <div
          key={day}
          className={`min-h-[120px] border border-gray-200 p-2 ${
            isToday ? "bg-blue-50 border-blue-400" : "bg-white hover:bg-gray-50"
          } transition-colors cursor-pointer`}
          onClick={() => onCreateForDate(dateStr)}
        >
          <div className="flex justify-between items-start mb-2">
            <span
              className={`text-sm font-semibold ${
                isToday
                  ? "bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  : "text-gray-700"
              }`}
            >
              {day}
            </span>
            {dayAppointments.length > 0 && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                {dayAppointments.length}
              </span>
            )}
          </div>

          <div className="space-y-1 overflow-y-auto max-h-[80px]">
            {dayAppointments.slice(0, 3).map((apt) => (
              <div
                key={apt.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(apt);
                }}
                className={`text-xs p-1.5 rounded cursor-pointer transition-colors ${
                  apt.status === "agendada"
                    ? "bg-blue-100 hover:bg-blue-200 text-blue-900"
                    : apt.status === "cancelada"
                    ? "bg-red-100 hover:bg-red-200 text-red-900"
                    : "bg-green-100 hover:bg-green-200 text-green-900"
                }`}
              >
                <div className="flex items-center gap-1 mb-0.5">
                  <Clock className="h-3 w-3" />
                  <span className="font-semibold">{apt.time}</span>
                </div>
                <div className="flex items-center gap-1 truncate">
                  <User className="h-3 w-3" />
                  <span className="truncate">{apt.patientName}</span>
                </div>
              </div>
            ))}
            {dayAppointments.length > 3 && (
              <div className="text-xs text-gray-500 text-center">
                +{dayAppointments.length - 3} más
              </div>
            )}
          </div>
        </div>
      );
    }

    // Días vacíos después del último día del mes
    const remainingCells = totalCells - (startDayOfWeek + daysInMonth);
    for (let i = 0; i < remainingCells; i++) {
      days.push(
        <div key={`empty-end-${i}`} className="min-h-[120px] bg-gray-50 border border-gray-200" />
      );
    }

    return days;
  };

  const monthName = format(currentDate, "MMMM yyyy", { locale: es });

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header del calendario */}
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900 capitalize flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-blue-600" />
          {monthName}
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
            ← Anterior
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Hoy
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextMonth}>
            Siguiente →
          </Button>
        </div>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 border-b bg-gray-50">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
          <div
            key={day}
            className="p-3 text-center text-sm font-semibold text-gray-700 border-r last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Cuadrícula de días */}
      <div className="grid grid-cols-7">{renderCalendarDays()}</div>

      {/* Leyenda */}
      <div className="p-4 border-t bg-gray-50 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 rounded"></div>
          <span>Agendada</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 rounded"></div>
          <span>Finalizada</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 rounded"></div>
          <span>Cancelada</span>
        </div>
      </div>
    </div>
  );
}
