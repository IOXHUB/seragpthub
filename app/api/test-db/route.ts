import { NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';

export async function GET() {
  try {
    console.log('Testing database connection...');
    
    // Simple test query
    const testUsers = await getUser('test@example.com');
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'Database connection working',
      userCount: testUsers.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database test failed:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
