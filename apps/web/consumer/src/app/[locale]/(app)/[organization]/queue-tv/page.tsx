"use client";
import { useEffect, useState } from 'react';
import { openQueueStream } from '@/services/queue';

export default function QueueTvPage({ params }: { params: { organization: string; locale: string } }) {
  const [current, setCurrent] = useState<{ ticketNo: string; firstName?: string }>({ ticketNo: '---' });

  useEffect(() => {
    const dispose = openQueueStream(params.organization, (payload) => {
      if (payload.state === 'CALLED') {
        setCurrent({ ticketNo: payload.ticketNo, firstName: payload.firstName });
      }
    });
    return dispose;
  }, [params.organization]);

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white text-8xl font-bold transition-all duration-300">
      <span>{current.ticketNo}</span>
    </div>
  );
} 