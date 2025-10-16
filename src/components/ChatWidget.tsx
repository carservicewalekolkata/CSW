import { FaWhatsapp } from 'react-icons/fa';

const ChatWidget = () => {
  return (
    <div className="fixed bottom-14 right-14 hidden flex-col items-end gap-3 md:flex">
      <a
        href="https://wa.me/918904555007?text=Hi%20Car%20Service%20Wale,%20I%20need%20assistance%20with%20my%20vehicle."
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-2 text-sm font-semibold text-indigo-950 shadow-card transition hover:text-brand-700"
      >
        Need Help? <strong className="font-semibold text-brand-600">Chat with us</strong>
      </a>
      <a
        href="https://wa.me/918904555007"
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-deep transition hover:scale-105"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp className="h-7 w-7" />
      </a>
    </div>
  );
};

export default ChatWidget;
