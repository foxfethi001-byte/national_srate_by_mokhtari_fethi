/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Risk & Early-Warning Center (Phase 5 Full Implementation)
 * مركز رصد المخاطر السيادية ونظام الإنذار المبكر لـ 10 مؤشرات هيكلية مع عتبات قابلة للتهيئة
 */

import React, { useState } from 'react';
import { SimulationState } from '../types/simulation';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { evaluateEarlyWarnings, CustomThresholds } from '../simulation/earlyWarningSystem';
import { ExplainerBubble } from './common/ExplainerBubble';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Activity,
  Flame,
  Zap,
  Sliders,
  RotateCcw,
  Building2,
  Scale,
  Users,
  Info,
} from 'lucide-react';

interface RiskCenterViewProps {
  currentState: SimulationState;
  previousState?: SimulationState;
  history: SimulationState[];
  lang: Language;
  onNavigateToPolicies?: () => void;
  onNavigateToShocks?: () => void;
}

export const RiskCenterView: React.FC<RiskCenterViewProps> = ({
  currentState,
  history,
  lang,
  onNavigateToPolicies,
  onNavigateToShocks,
}) => {
  const t = TRANSLATIONS[lang];

  // Custom user thresholds state
  const [customThresholds, setCustomThresholds] = useState<CustomThresholds>({});
  const [showConfigDrawer, setShowConfigDrawer] = useState(false);

  // Evaluate the 10 Early Warning Indicators
  const indicators = evaluateEarlyWarnings(currentState, history, customThresholds);

  const criticalCount = indicators.filter((r) => r.status === 'critical').length;
  const warningCount = indicators.filter((r) => r.status === 'warning').length;
  const safeCount = indicators.filter((r) => r.status === 'normal').length;

  const handleUpdateThreshold = (key: string, type: 'warning' | 'critical', val: number) => {
    setCustomThresholds((prev) => ({
      ...prev,
      [key]: {
        warning: type === 'warning' ? val : (prev[key]?.warning ?? 50),
        critical: type === 'critical' ? val : (prev[key]?.critical ?? 70),
      },
    }));
  };

  const handleResetThresholds = () => {
    setCustomThresholds({});
  };

  return (
    <div className="space-y-6">
      {/* Top Threat Level Banner */}
      <div
        className={`p-5 rounded-xl border text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${
          criticalCount > 0
            ? 'bg-rose-950/30 border-rose-800/80 text-rose-200'
            : warningCount > 0
            ? 'bg-amber-950/30 border-amber-800/80 text-amber-200'
            : 'bg-emerald-950/30 border-emerald-800/80 text-emerald-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <ShieldAlert
            className={`w-9 h-9 shrink-0 ${
              criticalCount > 0 ? 'text-rose-400' : warningCount > 0 ? 'text-amber-400' : 'text-emerald-400'
            }`}
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">
                {lang === 'ar' ? 'رادار الإنذار المبكر السيادي (EWS)' : 'Sovereign Early-Warning Radar (EWS)'}
              </h3>
              <ExplainerBubble itemKey="earlyWarningSystem" lang={lang} size="sm" showBadge />
            </div>
            <p className="mt-1 leading-relaxed text-slate-300">
              {criticalCount > 0
                ? (lang === 'ar'
                    ? `تم رصد ${criticalCount} مؤشرات حرجة تجاوزت العتبات الآمنة وتتطلب تدخلاً عاجلاً بالسياسات.`
                    : `${criticalCount} critical thresholds breached, demanding urgent policy realignment.`)
                : warningCount > 0
                ? (lang === 'ar'
                    ? `هناك ${warningCount} مؤشرات تقترب من مناطق الخطر وتحت المراقبة المكثفة.`
                    : `${warningCount} indicators under heightened surveillance approaching risk thresholds.`)
                : (lang === 'ar'
                    ? 'كافة مؤشرات الدولة الـ 10 مستقرة وتقع داخل النطاقات الآمنة.'
                    : 'All 10 structural indices are operating within verified safe parameters.')}
            </p>
          </div>
        </div>

        {/* Counter Badges & Config Toggle */}
        <div className="flex items-center gap-3 font-mono shrink-0">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-rose-800/60 text-center">
            <span className="text-[10px] text-slate-400 block font-sans">{lang === 'ar' ? 'حرجة' : 'Critical'}</span>
            <span className="text-rose-400 font-bold text-base">{criticalCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-amber-800/60 text-center">
            <span className="text-[10px] text-slate-400 block font-sans">{lang === 'ar' ? 'تنبيه' : 'Warning'}</span>
            <span className="text-amber-400 font-bold text-base">{warningCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-emerald-800/60 text-center">
            <span className="text-[10px] text-slate-400 block font-sans">{lang === 'ar' ? 'مستقرة' : 'Normal'}</span>
            <span className="text-emerald-400 font-bold text-base">{safeCount}</span>
          </div>

          <button
            onClick={() => setShowConfigDrawer(!showConfigDrawer)}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              showConfigDrawer
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title={lang === 'ar' ? 'تخصيص العتبات والحدود' : 'Configure Thresholds'}
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Thresholds Configurator Drawer */}
      {showConfigDrawer && (
        <div className="bg-slate-900 border border-cyan-500/40 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-bold text-slate-100">
                {lang === 'ar' ? 'تهيئة عتبات وحساسية نظام الإنذار المبكر' : 'Configure EWS Indicator Thresholds'}
              </h4>
            </div>
            <button
              onClick={handleResetThresholds}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{lang === 'ar' ? 'إعادة ضبط العتبات الافتراضية' : 'Reset to Defaults'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            {indicators.slice(0, 6).map((ind) => (
              <div key={ind.key} className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1.5 font-mono">
                <span className="text-[11px] font-sans font-semibold text-slate-300 block truncate">
                  {lang === 'ar' ? ind.titleAr : ind.titleEn}
                </span>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="text-amber-400">تنبيه:</span>
                  <input
                    type="number"
                    value={ind.thresholdWarning}
                    onChange={(e) => handleUpdateThreshold(ind.key, 'warning', parseFloat(e.target.value) || 0)}
                    className="w-14 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-slate-200"
                  />
                  <span className="text-rose-400 mr-2">حرج:</span>
                  <input
                    type="number"
                    value={ind.thresholdCritical}
                    onChange={(e) => handleUpdateThreshold(ind.key, 'critical', parseFloat(e.target.value) || 0)}
                    className="w-14 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-slate-200"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10 Early Warning Indicator Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {indicators.map((risk) => (
          <div
            key={risk.id}
            className={`bg-slate-900 border rounded-xl p-4 flex flex-col justify-between transition-colors ${
              risk.status === 'critical'
                ? 'border-rose-700/80 shadow-rose-950/20 shadow-lg ring-1 ring-rose-500/30'
                : risk.status === 'warning'
                ? 'border-amber-700/80 shadow-amber-950/20 shadow-md ring-1 ring-amber-500/30'
                : 'border-slate-800'
            }`}
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-1.5">
                  <ExplainerBubble itemKey={risk.key} lang={lang} size="sm" />
                  <span className="text-xs font-bold text-slate-200 leading-snug">
                    {lang === 'ar' ? risk.titleAr : risk.titleEn}
                  </span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                    risk.status === 'critical'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : risk.status === 'warning'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}
                >
                  {risk.status === 'critical'
                    ? (lang === 'ar' ? 'حرج' : 'Critical')
                    : risk.status === 'warning'
                    ? (lang === 'ar' ? 'تنبيه' : 'Warning')
                    : (lang === 'ar' ? 'مستقر' : 'Safe')}
                </span>
              </div>

              {/* Metric Value & Limits */}
              <div className="my-3 flex items-baseline justify-between font-mono">
                <div>
                  <span
                    className={`text-2xl font-black tabular-nums ${
                      risk.status === 'critical'
                        ? 'text-rose-400'
                        : risk.status === 'warning'
                        ? 'text-amber-400'
                        : 'text-slate-100'
                    }`}
                  >
                    {risk.currentValue}
                  </span>{' '}
                  <span className="text-xs text-slate-400">{risk.unit}</span>
                </div>
                <div className="text-[10px] text-slate-500 text-left">
                  <div>{lang === 'ar' ? 'تنبيه:' : 'Warn:'} &gt; {risk.thresholdWarning}</div>
                  <div>{lang === 'ar' ? 'حرج:' : 'Crit:'} &gt; {risk.thresholdCritical}</div>
                </div>
              </div>

              {/* Contributing Variables Breakdown */}
              <div className="space-y-1 mb-3 pt-2 border-t border-slate-800/60 font-mono text-[10px]">
                <div className="text-slate-400 uppercase font-sans text-[9px] font-semibold mb-1">
                  {lang === 'ar' ? 'المتغيرات المسببة (Contributing Variables):' : 'Key Drivers:'}
                </div>
                {risk.contributingVariables.map((cv, i) => (
                  <div key={i} className="flex justify-between items-center text-slate-300">
                    <span className="font-sans text-slate-400">{lang === 'ar' ? cv.nameAr : cv.nameEn}</span>
                    <span className="font-bold text-slate-200">
                      {cv.value} <span className="text-slate-500 font-normal">({cv.weightPct}%)</span>
                    </span>
                  </div>
                ))}
              </div>

              {/* Threshold Rationale */}
              <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                {lang === 'ar' ? risk.thresholdRationaleAr : risk.thresholdRationaleEn}
              </p>
            </div>

            {/* Recommended Policy Responses */}
            <div className="pt-2.5 border-t border-slate-800/80 text-[11px] bg-slate-950/60 p-2.5 rounded-lg space-y-1">
              <div className="flex items-center justify-between text-cyan-400 font-semibold text-[10px]">
                <span>{lang === 'ar' ? 'التدخل السياساتي المقترح:' : 'Recommended Policy Response:'}</span>
                <span className="text-slate-500 font-mono">{lang === 'ar' ? 'ثقة:' : 'Conf:'} {risk.confidenceScorePct}%</span>
              </div>
              <ul className="list-disc list-inside text-slate-300 space-y-0.5 text-[10.5px]">
                {(lang === 'ar' ? risk.recommendedResponsesAr : risk.recommendedResponsesEn).map((resp, idx) => (
                  <li key={idx}>{resp}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Navigation Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div>
          <h4 className="font-semibold text-slate-200">
            {lang === 'ar' ? 'مختبر اختبارات الصمود والأزمات السيادية' : 'Sovereign Stress Testing & Crisis Center'}
          </h4>
          <p className="text-slate-400 mt-0.5">
            {lang === 'ar'
              ? 'حقن صدمات كبرى لفحص استجابة المؤشرات الـ 10 لعتبات الأمان.'
              : 'Inject macro shocks to test if warnings trigger appropriately.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToShocks && (
            <button
              onClick={onNavigateToShocks}
              className="px-3.5 py-2 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-semibold rounded-lg shadow transition-colors cursor-pointer text-xs flex items-center gap-1.5"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'مركز إدارة الأزمات' : 'Crisis Center'}</span>
            </button>
          )}
          {onNavigateToPolicies && (
            <button
              onClick={onNavigateToPolicies}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold rounded-lg transition-colors cursor-pointer text-xs"
            >
              {lang === 'ar' ? 'تعديل السياسات الوقائية' : 'Adjust Policies'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
