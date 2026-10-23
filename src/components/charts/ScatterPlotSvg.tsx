/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Lightweight SVG Scatter Plot Component
 * مخطط الانتشار المتجهي لتحليل العلاقات الاقتصادية والتجريبية (مثل منحنى فيليبس أو قانون أوكون)
 */

import React, { useState } from 'react';

export interface ScatterPoint {
  id: string;
  x: number;
  y: number;
  label?: string;
  year?: number;
  isCurrent?: boolean;
}

interface ScatterPlotSvgProps {
  title: string;
  subtitle?: string;
  xAxisLabel: string;
  yAxisLabel: string;
  points: ScatterPoint[];
  regressionLine?: boolean;
  theoreticalCurve?: {
    formulaLabel: string;
    description: string;
  };
  height?: number;
}

export const ScatterPlotSvg: React.FC<ScatterPlotSvgProps> = ({
  title,
  subtitle,
  xAxisLabel,
  yAxisLabel,
  points,
  theoreticalCurve,
  height = 280,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<ScatterPoint | null>(null);

  if (!points || points.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex items-center justify-center text-slate-500 text-xs font-mono h-48">
        بيانات غير كافية لرسم مخطط الانتشار
      </div>
    );
  }

  // Padding
  const padLeft = 45;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 40;
  const width = 500;

  const xVals = points.map((p) => p.x);
  const yVals = points.map((p) => p.y);

  const minX = Math.min(...xVals);
  const maxX = Math.max(...xVals);
  const minY = Math.min(...yVals);
  const maxY = Math.max(...yVals);

  // Buffer range
  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;
  const domainMinX = minX - rangeX * 0.1;
  const domainMaxX = maxX + rangeX * 0.1;
  const domainMinY = minY - rangeY * 0.1;
  const domainMaxY = maxY + rangeY * 0.1;

  const scaleX = (val: number) => {
    return padLeft + ((val - domainMinX) / (domainMaxX - domainMinX)) * (width - padLeft - padRight);
  };

  const scaleY = (val: number) => {
    return height - padBottom - ((val - domainMinY) / (domainMaxY - domainMinY)) * (height - padTop - padBottom);
  };

  // Generate ticks
  const xTicks = [domainMinX, (domainMinX + domainMaxX) / 2, domainMaxX];
  const yTicks = [domainMinY, (domainMinY + domainMaxY) / 2, domainMaxY];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 sm:p-5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
          {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {theoreticalCurve && (
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded">
            {theoreticalCurve.formulaLabel}
          </span>
        )}
      </div>

      {/* SVG Canvas */}
      <div className="relative my-2 w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          {/* Grid lines */}
          {yTicks.map((tick, i) => {
            const yPos = scaleY(tick);
            return (
              <g key={`yt-${i}`}>
                <line
                  x1={padLeft}
                  y1={yPos}
                  x2={width - padRight}
                  y2={yPos}
                  stroke="#1e293b"
                  strokeDasharray="3 3"
                />
                <text
                  x={padLeft - 6}
                  y={yPos + 4}
                  textAnchor="end"
                  className="text-[9px] fill-slate-500 font-mono"
                >
                  {tick.toFixed(1)}
                </text>
              </g>
            );
          })}

          {xTicks.map((tick, i) => {
            const xPos = scaleX(tick);
            return (
              <g key={`xt-${i}`}>
                <line
                  x1={xPos}
                  y1={padTop}
                  x2={xPos}
                  y2={height - padBottom}
                  stroke="#1e293b"
                  strokeDasharray="3 3"
                />
                <text
                  x={xPos}
                  y={height - padBottom + 14}
                  textAnchor="middle"
                  className="text-[9px] fill-slate-500 font-mono"
                >
                  {tick.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Axis Labels */}
          <text
            x={width / 2}
            y={height - 6}
            textAnchor="middle"
            className="text-[10px] fill-slate-400 font-sans"
          >
            {xAxisLabel}
          </text>
          <text
            x={14}
            y={height / 2}
            textAnchor="middle"
            transform={`rotate(-90 14 ${height / 2})`}
            className="text-[10px] fill-slate-400 font-sans"
          >
            {yAxisLabel}
          </text>

          {/* Data Points */}
          {points.map((pt) => {
            const cx = scaleX(pt.x);
            const cy = scaleY(pt.y);
            const isHovered = hoveredPoint?.id === pt.id;

            return (
              <g
                key={pt.id}
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
                className="cursor-pointer"
              >
                {pt.isCurrent && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={8}
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth={1.5}
                    className="animate-pulse"
                  />
                )}
                <circle
                  cx={cx}
                  cy={cy}
                  r={pt.isCurrent ? 5 : isHovered ? 5.5 : 3.5}
                  fill={pt.isCurrent ? '#22d3ee' : isHovered ? '#38bdf8' : '#64748b'}
                  stroke="#0f172a"
                  strokeWidth={1.5}
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredPoint && (
          <div className="absolute top-2 left-2 bg-slate-800/95 border border-slate-700 p-2 rounded shadow text-xs font-mono text-slate-200">
            <div className="font-bold text-cyan-400">
              {hoveredPoint.label || `السنة: ${hoveredPoint.year}`}
              {hoveredPoint.isCurrent && ' (الحالي)'}
            </div>
            <div>
              {xAxisLabel}: {hoveredPoint.x.toFixed(2)}
            </div>
            <div>
              {yAxisLabel}: {hoveredPoint.y.toFixed(2)}
            </div>
          </div>
        )}
      </div>

      {/* Footer / Rationale */}
      {theoreticalCurve && (
        <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
          <span className="text-slate-500 font-semibold">التفسير الاقتصادي: </span>
          {theoreticalCurve.description}
        </div>
      )}
    </div>
  );
};
