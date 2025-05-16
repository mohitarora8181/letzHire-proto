import React from "react";

interface StatsCardProps {
  title: string;
  value: string;
  trend: string;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  trend,
  className = "",
}) => {
  // Determine if trend is positive, negative, or neutral
  const isTrendPositive = trend.includes("+");
  const isTrendNegative = trend.includes("-");
  //   const isTrendNeutral = !isTrendPositive && !isTrendNegative;

  // Set trend color based on direction
  let trendColorClass = "";
  if (isTrendPositive) {
    trendColorClass = "text-green-600";
  } else if (isTrendNegative) {
    trendColorClass = "text-red-600";
  } else {
    trendColorClass = "text-gray-500";
  }

  return (
    <div className={`p-6 rounded-lg shadow-sm ${className}`}>
      <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
      <div className="flex items-baseline justify-between">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <span className={`text-xs font-medium ${trendColorClass}`}>
          {trend}
        </span>
      </div>
    </div>
  );
};
