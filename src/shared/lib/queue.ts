import { Queue, Worker } from 'bullmq';
import { redis } from './redis';

if (!redis) {
  console.warn('Redis not configured — job queue disabled.');
}

export const defaultQueue = redis ? new Queue('default', { connection: redis as any }) : null;

// Example worker registration — in production you would run workers separately
if (redis) {
  const worker = new Worker('default', async (job: any) => {
    console.log('Processing job', job.name, job.data);
    // extend with job handlers
    return Promise.resolve();
  }, { connection: redis as any });

  worker.on('failed', (job: any, err: any) => {
    console.error('Job failed', job?.id, err);
  });
}
