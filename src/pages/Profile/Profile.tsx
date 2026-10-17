import { Avatar, Box, Chip, Divider, Stack, Typography } from '@mui/material';
import {
  Bloodtype,
  Cake,
  ContactEmergency,
  Email,
  Height,
  Phone,
  Scale,
  Wc,
} from '@mui/icons-material';
import type { ReactNode } from 'react';
import { HelpCard, Loader, PageHeader, SectionCard } from '@/components/ui';
import { usePatient } from '@/hooks/patients';
import { initials, withUnit } from '@/utils/format';

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

interface DetailRowProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}

const DetailRow = ({ icon, label, value }: DetailRowProps) => (
  <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 0.5 }}>
    <Box sx={{ color: 'text.secondary', display: 'flex', flexShrink: 0 }}>{icon}</Box>
    <Box flex={1} minWidth={0}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography fontWeight={600} noWrap>
        {value}
      </Typography>
    </Box>
  </Stack>
);

export const Profile = () => {
  const { data: patient, isLoading } = usePatient();

  if (isLoading || !patient) return <Loader label="Loading your profile..." />;

  return (
    <Box>
      <PageHeader title="Profile" subtitle="Your account and contact details." />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
        <SectionCard title="Account">
          <Stack direction="row" spacing={2.5} alignItems="center" sx={{ mb: 2 }}>
            <Avatar src={patient.avatar} sx={{ width: 72, height: 72 }}>
              {initials(patient.name)}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                {patient.name}
              </Typography>
              <Chip
                label="Patient"
                size="small"
                variant="outlined"
                color="primary"
                sx={{ mt: 0.5 }}
              />
            </Box>
          </Stack>
          <Stack divider={<Divider />} spacing={1}>
            <DetailRow icon={<Email fontSize="small" />} label="Email" value={patient.email} />
            <DetailRow icon={<Phone fontSize="small" />} label="Phone" value={patient.phone} />
          </Stack>
        </SectionCard>

        <SectionCard title="Personal details">
          <Stack divider={<Divider />} spacing={1}>
            <DetailRow icon={<Cake fontSize="small" />} label="Age" value={withUnit(patient.age, 'years')} />
            <DetailRow
              icon={<Wc fontSize="small" />}
              label="Gender"
              value={patient.gender ? capitalize(patient.gender) : 'Not set'}
            />
            <DetailRow
              icon={<Bloodtype fontSize="small" />}
              label="Blood group"
              value={withUnit(patient.bloodGroup)}
            />
            <DetailRow
              icon={<Height fontSize="small" />}
              label="Height"
              value={withUnit(patient.height, 'cm')}
            />
            <DetailRow
              icon={<Scale fontSize="small" />}
              label="Weight"
              value={withUnit(patient.weight, 'kg')}
            />
          </Stack>
        </SectionCard>

        <SectionCard title="Emergency contact">
          <Stack spacing={0.5}>
            <Typography fontWeight={700}>{patient.emergencyContact.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {patient.emergencyContact.relation}
            </Typography>
            <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mt: 1 }}>
              <ContactEmergency fontSize="small" sx={{ color: 'text.secondary' }} />
              <Typography fontWeight={600}>{patient.emergencyContact.phone}</Typography>
            </Stack>
          </Stack>
        </SectionCard>

        <HelpCard />
      </Box>
    </Box>
  );
};
