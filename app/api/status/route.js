import { fal } from '@fal-ai/client';

fal.config({ credentials: process.env.FAL_KEY });

export async function GET(req) {
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return Response.json({ error: 'Missing id.' }, { status: 400 });
  const model = process.env.FAL_MODEL || 'fal-ai/veo2';
  try {
    const st = await fal.queue.status(model, { requestId: id });
    if (st.status !== 'COMPLETED') return Response.json({ status: st.status });
    const out = await fal.queue.result(model, { requestId: id });
    return Response.json({ status: 'COMPLETED', url: out.data?.video?.url || null });
  } catch (e) {
    return Response.json({ error: e.message || 'Status check failed.' }, { status: 500 });
  }
}

