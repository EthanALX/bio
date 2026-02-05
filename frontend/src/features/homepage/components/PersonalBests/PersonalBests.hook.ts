import { useActivities } from "@/features/homepage/hooks";
import type {
  UsePersonalBestsProps,
  UsePersonalBestsResult,
  PersonalBestItem,
  PersonalBestsData,
} from "./PersonalBests.type";

export const usePersonalBests = (
  props: UsePersonalBestsProps
): UsePersonalBestsResult => {
  const { selectedYear } = props;
  const { personalBests } = useActivities(selectedYear);

  const pbs: PersonalBestItem[] = [
    { event: "5K", time: personalBests.best5k || "--:--" },
    { event: "10K", time: personalBests.best10k || "--:--" },
    { event: "Half", time: personalBests.bestHalf || "--:--" },
  ];

  return {
    data: { pbs },
  };
};
