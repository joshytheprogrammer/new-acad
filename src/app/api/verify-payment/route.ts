import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { checkoutDataStore } from '@/lib/checkoutDataStore';
import { generateEventId, getTestEventCode } from '@/lib/metaHelpers';
import { isPaymentProcessed, markPaymentAsProcessed } from '@/lib/paymentDeduplication';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reference, eventId, originalUserData, eventSourceUrl, backupData } = body;

    if (!reference) {
      return NextResponse.json(
        { success: false, error: 'Payment reference is required' },
        { status: 400 }
      );
    }

    if (!eventId) {
      return NextResponse.json(
        { success: false, error: 'Event ID is required for tracking' },
        { status: 400 }
      );
    }

    // Verify payment with Paystack
    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const verificationData = await verifyResponse.json();

    if (!verifyResponse.ok) {
      console.error('Paystack verification failed:', verificationData);
      return NextResponse.json(
        { success: false, error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    const { data: transaction } = verificationData;

    // Check if payment was successful
    if (transaction.status === 'success') {
      console.log('✅ Payment verified successfully:', {
        reference: transaction.reference,
        amount: transaction.amount / 100,
        customer: transaction.customer
      });

      // Check if this payment has already been processed to prevent duplicates
      if (isPaymentProcessed(reference)) {
        console.log('⚠️ Payment already processed, skipping duplicate Purchase event:', reference);
        return NextResponse.json({
          success: true,
          message: 'Payment verified successfully (already processed)',
          transaction: {
            reference: transaction.reference,
            amount: transaction.amount / 100,
            status: transaction.status,
            paidAt: transaction.paid_at,
            customer: transaction.customer,
          },
        });
      }

      // Purchase event will be sent from the success page
      console.log('✅ Payment verified successfully, Purchase event will be triggered from success page');

      // Mark this payment as processed to prevent duplicates
      markPaymentAsProcessed(reference);
      console.log('📝 Marked payment as processed:', reference);

      return NextResponse.json({
        success: true,
        transaction: {
          reference: transaction.reference,
          amount: transaction.amount / 100,
          status: transaction.status,
          paidAt: transaction.paid_at,
          customer: transaction.customer,
        },
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Payment was not successful' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 