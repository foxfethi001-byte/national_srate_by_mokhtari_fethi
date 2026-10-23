/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Time Controls & Horizon Simulator (Phase 3 Visual Control Center)
 * شريط التحكم الزمني وسرعة المحاكاة والقفز للأفق المستقبلي
 */

import React, { useState } from 'react';
import { Play, Pause, FastForward, RotateCcw, Calendar, ChevronsRight } from 'lucide-react';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { SimulatedDate, TimeStepUnit } from '../types/simulation';
import { TimeEngine } from '../simulation/timeEngine';

interface TimeControlsProps {
  currentDate: SimulatedDate;
  currentYear: number;
  startYear: number;
  maxHorizonYear: number;
  timeStep: TimeStepUnit;
  onToggleTimeStep: (step: TimeStepUnit) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onFastJumpYears?: (yearsToAdd: number) => void;
  onReset: () => void;
  speedMultiplier: number;
  onChangeSpeed: (multiplier: number) => void;
  scenarioName: string;
  lang: Language;
}

export const TimeControls: React.FC<TimeControlsProps> = ({
  currentDate,
  currentYear,
  startYear,
  maxHorizonYear,
  timeStep,
  onToggleTimeStep,
  isPlaying,
  onTogglePlay,
  onStepForward,
  onFastJumpYears,
  onReset,
  speedMultiplier,
  onChangeSpeed,
  scenarioName,
  lang,
}) => {
  const t = TRANSLATIONS[lang];
  const elapsedYears = currentYear - startYear;
  const progressPct = Math.min(100, Math.max(0, (elapsedYears / (maxHorizonYear - startYear)) * 100));

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Scenario and Simulated Date Status */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">{t.scenarioActive}</span>
            <span className="text-xs font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded">
              {scenarioName}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-xs text-slate-400">{lang === 'ar' ? 'التاريخ المحاكى:' : 'Simulated Date:'}</span>
            <span className="text-2xl font-bold font-mono text-white tabular-nums tracking-tight">
              {TimeEngine.formatDate(currentDate, lang)}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              (+{elapsedYears} {t.units.years})
            </span>
          </div>

          {/* Time Step Mode Toggle */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-800 border border-slate-700 rounded p-0.5 text-[11px] font-mono">
            <button
              onClick={() => onToggleTimeStep('annual')}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                timeStep === 'annual'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              سنوي
            </button>
            <button
              onClick={() => onToggleTimeStep('quarterly')}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                timeStep === 'quarterly'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              فصلي
            </button>
          </div>
        </div>

        {/* Progress Timeline bar */}
        <div className="hidden lg:flex flex-col gap-1 w-full max-w-xs">
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>{startYear} (الأساس)</span>
            <span>{maxHorizonYear} (الأفق الأقصى)</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-500 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {/* Step Button */}
          <button
            onClick={onStepForward}
            disabled={isPlaying || currentYear >= maxHorizonYear}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700 rounded transition-colors cursor-pointer"
            title="تقدم خطوة زمنية واحدة محددة"
          >
            <FastForward className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.stepForwardYear}</span>
          </button>

          {/* Jump Ahead Buttons */}
          {onFastJumpYears && (
            <div className="hidden sm:flex items-center bg-slate-800 border border-slate-700 rounded p-0.5 text-[11px] font-mono">
              <button
                onClick={() => onFastJumpYears(5)}
                disabled={isPlaying || currentYear >= maxHorizonYear}
                className="px-1.5 py-0.5 text-slate-300 hover:text-cyan-300 disabled:opacity-40 cursor-pointer"
                title="قفز إلى الأمام 5 سنوات"
              >
                +5
              </button>
              <button
                onClick={() => onFastJumpYears(10)}
                disabled={isPlaying || currentYear >= maxHorizonYear}
                className="px-1.5 py-0.5 text-slate-300 hover:text-cyan-300 disabled:opacity-40 cursor-pointer"
                title="قفز إلى الأمام 10 سنوات"
              >
                +10
              </button>
            </div>
          )}

          {/* Play/Pause Button */}
          <button
            onClick={onTogglePlay}
            disabled={currentYear >= maxHorizonYear}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>{t.pauseSimulation}</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>{t.playSimulation}</span>
              </>
            )}
          </button>

          {/* Speed Toggle */}
          <div className="flex items-center bg-slate-800 border border-slate-700 rounded p-0.5 text-[11px] font-mono">
            {[1, 2, 5, 10].map((spd) => (
              <button
                key={spd}
                onClick={() => onChangeSpeed(spd)}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  speedMultiplier === spd
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Reset to Start */}
          <button
            onClick={onReset}
            title={t.resetToBaseline}
            className="p-1.5 text-slate-400 hover:text-slate-100 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
