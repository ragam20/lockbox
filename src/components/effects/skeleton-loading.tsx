import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonLoadingProps = {
  className?: string;
  count?: number;
};

export const SkeletonLoading = ({
  className,
  count = 4,
}: SkeletonLoadingProps) => {
  return (
    <div className={cn("flex flex-col gap-4", className)} aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex h-14 w-full items-center gap-4 rounded-md border border-forest/60 bg-forest/10 px-4 py-3 animate-pulse"
          style={{ animationDelay: `${index * 120}ms` }}
        >
          <Skeleton className="size-5 shrink-0 rounded-xs bg-forest/30" />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Skeleton
              className={cn(
                "h-3 rounded-full bg-forest/30",
                index % 2 === 0 ? "w-3/5" : "w-1/2",
              )}
            />
            <Skeleton className="h-2.5 w-1/3 rounded-full bg-forest/20" />
          </div>
          <Skeleton className="size-9 shrink-0 rounded-md bg-forest/30" />
        </div>
      ))}
    </div>
  );
};
