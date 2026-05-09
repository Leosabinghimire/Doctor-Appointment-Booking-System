import { Avatar, Box, Card, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { FiberManualRecord, MoreHoriz, PeopleAlt, VideocamOff } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface VideoStageProps {
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatar?: string;
  durationLabel: string;
  camOn: boolean;
  controls: ReactNode;
}

export const VideoStage = ({
  doctorName,
  doctorSpecialty,
  doctorAvatar,
  durationLabel,
  camOn,
  controls,
}: VideoStageProps) => (
  <Card
    sx={{
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 3,
      minHeight: { xs: 360, md: 520 },
      bgcolor: '#0F172A',
      backgroundImage:
        'radial-gradient(circle at 20% 20%, rgba(56,189,248,0.15) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(139,92,246,0.18) 0%, transparent 50%)',
    }}
  >
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ position: 'absolute', top: 16, left: 16, right: 16, zIndex: 2 }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Chip
          icon={<FiberManualRecord sx={{ fontSize: 12, color: '#EF4444' }} />}
          label="LIVE"
          size="small"
          sx={{ bgcolor: 'rgba(239,68,68,0.2)', color: '#FCA5A5', fontWeight: 700 }}
        />
        <Chip
          label={durationLabel}
          size="small"
          sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 600 }}
        />
      </Stack>
      <Stack direction="row" spacing={1}>
        <Tooltip title="Participants">
          <IconButton sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' }}>
            <PeopleAlt fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="More">
          <IconButton sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' }}>
            <MoreHoriz fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>

    <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
      <Stack alignItems="center" spacing={2}>
        <Avatar
          src={doctorAvatar}
          sx={{
            width: 140,
            height: 140,
            border: '4px solid rgba(255,255,255,0.2)',
            boxShadow: '0 0 80px rgba(56,189,248,0.4)',
          }}
        />
        <Typography variant="h5" fontWeight={800} color="#fff">
          {doctorName}
        </Typography>
        <Typography color="rgba(255,255,255,0.7)">{doctorSpecialty} • Connected</Typography>
      </Stack>
    </Box>

    <Box
      component={motion.div}
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 4, repeat: Infinity }}
      sx={{
        position: 'absolute',
        bottom: 100,
        right: 16,
        width: 140,
        height: 100,
        borderRadius: 2,
        bgcolor: '#1E293B',
        border: '2px solid rgba(255,255,255,0.2)',
        display: 'grid',
        placeItems: 'center',
        color: '#fff',
        overflow: 'hidden',
      }}
    >
      {camOn ? (
        <Stack alignItems="center" spacing={0.5}>
          <Avatar sx={{ width: 40, height: 40 }}>You</Avatar>
          <Typography variant="caption">You</Typography>
        </Stack>
      ) : (
        <VideocamOff sx={{ color: 'rgba(255,255,255,0.5)' }} />
      )}
    </Box>

    {controls}
  </Card>
);
