import type { AuthUser } from '../../../src/types';
import { patientsRepo } from '../repos/patients';
import type { UserRecord } from '../repos/users';

/** The public shape sent to the browser — never includes the password hash. */
export const toAuthUser = (user: UserRecord): AuthUser => {
  const patient = user.patientId ? patientsRepo.get(user.patientId) : undefined;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    patientId: user.patientId,
    avatar: patient?.avatar || undefined,
    phone: patient?.phone,
  };
};
