import { useState } from 'react';
import { Box } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui';
import { useAppointment } from '@/hooks/appointments';
import { ROUTES } from '@/constants';
import { useCallTimer } from './useCallTimer';
import { useChat } from './useChat';
import { VideoStage } from './VideoStage';
import { ControlBar } from './ControlBar';
import { ChatPanel } from './ChatPanel';
import { NotesCard } from './NotesCard';

const FALLBACK_DOCTOR = {
  name: 'Dr. Sarah Johnson',
  specialty: 'Cardiology',
  avatar: undefined,
};

export const VideoConsultation = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { data: appointment } = useAppointment(appointmentId);
  const { formatted: durationLabel } = useCallTimer();
  const chat = useChat();

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screen, setScreen] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);

  const doctorName = appointment?.doctorName ?? FALLBACK_DOCTOR.name;
  const doctorSpecialty = appointment?.doctorSpecialty ?? FALLBACK_DOCTOR.specialty;
  const doctorAvatar = appointment?.doctorAvatar ?? FALLBACK_DOCTOR.avatar;

  return (
    <Box>
      <PageHeader
        title="Video consultation"
        subtitle={appointment ? `${doctorName} • ${doctorSpecialty}` : 'Live consult room'}
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: chatOpen ? '1fr 340px' : '1fr' },
          gap: 2.5,
        }}
      >
        <Box>
          <VideoStage
            doctorName={doctorName}
            doctorSpecialty={doctorSpecialty}
            doctorAvatar={doctorAvatar}
            durationLabel={durationLabel}
            camOn={camOn}
            controls={
              <ControlBar
                micOn={micOn}
                camOn={camOn}
                screen={screen}
                chatOpen={chatOpen}
                onToggleMic={() => setMicOn((v) => !v)}
                onToggleCam={() => setCamOn((v) => !v)}
                onToggleScreen={() => setScreen((v) => !v)}
                onToggleChat={() => setChatOpen((v) => !v)}
                onEndCall={() => navigate(ROUTES.appointments)}
              />
            }
          />
          <NotesCard />
        </Box>

        <AnimatePresence>
          {chatOpen && (
            <ChatPanel
              messages={chat.messages}
              draft={chat.draft}
              doctorAvatar={doctorAvatar}
              onChangeDraft={chat.setDraft}
              onSend={chat.send}
              onClose={() => setChatOpen(false)}
            />
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
};
