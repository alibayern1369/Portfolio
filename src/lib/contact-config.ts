/**
 * Central contact settings — change phone, Telegram, messages, and inbox here.
 * Form emails are delivered via Web3Forms to the address tied to WEB3FORMS_ACCESS_KEY
 * (should match `email` below).
 */
export const contactConfig = {
  email: "hello@alidelavar.dev",
  whatsapp: "+989120695355",
  whatsappMessage:
    "سلام، از طریق وب‌سایت شما با شما آشنا شدم و مایل هستم درباره همکاری بیشتر صحبت کنیم.",
  telegram: "YOUR_TELEGRAM_USERNAME",
  telegramMessage:
    "سلام، از طریق وب‌سایت شما با شما آشنا شدم و مایل هستم درباره همکاری بیشتر صحبت کنیم.",
} as const;

/** wa.me link with URL-encoded default message */
export function getWhatsAppUrl(): string {
  const phone = contactConfig.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(contactConfig.whatsappMessage)}`;
}

/**
 * Opens Telegram chat/profile.
 * User deep links do not reliably support a pre-filled message, so we open the chat only.
 * `telegramMessage` stays in config for easy reuse / future changes.
 */
export function getTelegramUrl(): string {
  const username = contactConfig.telegram.replace(/^@/, "");
  return `https://t.me/${username}`;
}
