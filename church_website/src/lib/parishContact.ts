/** Official parish contact — update here to refresh site-wide. */
export const PARISH_PHONE_DISPLAY = "0759686897";
export const PARISH_PHONE_TEL = "+254759686897";
/** Digits only, no + prefix (for wa.me links). */
export const PARISH_WHATSAPP_E164 = "254759686897";
export const PARISH_EMAIL = "St.francischeptarit014@gmail.com";

/** Same values as PARISH_* — kept so older component code never hits “not defined” after refactors. */
export const CHURCH_PHONE = PARISH_PHONE_DISPLAY;
export const CHURCH_EMAIL = PARISH_EMAIL;
export const WHATSAPP_NUMBER = PARISH_WHATSAPP_E164;

export const PARISH_POSTAL_LINES = [
  "ST. FRANCIS CATHOLIC CHURCH",
  "CHEPTARIT PARISH",
  "P.O. BOX 97 - 30307",
  "MOSORIOT",
].join("\n");

/** Native `href` values — phones open the dialer, mail opens the default email app. */
export const PARISH_TEL_HREF = `tel:${PARISH_PHONE_TEL}`;
export const PARISH_MAILTO_HREF = `mailto:${PARISH_EMAIL}`;
