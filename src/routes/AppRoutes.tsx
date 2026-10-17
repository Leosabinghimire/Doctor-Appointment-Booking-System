import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/layouts';
import {
  AdminDashboard,
  Appointments,
  BookAppointment,
  CallLogs,
  Dashboard,
  DoctorDetail,
  Doctors,
  Login,
  ManageDoctors,
  MedicalHistory,
  NotFound,
  NotificationsPage,
  Prescriptions,
  Profile,
  VideoConsultation,
} from '@/pages';
import { ROUTES, ROUTE_PATTERNS } from '@/constants';
import { RequireAuth, RequireRole } from './RequireAuth';

export const AppRoutes = () => (
  <Routes>
    <Route path={ROUTES.login} element={<Login />} />
    <Route element={<RequireAuth />}>
      <Route element={<AppLayout />}>
        {/* Shared */}
        <Route path={ROUTES.doctors} element={<Doctors />} />
        <Route path={ROUTE_PATTERNS.doctorDetail} element={<DoctorDetail />} />
        <Route path={ROUTES.book} element={<BookAppointment />} />
        <Route path={ROUTE_PATTERNS.bookWithDoctor} element={<BookAppointment />} />
        <Route path={ROUTES.appointments} element={<Appointments />} />

        {/* Patients */}
        <Route element={<RequireRole roles={['patient']} />}>
          <Route index element={<Dashboard />} />
          <Route path={ROUTES.history} element={<MedicalHistory />} />
          <Route path={ROUTES.prescriptions} element={<Prescriptions />} />
          <Route path={ROUTES.video} element={<VideoConsultation />} />
          <Route path={ROUTE_PATTERNS.videoSession} element={<VideoConsultation />} />
          <Route path={ROUTES.notifications} element={<NotificationsPage />} />
          <Route path={ROUTES.profile} element={<Profile />} />
        </Route>

        {/* Admins */}
        <Route element={<RequireRole roles={['admin']} />}>
          <Route path={ROUTES.admin} element={<AdminDashboard />} />
          <Route path={ROUTES.manageDoctors} element={<ManageDoctors />} />
          <Route path={ROUTES.calls} element={<CallLogs />} />
        </Route>

        <Route path={ROUTES.notFound} element={<NotFound />} />
        <Route path="*" element={<Navigate to={ROUTES.notFound} replace />} />
      </Route>
    </Route>
  </Routes>
);
