import { NextRequest, NextResponse } from 'next/server';
import { logMetaEventToSheetDB } from '@/lib/sheetdbMetaEvents';

export async function POST(request: NextRequest) {
  try {
    const eventData = await request.json();
    
    // Log the event to SheetDB
    const result = await logMetaEventToSheetDB(eventData, eventData.additional_data);
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Error in log-meta-event API:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to log Meta event',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 