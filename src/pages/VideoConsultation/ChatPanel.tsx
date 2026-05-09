import {
  Avatar,
  Box,
  Card,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  alpha,
} from '@mui/material';
import { Close, Send } from '@mui/icons-material';
import { motion } from 'framer-motion';
import type { ChatMessage } from './useChat';

interface ChatPanelProps {
  messages: ChatMessage[];
  draft: string;
  doctorAvatar?: string;
  onChangeDraft: (value: string) => void;
  onSend: () => void;
  onClose: () => void;
}

export const ChatPanel = ({
  messages,
  draft,
  doctorAvatar,
  onChangeDraft,
  onSend,
  onClose,
}: ChatPanelProps) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    transition={{ duration: 0.25 }}
  >
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ p: 2, borderBottom: (t) => `1px solid ${t.palette.divider}` }}
      >
        <Typography fontWeight={700}>In-call chat</Typography>
        <IconButton size="small" onClick={onClose} aria-label="Close chat">
          <Close fontSize="small" />
        </IconButton>
      </Stack>
      <Box sx={{ flex: 1, p: 2, overflowY: 'auto', minHeight: 380 }}>
        <Stack spacing={1.5}>
          {messages.map((m) => (
            <Stack
              key={m.id}
              direction={m.from === 'me' ? 'row-reverse' : 'row'}
              spacing={1}
              alignItems="flex-end"
            >
              <Avatar
                src={m.from === 'doctor' ? doctorAvatar : undefined}
                sx={{ width: 28, height: 28 }}
              >
                {m.from === 'me' ? 'M' : 'D'}
              </Avatar>
              <Box
                sx={{
                  px: 1.5,
                  py: 1,
                  maxWidth: 240,
                  borderRadius: 2,
                  bgcolor: (t) =>
                    m.from === 'me' ? t.palette.primary.main : alpha(t.palette.text.secondary, 0.08),
                  color: m.from === 'me' ? '#fff' : 'text.primary',
                  fontSize: 14,
                }}
              >
                <Typography fontSize={14}>{m.text}</Typography>
                <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 0.3 }}>
                  {m.time}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
      </Box>
      <Divider />
      <Box sx={{ p: 1.5 }}>
        <TextField
          fullWidth
          placeholder="Type a message..."
          value={draft}
          onChange={(e) => onChangeDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSend()}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton color="primary" onClick={onSend} aria-label="Send message">
                  <Send />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Card>
  </motion.div>
);
