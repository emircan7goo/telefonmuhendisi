import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📱 Gelen MDM Telemetri:', JSON.stringify(body, null, 2));

    return NextResponse.json(
      {
        status: 'success',
        message: 'Telemetry received successfully',
        received_at: Date.now(),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Invalid payload' },
      { status: 400 }
    );
  }
}
