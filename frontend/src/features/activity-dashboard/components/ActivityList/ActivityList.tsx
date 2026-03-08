import React from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import * as Tooltip from "@radix-ui/react-tooltip";
import * as Dialog from "@radix-ui/react-dialog";
import * as Separator from "@radix-ui/react-separator";
import { useActivityList } from "./ActivityList.hook";
import type { ActivityListProps, FormattedActivity, SortField } from "./ActivityList.type";
import { Icon } from "@/components/Icon";
import { RouteSketch } from "../RouteSketch";
import styles from "./ActivityList.module.css";

type Column = { key: SortField; label: string };
const COLUMNS: Column[] = [
  { key: "distance", label: "Distance" },
  { key: "pace",     label: "Pace" },
  { key: "bpm",      label: "BPM" },
  { key: "time",     label: "Time" },
  { key: "date",     label: "Date" },
];

function BpmBadge({ bpm }: { bpm: number }) {
  const cls =
    bpm < 140 ? styles.bpmLow : bpm < 155 ? styles.bpmMed : styles.bpmHigh;
  return <span className={`${styles.bpmBadge} ${cls}`}>{bpm}</span>;
}

function SortIcon({ field, sortField, sortDir }: {
  field: SortField;
  sortField: SortField;
  sortDir: "asc" | "desc";
}) {
  if (field !== sortField)
    return <span className={styles.sortIcon}>↕</span>;
  return (
    <span className={`${styles.sortIcon} ${styles.sortActive}`}>
      {sortDir === "asc" ? "↑" : "↓"}
    </span>
  );
}

function ActivityDetailDialog({
  activity,
  open,
  onClose,
}: {
  activity: FormattedActivity | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!activity) return null;

  const detail = [
    { icon: "straighten",   label: "Distance", value: activity.distance },
    { icon: "speed",        label: "Pace",     value: activity.pace },
    { icon: "favorite",     label: "Avg BPM",  value: String(activity.bpm) },
    { icon: "timer",        label: "Duration", value: activity.time },
    { icon: "calendar_today", label: "Date",   value: activity.dateDisplay },
    { icon: "place",        label: "Route",    value: activity.route || "—" },
  ];

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.dialogOverlay} />
        <Dialog.Content className={styles.dialogContent} aria-describedby={undefined}>
          <div className={styles.dialogHeader}>
            <Dialog.Title className={styles.dialogTitle}>Run Details</Dialog.Title>
            <Dialog.Close className={styles.dialogClose} aria-label="Close">
              <Icon name="close" className={styles.dialogCloseIcon} />
            </Dialog.Close>
          </div>

          <Separator.Root className={styles.sep} />

          {/* Route sketch */}
          {activity.coordinates && activity.coordinates.length > 1 && (
            <div className={styles.dialogSketch}>
              <RouteSketch
                coordinates={activity.coordinates}
                seed={activity.id}
                width={360}
                height={160}
              />
            </div>
          )}

          {/* Stats grid */}
          <div className={styles.dialogStats}>
            {detail.map(({ icon, label, value }) => (
              <div key={label} className={styles.dialogStatItem}>
                <Icon name={icon} className={styles.dialogStatIcon} />
                <div>
                  <div className={styles.dialogStatLabel}>{label}</div>
                  <div className={styles.dialogStatValue}>{value}</div>
                </div>
              </div>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function ActivityList({ activities }: ActivityListProps) {
  const { state, actions } = useActivityList({ activities });
  const { sorted, sortField, sortDir, selectedActivity, dialogOpen } = state;
  const { handleSort, handleRowClick, handleDialogClose } = actions;

  return (
    <Tooltip.Provider delayDuration={400}>
      <div className={styles.container}>
        {/* ── Header row ───────────────────────────────────── */}
        <div className={styles.header}>
          {COLUMNS.map(({ key, label }) => (
            <button
              key={key}
              className={styles.headerCell}
              onClick={() => handleSort(key)}
              aria-sort={
                sortField === key
                  ? sortDir === "asc" ? "ascending" : "descending"
                  : "none"
              }
            >
              {label}
              <SortIcon field={key} sortField={sortField} sortDir={sortDir} />
            </button>
          ))}
          {/* spacer for route sketch column */}
          <div className={styles.headerCell}>Route</div>
        </div>

        {/* ── Scroll area ───────────────────────────────────── */}
        <ScrollArea.Root className={styles.scrollRoot} type="scroll">
          <ScrollArea.Viewport className={styles.scrollViewport}>
            {sorted.map((activity) => (
              <Tooltip.Root key={activity.id}>
                <Tooltip.Trigger asChild>
                  <div
                    className={styles.row}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleRowClick(activity)}
                    onKeyDown={(e) => e.key === "Enter" && handleRowClick(activity)}
                    aria-label={`Run on ${activity.dateDisplay}, ${activity.distance}`}
                  >
                    <div className={styles.cell}>{activity.distance}</div>
                    <div className={`${styles.cell} ${styles.mono}`}>{activity.pace}</div>
                    <div className={styles.cell}>
                      <BpmBadge bpm={activity.bpm} />
                    </div>
                    <div className={styles.cell}>{activity.time}</div>
                    <div className={`${styles.cell} ${styles.dateCell}`}>
                      {activity.dateDisplay}
                    </div>
                    <div className={styles.cell}>
                      <RouteSketch
                        coordinates={activity.coordinates}
                        seed={activity.id}
                      />
                    </div>
                  </div>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content className={styles.rowTooltip} side="left" sideOffset={12}>
                    <div className={styles.tooltipRow}>
                      <span className={styles.tooltipLabel}>Distance</span>
                      <span className={styles.tooltipValue}>{activity.distance}</span>
                    </div>
                    <div className={styles.tooltipRow}>
                      <span className={styles.tooltipLabel}>Pace</span>
                      <span className={styles.tooltipValue}>{activity.pace}</span>
                    </div>
                    <div className={styles.tooltipRow}>
                      <span className={styles.tooltipLabel}>BPM</span>
                      <span className={styles.tooltipValue}>{activity.bpm}</span>
                    </div>
                    <div className={styles.tooltipHint}>Click for full details →</div>
                    <Tooltip.Arrow className={styles.tooltipArrow} />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            ))}
          </ScrollArea.Viewport>

          <ScrollArea.Scrollbar className={styles.scrollbar} orientation="vertical">
            <ScrollArea.Thumb className={styles.scrollThumb} />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </div>

      {/* ── Detail dialog ──────────────────────────────────── */}
      <ActivityDetailDialog
        activity={selectedActivity}
        open={dialogOpen}
        onClose={handleDialogClose}
      />
    </Tooltip.Provider>
  );
}
