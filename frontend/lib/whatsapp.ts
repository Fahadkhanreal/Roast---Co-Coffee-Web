/**
 * WhatsApp messaging utilities for order notifications
 */

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

/**
 * Generate WhatsApp link with pre-filled message
 */
export function getWhatsAppLink(phone: string, orderNumber: string, status: OrderStatus): string {
  // Clean phone number (remove spaces, dashes, etc.)
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');

  // Add Pakistan country code if not present
  const formattedPhone = cleanPhone.startsWith('+92')
    ? cleanPhone.substring(1) // Remove + for wa.me
    : cleanPhone.startsWith('92')
    ? cleanPhone
    : cleanPhone.startsWith('0')
    ? '92' + cleanPhone.substring(1) // Replace leading 0 with 92
    : '92' + cleanPhone;

  // Get message based on status
  const message = getWhatsAppMessage(orderNumber, status);

  // Encode message for URL
  const encodedMessage = encodeURIComponent(message);

  // Return WhatsApp link
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
}

/**
 * Get pre-filled message template based on order status
 */
function getWhatsAppMessage(orderNumber: string, status: OrderStatus): string {
  const messages = {
    pending: `السلام علیکم!
Your order *${orderNumber}* has been received.
We'll confirm shortly. ☕

*Roast & Co.*`,

    confirmed: `السلام علیکم!
Your order *${orderNumber}* has been confirmed! ✅

We're preparing your delicious coffee now.
Estimated time: 20-30 minutes ⏰

*Roast & Co.*`,

    preparing: `السلام علیکم!
Your order *${orderNumber}* is being prepared! 👨‍🍳

Our baristas are crafting your coffee with care. ☕
Almost ready!

*Roast & Co.*`,

    ready: `السلام علیکم!
Your order *${orderNumber}* is ready! ✅

Our delivery rider is on the way to you. 🚚
Please keep your phone nearby.

*Roast & Co.*`,

    delivered: `السلام علیکم!
Thank you for ordering from Roast & Co.! ❤️

We hope you enjoy your coffee! ☕
Order *${orderNumber}* has been delivered.

Rate us: [link to review]

*Roast & Co.*`,

    cancelled: `السلام علیکم!
Your order *${orderNumber}* has been cancelled.

If you have any questions, please call us.
We apologize for the inconvenience.

*Roast & Co.*`,
  };

  return messages[status] || messages.pending;
}

/**
 * Open WhatsApp in new window/tab
 */
export function sendWhatsAppMessage(phone: string, orderNumber: string, status: OrderStatus): void {
  const link = getWhatsAppLink(phone, orderNumber, status);
  window.open(link, '_blank');
}
