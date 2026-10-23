/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Timeline & Historical Indicators View (Phase 3)
 * مركز إدارة السلسلة الزمنية والتنقل بين اللقطات التاريخية واستعادة المحطات وتفريغ السيناريوهات
 */

import React, { useState } from 'react';
import {
  SimulationState,
  PolicyAuditEntry,
  SimulationCheckpoint,
  Scenario,
} from '../types/simulation';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { TimelineScrubber } from './charts/TimelineScrubber';
import { LineChartSvg } from './charts/LineChartSvg';
import {
  History,
  RotateCcw,
  GitBranch,
  Bookmark,
  Calendar,
  AlertCircle,
  Clock,
  Eye,
  CheckCircle,
} from 'lucide-react';

interface HistoricalTimelineViewProps {
  history: SimulationState[];
  currentYear: number;
  startYear: number;
  maxHorizonYear: number;
  auditLog: PolicyAuditEntry[];
  checkpoints: SimulationCheckpoint[];
  onRestoreSnapshotState: (state: SimulationState) => void;
  onRestoreCheckpoint: (checkpoint: SimulationCheckpoint) => void;
  onBranchNewScenario: (name: string, fromYear: number) => void;
  lang: Language;
}

export const HistoricalTimelineView: React.FC<HistoricalTimelineViewProps> = ({
  history,
  currentYear,
  startYear,
  maxHorizonYear,
  auditLog,
  checkpoints,
  onRestoreSnapshotState,
  onRestoreCheckpoint,
  onBranchNewScenario,
  lang,
}) => {
  const t = TRANSLATIONS[lang];
  const [selectedSnapshotYear, setSelectedSnapshotYear] = useState<number>(currentYear);
  const [branchNameInput, setBranchNameInput] = useState<string>('');
  const [showBranchDialog, setShowBranchDialog] = useState<boolean>(false);

  const selectedSnapshot = history.find((s) => s.year === selectedSnapshotYear) || history[history.length - 1];
  const currentState = history[history.length - 1];

  // Calculate delta between selected snapshot and current active state
  const isSelectedCurrent = selectedSnapshot.year === currentState.year;
  const deltaGdp = selectedSnapshot.macro.realGdp - currentState.macro.realGdp;
  const deltaDebt = selectedSnapshot.macro.debtToGdpRatio - currentState.macro.debtToGdpRatio;
  const deltaInflation = selectedSnapshot.macro.inflationRate - currentState.macro.inflationRate;
  const deltaUnemployment = selectedSnapshot.demographics.unemploymentRate - currentState.demographics.unemploymentRate;

  // Filter audit log for the selected snapshot year
  const snapshotAudits = auditLog.filter((a) => a.simulatedYear === selectedSnapshot.year);

  const handleBranchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchNameInput.trim()) return;
    onBranchNewScenario(branchNameInput.trim(), selectedSnapshotYear);
    setBranchNameInput('');
    setShowBranchDialog(false);
  };

  return (
    <div className="space-y-6">
      {/* Interactive Timeline Scrubber Component */}
      <TimelineScrubber
        history={history}
        currentYear={selectedSnapshotYear}
        startYear={startYear}
        maxHorizonYear={maxHorizonYear}
        auditLog={auditLog}
        onSelectSnapshotYear={setSelectedSnapshotYear}
        onRestoreSnapshotState={onRestoreSnapshotState}
        onBranchNewScenarioFromYear={(yr) => {
          setSelectedSnapshotYear(yr);
          setBranchNameInput(`مسار بديل مفرغ من سنة ${yr}`);
          setShowBranchDialog(true);
        }}
        lang={lang}
      />

      {/* Snapshot Inspection & Comparison Deck */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>
                فحص تفاصيل اللقطة التاريخية لسنة <span className="font-mono text-cyan-400 text-base">{selectedSnapshot.year}</span>
                {isSelectedCurrent && <span className="text-xs text-emerald-400 mr-2">(السنة الحالية للنموذج)</span>}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              استعراض المؤشرات كما سجلت في الذاكرة دون أي تلاعب أو خصم تراجعي وهمي.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isSelectedCurrent && (
              <button
                onClick={() => onRestoreSnapshotState(selectedSnapshot)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded text-xs transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>استعادة هذه السنة كنقطة انطلاق</span>
              </button>
            )}

            <button
              onClick={() => {
                setBranchNameInput(`سيناريو بديل بدءاً من ${selectedSnapshot.year}`);
                setShowBranchDialog(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs transition-colors cursor-pointer"
            >
              <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
              <span>تفريغ سيناريو جديد</span>
            </button>
          </div>
        </div>

        {/* Branching Dialog Modal */}
        {showBranchDialog && (
          <div className="my-4 p-4 bg-slate-950 border border-cyan-800/80 rounded-lg text-xs">
            <form onSubmit={handleBranchSubmit} className="space-y-3">
              <div className="font-semibold text-slate-200 flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-cyan-400" />
                <span>تفريغ مسار جديد (Scenario Branching)</span>
              </div>
              <p className="text-slate-400">
                سيتم استنساخ حالة النموذج كاملة من سنة {selectedSnapshot.year} مع الاحتفاظ بالسلسلة التاريخية حتى ذلك العام، ليتسنى لك تجربة سياسات بديلة من تلك النقطة الزمنية.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={branchNameInput}
                  onChange={(e) => setBranchNameInput(e.target.value)}
                  placeholder="اسم السيناريو الجديد..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-medium cursor-pointer"
                >
                  إنشاء المسار
                </button>
                <button
                  type="button"
                  onClick={() => setShowBranchDialog(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Snapshot Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          <div className="bg-slate-950 p-3 rounded border border-slate-800">
            <span className="text-[11px] text-slate-400 block">الناتج الحقيقي المسجل</span>
            <span className="text-lg font-bold font-mono text-white mt-1 block">
              ${selectedSnapshot.macro.realGdp.toFixed(1)}B
            </span>
            {!isSelectedCurrent && (
              <span className={`text-[10px] font-mono ${deltaGdp >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                فارق عن الحالي: {deltaGdp > 0 ? `+${deltaGdp.toFixed(1)}` : deltaGdp.toFixed(1)}B
              </span>
            )}
          </div>

          <div className="bg-slate-950 p-3 rounded border border-slate-800">
            <span className="text-[11px] text-slate-400 block">نسبة الدين العام</span>
            <span className="text-lg font-bold font-mono text-white mt-1 block">
              {selectedSnapshot.macro.debtToGdpRatio.toFixed(1)}%
            </span>
            {!isSelectedCurrent && (
              <span className={`text-[10px] font-mono ${deltaDebt <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                فارق عن الحالي: {deltaDebt > 0 ? `+${deltaDebt.toFixed(1)}%` : `${deltaDebt.toFixed(1)}%`}
              </span>
            )}
          </div>

          <div className="bg-slate-950 p-3 rounded border border-slate-800">
            <span className="text-[11px] text-slate-400 block">معدل التضخم</span>
            <span className="text-lg font-bold font-mono text-white mt-1 block">
              {selectedSnapshot.macro.inflationRate.toFixed(1)}%
            </span>
            {!isSelectedCurrent && (
              <span className={`text-[10px] font-mono ${deltaInflation <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                فارق عن الحالي: {deltaInflation > 0 ? `+${deltaInflation.toFixed(1)}%` : `${deltaInflation.toFixed(1)}%`}
              </span>
            )}
          </div>

          <div className="bg-slate-950 p-3 rounded border border-slate-800">
            <span className="text-[11px] text-slate-400 block">معدل البطالة</span>
            <span className="text-lg font-bold font-mono text-white mt-1 block">
              {selectedSnapshot.demographics.unemploymentRate.toFixed(1)}%
            </span>
            {!isSelectedCurrent && (
              <span className={`text-[10px] font-mono ${deltaUnemployment <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                فارق عن الحالي: {deltaUnemployment > 0 ? `+${deltaUnemployment.toFixed(1)}%` : `${deltaUnemployment.toFixed(1)}%`}
              </span>
            )}
          </div>
        </div>

        {/* Audited Policy Changes at this Snapshot */}
        <div className="pt-3 border-t border-slate-800">
          <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>سجل قرارات السياسات المطبقة في سنة {selectedSnapshot.year}</span>
          </h4>
          {snapshotAudits.length > 0 ? (
            <div className="space-y-2">
              {snapshotAudits.map((audit) => (
                <div
                  key={audit.id}
                  className="bg-slate-950 p-2.5 rounded border border-slate-800/80 flex items-center justify-between text-xs font-mono"
                >
                  <div>
                    <span className="font-semibold text-slate-200">{audit.labelAr}</span>
                    <span className="text-slate-400 mr-2">
                      ({audit.previousValue} &rarr; {audit.newValue})
                    </span>
                  </div>
                  <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                    تم التطبيق: {audit.timestamp.substring(11, 19)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 font-mono">
              لم تسجل أي تعديلات سياسات مخصصة في هذا العام المحدد؛ استمر الاقتصاد وفق السياسات السابقة.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
