/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Public Policy Control Deck
 * حقيبة التحكم في السياسات العامة مع بيان المقايضات الهيكلية
 */

import React from 'react';
import { PolicySettings } from '../types/simulation';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { RotateCcw, AlertCircle } from 'lucide-react';

interface PolicyDeckProps {
  policies: PolicySettings;
  baselinePolicies: PolicySettings;
  onUpdatePolicy: <K extends keyof PolicySettings>(key: K, value: PolicySettings[K]) => void;
  onResetPolicies: () => void;
  lang: Language;
}

export const PolicyDeck: React.FC<PolicyDeckProps> = ({
  policies,
  baselinePolicies,
  onUpdatePolicy,
  onResetPolicies,
  lang,
}) => {
  const t = TRANSLATIONS[lang];

  // Count active modifications
  const modifiedKeys = (Object.keys(policies) as (keyof PolicySettings)[]).filter(
    (k) => policies[k] !== baselinePolicies[k]
  );

  return (
    <div className="space-y-6">
      {/* Header and Reset Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-100">{t.policies.title}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{t.policies.subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-400 font-mono">
            {t.policies.activeModifications}{' '}
            <span className="font-bold text-cyan-400 tabular-nums">
              {modifiedKeys.length}
            </span>
          </div>
          {modifiedKeys.length > 0 && (
            <button
              onClick={onResetPolicies}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.policies.resetAllPolicies}</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Fiscal Taxation Levers */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-4">
          <div className="border-b border-slate-800 pb-2">
            <h3 className="text-sm font-semibold text-slate-200">
              1. السياسة الضريبية والإيرادات العامة
            </h3>
            <p className="text-[11px] text-slate-500">
              تحديد الأوعية الضريبية والرسوم مع مراعاة مرونة الاستثمار والاستهلاك
            </p>
          </div>

          {/* Income Tax */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">{t.policies.taxRateIncome}</span>
              <span className="font-mono tabular-nums text-cyan-400 font-semibold">
                {policies.taxRateIncome}%{' '}
                <span className="text-[10px] text-slate-500 font-normal">
                  (الأساس: {baselinePolicies.taxRateIncome}%)
                </span>
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="55"
              step="1"
              value={policies.taxRateIncome}
              onChange={(e) => onUpdatePolicy('taxRateIncome', Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400 flex items-start gap-1">
              <AlertCircle className="w-3 h-3 text-slate-500 shrink-0 mt-0.5" />
              <span>{t.policies.tradeoffNotes.taxIncome}</span>
            </p>
          </div>

          {/* Corporate Tax */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">{t.policies.taxRateCorporate}</span>
              <span className="font-mono tabular-nums text-cyan-400 font-semibold">
                {policies.taxRateCorporate}%{' '}
                <span className="text-[10px] text-slate-500 font-normal">
                  (الأساس: {baselinePolicies.taxRateCorporate}%)
                </span>
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="45"
              step="1"
              value={policies.taxRateCorporate}
              onChange={(e) => onUpdatePolicy('taxRateCorporate', Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400 flex items-start gap-1">
              <AlertCircle className="w-3 h-3 text-slate-500 shrink-0 mt-0.5" />
              <span>{t.policies.tradeoffNotes.taxCorporate}</span>
            </p>
          </div>

          {/* VAT */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">{t.policies.taxRateVat}</span>
              <span className="font-mono tabular-nums text-cyan-400 font-semibold">
                {policies.taxRateVat}%{' '}
                <span className="text-[10px] text-slate-500 font-normal">
                  (الأساس: {baselinePolicies.taxRateVat}%)
                </span>
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="28"
              step="1"
              value={policies.taxRateVat}
              onChange={(e) => onUpdatePolicy('taxRateVat', Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400 flex items-start gap-1">
              <AlertCircle className="w-3 h-3 text-slate-500 shrink-0 mt-0.5" />
              <span>{t.policies.tradeoffNotes.vat}</span>
            </p>
          </div>

          {/* Tariffs */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">{t.policies.tariffRateAvg}</span>
              <span className="font-mono tabular-nums text-cyan-400 font-semibold">
                {policies.tariffRateAvg}%{' '}
                <span className="text-[10px] text-slate-500 font-normal">
                  (الأساس: {baselinePolicies.tariffRateAvg}%)
                </span>
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="35"
              step="0.5"
              value={policies.tariffRateAvg}
              onChange={(e) => onUpdatePolicy('tariffRateAvg', Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>
        </div>

        {/* 2. Public Budget Expenditure Allocations */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-4">
          <div className="border-b border-slate-800 pb-2">
            <h3 className="text-sm font-semibold text-slate-200">
              2. أولويات الإنفاق العام (% من الناتج المحلي)
            </h3>
            <p className="text-[11px] text-slate-500">
              توزيع المخصصات العامة على القطاعات والخدمات الحيوية
            </p>
          </div>

          {/* Healthcare Budget */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">{t.policies.budgetHealthcarePctGdp}</span>
              <span className="font-mono tabular-nums text-teal-400 font-semibold">
                {policies.budgetHealthcarePctGdp}%{' '}
                <span className="text-[10px] text-slate-500 font-normal">
                  (الأساس: {baselinePolicies.budgetHealthcarePctGdp}%)
                </span>
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="14"
              step="0.5"
              value={policies.budgetHealthcarePctGdp}
              onChange={(e) => onUpdatePolicy('budgetHealthcarePctGdp', Number(e.target.value))}
              className="w-full accent-teal-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400 flex items-start gap-1">
              <AlertCircle className="w-3 h-3 text-slate-500 shrink-0 mt-0.5" />
              <span>{t.policies.tradeoffNotes.healthcare}</span>
            </p>
          </div>

          {/* Education Budget */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">{t.policies.budgetEducationPctGdp}</span>
              <span className="font-mono tabular-nums text-sky-400 font-semibold">
                {policies.budgetEducationPctGdp}%{' '}
                <span className="text-[10px] text-slate-500 font-normal">
                  (الأساس: {baselinePolicies.budgetEducationPctGdp}%)
                </span>
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              step="0.5"
              value={policies.budgetEducationPctGdp}
              onChange={(e) => onUpdatePolicy('budgetEducationPctGdp', Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400 flex items-start gap-1">
              <AlertCircle className="w-3 h-3 text-slate-500 shrink-0 mt-0.5" />
              <span>{t.policies.tradeoffNotes.education}</span>
            </p>
          </div>

          {/* Infrastructure Budget */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">{t.policies.budgetInfrastructurePctGdp}</span>
              <span className="font-mono tabular-nums text-emerald-400 font-semibold">
                {policies.budgetInfrastructurePctGdp}%{' '}
                <span className="text-[10px] text-slate-500 font-normal">
                  (الأساس: {baselinePolicies.budgetInfrastructurePctGdp}%)
                </span>
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="14"
              step="0.5"
              value={policies.budgetInfrastructurePctGdp}
              onChange={(e) => onUpdatePolicy('budgetInfrastructurePctGdp', Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400 flex items-start gap-1">
              <AlertCircle className="w-3 h-3 text-slate-500 shrink-0 mt-0.5" />
              <span>{t.policies.tradeoffNotes.infra}</span>
            </p>
          </div>

          {/* Social Safety Net */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">{t.policies.budgetSocialSafetyPctGdp}</span>
              <span className="font-mono tabular-nums text-amber-400 font-semibold">
                {policies.budgetSocialSafetyPctGdp}%{' '}
                <span className="text-[10px] text-slate-500 font-normal">
                  (الأساس: {baselinePolicies.budgetSocialSafetyPctGdp}%)
                </span>
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="15"
              step="0.5"
              value={policies.budgetSocialSafetyPctGdp}
              onChange={(e) => onUpdatePolicy('budgetSocialSafetyPctGdp', Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Public Wage Bill */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">{t.policies.budgetPublicWagesPctGdp}</span>
              <span className="font-mono tabular-nums text-rose-400 font-semibold">
                {policies.budgetPublicWagesPctGdp}%{' '}
                <span className="text-[10px] text-slate-500 font-normal">
                  (الأساس: {baselinePolicies.budgetPublicWagesPctGdp}%)
                </span>
              </span>
            </div>
            <input
              type="range"
              min="3"
              max="20"
              step="0.5"
              value={policies.budgetPublicWagesPctGdp}
              onChange={(e) => onUpdatePolicy('budgetPublicWagesPctGdp', Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>
        </div>

        {/* 3. Labor, Demographics & Pensions */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-4">
          <div className="border-b border-slate-800 pb-2">
            <h3 className="text-sm font-semibold text-slate-200">
              3. تنظيم سوق العمل والتقاعد
            </h3>
            <p className="text-[11px] text-slate-500">
              الاستدامة الاكتوارية لصناديق التقاعد وتنافسية التشغيل
            </p>
          </div>

          {/* Retirement Age */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">{t.policies.statutoryRetirementAge}</span>
              <span className="font-mono tabular-nums text-indigo-400 font-semibold">
                {policies.statutoryRetirementAge} {t.units.years}{' '}
                <span className="text-[10px] text-slate-500 font-normal">
                  (الأساس: {baselinePolicies.statutoryRetirementAge})
                </span>
              </span>
            </div>
            <input
              type="range"
              min="55"
              max="70"
              step="1"
              value={policies.statutoryRetirementAge}
              onChange={(e) => onUpdatePolicy('statutoryRetirementAge', Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400 flex items-start gap-1">
              <AlertCircle className="w-3 h-3 text-slate-500 shrink-0 mt-0.5" />
              <span>{t.policies.tradeoffNotes.retirementAge}</span>
            </p>
          </div>

          {/* Labor Market Flexibility */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">{t.policies.laborMarketFlexibility}</span>
              <span className="font-mono tabular-nums text-indigo-400 font-semibold">
                {policies.laborMarketFlexibility} / 100{' '}
                <span className="text-[10px] text-slate-500 font-normal">
                  (الأساس: {baselinePolicies.laborMarketFlexibility})
                </span>
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="90"
              step="1"
              value={policies.laborMarketFlexibility}
              onChange={(e) => onUpdatePolicy('laborMarketFlexibility', Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* Monetary Inflation Target */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">{t.policies.monetaryTargetInflation}</span>
              <span className="font-mono tabular-nums text-purple-400 font-semibold">
                {policies.monetaryTargetInflation}%{' '}
                <span className="text-[10px] text-slate-500 font-normal">
                  (الأساس: {baselinePolicies.monetaryTargetInflation}%)
                </span>
              </span>
            </div>
            <input
              type="range"
              min="1.0"
              max="8.0"
              step="0.5"
              value={policies.monetaryTargetInflation}
              onChange={(e) => onUpdatePolicy('monetaryTargetInflation', Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>
        </div>

        {/* 4. Energy Transition & Governance */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-4">
          <div className="border-b border-slate-800 pb-2">
            <h3 className="text-sm font-semibold text-slate-200">
              4. التحول المناخي وإصلاح الحوكمة
            </h3>
            <p className="text-[11px] text-slate-500">
              تسعير الكربون، حوافز الطاقة المستدامة، وترقية نزاهة المؤسسات
            </p>
          </div>

          {/* Carbon Tax */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">{t.policies.carbonTaxPerTon}</span>
              <span className="font-mono tabular-nums text-emerald-400 font-semibold">
                {policies.carbonTaxPerTon} {t.units.usdPerTon}{' '}
                <span className="text-[10px] text-slate-500 font-normal">
                  (الأساس: {baselinePolicies.carbonTaxPerTon})
                </span>
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="150"
              step="5"
              value={policies.carbonTaxPerTon}
              onChange={(e) => onUpdatePolicy('carbonTaxPerTon', Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400 flex items-start gap-1">
              <AlertCircle className="w-3 h-3 text-slate-500 shrink-0 mt-0.5" />
              <span>{t.policies.tradeoffNotes.carbonTax}</span>
            </p>
          </div>

          {/* Clean Energy Subsidy */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">{t.policies.cleanEnergySubsidyPct}</span>
              <span className="font-mono tabular-nums text-emerald-400 font-semibold">
                {policies.cleanEnergySubsidyPct}%{' '}
                <span className="text-[10px] text-slate-500 font-normal">
                  (الأساس: {baselinePolicies.cleanEnergySubsidyPct}%)
                </span>
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="45"
              step="2"
              value={policies.cleanEnergySubsidyPct}
              onChange={(e) => onUpdatePolicy('cleanEnergySubsidyPct', Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Governance Reform Effort */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">{t.policies.governanceReformEffort}</span>
              <span className="font-mono tabular-nums text-cyan-400 font-semibold">
                {policies.governanceReformEffort} / 100{' '}
                <span className="text-[10px] text-slate-500 font-normal">
                  (الأساس: {baselinePolicies.governanceReformEffort})
                </span>
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="95"
              step="1"
              value={policies.governanceReformEffort}
              onChange={(e) => onUpdatePolicy('governanceReformEffort', Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
