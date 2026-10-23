/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Lightweight SVG Heatmap Matrix Component
 * مصفوفة الخريطة الحرارية لمقارنة الأقاليم والقطاعات التنموية
 */

import React, { useState } from 'react';

export interface HeatmapRow {
  id: string;
  label: string;
  values: {
    columnId: string;
    value: number;
    formatted: string;
    normalizedScore: number; // 0 to 1 scale for color intensity
    isAlert?: boolean;
  }[];
}

export interface HeatmapColumn {
  id: string;
  label: string;
  unit?: string;
  higherIsBetter?: boolean;
}

interface HeatmapSvgProps {
  title: string;
  subtitle?: string;
  columns: HeatmapColumn[];
  rows: HeatmapRow[];
}

export const HeatmapSvg: React.FC<HeatmapSvgProps> = ({
  title,
  subtitle,
  columns,
  rows,
}) => {
  const [hoveredCell, setHoveredCell] = useState<{
    rowLabel: string;
    colLabel: string;
    valStr: string;
  } | null>(null);

  // Color generator based on normalized intensity
  const getCellBgColor = (score: number, isAlert?: boolean) => {
    if (isAlert) return 'rgba(239, 68, 68, 0.35)'; // red alert
    // Cyan to blue gradient scale
    const alpha = Math.min(0.9, Math.max(0.12, score * 0.85));
    return `rgba(6, 182, 212, ${alpha})`;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 sm:p-5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
          {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
          <span>أقل</span>
          <div className="w-16 h-2 rounded bg-gradient-to-r from-cyan-950 via-cyan-700 to-cyan-400" />
          <span>أعلى كفاءة</span>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="overflow-x-auto my-3">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-right py-2 px-3 text-slate-400 font-semibold">الإقليم / المؤشر</th>
              {columns.map((col) => (
                <th key={col.id} className="text-center py-2 px-3 text-slate-300 font-medium">
                  <div>{col.label}</div>
                  {col.unit && <div className="text-[10px] text-slate-500 font-mono">({col.unit})</div>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-2.5 px-3 font-sans font-medium text-slate-200 whitespace-nowrap">
                  {row.label}
                </td>
                {row.values.map((val) => {
                  const colObj = columns.find((c) => c.id === val.columnId);
                  return (
                    <td
                      key={val.columnId}
                      onMouseEnter={() =>
                        setHoveredCell({
                          rowLabel: row.label,
                          colLabel: colObj?.label || val.columnId,
                          valStr: val.formatted,
                        })
                      }
                      onMouseLeave={() => setHoveredCell(null)}
                      className="py-2 px-2 text-center transition-all cursor-pointer"
                    >
                      <div
                        className="py-1.5 px-2 rounded font-semibold text-[11px] tabular-nums border border-slate-700/40 text-white"
                        style={{
                          backgroundColor: getCellBgColor(val.normalizedScore, val.isAlert),
                        }}
                      >
                        {val.formatted}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tooltip / Status strip */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        {hoveredCell ? (
          <span className="font-mono text-cyan-300">
            {hoveredCell.rowLabel} &gt; {hoveredCell.colLabel}: <strong className="text-white">{hoveredCell.valStr}</strong>
          </span>
        ) : (
          <span className="text-[10px] text-slate-500">
            مرر المؤشر فوق أي خلية لعرض القيمة الدقيقة ومقارنة الفجوات الإقليمية
          </span>
        )}
      </div>
    </div>
  );
};
