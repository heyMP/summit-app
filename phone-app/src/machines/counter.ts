import type { InvokeCallback } from 'xstate';

export const counterInterval: InvokeCallback = (send, receieve)  => {
  const intervalId = setInterval(() => {
    send({ type: 'TICK' });
  }, 1000);

  return () => { clearInterval(intervalId); }
}