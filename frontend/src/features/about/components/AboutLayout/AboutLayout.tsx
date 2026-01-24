"use client";

import React from "react";
import styles from "./AboutLayout.module.css";

export function AboutLayout() {
  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <p>每一公里，都是对生命的热爱</p>
      </header>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>故事</h2>
        <p className={styles.text}>
          我相信每一次迈步都是一次成长，每一次挑战都是一次突破。
          无论是清晨的5公里，还是挑战自我的马拉松，每一步都值得被记录和分享。
        </p>
        <p className={styles.text}>
          跑步数据不仅仅是数字的积累，更是个人成长和健康生活方式的见证。
          希望让每一位跑者都能看到自己的进步，找到坚持下去的动力。
        </p>
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>为什么？</h2>
        <p className={styles.text}>
          跑步是最简单、最原始的运动形式之一。一点儿也不复杂，只需要一双合适的跑鞋和一颗愿意前行的内心。
          正如传奇跑者艾米尔·扎托佩克所说："如果想跑步，一公里就好，如果想体验不一样的人生，去跑场马拉松。"
        </p>
        <p className={styles.text}>
          跑步不仅锻炼身体，更能磨练意志。每一次突破自己的极限，都是对内心的一次对话和成长。
          在跑步中，我学会了坚持，学会了面对困难，也学会了在疲惫中寻找力量。
        </p>
      </section>

      <section className={styles.card}>
        <div className={styles.socialLinks}>
          <a
            href="https://www.strava.com/athletes/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.socialLink} ${styles.strava}`}
          >
            <svg
              className={styles.icon}
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M15.387 17.944l-2.089-4.116h-3.065l2.089 4.116h-1.748l-5.445-10.749h1.748l3.828 7.574 3.828-7.574h1.748l-5.445 10.749h-1.748zm-6.321-8.484v-1.178h6.321v1.178h-6.321z" />
            </svg>
            <span>Strava</span>
          </a>

          <a
            href="https://www.instagram.com/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.socialLink} ${styles.instagram}`}
          >
            <svg
              className={styles.icon}
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
            </svg>
            <span>Instagram</span>
          </a>

          <a
            href="https://twitter.com/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.socialLink} ${styles.twitter}`}
          >
            <svg
              className={styles.icon}
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
            <span>Twitter</span>
          </a>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>© 2026  记录每一步</p>
      </footer>
    </div>
  );
}
