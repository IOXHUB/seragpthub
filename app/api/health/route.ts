import { NextResponse } from 'next/server';

export async function GET() {
  const startTime = Date.now();

  try {
    // Add a small delay to simulate processing time
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100));

    const processingTime = Date.now() - startTime;

    return NextResponse.json({
      status: 'ok',
      message: 'SeraGPT sistemi normal çalışıyor',
      timestamp: new Date().toISOString(),
      processingTime,
      uptime: process.uptime(),
      version: '1.0.0'
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Sistem hatası',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      },
      { status: 500 }
    );
  }
}
