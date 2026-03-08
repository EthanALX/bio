import React from "react";
import type { IconType } from "react-icons";
import {
  MdAdd,
  MdAltRoute,
  MdAreaChart,
  MdCalendarMonth,
  MdCalendarToday,
  MdChevronRight,
  MdClose,
  MdDirectionsRun,
  MdEmojiEvents,
  MdErrorOutline,
  MdFavorite,
  MdFormatListBulleted,
  MdGridView,
  MdHelpOutline,
  MdNotifications,
  MdPlace,
  MdQueryStats,
  MdRemove,
  MdSettings,
  MdSpeed,
  MdStraighten,
  MdTerminal,
  MdTimer,
} from "react-icons/md";

type IconName = string;

const ICON_MAP: Record<string, IconType> = {
  format_list_bulleted: MdFormatListBulleted,
  calendar_month: MdCalendarMonth,
  area_chart: MdAreaChart,
  route: MdAltRoute,
  directions_run: MdDirectionsRun,
  error: MdErrorOutline,
  close: MdClose,
  straighten: MdStraighten,
  speed: MdSpeed,
  favorite: MdFavorite,
  timer: MdTimer,
  calendar_today: MdCalendarToday,
  place: MdPlace,
  sprint: MdDirectionsRun,
  monitoring: MdQueryStats,
  trophy: MdEmojiEvents,
  grid_view: MdGridView,
  terminal: MdTerminal,
  settings: MdSettings,
  notifications: MdNotifications,
  "+": MdAdd,
  "-": MdRemove,
  chevron_right: MdChevronRight,
  distance: MdStraighten,
  "query_stats": MdQueryStats,
};

export interface IconProps {
  name: IconName;
  className?: string;
  title?: string;
  ariaLabel?: string;
}

export function Icon({ name, className, title, ariaLabel }: IconProps) {
  const Comp = ICON_MAP[name] ?? MdHelpOutline;
  const ariaHidden = ariaLabel ? undefined : true;

  return (
    <Comp
      className={className}
      title={title}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      focusable={false}
    />
  );
}
