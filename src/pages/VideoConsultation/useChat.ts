import { useState, useCallback } from 'react';

export interface ChatMessage {
  id: string;
  from: 'doctor' | 'me';
  text: string;
  time: string;
}

const seedMessages: ChatMessage[] = [
  { id: 'm1', from: 'doctor', text: "Hi! I'm joining now, how are you feeling today?", time: '2 min ago' },
  { id: 'm2', from: 'me', text: 'A bit better, the headaches are less frequent.', time: '1 min ago' },
];

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(seedMessages);
  const [draft, setDraft] = useState('');

  const send = useCallback(() => {
    setDraft((current) => {
      const trimmed = current.trim();
      if (!trimmed) return current;
      setMessages((prev) => [
        ...prev,
        { id: `m${Date.now()}`, from: 'me', text: trimmed, time: 'just now' },
      ]);
      return '';
    });
  }, []);

  return { messages, draft, setDraft, send };
};
