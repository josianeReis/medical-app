
import { listAppointments } from '@/services/appointments';

export default async function CalendarPage({ params, searchParams }: { params: Promise<{ organization: string; locale: string }>, searchParams: Promise<{ roomId: string, doctorId: string }> }) {

  const { organization } = await params;
  const { roomId, doctorId } = await searchParams;


  const from = new Date();
  const to = new Date();
  to.setDate(to.getDate() + 7);

  const events = await listAppointments({
    slug: organization,
    from: from.toISOString(),
    to: to.toISOString(),
    roomId,
    doctorId,
  })
  console.log("🚀 ~ CalendarPage ~ events:", events)


  return (
    <div className="p-4">

    </div>
  );
} 