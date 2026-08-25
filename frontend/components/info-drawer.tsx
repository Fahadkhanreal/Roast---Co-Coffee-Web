"use client";

import { useEffect } from "react";
import {
  ClockIcon,
  CloseIcon,
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  MapIcon,
  PhoneIcon,
  PinIcon,
  WhatsAppIcon,
} from "./icons";

type InfoDrawerProps = {
  open: boolean;
  onClose: () => void;
};

function DrawerSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="drawer-section">
      <h3 className="drawer-section-title">{title}</h3>
      {children}
    </div>
  );
}

function Row({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="drawer-row">
      <span className="drawer-row-icon">{icon}</span>
      <span className="drawer-row-content">{children}</span>
    </div>
  );
}

export function InfoDrawer({ open, onClose }: InfoDrawerProps) {
  // Close on Escape key
  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  // Don't render if not open (performance optimization)
  if (!open) {
    return null;
  }

  return (
    <aside
      className="drawer drawer-info drawer-open"
      aria-hidden={false}
      onClick={(e) => {
        // Prevent clicks inside drawer from closing it
        e.stopPropagation();
      }}
    >
      <button
        className="drawer-close-btn"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }}
        type="button"
        aria-label="Close menu"
      >
        <CloseIcon size={20} strokeWidth={2.2} />
      </button>

      <h2 className="drawer-title">Good to know</h2>

      <DrawerSection title="Address">
        <Row icon={<PinIcon size={19} />}>
          <span>
            <strong>Roast &amp; Co.</strong>
            <br />
            Shop 12, Seaview Plaza, Block 8,
            <br />
            Clifton, Karachi
          </span>
        </Row>
      </DrawerSection>

      <DrawerSection title="Opening Hours">
        <Row icon={<ClockIcon size={19} />}>
          <span>
            Monday – Friday: 8:00am – 11:00pm
            <br />
            Saturday – Sunday: 9:00am – 12:00am
          </span>
        </Row>
      </DrawerSection>

      <DrawerSection title="Contact">
        <Row icon={<PhoneIcon size={19} />}>
          <a href="tel:+922135001122">+92 21 3500 1122</a>
        </Row>
        <Row icon={<MailIcon size={19} />}>
          <a href="mailto:hello@roastandco.pk">hello@roastandco.pk</a>
        </Row>
        <Row icon={<WhatsAppIcon size={19} />}>
          <a className="drawer-whatsapp" href="https://wa.me/923001234567">
            Chat with us on WhatsApp
          </a>
        </Row>
      </DrawerSection>

      <DrawerSection title="Delivery">
        <p className="drawer-paragraph">
          Free delivery on orders above Rs. 1,500. Orders arrive in 30–45 minutes
          across Clifton, DHA and Boat Basin.
        </p>
      </DrawerSection>

      <div className="drawer-socials">
        <button className="social-btn" aria-label="Instagram">
          <InstagramIcon size={18} />
        </button>
        <button className="social-btn" aria-label="Facebook">
          <FacebookIcon size={18} />
        </button>
        <button className="social-btn" aria-label="View on Maps">
          <MapIcon size={18} />
        </button>
      </div>
    </aside>
  );
}