// In-memory store for InitiateCheckout data
// This stores the rich user data from InitiateCheckout to be reused for Purchase events

interface CheckoutData {
  userData: any;
  sourceUrl: string;
  timestamp: number;
  leadInfo: {
    email: string;
    name: string;
    phone: string;
    fbp?: string;
    fbc?: string;
    userAgent?: string;
    clientIp?: string;
  };
}

class CheckoutDataStore {
  private store = new Map<string, CheckoutData>();
  private readonly TTL = 30 * 60 * 1000; // 30 minutes TTL

  // Store InitiateCheckout data
  set(eventId: string, data: CheckoutData) {
    this.store.set(eventId, {
      ...data,
      timestamp: Date.now()
    });
    
    // Clean up old entries periodically
    this.cleanup();
    
    console.log('💾 Stored checkout data for eventId:', eventId);
  }

  // Retrieve data for Purchase event
  get(eventId: string): CheckoutData | null {
    const data = this.store.get(eventId);
    
    if (!data) {
      console.warn('⚠️ No checkout data found for eventId:', eventId);
      return null;
    }

    // Check if data is still valid (not expired)
    if (Date.now() - data.timestamp > this.TTL) {
      console.warn('⚠️ Checkout data expired for eventId:', eventId);
      this.store.delete(eventId);
      return null;
    }

    console.log('✅ Retrieved checkout data for eventId:', eventId);
    return data;
  }

  // Remove data after successful purchase (optional cleanup)
  remove(eventId: string) {
    const removed = this.store.delete(eventId);
    if (removed) {
      console.log('🗑️ Cleaned up checkout data for eventId:', eventId);
    }
  }

  // Clean up expired entries
  private cleanup() {
    const now = Date.now();
    for (const [eventId, data] of this.store.entries()) {
      if (now - data.timestamp > this.TTL) {
        this.store.delete(eventId);
      }
    }
  }

  // Get store stats (for debugging)
  getStats() {
    return {
      totalEntries: this.store.size,
      entries: Array.from(this.store.keys())
    };
  }
}

// Singleton instance
export const checkoutDataStore = new CheckoutDataStore();
