import { Suspense } from "react";
import { DashboardLayout } from "@/features/activity-dashboard";
import { LoadingSkeleton } from "@/components/Feedback";

export default function Home() {
  return (
    <Suspense fallback={<LoadingSkeleton variant="list" rows={8} />}>
      <DashboardLayout />
    </Suspense>
  );
}
