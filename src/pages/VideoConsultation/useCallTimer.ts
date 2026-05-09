import { useEffect, useState } from 'react';

const pad = (n: number) => n.toString().padStart(2, '0');

export const useCallTimer = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const formatted = `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`;

  return { seconds, formatted };
};
