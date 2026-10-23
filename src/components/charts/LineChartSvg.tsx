/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Lightweight SVG Multi-Series Time Chart
 * مخطط بياني متجهي خفيف ودقيق للسلاسل الزمنية
 */

import React, { useState } from 'react';

export interface DataSeries {
  id: string;
  label: string;
  color: string;
  data: { year: number; value: number }[];
  isDashed?: boolean;
}

interface LineChartSvgProps {
  title?: string;
  subtitle?: string;
  series: DataSeries[];
  unit?: string;
  height?: number;
  yMin?: number;
  yMax?: number;
  referenceLineY?: number;
  referenceLineLabel?: string;
}

export const LineChartSvg: React.FC<LineChartSvgProps> = ({
  title,
  subtitle,
  series,
  unit = '',
  height = 200,
  yMin: customYMin,
  yMax: customYMax,
  referenceLineY,
  referenceLineLabel,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{
    year: number;
    value: number;
    seriesLabel: string;
    x: number;
    y: number;
  } | null>(null);

  if (!series.length || !series[0].data.length) {
    return <div className="h-48 flex items-center justify-center text-xs text-slate-500">لا توجد بيانات متاحة</div>;
  }

  // Calculate bounds
  const allYears = Array.from(new Set(series.flatMap((s) => s.data.map((d) => d.year)))).sort((a, b) => a - b);
  const allValues = series.flatMap((s) => s.data.map((d) => d.value));

  const minYear = allYears[0];
  const maxYear = allYears[allYears.length - 1];
  const yearSpan = Math.max(1, maxYear - minYear);

  let computedMin = customYMin ?? Math.min(...allValues);
  let computedMax = customYMax ?? Math.max(...allValues);

  if (referenceLineY !== undefined) {
    computedMin = Math.min(computedMin, referenceLineY);
    computedMax = Math.max(computedMax, referenceLineY);
  }

  // Add 8% vertical padding if auto bounds
  const valRange = computedMax - computedMin;
  const paddingY = valRange === 0 ? 1 : valRange * 0.1;
  const yBottom = customYMin ?? (computedMin - paddingY);
  const yTop = customYMax ?? (computedMax + paddingY);
  const effectiveRange = Math.max(0.001, yTop - yBottom);

  // SVG dimensions
  const svgWidth = 600;
  const svgHeight = height;
  const padLeft = 52;
  const padRight = 24;
  const padTop = 20;
  const padBottom = 32;

  const plotWidth = svgWidth - padLeft - padRight;
  const plotHeight = svgHeight - padTop - padBottom;

  const getX = (year: number) => padLeft + ((year - minYear) / yearSpan) * plotWidth;
  const getY = (val: number) => padTop + plotHeight - ((val - yBottom) / effectiveRange) * plotHeight;

  // Horizontal grid lines (4 intervals)
  const gridTicks = [0, 0.25, 0.5, 0.75, 1].map((pct) => {
    const val = yBottom + pct * effectiveRange;
    return {
      value: val,
      y: getY(val),
    };
  });

  return (
    <div className="relative w-full bg-slate-900 border border-slate-800 rounded-lg p-4">
      {(title || subtitle) && (
        <div className="mb-3 pb-2 border-b border-slate-800/80">
          {title && <h3 className="text-sm font-semibold text-slate-100">{title}</h3>}
          {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      )}
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-auto overflow-visible select-none"
      >
        {/* Horizontal grid lines */}
        {gridTicks.map((tick, i) => (
          <g key={i}>
            <line
              x1={padLeft}
              y1={tick.y}
              x2={padLeft + plotWidth}
              y2={tick.y}
              stroke="rgba(51, 65, 85, 0.4)"
              strokeDasharray="3 3"
              strokeWidth="1"
            />
            <text
              x={padLeft - 6}
              y={tick.y + 3}
              textAnchor="end"
              className="text-[10px] fill-slate-400 font-mono tabular-nums"
            >
              {tick.value.toFixed(tick.value >= 100 ? 0 : 1)}
            </text>
          </g>
        ))}

        {/* Reference Line if any (e.g. 60% debt rule or 0% deficit) */}
        {referenceLineY !== undefined && (
          <g>
            <line
              x1={padLeft}
              y1={getY(referenceLineY)}
              x2={padLeft + plotWidth}
              y2={getY(referenceLineY)}
              stroke="rgba(239, 68, 68, 0.6)"
              strokeDasharray="4 2"
              strokeWidth="1.2"
            />
            {referenceLineLabel && (
              <text
                x={padLeft + plotWidth - 4}
                y={getY(referenceLineY) - 4}
                textAnchor="end"
                className="text-[9px] fill-rose-400 font-sans"
              >
                {referenceLineLabel}
              </text>
            )}
          </g>
        )}

        {/* X-axis year labels */}
        {allYears.map((year, i) => {
          // Only show some years if too many
          const shouldShow =
            allYears.length <= 10 ||
            i === 0 ||
            i === allYears.length - 1 ||
            year % 5 === 0;

          if (!shouldShow) return null;
          const x = getX(year);
          return (
            <g key={year}>
              <line
                x1={x}
                y1={padTop + plotHeight}
                x2={x}
                y2={padTop + plotHeight + 4}
                stroke="rgba(100, 116, 139, 0.5)"
              />
              <text
                x={x}
                y={padTop + plotHeight + 16}
                textAnchor="middle"
                className="text-[10px] fill-slate-400 font-mono tabular-nums"
              >
                {year}
              </text>
            </g>
          );
        })}

        {/* Data Series Paths */}
        {series.map((s) => {
          if (!s.data.length) return null;
          const pathD = s.data.reduce((acc, point, index) => {
            const x = getX(point.year);
            const y = getY(point.value);
            return `${acc} ${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
          }, '');

          return (
            <g key={s.id}>
              <path
                d={pathD}
                fill="none"
                stroke={s.color}
                strokeWidth={s.isDashed ? '1.5' : '2'}
                strokeDasharray={s.isDashed ? '4 3' : undefined}
                className="transition-all duration-300"
              />
              {/* Data points */}
              {s.data.map((point) => {
                const x = getX(point.year);
                const y = getY(point.value);
                const isHovered = hoveredPoint?.year === point.year && hoveredPoint?.seriesLabel === s.label;

                return (
                  <circle
                    key={`${s.id}-${point.year}`}
                    cx={x}
                    cy={y}
                    r={isHovered ? 4.5 : 2.5}
                    fill={s.color}
                    className="cursor-pointer transition-transform"
                    onMouseEnter={() =>
                      setHoveredPoint({
                        year: point.year,
                        value: point.value,
                        seriesLabel: s.label,
                        x,
                        y,
                      })
                    }
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                );
              })}
            </g>
          );
        })}
      </svg>

      {/* Hover Tooltip */}
      {hoveredPoint && (
        <div
          className="absolute pointer-events-none bg-slate-900 border border-slate-700/80 px-2 py-1 rounded text-xs shadow-lg transform -translate-x-1/2 -translate-y-8 z-20 whitespace-nowrap"
          style={{
            left: `${(hoveredPoint.x / svgWidth) * 100}%`,
            top: `${(hoveredPoint.y / svgHeight) * 100}%`,
          }}
        >
          <div className="font-mono text-[10px] text-slate-400">{hoveredPoint.year}</div>
          <div className="font-medium text-slate-100 tabular-nums">
            {hoveredPoint.seriesLabel}: {hoveredPoint.value.toFixed(2)} {unit}
          </div>
        </div>
      )}

      {/* Chart Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-2 text-xs text-slate-400">
        {series.map((s) => (
          <div key={s.id} className="flex items-center gap-1.5">
            <span
              className="inline-block w-3 h-0.5 rounded"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-[11px]">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
