import { env } from '@packages/data-access';
import { DrizzleOutboxRepository } from '@/infrastructure/database/drizzle-outbox.repository';
import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

const repo = new DrizzleOutboxRepository();

async function run() {
  console.log('Starting Outbox dispatcher');
  while (true) {
    const events = await repo.fetchPending(50);
    for (const ev of events) {
      // For now just log. Replace with real broker publish.
      console.log('Dispatching event', ev.eventType, ev.id);
      // TODO push to Kafka / NATS etc.
      await repo.markProcessed(ev.id);
    }
    await new Promise((res) => setTimeout(res, 5000));
  }
}

run();