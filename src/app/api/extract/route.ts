import { NextResponse } from 'next/server';
import { extractExam } from '@/lib/ai/extract';
import { enabledProviders, type ProviderId } from '@/lib/ai/providers';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET() { return NextResponse.json({ providers: enabledProviders() }); }

export async function POST(req: Request) {
  const { images, provider } = (await req.json()) as { images?: string[]; provider?: ProviderId };
  if (!images?.length || images.length > 8 || !images.every((i) => i.startsWith('data:image/'))) return NextResponse.json({ error: 'الصورة غير صالحة' }, { status: 400 });
  if (!provider || !enabledProviders().includes(provider)) return NextResponse.json({ error: 'النموذج غير مفعّل' }, { status: 400 });
  try { return NextResponse.json({ exam: await extractExam(provider, images) }); }
  catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : 'خطأ غير متوقع' }, { status: 500 }); }
}
