/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Scenario Manager & Trajectory Diff Explorer
 * مقارنة السيناريوهات المتعددة والفوارق التراكمية في المؤشرات
 */

import React, { useState } from 'react';
import { Scenario, SimulationState } from '../types/simulation';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { LineChartSvg } from './charts/LineChartSvg';
import { BookmarkPlus, GitCompare, Trash2 } from 'lucide-react';

interface ScenarioComparisonViewProps {
  currentScenario: Scenario;
  savedScenarios: Scenario[];
  onSaveCurrentScenario: (name: string, description: string) => void;
  onDeleteScenario: (id: string) => void;
  lang: Language;
}

export const ScenarioComparisonView: React.FC<ScenarioComparisonViewProps> = ({
  currentScenario,
  savedScenarios,
  onSaveCurrentScenario,
  onDeleteScenario,
  lang,
}) => {
  const t = TRANSLATIONS[lang];
  const [newScenarioName, setNewScenarioName] = useState('');
  const [compareScenarioId, setCompareScenarioId] = useState<string>(
    savedScenarios[0]?.id || ''
  );

  const comparedScenario = savedScenarios.find((s) => s.id === compareScenarioId);

  const handleSave = () => {
    if (!newScenarioName.trim()) return;
    onSaveCurrentScenario(newScenarioName.trim(), 'سيناريو بديل مخصص');
    setNewScenarioName('');
  };

  // Compare metrics at latest common year
  const currentLatest = currentScenario.history[currentScenario.history.length - 1];
  const comparedLatest = comparedScenario?.history[comparedScenario.history.length - 1];

  const metricsToCompare: {
    key: string;
    label: string;
    unit: string;
    getCurrent: (s: SimulationState) => number;
  }[] = [
    { key: 'realGdp', label: t.metrics.realGdp, unit: '$B', getCurrent: (s) => s.macro.realGdp },
    { key: 'growth', label: t.metrics.realGdpGrowthRate, unit: '%', getCurrent: (s) => s.macro.realGdpGrowthRate },
    { key: 'debtRatio', label: t.metrics.debtToGdpRatio, unit: '%', getCurrent: (s) => s.macro.debtToGdpRatio },
    { key: 'unemployment', label: t.metrics.unemploymentRate, unit: '%', getCurrent: (s) => s.demographics.unemploymentRate },
    { key: 'inflation', label: t.metrics.inflationRate, unit: '%', getCurrent: (s) => s.macro.inflationRate },
    { key: 'gini', label: t.metrics.giniCoefficient, unit: 'pts', getCurrent: (s) => s.governance.giniCoefficient },
    { key: 'co2', label: t.metrics.annualCo2EmissionsMt, unit: 'Mt', getCurrent: (s) => s.energy.annualCo2EmissionsMt },
    { key: 'tension', label: t.metrics.socialTensionIndex, unit: 'pts', getCurrent: (s) => s.governance.socialTensionIndex },
  ];

  // Chart series comparing Current vs Selected Scenario
  const gdpComparisonSeries = [
    {
      id: 'current_gdp',
      label: `${currentScenario.nameAr} (النشط)`,
      color: '#38bdf8',
      data: currentScenario.history.map((s) => ({ year: s.year, value: s.macro.realGdp })),
    },
    ...(comparedScenario
      ? [
          {
            id: 'compare_gdp',
            label: comparedScenario.nameAr,
            color: '#f59e0b',
            data: comparedScenario.history.map((s) => ({ year: s.year, value: s.macro.realGdp })),
            isDashed: true,
          },
        ]
      : []),
  ];

  const debtComparisonSeries = [
    {
      id: 'current_debt',
      label: `${currentScenario.nameAr} (النشط)`,
      color: '#f87171',
      data: currentScenario.history.map((s) => ({ year: s.year, value: s.macro.debtToGdpRatio })),
    },
    ...(comparedScenario
      ? [
          {
            id: 'compare_debt',
            label: comparedScenario.nameAr,
            color: '#34d399',
            data: comparedScenario.history.map((s) => ({ year: s.year, value: s.macro.debtToGdpRatio })),
            isDashed: true,
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      {/* Header and Save Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-cyan-400" />
            <span>{t.scenarios.title}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{t.scenarios.subtitle}</p>
        </div>

        {/* Save Scenario Form */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder={t.scenarios.scenarioNamePlaceholder}
            value={newScenarioName}
            onChange={(e) => setNewScenarioName(e.target.value)}
            className="bg-slate-800 text-slate-200 text-xs px-3 py-1.5 rounded border border-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500 w-full sm:w-64"
          />
          <button
            onClick={handleSave}
            disabled={!newScenarioName.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors whitespace-nowrap cursor-pointer"
          >
            <BookmarkPlus className="w-3.5 h-3.5" />
            <span>حفظ</span>
          </button>
        </div>
      </div>

      {/* Comparison Selector */}
      {savedScenarios.length > 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">{t.scenarios.compareWith}</span>
              <select
                value={compareScenarioId}
                onChange={(e) => setCompareScenarioId(e.target.value)}
                className="bg-slate-800 text-slate-200 text-xs border border-slate-700 rounded px-2.5 py-1.5"
              >
                {savedScenarios.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nameAr} ({s.currentYear})
                  </option>
                ))}
              </select>
            </div>

            {comparedScenario && (
              <button
                onClick={() => onDeleteScenario(comparedScenario.id)}
                className="p-1.5 text-slate-500 hover:text-rose-400 rounded transition-colors"
                title="حذف هذا السيناريو"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Comparison Table */}
          {comparedLatest && (
            <div className="overflow-x-auto border border-slate-800 rounded-lg">
              <table className="w-full text-xs text-right rtl:text-right ltr:text-left">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">المؤشر</th>
                    <th className="p-3 font-mono">{currentScenario.nameAr} (سنة {currentLatest.year})</th>
                    <th className="p-3 font-mono">{comparedScenario.nameAr} (سنة {comparedLatest.year})</th>
                    <th className="p-3 font-mono">الفارق الصافي (&Delta;)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono text-slate-200">
                  {metricsToCompare.map((m) => {
                    const valCurr = m.getCurrent(currentLatest);
                    const valComp = m.getCurrent(comparedLatest);
                    const diff = Math.round((valCurr - valComp) * 10) / 10;
                    return (
                      <tr key={m.key} className="hover:bg-slate-800/40">
                        <td className="p-3 font-sans text-slate-300">{m.label}</td>
                        <td className="p-3 tabular-nums font-semibold">{valCurr} {m.unit}</td>
                        <td className="p-3 tabular-nums text-slate-400">{valComp} {m.unit}</td>
                        <td
                          className={`p-3 tabular-nums font-bold ${
                            diff === 0
                              ? 'text-slate-500'
                              : diff > 0
                              ? 'text-cyan-400'
                              : 'text-amber-400'
                          }`}
                        >
                          {diff > 0 ? '+' : ''}{diff} {m.unit}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Comparative Line Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
              <h4 className="text-xs font-semibold text-slate-300 mb-2">
                مقارنة الناتج المحلي الحقيقي ($B)
              </h4>
              <LineChartSvg series={gdpComparisonSeries} unit="$B" height={180} />
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
              <h4 className="text-xs font-semibold text-slate-300 mb-2">
                مقارنة نسبة الدين العام إلى الناتج (%)
              </h4>
              <LineChartSvg series={debtComparisonSeries} unit="%" height={180} />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 text-center text-xs text-slate-400 space-y-2">
          <p>{t.scenarios.noAlternativeScenarios}</p>
        </div>
      )}
    </div>
  );
};
