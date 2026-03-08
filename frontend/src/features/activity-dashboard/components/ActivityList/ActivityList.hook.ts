import { useState, useMemo } from "react";
import type {
  FormattedActivity,
  SortField,
  SortDir,
  UseActivityListProps,
  UseActivityListResult,
} from "./ActivityList.type";

function parsePaceToSeconds(pace: string): number {
  const match = pace.match(/(\d+)'(\d+)/);
  if (!match) return 0;
  return parseInt(match[1]) * 60 + parseInt(match[2]);
}

function parseTimeToMinutes(time: string): number {
  const h = time.match(/(\d+)h/);
  const m = time.match(/(\d+)m/);
  return (h ? parseInt(h[1]) * 60 : 0) + (m ? parseInt(m[1]) : 0);
}

export const useActivityList = ({ activities }: UseActivityListProps): UseActivityListResult => {
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedActivity, setSelectedActivity] = useState<FormattedActivity | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const formattedActivities: FormattedActivity[] = useMemo(
    () =>
      activities.map((a) => ({
        id: a.id,
        distance: `${a.distance} km`,
        distanceNum: a.distance,
        pace: a.pace,
        paceSeconds: parsePaceToSeconds(a.pace),
        bpm: a.bpm,
        time: a.time,
        route: a.route,
        coordinates: a.coordinates,
        dateISO: a.date,
        dateDisplay: new Date(a.date).toLocaleString("zh-CN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }).replace(/\//g, "-"),
      })),
    [activities]
  );

  const sorted = useMemo(() => {
    const arr = [...formattedActivities];
    arr.sort((a, b) => {
      let av: number | string = 0;
      let bv: number | string = 0;

      if (sortField === "date")     { av = a.dateISO; bv = b.dateISO; }
      if (sortField === "distance") { av = a.distanceNum; bv = b.distanceNum; }
      if (sortField === "pace")     { av = a.paceSeconds; bv = b.paceSeconds; }
      if (sortField === "bpm")      { av = a.bpm; bv = b.bpm; }
      if (sortField === "time")     {
        av = parseTimeToMinutes(a.time);
        bv = parseTimeToMinutes(b.time);
      }

      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [formattedActivities, sortField, sortDir]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const handleRowClick = (activity: FormattedActivity) => {
    setSelectedActivity(activity);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return {
    state: {
      formattedActivities,
      sorted,
      sortField,
      sortDir,
      selectedActivity,
      dialogOpen,
    },
    actions: {
      handleSort,
      handleRowClick,
      handleDialogClose,
    },
  };
};
