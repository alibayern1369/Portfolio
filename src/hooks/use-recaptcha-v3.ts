"use client";

import { useCallback, useEffect } from "react";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

const SCRIPT_ID = "recaptcha-v3-script";

export function useRecaptchaV3() {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    if (!siteKey) return;
    if (document.getElementById(SCRIPT_ID) || document.querySelector(`script[src*="recaptcha/api.js"]`)) {
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    document.head.appendChild(script);
  }, [siteKey]);

  const getToken = useCallback(
    async (action: string): Promise<string | null> => {
      if (!siteKey) return null;

      const waitForGrecaptcha = () =>
        new Promise<NonNullable<Window["grecaptcha"]>>((resolve, reject) => {
          const start = Date.now();
          const tick = () => {
            if (window.grecaptcha) {
              resolve(window.grecaptcha);
              return;
            }
            if (Date.now() - start > 8000) {
              reject(new Error("reCAPTCHA load timeout"));
              return;
            }
            setTimeout(tick, 100);
          };
          tick();
        });

      try {
        const grecaptcha = await waitForGrecaptcha();
        return await new Promise((resolve) => {
          grecaptcha.ready(async () => {
            const token = await grecaptcha.execute(siteKey, { action });
            resolve(token);
          });
        });
      } catch {
        return null;
      }
    },
    [siteKey]
  );

  return { siteKey, getToken, enabled: Boolean(siteKey) };
}
