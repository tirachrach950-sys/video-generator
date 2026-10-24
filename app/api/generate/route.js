import { fal } from '@fal-ai/client';

fal.config({ credentials: process.env.FAL_KEY });

const STYLES = {
  studio: 'slow rotating hero shot on a clean studio background, soft diffused light, glossy reflections',
  lifestyle: 'lifestyle scene with natural window light, a hand picks up and uses the product, shallow depth of field',
  luxury: 'luxury cinematic macro shots, dark background, golden highlights, slow camera push-in',
};

export async function POST(req) {
  const body = await req.json().catch(() => ({}));

  // Simple protection so strangers cannot spend your money.
  if (process.env.ACCESS_CODE && body.code !== process.env.ACCESS_CODE) {
    return Response.json({ error: 'Wrong access code.' }, { status: 401 });
  }
  if (!process.env.FAL_KEY) {
    return Response.json({ error: 'FAL_KEY is missing on the server.' }, { status: 500 });
  }

  const product = String(body.product || '').slice(0, 60);
  const details = String(body.details || '').slice(0, 140);
  const style = STYLES[body.style] || STYLES.studio;
  if (!product) return Response.json({ error: 'Product name is required.' }, { status: 400 });

  // AI video models draw text badly, so we ask for a clean shot with no text.
  const prompt = `Vertical product advertisement for "${product}" (${details}). ${style}. Smooth realistic motion, high detail, no text or logos in the frame.`;

  let extra = {};
  try { extra = JSON.parse(process.env.FAL_EXTRA_INPUT || '{}'); } catch {}

  try {
    const { request_id } = await fal.queue.submit(process.env.FAL_MODEL || 'fal-ai/veo2', {
      input: { prompt, duration: '5s', aspect_ratio: '9:16', ...extra },
    });
    return Response.json({ id: request_id });
  } catch (e) {
    return Response.json({ error: e.message || 'Could not start the generation.' }, { status: 500 });
  }
}

