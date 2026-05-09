import {
  Alert,
  Box,
  Button,
  Card,
  Snackbar,
  Stack,
  Step,
  StepLabel,
  Stepper,
} from '@mui/material';
import { CheckCircle, NavigateBefore, NavigateNext } from '@mui/icons-material';
import { AnimatePresence, motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui';
import { slideInRight } from '@/lib/animations';
import { BOOKING_STEPS, useBookingFlow } from './useBookingFlow';
import { BookingSummary } from './BookingSummary';
import { DoctorSelectStep } from './steps/DoctorSelectStep';
import { SlotSelectStep } from './steps/SlotSelectStep';
import { PatientDetailsStep } from './steps/PatientDetailsStep';
import { ConfirmStep } from './steps/ConfirmStep';

export const BookAppointment = () => {
  const { doctorId } = useParams();
  const flow = useBookingFlow(doctorId);

  return (
    <Box>
      <PageHeader title="Book an appointment" subtitle="A few quick steps to schedule your visit." />

      <Stepper activeStep={flow.activeStep} alternativeLabel sx={{ mb: 4 }}>
        {BOOKING_STEPS.map((s) => (
          <Step key={s}>
            <StepLabel>{s}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 2.5 }}>
        <Card sx={{ p: { xs: 2.5, md: 3.5 }, minHeight: 420 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={flow.activeStep}
              variants={slideInRight}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {flow.activeStep === 0 && (
                <DoctorSelectStep
                  selectedDoctorId={flow.selectedDoctorId}
                  doctor={flow.doctor}
                  onChange={flow.setSelectedDoctorId}
                />
              )}
              {flow.activeStep === 1 && (
                <SlotSelectStep
                  loading={flow.loadingDoctor || flow.loadingAvailability}
                  availability={flow.availability}
                  selectedDate={flow.selectedDate}
                  selectedSlot={flow.selectedSlot}
                  type={flow.type}
                  onTypeChange={flow.setType}
                  onSelectDate={(d) => {
                    flow.setSelectedDate(d);
                    flow.setSelectedSlot(undefined);
                  }}
                  onSelectSlot={flow.setSelectedSlot}
                />
              )}
              {flow.activeStep === 2 && (
                <PatientDetailsStep
                  patientName={flow.patientName}
                  patientPhone={flow.patientPhone}
                  patientEmail={flow.patientEmail}
                  reason={flow.reason}
                  onChangeName={flow.setPatientName}
                  onChangePhone={flow.setPatientPhone}
                  onChangeEmail={flow.setPatientEmail}
                  onChangeReason={flow.setReason}
                />
              )}
              {flow.activeStep === 3 && flow.doctor && flow.selectedDate && flow.selectedSlot && (
                <ConfirmStep
                  doctor={flow.doctor}
                  selectedDate={flow.selectedDate}
                  selectedSlot={flow.selectedSlot}
                  type={flow.type}
                  reason={flow.reason}
                />
              )}
            </motion.div>
          </AnimatePresence>

          <Stack direction="row" justifyContent="space-between" sx={{ mt: 4 }}>
            <Button
              startIcon={<NavigateBefore />}
              onClick={flow.handleBack}
              disabled={flow.activeStep === 0}
              color="inherit"
            >
              Back
            </Button>
            {flow.activeStep < BOOKING_STEPS.length - 1 ? (
              <Button
                variant="contained"
                endIcon={<NavigateNext />}
                onClick={flow.handleNext}
                disabled={!flow.canProceed}
              >
                Continue
              </Button>
            ) : (
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircle />}
                onClick={flow.handleConfirm}
                disabled={flow.isPending}
              >
                {flow.isPending ? 'Booking...' : 'Confirm Booking'}
              </Button>
            )}
          </Stack>
        </Card>

        <BookingSummary
          doctor={flow.doctor}
          date={flow.selectedDate}
          slot={flow.selectedSlot}
          type={flow.type}
        />
      </Box>

      <Snackbar
        open={flow.success}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled">
          Appointment booked successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};
