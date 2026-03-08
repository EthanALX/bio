"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useAboutLayout } from "./AboutLayout.hook";
import styles from "./AboutLayout.module.css";

export function AboutLayout() {
  const { state } = useAboutLayout();
  const { heroText, storySections, socialLinks, footerText } = state;

  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedSocial, setSelectedSocial] = useState<{
    label: string;
    qrCode: string;
  } | null>(null);

  const handleSocialClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    link: (typeof socialLinks)[0],
  ) => {
    if (link.qrCode) {
      e.preventDefault();
      setSelectedSocial({ label: link.label, qrCode: link.qrCode });
      setQrDialogOpen(true);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <p>{heroText}</p>
      </header>

      {storySections.map((section) => (
        <section key={section.title} className={styles.card}>
          <h2 className={styles.cardTitle}>{section.title}</h2>
          {section.content.map((paragraph, index) => (
            <p key={index} className={styles.text}>
              {paragraph}
            </p>
          ))}
        </section>
      ))}

      <section className={styles.card}>
        <div className={styles.socialLinks}>
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.socialLink} ${styles[link.className]}`}
              onClick={(e) => handleSocialClick(e, link)}
            >
              <svg
                className={styles.icon}
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d={link.iconPath} />
              </svg>
              <span>{link.label}</span>
            </a>
          ))}
        </div>
      </section>

      {/* QR Code Dialog */}
      <Dialog.Root open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className={styles.qrOverlay} />
          <Dialog.Content className={styles.qrContent}>
            <Dialog.Title className={styles.qrTitle}>
              {selectedSocial?.label} 二维码
            </Dialog.Title>
            <div className={styles.qrImageWrapper}>
              <img
                src={selectedSocial?.qrCode}
                alt={`${selectedSocial?.label} 二维码`}
                className={styles.qrImage}
              />
            </div>
            <p className={styles.qrHint}>扫描二维码关注</p>
            <Dialog.Close className={styles.qrClose}>
              <span aria-hidden="true">×</span>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <footer className={styles.footer}>
        <p>{footerText}</p>
      </footer>
    </div>
  );
}
