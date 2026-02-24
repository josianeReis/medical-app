"use client";
import { PropsWithChildren, useEffect } from 'react';
import { toast } from 'sonner';

/**
 * NotificationProvider – subscribes to server-sent events (placeholder).
 * In the future this can be replaced with Pusher / WebSocket implementation.
 */
export default function NotificationProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    // Placeholder SSE subscription – adjust endpoint when backend is ready.
    const url = '/api/notifications/stream';

    let es: EventSource | undefined;
    try {
      es = new EventSource(url);
      es.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          // Expected: { title?: string; message: string; type?: 'success' | 'error' | 'info' }
          const { message, title, type } = payload;
          const toaster = type && toast[type as 'success' | 'error' | 'info'];
          if (toaster) {
            toaster(message ?? title ?? 'Notification');
          } else {
            toast(message ?? title ?? 'Notification');
          }
        } catch (err) {
          console.error('Failed to parse notification payload', err);
        }
      };
    } catch (err) {
      // On localhost without the endpoint this will error – swallow silently.
      console.warn('Notification stream not available yet', err);
    }
    return () => {
      es?.close();
    };
  }, []);

  return <>{children}</>;
}