"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Subtitle } from "../Subtitle";
import styles from "./EnhancedGlobalHeader.module.css";

export function EnhancedGlobalHeader() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.athleteCard}>
          {/* 动态 Avatar */}
          <motion.div
            className={styles.avatarContainer}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ scale: 1.05 }}
          >
            {/* 外圈能量环 */}
            <motion.div
              className={styles.energyRing}
              animate={{
                rotate: 360,
                scale: isHovered ? 1.1 : 1,
              }}
              transition={{
                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                scale: { duration: 0.3 },
              }}
            />

            {/* 数据轨道 */}
            <motion.div
              className={styles.dataOrbit}
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            >
              <div className={styles.dataPoint} style={{ transform: "rotate(0deg) translateX(45px)" }}>
                <span>💪</span>
              </div>
              <div className={styles.dataPoint} style={{ transform: "rotate(120deg) translateX(45px)" }}>
                <span>🔥</span>
              </div>
              <div className={styles.dataPoint} style={{ transform: "rotate(240deg) translateX(45px)" }}>
                <span>⚡</span>
              </div>
            </motion.div>

            {/* 中心 Avatar */}
            <motion.div
              className={styles.avatar}
              animate={isHovered ? {
                boxShadow: [
                  "0 0 30px rgba(14, 165, 233, 0.6)",
                  "0 0 60px rgba(14, 165, 233, 0.8)",
                  "0 0 30px rgba(14, 165, 233, 0.6)",
                ]
              } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              E
            </motion.div>

            {/* 脉冲波 */}
            {isHovered && (
              <motion.div
                className={styles.pulseWave}
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </motion.div>

          {/* 运动员信息 */}
          <div className={styles.athleteInfo}>
            <motion.div
              className={styles.athleteName}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              RUNNER
            </motion.div>
            <motion.div
              className={styles.athleteTitle}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              追风者 · Wind Chaser
            </motion.div>

            {/* 实时数据流 */}
            <div className={styles.dataStream}>
              <motion.div
                className={styles.dataItem}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className={styles.dataLabel}>PACE</span>
                <span className={styles.dataValue}>5'20"</span>
              </motion.div>
              <motion.div
                className={styles.dataItem}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
              >
                <span className={styles.dataLabel}>BPM</span>
                <span className={styles.dataValue}>145</span>
              </motion.div>
              <motion.div
                className={styles.dataItem}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, delay: 1, repeat: Infinity }}
              >
                <span className={styles.dataLabel}>KM</span>
                <span className={styles.dataValue}>2847</span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* 导航按钮 */}
        <motion.div
          className={styles.navContainer}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {pathname === "/about" ? (
            <Link href="/" className={styles.navButton}>
              <span className={styles.navIcon}>📊</span>
              <span className={styles.navText}>Running Stats</span>
              <motion.div
                className={styles.navGlow}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </Link>
          ) : (
            <Link href="/about" className={styles.navButton}>
              <span className={styles.navIcon}>👤</span>
              <span className={styles.navText}>About Me</span>
              <motion.div
                className={styles.navGlow}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </Link>
          )}
        </motion.div>
      </header>

      {/* 分隔线 */}
      <motion.div
        className={styles.divider}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />

      <Subtitle />
    </>
  );
}
