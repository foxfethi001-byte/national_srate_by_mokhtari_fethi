/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Metric Card with Tabular Numbers and Causal Inspection Link
 * بطاقة عرض المؤشرات مع الأرقام الجدلية ورابط الفحص السببي
 */

import React from 'react';
import { ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import { ConfidenceLevel } from '../types/simulation';

interface MetricCardProps {
  label: string;
  value: number;
  unit: string;
  previousValue?: number;
  baselineValue?: number;
  decimals?: number;
  confidence?: ConfidenceLevel;
  invertColor?: boolean; // When lower is better (e.g. unemployment, debt, inflation, tension)
  onClickInspect?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  previousValue,
  baselineValue,
  decimals = 1,
  confidence,
  invertColor = false,
  onClickInspect,
}) => {
  const deltaFromPrevious = previousValue !== undefined ? value - previousValue : 0;
  const isNeutral = Math.abs(deltaFromPrevious) < 0.05;
  const isPositive = deltaFromPrevious > 0;

  // Good or bad depending on metric nature
  const isGood = invertColor ? !isPositive : isPositive;

  return (
    <div
      onClick={onClickInspect}
      className={`group relative bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg p-3.5 transition-all ${
        onClickInspect ? 'cursor-pointer hover:bg-slate-850' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <span className="text-xs text-slate-400 font-medium line-clamp-1">{label}</span>
        {onClickInspect && (
          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-cyan-400">
            <Info className="w-3.5 h-3.5" />
          </span>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold font-mono text-slate-100 tabular-nums">
            {value.toFixed(decimals)}
          </span>
          <span className="text-xs text-slate-400 font-sans">{unit}</span>
        </div>

        {/* Delta from previous year */}
        {previousValue !== undefined && !isNeutral && (
          <div
            className={`flex items-center text-xs font-mono tabular-nums ${
              isGood ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5" />
            )}
            <span>{Math.abs(deltaFromPrevious).toFixed(decimals)}</span>
          </div>
        )}
      </div>

      {/* Baseline comparison if present */}
      {baselineValue !== undefined && (
        <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>الأساس: {baselineValue.toFixed(decimals)} {unit}</span>
          <span className="tabular-nums">
            {value >= baselineValue ? '+' : ''}
            {(value - baselineValue).toFixed(decimals)}
          </span>
        </div>
      )}
    </div>
  );
};
