import { Suspense } from "react";
import { StockCountClient } from "@/components/StockCountClient";
import { PageSkeleton } from "@/components/PageSkeleton";

interface PageProps {
  params: { id: string };
}

export default function StockCountPage({ params }: PageProps) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <StockCountClient id={params.id} />
    </Suspense>
  );
}
