/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Interactive Timeline & Historical Snapshot Scrubber
 * شريط تتبع السجل الزمني والتنقل بين اللقطات التاريخية والمحطات
 */

import React, { useState } from 'react';
import { SimulationState, PolicyAuditEntry } from '../../types/simulation';
import { TimeEngine } from '../../simulation/timeEngine';
import { Language } from '../../i18n/translations';
import { History, Bookmark, FastForward, Play, Pause, RotateCcw } from 'lucide-react';

interface TimelineScrubberProps {
  history: SimulationState[];
  currentYear: number;
  startYear: number;
  maxHorizonYear: number;
  auditLog?: PolicyAuditEntry[];
  onSelectSnapshotYear: (year: number) => void;
  onRestoreSnapshotState: (state: SimulationState) => void;
  onBranchNewScenarioFromYear?: (year: number) => void;
  lang: Language;
}

export const TimelineScrubber: React.FC<TimelineScrubberProps> = ({
  history,
  currentYear,
  startYear,
  maxHorizonYear,
  auditLog = [],
  onSelectSnapshotYear,
  onRestoreSnapshotState,
  onBranchNewScenarioFromYear,
  lang,
}) => {
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  const availableYears = history.map((s) => s.year);
  const minYear = startYear;
  const maxYear = Math.max(startYear, ...availableYears);

  // Find policies changed in each year
  const getAuditEntriesForYear = (yr: number) => {
    return auditLog.filter((a) => a.simulatedYear === yr);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 sm:p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-100">
            {lang === 'ar' ? 'مسار السلسلة الزمنية واستعراض اللقطات المحفوظة' : 'Simulation Timeline & Snapshot History'}
          </h3>
        </div>
        <div className="text-xs font-mono text-slate-400">
          <span>{lang === 'ar' ? 'اللقطات المخزنة:' : 'Snapshots:'} </span>
          <span className="text-cyan-400 font-bold">{history.length}</span> / {maxHorizonYear - startYear + 1}
        </div>
      </div>

      {/* Scrubber Track & Markers */}
      <div className="my-5 px-3">
        <div className="relative">
          {/* Base track */}
          <div className="h-2 w-full bg-slate-800 rounded-full relative">
            {/* Simulated progress span */}
            <div
              className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full"
              style={{
                width: `${maxHorizonYear > startYear ? ((maxYear - startYear) / (maxHorizonYear - startYear)) * 100 : 0}%`,
              }}
            />
          </div>

          {/* Year ticks and milestones */}
          <div className="relative h-9 mt-2 flex items-center justify-between">
            {history.map((snapshot) => {
              const yr = snapshot.year;
              const pct = maxHorizonYear > startYear ? ((yr - startYear) / (maxHorizonYear - startYear)) * 100 : 0;
              const isSelected = yr === currentYear;
              const audits = getAuditEntriesForYear(yr);
              const hasPolicyChange = audits.length > 0;

              return (
                <button
                  key={yr}
                  onClick={() => onSelectSnapshotYear(yr)}
                  onMouseEnter={() => setHoveredYear(yr)}
                  onMouseLeave={() => setHoveredYear(null)}
                  title={`${lang === 'ar' ? 'السنة' : 'Year'} ${yr}${hasPolicyChange ? ` (${audits.length} ${lang === 'ar' ? 'تعديل سياسات' : 'policy changes'})` : ''}`}
                  className="absolute -top-3.5 -translate-x-1/2 flex flex-col items-center group cursor-pointer focus:outline-none"
                  style={{ left: `${pct}%` }}
                >
                  {/* Pin Dot */}
                  <div
                    className={`w-3.5 h-3.5 rounded-full border-2 transition-all flex items-center justify-center ${
                      isSelected
                        ? 'bg-cyan-400 border-white scale-125 shadow-lg shadow-cyan-500/50'
                        : hasPolicyChange
                        ? 'bg-amber-400 border-slate-900 group-hover:scale-110'
                        : 'bg-slate-700 border-slate-900 group-hover:bg-cyan-500'
                    }`}
                  >
                    {hasPolicyChange && <span className="w-1 h-1 bg-black rounded-full" />}
                  </div>

                  {/* Year Label */}
                  <span
                    className={`text-[10px] font-mono mt-1 transition-colors ${
                      isSelected
                        ? 'text-cyan-300 font-bold'
                        : 'text-slate-500 group-hover:text-slate-300'
                    }`}
                  >
                    {yr}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Snapshot Inspector / Restorer */}
      {hoveredYear !== null || currentYear ? (
        <div className="bg-slate-950 border border-slate-800 rounded p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <Bookmark className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <div className="font-semibold text-slate-200">
                {lang === 'ar' ? 'اللقطة المحددة:' : 'Inspected Year:'}{' '}
                <span className="font-mono text-cyan-400 font-bold">{hoveredYear || currentYear}</span>
              </div>
              <div className="text-[11px] text-slate-400">
                {getAuditEntriesForYear(hoveredYear || currentYear).length > 0 ? (
                  <span className="text-amber-400">
                    {lang === 'ar'
                      ? `تم تطبيق ${getAuditEntriesForYear(hoveredYear || currentYear).length} قرار سياساتي في هذا العام`
                      : `${getAuditEntriesForYear(hoveredYear || currentYear).length} policy changes applied this year`}
                  </span>
                ) : (
                  <span>{lang === 'ar' ? 'حالة اقتصادية ومالية مخزنة دون تعديلات سياسات إضافية' : 'Stored state without policy changes'}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* If inspected is not current, allow restore or branch */}
            {hoveredYear && hoveredYear !== currentYear && (
              <button
                onClick={() => {
                  const targetState = history.find((s) => s.year === hoveredYear);
                  if (targetState) {
                    onRestoreSnapshotState(targetState);
                  }
                }}
                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded transition-colors cursor-pointer text-xs flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? `استعادة لقطة ${hoveredYear}` : `Restore Year ${hoveredYear}`}</span>
              </button>
            )}

            {onBranchNewScenarioFromYear && (
              <button
                onClick={() => onBranchNewScenarioFromYear(hoveredYear || currentYear)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded transition-colors cursor-pointer text-xs"
              >
                {lang === 'ar' ? 'تفريغ مسار جديد (Branch)' : 'Branch Scenario'}
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
