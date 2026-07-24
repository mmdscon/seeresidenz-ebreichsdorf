"use client";

// Direct WhatsApp contact — replace the phone number below with your
// dedicated WhatsApp business number if different from the office line.
const WHATSAPP_NUMBER = "4930000000"; // no spaces, with country code, no leading +
const WHATSAPP_TEXT = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

export default function WhatsAppButton() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_TEXT)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Per WhatsApp kontaktieren"
      className="fixed z-40 flex items-center justify-center transition-transform duration-200 hover:scale-105 active:scale-95"
      style={{
        bottom: "24px",
        right: "24px",
        width: "58px",
        height: "58px",
        borderRadius: "50%",
        backgroundColor: "#25D366",
        boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
      }}
    >
      <svg width="30" height="30" viewBox="0 0 24 24" fill="white" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01s-.52.075-.792.372c-.272.297-1.04 1.016-1.04 2.479s1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.77.46 3.43 1.28 4.86L2 22l5.36-1.4a9.9 9.9 0 004.68 1.19h.004c5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm0 18.03h-.003a8.1 8.1 0 01-4.14-1.13l-.297-.176-3.18.83.85-3.1-.194-.318a8.09 8.09 0 01-1.24-4.33c0-4.48 3.65-8.12 8.13-8.12 2.17 0 4.21.85 5.74 2.38a8.06 8.06 0 012.38 5.75c0 4.48-3.65 8.13-8.13 8.13z" />
      </svg>
    </a>
  );
}
