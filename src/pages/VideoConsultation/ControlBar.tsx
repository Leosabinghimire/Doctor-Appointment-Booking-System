import { Box, IconButton, Stack, Tooltip } from '@mui/material';
import {
  CallEnd,
  Chat,
  Mic,
  MicOff,
  ScreenShare,
  Videocam,
  VideocamOff,
} from '@mui/icons-material';
import { ReactNode } from 'react';

interface ControlButtonProps {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}

const ControlButton = ({ active, onClick, icon, label }: ControlButtonProps) => (
  <Tooltip title={label}>
    <IconButton
      onClick={onClick}
      aria-label={label}
      sx={{
        width: 50,
        height: 50,
        bgcolor: active ? 'rgba(255,255,255,0.15)' : 'rgba(239,68,68,0.85)',
        color: '#fff',
        '&:hover': {
          bgcolor: active ? 'rgba(255,255,255,0.25)' : 'rgba(239,68,68,1)',
        },
      }}
    >
      {icon}
    </IconButton>
  </Tooltip>
);

interface ControlBarProps {
  micOn: boolean;
  camOn: boolean;
  screen: boolean;
  chatOpen: boolean;
  onToggleMic: () => void;
  onToggleCam: () => void;
  onToggleScreen: () => void;
  onToggleChat: () => void;
  onEndCall: () => void;
}

export const ControlBar = ({
  micOn,
  camOn,
  screen,
  chatOpen,
  onToggleMic,
  onToggleCam,
  onToggleScreen,
  onToggleChat,
  onEndCall,
}: ControlBarProps) => (
  <Stack
    direction="row"
    spacing={1.5}
    justifyContent="center"
    alignItems="center"
    sx={{ position: 'absolute', bottom: 16, left: 0, right: 0, zIndex: 2 }}
  >
    <ControlButton active={micOn} onClick={onToggleMic} icon={micOn ? <Mic /> : <MicOff />} label={micOn ? 'Mute' : 'Unmute'} />
    <ControlButton
      active={camOn}
      onClick={onToggleCam}
      icon={camOn ? <Videocam /> : <VideocamOff />}
      label={camOn ? 'Stop video' : 'Start video'}
    />
    <ControlButton active={screen} onClick={onToggleScreen} icon={<ScreenShare />} label="Share screen" />
    <ControlButton active={chatOpen} onClick={onToggleChat} icon={<Chat />} label="Chat" />
    <Box
      onClick={onEndCall}
      role="button"
      aria-label="End call"
      sx={{
        width: 56,
        height: 56,
        borderRadius: '50%',
        bgcolor: 'error.main',
        color: '#fff',
        display: 'grid',
        placeItems: 'center',
        cursor: 'pointer',
        ml: 1,
        transition: 'transform .2s',
        '&:hover': { transform: 'scale(1.05)' },
      }}
    >
      <CallEnd />
    </Box>
  </Stack>
);
