import { NextRequest, NextResponse } from 'next/server';
import { generateScenario } from '@/lib/ai/openai';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { context } = await request.json();

    const scenario = await generateScenario(context);

    return NextResponse.json(scenario);
  } catch (error: any) {
    console.error('Error generating scenario:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate scenario' },
      { status: 500 }
    );
  }
}
