"use client";

import React from "react";
import { useAboutLayout } from "./AboutLayout.hook";
import styles from "./AboutLayout.module.css";

export function AboutLayout() {
  const { state } = useAboutLayout();
  const { heroText, storySections, socialLinks, footerText } = state;

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

      <footer className={styles.footer}>
        <p>{footerText}</p>
      </footer>
    </div>
  );
}
