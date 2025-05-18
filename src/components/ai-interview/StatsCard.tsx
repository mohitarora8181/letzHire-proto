import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

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
  const isTrendPositive = trend.includes("+");
  const isTrendNegative = trend.includes("-");

  const getTrendIcon = () => {
    if (isTrendPositive) return <TrendingUp size={14} className="ml-1" />;
    if (isTrendNegative) return <TrendingDown size={14} className="ml-1" />;
    return <Minus size={14} className="ml-1" />;
  };

  const getTrendColorClass = () => {
    if (isTrendPositive) return "text-green-600 bg-green-50";
    if (isTrendNegative) return "text-red-600 bg-red-50";
    return "text-gray-600 bg-gray-50";
  };

  return (
    <div
      className={`p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] ${className}`}
    >
      <h3 className="text-sm font-medium text-gray-500 mb-3 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
        {title}
      </h3>
      <div className="flex items-center justify-between">
        <p className="text-3xl font-bold text-gray-900 opacity-0 animate-[fadeIn_0.5s_ease-out_0.2s_forwards]">
          {value}
        </p>
        <div
          className={`flex items-center px-2 py-1 rounded-full ${getTrendColorClass()} opacity-0 animate-[fadeIn_0.5s_ease-out_0.4s_forwards]`}
        >
          <span className="text-xs font-semibold flex items-center">
            {trend}
            {getTrendIcon()}
          </span>
        </div>
      </div>
    </div>
  );
};
