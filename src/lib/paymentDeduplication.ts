/**
 * Payment deduplication utility to prevent duplicate Purchase events
 * from multiple verification attempts
 */

// In-memory store to track processed payments
const processedPayments = new Set<string>();

/**
 * Check if a payment has already been processed
 */
export function isPaymentProcessed(paymentReference: string): boolean {
  return processedPayments.has(paymentReference);
}

/**
 * Mark a payment as processed to prevent duplicates
 */
export function markPaymentAsProcessed(paymentReference: string): void {
  processedPayments.add(paymentReference);
}

/**
 * Get statistics about processed payments (for debugging)
 */
export function getProcessedPaymentsStats(): { count: number, references: string[] } {
  return {
    count: processedPayments.size,
    references: Array.from(processedPayments)
  };
}

/**
 * Clear old processed payments (optional cleanup - can be called periodically)
 * This prevents memory leaks in long-running applications
 */
export function clearOldProcessedPayments(): void {
  // In a production app, you might want to implement TTL-based cleanup
  // For now, we'll keep all processed payments in memory
  console.log('Current processed payments count:', processedPayments.size);
}
