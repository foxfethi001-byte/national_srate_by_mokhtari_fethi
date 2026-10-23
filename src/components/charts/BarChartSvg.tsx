/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Lightweight SVG Bar Chart Component
 * مخطط بياني شريطي متجهي لمقارنة المخصصات والمؤشرات الفئوية
 */

import React, { useState } from 'react';

export interface BarChartItem {
  id: string;
  label: string;
  value: number;
  secondaryValue?: number;
  color?: string;
  secondaryColor?: string;
  unit?: string;
  benchmarks?: { label: string; value: number; color?: string }[];
}

interface BarChartSvgProps {
  title: string;
  subtitle?: string;
  items: BarChartItem[];
  orientation?: 'horizontal' | 'vertical';
  unit?: string;
  height?: number;
  showComparison?: boolean;
  primaryLegend?: string;
  secondaryLegend?: string;
}

export const BarChartSvg: React.FC<BarChartSvgProps> = ({
  title,
  subtitle,
  items,
  orientation = 'horizontal',
  unit = '',
  height = 280,
  showComparison = false,
  primaryLegend = 'القيمة الحالية',
  secondaryLegend = 'المعيار / الأساس',
}) => {
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  if (!items || items.length === 0) {
    return (
      <div className="glass-panel rounded-xl border border-slate-800/80 p-5 flex items-center justify-center text-slate-500 text-xs font-mono h-48 shadow-md">
        لا توجد بيانات متاحة للعرض
      </div>
    );
  }

  // Calculate maximum value for scaling
  const allValues = items.flatMap((item) => [
    item.value,
    ...(item.secondaryValue !== undefined ? [item.secondaryValue] : []),
    ...(item.benchmarks ? item.benchmarks.map((b) => b.value) : []),
  ]);
  const maxValue = Math.max(...allValues, 1);

  return (
    <div className="glass-panel rounded-xl border border-slate-800/80 p-4 sm:p-5 flex flex-col justify-between shadow-md">
      {/* Title & Legends */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
          {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {showComparison && (
          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500 inline-block" />
              <span>{primaryLegend}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-600 inline-block" />
              <span>{secondaryLegend}</span>
            </span>
          </div>
        )}
      </div>

      {/* Chart Canvas */}
      {orientation === 'horizontal' ? (
        <div className="space-y-3.5 my-3">
          {items.map((item) => {
            const pct = Math.min(100, Math.max(0, (item.value / maxValue) * 100));
            const secPct = item.secondaryValue !== undefined
              ? Math.min(100, Math.max(0, (item.secondaryValue / maxValue) * 100))
              : null;
            const isHovered = hoveredItemId === item.id;
            const barColor = item.color || '#06b6d4'; // cyan-500 default

            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredItemId(item.id)}
                onMouseLeave={() => setHoveredItemId(null)}
                className={`transition-colors p-1.5 rounded ${isHovered ? 'bg-slate-800/60' : ''}`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium truncate max-w-[65%]">
                    {item.label}
                  </span>
                  <div className="flex items-center gap-2 font-mono text-[11px] tabular-nums">
                    <span className="text-white font-semibold">
                      {item.value.toLocaleString(undefined, { maximumFractionDigits: 1 })}{' '}
                      <span className="text-slate-500 text-[10px]">{item.unit || unit}</span>
                    </span>
                    {item.secondaryValue !== undefined && showComparison && (
                      <span className="text-slate-400">
                        / {item.secondaryValue.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bar Tracks */}
                <div className="relative h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  {secPct !== null && showComparison && (
                    <div
                      className="absolute top-0 bottom-0 bg-slate-600 rounded-full transition-all duration-300 opacity-60"
                      style={{ width: `${secPct}%` }}
                    />
                  )}
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: barColor,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Vertical Bar Chart */
        <div className="relative pt-6 pb-2" style={{ height: `${height}px` }}>
          <div className="h-full flex items-end justify-around gap-2 px-2 border-b border-slate-800">
            {items.map((item) => {
              const heightPct = Math.min(100, Math.max(0, (item.value / maxValue) * 100));
              const isHovered = hoveredItemId === item.id;
              const barColor = item.color || '#06b6d4';

              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setHoveredItemId(item.id)}
                  onMouseLeave={() => setHoveredItemId(null)}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                >
                  {isHovered && (
                    <div className="text-[10px] font-mono text-cyan-300 bg-slate-800 px-1.5 py-0.5 rounded shadow mb-1 border border-slate-700 whitespace-nowrap">
                      {item.value.toLocaleString(undefined, { maximumFractionDigits: 1 })} {item.unit || unit}
                    </div>
                  )}
                  <div
                    className="w-full max-w-[36px] rounded-t transition-all duration-300 group-hover:brightness-125"
                    style={{
                      height: `${Math.max(4, heightPct)}%`,
                      backgroundColor: barColor,
                    }}
                  />
                  <span className="text-[10px] text-slate-400 truncate max-w-full text-center mt-2 group-hover:text-slate-200">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer Notes */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
        <span>وحدة القياس: {unit}</span>
        <span>الحد الأعلى المرجعي: {maxValue.toLocaleString(undefined, { maximumFractionDigits: 1 })}</span>
      </div>
    </div>
  );
};
