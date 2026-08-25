"use client";

import { useState, useEffect } from "react";

type PromoMessage = {
  text: string;
  pill?: string | null;
};

const defaultMessages: PromoMessage[] = [
  { text: "FLAT 20% OFF ON YOUR FIRST ORDER", pill: "ORDER NOW" },
  { text: "FREE DELIVERY ABOVE RS. 1,500", pill: null },
  { text: "RATED 4.9 BY 2,000+ COFFEE LOVERS", pill: null },
];

function MarqueeTrack({ messages }: { messages: PromoMessage[] }) {
  const row = [...messages, ...messages, ...messages];
  return (
    <div className="promo-track">
      {row.map((m, i) => (
        <span className="promo-item" key={i}>
          <span className="promo-text">{m.text}</span>
          {m.pill && <span className="promo-pill">{m.pill}</span>}
          <span className="promo-star" aria-hidden>
            ✦
          </span>
        </span>
      ))}
    </div>
  );
}

export function PromoBar() {
  const [messages, setMessages] = useState<PromoMessage[]>(defaultMessages);

  useEffect(() => {
    fetchPromoMessages();
  }, []);

  const fetchPromoMessages = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      if (response.ok && data.settings?.promo_bar?.messages) {
        // Convert simple string array to PromoMessage format
        const promoMessages: PromoMessage[] = data.settings.promo_bar.messages.map((msg: string) => ({
          text: msg,
          pill: null,
        }));
        setMessages(promoMessages);
      }
    } catch (error) {
      console.error('Failed to fetch promo messages:', error);
      // Keep default messages if fetch fails
    }
  };

  return (
    <div className="promo-bar" role="region" aria-label="Offers">
      <MarqueeTrack messages={messages} />
    </div>
  );
}
