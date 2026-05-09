import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDoctor, useDoctorAvailability } from '@/hooks/doctors';
import { useBookAppointment } from '@/hooks/appointments';
import { useCurrentUser } from '@/store/auth';
import { ROUTES } from '@/constants';
import type { AppointmentType, TimeSlot } from '@/types';

export const BOOKING_STEPS = ['Select doctor', 'Choose slot', 'Patient details', 'Confirm'] as const;

export const useBookingFlow = (initialDoctorId?: string) => {
  const navigate = useNavigate();
  const user = useCurrentUser();

  const [activeStep, setActiveStep] = useState(initialDoctorId ? 1 : 0);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>(initialDoctorId);
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | undefined>();
  const [type, setType] = useState<AppointmentType>('video');
  const [reason, setReason] = useState('');
  const [patientName, setPatientName] = useState(user?.name ?? '');
  const [patientPhone, setPatientPhone] = useState(user?.phone ?? '');
  const [patientEmail, setPatientEmail] = useState(user?.email ?? '');
  const [success, setSuccess] = useState(false);

  const { data: doctor, isLoading: loadingDoctor } = useDoctor(selectedDoctorId);
  const { data: availability, isLoading: loadingAvailability } = useDoctorAvailability(selectedDoctorId);
  const { mutateAsync: book, isPending } = useBookAppointment();

  useEffect(() => {
    if (availability && !selectedDate) setSelectedDate(availability[0]?.date);
  }, [availability, selectedDate]);

  const canProceed = useMemo(() => {
    switch (activeStep) {
      case 0:
        return Boolean(selectedDoctorId);
      case 1:
        return Boolean(selectedDate && selectedSlot);
      case 2:
        return Boolean(reason.trim() && patientName && patientPhone && patientEmail);
      default:
        return true;
    }
  }, [activeStep, selectedDoctorId, selectedDate, selectedSlot, reason, patientName, patientPhone, patientEmail]);

  const handleNext = () => setActiveStep((s) => Math.min(s + 1, BOOKING_STEPS.length - 1));
  const handleBack = () => setActiveStep((s) => Math.max(s - 1, 0));

  const handleConfirm = async () => {
    if (!selectedDoctorId || !selectedDate || !selectedSlot) return;
    await book({
      doctorId: selectedDoctorId,
      date: selectedDate,
      slotId: selectedSlot.id,
      time: selectedSlot.time,
      type,
      reason,
      patientName,
      patientPhone,
      patientEmail,
    });
    setSuccess(true);
    setTimeout(() => navigate(ROUTES.appointments), 1400);
  };

  return {
    activeStep,
    canProceed,
    success,
    isPending,
    loadingDoctor,
    loadingAvailability,
    doctor,
    availability,
    selectedDoctorId,
    selectedDate,
    selectedSlot,
    type,
    reason,
    patientName,
    patientPhone,
    patientEmail,
    setSelectedDoctorId,
    setSelectedDate,
    setSelectedSlot,
    setType,
    setReason,
    setPatientName,
    setPatientPhone,
    setPatientEmail,
    handleNext,
    handleBack,
    handleConfirm,
  };
};

export type BookingFlow = ReturnType<typeof useBookingFlow>;
