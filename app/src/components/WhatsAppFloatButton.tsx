import { MessageCircle } from 'lucide-react';

const WHATSAPP_URL = 'https://wa.me/27683572983'; // +27 68 357 2983

/**
 * Persistent click-to-chat button — visible from anywhere on the page, not
 * just after scrolling to Contact. Bottom-left so it never collides with the
 * "Back to top" button (bottom-right, desktop-only) in App.tsx.
 */
export default function WhatsAppFloatButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed left-4 bottom-4 sm:left-6 sm:bottom-6 z-[110] flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.35)] hover:scale-105 active:scale-95 transition-transform duration-200"
    >
      <MessageCircle size={26} strokeWidth={2} className="text-white" />
    </a>
  );
}
