export function openQueueStream(roomId: string, onMessage: (payload: any) => void) {
  const es = new EventSource(`/api/organizations/${roomId}/queue/stream`);
  es.onmessage = (ev) => {
    try {
      const data = JSON.parse(ev.data);
      onMessage(data);
    } catch (err) {
      console.error('queue stream parse', err);
    }
  };
  return () => es.close();
} 