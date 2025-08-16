import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    message: 'AI Chatbot is running',
    timestamp: new Date().toISOString()
  });
}
