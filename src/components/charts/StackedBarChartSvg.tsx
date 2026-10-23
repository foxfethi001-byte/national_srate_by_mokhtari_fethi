/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Lightweight SVG Stacked Bar Chart Component
 * مخطط بياني شريطي تراكمي لتوزيع مكونات الميزانية أو مزيج الطاقة
 */

import React, { useState } from 'react';

export interface StackedSegment {
  id: string;
  label: string;
  value: number;
  color: string;
  unit?: string;
}

interface StackedBarChartSvgProps {
  title: string;
  subtitle?: string;
  segments: StackedSegment[];
  totalLabel?: string;
  unit?: string;
  showPercentages?: boolean;
}

export const StackedBarChartSvg: React.FC<StackedBarChartSvgProps> = ({
  title,
  subtitle,
  segments,
  totalLabel = 'الإجمالي الكلي',
  unit = '',
  showPercentages = true,
}) => {
  const [hoveredSegmentId, setHoveredSegmentId] = useState<string | null>(null);

  const totalValue = segments.reduce((sum, s) => sum + Math.max(0, s.value), 0);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 sm:p-5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
          {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        <div className="text-left font-mono">
          <span className="text-xs text-slate-400">{totalLabel}: </span>
          <span className="text-sm font-bold text-white tabular-nums">
            {totalValue.toLocaleString(undefined, { maximumFractionDigits: 1 })} {unit}
          </span>
        </div>
      </div>

      {/* Main Stacked Bar Track */}
      <div className="my-4">
        <div className="h-7 w-full bg-slate-800 rounded-md overflow-hidden flex shadow-inner">
          {segments.map((seg) => {
            const pct = totalValue > 0 ? (Math.max(0, seg.value) / totalValue) * 100 : 0;
            if (pct <= 0) return null;
            const isHovered = hoveredSegmentId === seg.id;

            return (
              <div
                key={seg.id}
                onMouseEnter={() => setHoveredSegmentId(seg.id)}
                onMouseLeave={() => setHoveredSegmentId(null)}
                className="h-full transition-all duration-300 relative group cursor-pointer flex items-center justify-center overflow-hidden"
                style={{
                  width: `${pct}%`,
                  backgroundColor: seg.color,
                  filter: hoveredSegmentId && !isHovered ? 'opacity(0.4)' : 'none',
                }}
              >
                {pct >= 8 && (
                  <span className="text-[10px] font-mono font-bold text-slate-950 px-1 truncate">
                    {pct.toFixed(0)}%
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend & Breakdown Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
        {segments.map((seg) => {
          const pct = totalValue > 0 ? (Math.max(0, seg.value) / totalValue) * 100 : 0;
          const isHovered = hoveredSegmentId === seg.id;

          return (
            <div
              key={seg.id}
              onMouseEnter={() => setHoveredSegmentId(seg.id)}
              onMouseLeave={() => setHoveredSegmentId(null)}
              className={`flex items-center gap-2 p-1.5 rounded transition-colors text-xs cursor-pointer ${
                isHovered ? 'bg-slate-800/80 ring-1 ring-slate-700' : 'hover:bg-slate-800/40'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-sm shrink-0"
                style={{ backgroundColor: seg.color }}
              />
              <div className="min-w-0 flex-1">
                <div className="text-[11px] text-slate-300 truncate">{seg.label}</div>
                <div className="text-[10px] font-mono text-slate-400 tabular-nums flex items-baseline justify-between">
                  <span>{seg.value.toLocaleString(undefined, { maximumFractionDigits: 1 })} {seg.unit || unit}</span>
                  {showPercentages && <span className="text-slate-500">({pct.toFixed(1)}%)</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
