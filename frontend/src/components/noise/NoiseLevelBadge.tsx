import { cn } from "@/lib/utils";

type NoiseLevel = "low" | "medium" | "high" | "extreme";

interface NoiseLevelBadgeProps {
  level: NoiseLevel;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

const levelConfig = {
  low: {
    label: "Quiet",
    range: "< 50 dB",
    className: "bg-noise-quiet text-primary-foreground",
  },
  medium: {
    label: "Moderate",
    range: "50-70 dB",
    className: "bg-noise-moderate text-foreground",
  },
  high: {
    label: "Loud",
    range: "70-85 dB",
    className: "bg-noise-loud text-primary-foreground",
  },
  extreme: {
    label: "Very Loud",
    range: "> 85 dB",
    className: "bg-noise-extreme text-primary-foreground",
  },
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
  lg: "px-4 py-1.5 text-base",
};

export function NoiseLevelBadge({ level, showLabel = true, size = "md" }: NoiseLevelBadgeProps) {
  const config = levelConfig[level];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        config.className,
        sizeClasses[size]
      )}
    >
      {showLabel && config.label}
      <span className="opacity-80">({config.range})</span>
    </span>
  );
}

export function NoiseLevelIndicator() {
  return (
    <div className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border">
      <span className="text-sm font-medium text-muted-foreground">Noise Levels:</span>
      <div className="flex gap-2 flex-wrap">
        <NoiseLevelBadge level="low" size="sm" />
        <NoiseLevelBadge level="medium" size="sm" />
        <NoiseLevelBadge level="high" size="sm" />
        <NoiseLevelBadge level="extreme" size="sm" />
      </div>
    </div>
  );
}
