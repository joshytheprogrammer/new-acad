import { NextRequest, NextResponse } from 'next/server';
import { checkoutDataStore } from '@/lib/checkoutDataStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId, userData, sourceUrl, leadInfo } = body;

    if (!eventId || !userData || !leadInfo) {
      return NextResponse.json(
        { error: 'Missing required fields: eventId, userData, leadInfo' },
        { status: 400 }
      );
    }

    // Store the checkout data in memory
    checkoutDataStore.set(eventId, {
      userData,
      sourceUrl,
      timestamp: Date.now(),
      leadInfo
    });

    console.log('✅ Stored InitiateCheckout data for eventId:', eventId);
    console.log('📊 Store stats:', checkoutDataStore.getStats());

    return NextResponse.json({
      success: true,
      message: 'Checkout data stored successfully',
      eventId
    });

  } catch (error) {
    console.error('Error storing checkout data:', error);
    return NextResponse.json(
      { error: 'Failed to store checkout data' },
      { status: 500 }
    );
  }
}
