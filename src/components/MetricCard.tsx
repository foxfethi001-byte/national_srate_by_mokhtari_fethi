/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Metric Card with Glassmorphism, Tabular Numbers & Visual State Threshold Dots
 * بطاقة عرض المؤشرات بتصميم زجاجي عصري، أرقام جدولية، ونقاط مؤشرات الحالة المرئية
 */

import React from 'react';
import { ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import { ConfidenceLevel } from '../types/simulation';

export type IndicatorThresholdStatus = 'normal' | 'warning' | 'critical';

interface MetricCardProps {
  label: string;
  value: number;
  unit: string;
  previousValue?: number;
  baselineValue?: number;
  decimals?: number;
  confidence?: ConfidenceLevel;
  invertColor?: boolean; // When lower is better (e.g. unemployment, debt, inflation, tension)
  status?: IndicatorThresholdStatus;
  statusTooltip?: string;
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
  status,
  statusTooltip,
  onClickInspect,
}) => {
  const deltaFromPrevious = previousValue !== undefined ? value - previousValue : 0;
  const isNeutral = Math.abs(deltaFromPrevious) < 0.05;
  const isPositive = deltaFromPrevious > 0;

  // Good or bad depending on metric nature
  const isGood = invertColor ? !isPositive : isPositive;

  // Calculate default threshold status if not explicitly provided
  const effectiveStatus: IndicatorThresholdStatus = status || (() => {
    if (previousValue === undefined) return 'normal';
    if (isNeutral || isGood) return 'normal';
    const pctDivergence = Math.abs(deltaFromPrevious / (Math.abs(previousValue) || 1));
    if (pctDivergence > 0.15) return 'critical';
    return 'warning';
  })();

  const statusConfig = {
    normal: {
      dotColor: 'bg-emerald-400',
      glowRing: 'ring-emerald-500/25 shadow-[0_0_8px_rgba(52,211,153,0.6)]',
      pingColor: 'bg-emerald-400',
      label: 'ضمن النطاق الآمن المستهدف | Within expected threshold',
    },
    warning: {
      dotColor: 'bg-amber-400',
      glowRing: 'ring-amber-500/30 shadow-[0_0_8px_rgba(251,191,36,0.6)]',
      pingColor: 'bg-amber-400',
      label: 'تحذير: يقترب من حد الاستقرار | Warning: Approaching threshold',
    },
    critical: {
      dotColor: 'bg-rose-500',
      glowRing: 'ring-rose-500/35 shadow-[0_0_10px_rgba(244,63,94,0.7)]',
      pingColor: 'bg-rose-500',
      label: 'حرج: تجاوز العتبة الآمنة | Critical: Threshold breached',
    },
  }[effectiveStatus];

  return (
    <div
      onClick={onClickInspect}
      className={`group relative glass-card rounded-xl p-3.5 sm:p-4 transition-all duration-200 border border-slate-800/80 hover:border-cyan-500/40 hover:shadow-[0_4px_20px_rgba(6,182,212,0.12)] ${
        onClickInspect ? 'cursor-pointer' : ''
      }`}
    >
      {/* Top Header: Indicator Status Dot + Label + Inspect Trigger */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          {/* Visual State Indicator (Color-Coded Status Dot) */}
          <span
            className="relative flex h-2 w-2 shrink-0 cursor-help"
            title={statusTooltip || statusConfig.label}
          >
            {effectiveStatus !== 'normal' && (
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${statusConfig.pingColor}`}></span>
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ring-2 ${statusConfig.dotColor} ${statusConfig.glowRing}`}></span>
          </span>
          <span className="text-xs text-slate-300 font-medium truncate">{label}</span>
        </div>

        {onClickInspect && (
          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-cyan-400 shrink-0">
            <Info className="w-3.5 h-3.5" />
          </span>
        )}
      </div>

      {/* Main Value and Trend Delta */}
      <div className="flex items-baseline justify-between gap-2 mt-1">
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums tracking-tight">
            {value.toFixed(decimals)}
          </span>
          <span className="text-xs text-slate-400 font-sans">{unit}</span>
        </div>

        {/* Delta from previous year */}
        {previousValue !== undefined && !isNeutral && (
          <div
            className={`flex items-center gap-0.5 text-xs font-mono tabular-nums font-semibold ${
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
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>الأساس: {baselineValue.toFixed(decimals)} {unit}</span>
          <span className={`tabular-nums font-medium ${
            value === baselineValue
              ? 'text-slate-400'
              : (invertColor ? value < baselineValue : value > baselineValue)
              ? 'text-emerald-400'
              : 'text-amber-400'
          }`}>
            {value >= baselineValue ? '+' : ''}
            {(value - baselineValue).toFixed(decimals)}
          </span>
        </div>
      )}
    </div>
  );
};
