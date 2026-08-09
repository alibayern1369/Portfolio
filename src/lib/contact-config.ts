/**
 * Contact defaults + helpers.
 * Editable values live in Admin → Settings (site_settings).
 * WEB3FORMS_ACCESS_KEY may also come from env as a fallback.
 */

export type ContactPublicConfig = {
  email: string;
  whatsapp: string;
  whatsappMessage: string;
  telegram: string;
  telegramMessage: string;
};

export const DEFAULT_CONTACT_CONFIG: ContactPublicConfig = {
  email: "hello@alidelavar.dev",
  whatsapp: "+989120695355",
  whatsappMessage:
    "سلام، از طریق وب‌سایت شما با شما آشنا شدم و مایل هستم درباره همکاری بیشتر صحبت کنیم.",
  telegram: "YOUR_TELEGRAM_USERNAME",
  telegramMessage:
    "سلام، از طریق وب‌سایت شما با شما آشنا شدم و مایل هستم درباره همکاری بیشتر صحبت کنیم.",
};

/** wa.me link with URL-encoded default message */
export function getWhatsAppUrl(
  whatsapp: string,
  message: string
): string {
  const phone = whatsapp.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Opens Telegram chat/profile.
 * User deep links do not reliably support a pre-filled message.
 */
export function getTelegramUrl(telegram: string): string {
  const username = telegram.replace(/^@/, "").trim();
  return `https://t.me/${username}`;
}
