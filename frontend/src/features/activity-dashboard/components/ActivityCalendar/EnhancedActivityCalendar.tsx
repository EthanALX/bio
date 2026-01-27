'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity } from '../../types';
import styles from './EnhancedActivityCalendar.module.css';

interface DayData {
  date: string;
  distance: number;
  activities: Activity[];
  dayOfWeek: number;
  dayOfMonth: number;
}

interface EnhancedActivityCalendarProps {
  year: number;
  activities: Activity[];
}

export function EnhancedActivityCalendar({ year, activities }: EnhancedActivityCalendarProps) {
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // 生成全年日历数据
  const calendarData = useMemo(() => {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    const days: DayData[] = [];

    // 创建日期到活动的映射
    const activityMap = new Map<string, Activity[]>();
    activities.forEach(activity => {
      const dateKey = activity.date.split('T')[0];
      if (!activityMap.has(dateKey)) {
        activityMap.set(dateKey, []);
      }
      activityMap.get(dateKey)!.push(activity);
    });

    // 生成每一天的数据
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateKey = d.toISOString().split('T')[0];
      const dayActivities = activityMap.get(dateKey) || [];
      const totalDistance = dayActivities.reduce((sum, a) => sum + a.distance, 0);

      days.push({
        date: dateKey,
        distance: totalDistance,
        activities: dayActivities,
        dayOfWeek: d.getDay(),
        dayOfMonth: d.getDate(),
      });
    }

    return days;
  }, [year, activities]);

  // 计算连击数据
  const streaks = useMemo(() => {
    const result: Array<{ start: number; end: number; length: number }> = [];
    let currentStreak = { start: 0, end: 0, length: 0 };

    calendarData.forEach((day, index) => {
      if (day.activities.length > 0) {
        if (currentStreak.length === 0) {
          currentStreak.start = index;
        }
        currentStreak.end = index;
        currentStreak.length++;
      } else if (currentStreak.length > 0) {
        if (currentStreak.length >= 3) {
          result.push({ ...currentStreak });
        }
        currentStreak = { start: 0, end: 0, length: 0 };
      }
    });

    if (currentStreak.length >= 3) {
      result.push(currentStreak);
    }

    return result;
  }, [calendarData]);

  // 最长连击
  const longestStreak = useMemo(() => {
    return streaks.reduce((max, streak) =>
      streak.length > max.length ? streak : max
    , { start: 0, end: 0, length: 0 });
  }, [streaks]);

  // 按月组织数据
  const months = useMemo(() => {
    const result: Array<{ name: string; days: DayData[] }> = [];
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

    for (let month = 0; month < 12; month++) {
      const monthDays = calendarData.filter(day => {
        const date = new Date(day.date);
        return date.getMonth() === month;
      });

      result.push({
        name: monthNames[month],
        days: monthDays,
      });
    }

    return result;
  }, [calendarData]);

  // 获取格子颜色等级
  const getLevel = (distance: number) => {
    if (distance === 0) return 0;
    if (distance < 5) return 1;
    if (distance < 10) return 2;
    if (distance < 15) return 3;
    return 4;
  };

  const handleDayHover = (day: DayData | null, e?: React.MouseEvent) => {
    setHoveredDay(day);
    if (e && day && day.date) {
      // 计算智能定位
      const tooltipWidth = 220; // tooltip 预估宽度
      const tooltipHeight = 200; // tooltip 预估高度
      const offset = 15; // 偏移量

      let x = e.clientX + offset;
      let y = e.clientY + offset;

      // 检查右边界
      if (x + tooltipWidth > window.innerWidth) {
        x = e.clientX - tooltipWidth - offset;
      }

      // 检查下边界
      if (y + tooltipHeight > window.innerHeight) {
        y = e.clientY - tooltipHeight - offset;
      }

      // 检查上边界
      if (y < 0) {
        y = offset;
      }

      // 检查左边界
      if (x < 0) {
        x = offset;
      }

      setTooltipPos({ x, y });
    }
  };

  return (
    <div className={styles.container}>
      {/* 月份标签 */}
      <div className={styles.monthLabels}>
        {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].map((month, i) => (
          <div key={month} className={styles.monthLabel} style={{ left: `${(i / 12) * 100}%` }}>
            {month}
          </div>
        ))}
      </div>

      {/* 日历网格 - 按月显示 */}
      <div className={styles.grid}>
        {months.map((month, monthIndex) => (
          <div key={month.name} className={styles.month}>
            <div className={styles.monthName}>{month.name}</div>
            <div className={styles.monthDays}>
              {month.days.map((day, dayIndex) => {
                const level = getLevel(day.distance);
                const globalIndex = monthIndex * 31 + dayIndex;
                const isWeekend = day.dayOfWeek === 0 || day.dayOfWeek === 6;
                const isInLongestStreak =
                  longestStreak.length > 0 &&
                  calendarData.findIndex(d => d.date === day.date) >= longestStreak.start &&
                  calendarData.findIndex(d => d.date === day.date) <= longestStreak.end;

                return (
                  <motion.div
                    key={day.date}
                    className={`${styles.day} ${styles[`level-${level}`]} ${isWeekend ? styles.weekend : ''} ${isInLongestStreak ? styles.bestStreak : ''}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: globalIndex * 0.001,
                      duration: 0.3,
                      ease: 'easeOut'
                    }}
                    whileHover={{
                      scale: 1.5,
                      zIndex: 10,
                      transition: { duration: 0.2 }
                    }}
                    onMouseEnter={(e) => handleDayHover(day, e)}
                    onMouseLeave={() => handleDayHover(null)}
                  >
                    <span className={styles.dayNumber}>{day.dayOfMonth}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}

        {/* 连击连接线 SVG */}
        <svg className={styles.streakLines} style={{ width: '100%', height: '100%' }}>
          <defs>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#f97316" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* 暂时隐藏连击线,月视图下不太适合显示 */}
        </svg>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredDay && hoveredDay.date && (
          <motion.div
            className={styles.tooltip}
            style={{
              left: tooltipPos.x + 10,
              top: tooltipPos.y + 10,
            }}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <div className={styles.tooltipDate}>{hoveredDay.date}</div>
            <div className={styles.tooltipStats}>
              <div className={styles.tooltipStat}>
                <span className={styles.tooltipLabel}>Distance</span>
                <span className={styles.tooltipValue}>{hoveredDay.distance.toFixed(2)} km</span>
              </div>
              <div className={styles.tooltipStat}>
                <span className={styles.tooltipLabel}>Activities</span>
                <span className={styles.tooltipValue}>{hoveredDay.activities.length}</span>
              </div>
            </div>

            {/* 活动列表 */}
            {hoveredDay.activities.length > 0 ? (
              <div className={styles.tooltipActivities}>
                {hoveredDay.activities.map((activity) => (
                  <div key={activity.id} className={styles.tooltipActivity}>
                    <div className={styles.activityDot} />
                    <span>{activity.distance.toFixed(2)} km</span>
                    <span className={styles.activityPace}>{activity.pace}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.tooltipEmpty}>
                <span className={styles.tooltipEmptyText}>休息日 🌙</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 图例 */}
      <div className={styles.legend}>
        <span className={styles.legendTitle}>跑步强度</span>
        <div className={styles.legendGradient}>
          <span className={styles.legendLabel}>少</span>
          {[0, 1, 2, 3, 4].map(level => (
            <div
              key={level}
              className={`${styles.legendBox} ${styles[`level-${level}`]}`}
              title={
                level === 0 ? '无活动' :
                level === 1 ? '< 5km' :
                level === 2 ? '5-10km' :
                level === 3 ? '10-15km' :
                '> 15km'
              }
            />
          ))}
          <span className={styles.legendLabel}>多</span>
        </div>

        {longestStreak.length > 0 && (
          <div className={styles.streakBadge}>
            <span className={styles.streakIcon}>🔥</span>
            <span className={styles.streakText}>Best Streak: {longestStreak.length} days</span>
          </div>
        )}
      </div>
    </div>
  );
}
