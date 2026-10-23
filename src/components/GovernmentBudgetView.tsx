/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Government Budget & Interactive Resource Allocation Workspace (Phases 1-6 Master)
 * الميزانية العامة وتوزيع الموارد، محرر المخصصات القطاعية التفاعلي، وافتراضات تمويل العجز
 */

import React, { useState } from 'react';
import { SimulationState, PolicySettings, DeficitFinancingPreference } from '../types/simulation';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { BarChartSvg, BarChartItem } from './charts/BarChartSvg';
import { StackedBarChartSvg, StackedSegment } from './charts/StackedBarChartSvg';
import {
  Landmark,
  Receipt,
  Scale,
  ShieldCheck,
  AlertCircle,
  TrendingDown,
  Percent,
  Sliders,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';
import { ExplainerBubble } from './common/ExplainerBubble';

interface GovernmentBudgetViewProps {
  currentState: SimulationState;
  previousState?: SimulationState;
  baselineState: SimulationState;
  history: SimulationState[];
  policies?: PolicySettings;
  onUpdatePolicies?: (updated: Partial<PolicySettings>) => void;
  lang: Language;
  onInspectMetric: (metricKey: string) => void;
  onNavigateToPolicyLab?: () => void;
}

export const GovernmentBudgetView: React.FC<GovernmentBudgetViewProps> = ({
  currentState,
  previousState,
  baselineState,
  history,
  policies,
  onUpdatePolicies,
  lang,
  onInspectMetric,
  onNavigateToPolicyLab,
}) => {
  const t = TRANSLATIONS[lang];
  const fiscal = currentState.economic.fiscal;
  const macro = currentState.macro;

  // Active editable budget allocations state (draft workspace)
  const [draftAllocations, setDraftAllocations] = useState({
    wages: policies?.budgetPublicWagesPctGdp ?? 12.0,
    health: policies?.budgetHealthcarePctGdp ?? 4.0,
    education: policies?.budgetEducationPctGdp ?? 5.0,
    infra: policies?.budgetInfrastructurePctGdp ?? 6.5,
    social: policies?.budgetSocialSafetyPctGdp ?? 5.5,
    defense: policies?.budgetDefensePctGdp ?? 6.0,
    agri: policies?.budgetAgricultureSupportPctGdp ?? 2.5,
    rnd: policies?.budgetRnDPctGdp ?? 0.8,
    regional: policies?.budgetRegionalDevelopmentPctGdp ?? 1.5,
    financingPref: policies?.deficitFinancingPreference ?? ('balanced_mix' as DeficitFinancingPreference),
  });

  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState<boolean>(true);
  const [justApplied, setJustApplied] = useState<boolean>(false);

  // Recalculate draft totals dynamically using nominal GDP
  const nominalGdp = macro.nominalGdp;
  const draftTotalPctGdp =
    draftAllocations.wages +
    draftAllocations.health +
    draftAllocations.education +
    draftAllocations.infra +
    draftAllocations.social +
    draftAllocations.defense;

  const draftOutlaysUsdB = Math.round(((nominalGdp * draftTotalPctGdp) / 100 + fiscal.expenditureDebtInterest) * 10) / 10;
  const draftDeficitUsdB = Math.round(Math.max(0, draftOutlaysUsdB - fiscal.totalRevenue) * 10) / 10;
  const draftDeficitPctGdp = Math.round(((draftDeficitUsdB / nominalGdp) * 100) * 10) / 10;
  const isOverAllocated = draftDeficitPctGdp > 7.5 || draftTotalPctGdp > 48.0;

  const handleCommitBudget = () => {
    if (!onUpdatePolicies) return;
    onUpdatePolicies({
      budgetPublicWagesPctGdp: draftAllocations.wages,
      budgetHealthcarePctGdp: draftAllocations.health,
      budgetEducationPctGdp: draftAllocations.education,
      budgetInfrastructurePctGdp: draftAllocations.infra,
      budgetSocialSafetyPctGdp: draftAllocations.social,
      budgetDefensePctGdp: draftAllocations.defense,
      budgetAgricultureSupportPctGdp: draftAllocations.agri,
      budgetRnDPctGdp: draftAllocations.rnd,
      budgetRegionalDevelopmentPctGdp: draftAllocations.regional,
      deficitFinancingPreference: draftAllocations.financingPref,
    });
    setJustApplied(true);
    setTimeout(() => setJustApplied(false), 3000);
  };

  const handleResetToCurrent = () => {
    if (!policies) return;
    setDraftAllocations({
      wages: policies.budgetPublicWagesPctGdp,
      health: policies.budgetHealthcarePctGdp,
      education: policies.budgetEducationPctGdp,
      infra: policies.budgetInfrastructurePctGdp,
      social: policies.budgetSocialSafetyPctGdp,
      defense: policies.budgetDefensePctGdp,
      agri: policies.budgetAgricultureSupportPctGdp ?? 2.5,
      rnd: policies.budgetRnDPctGdp ?? 0.8,
      regional: policies.budgetRegionalDevelopmentPctGdp ?? 1.5,
      financingPref: policies.deficitFinancingPreference ?? 'balanced_mix',
    });
  };

  // Revenue composition segments
  const revenueSegments: StackedSegment[] = [
    {
      id: 'rev_income',
      label: 'ضريبة الدخل الفردي',
      value: fiscal.taxRevenueIncome,
      color: '#38bdf8',
      unit: t.units.billionUsd,
    },
    {
      id: 'rev_corporate',
      label: 'ضريبة الشركات والأرباح',
      value: fiscal.taxRevenueCorporate,
      color: '#818cf8',
      unit: t.units.billionUsd,
    },
    {
      id: 'rev_vat',
      label: 'ضريبة القيمة المضافة / المبيعات',
      value: fiscal.taxRevenueVat,
      color: '#34d399',
      unit: t.units.billionUsd,
    },
    {
      id: 'rev_tariffs',
      label: 'الرسوم الجمركية',
      value: fiscal.taxRevenueTariffs,
      color: '#f59e0b',
      unit: t.units.billionUsd,
    },
    {
      id: 'rev_rents',
      label: 'ريوع الموارد الطبيعية والمحروقات',
      value: fiscal.resourceRentsRevenue,
      color: '#a855f7',
      unit: t.units.billionUsd,
    },
    {
      id: 'rev_carbon',
      label: 'إيرادات ضريبة الكربون',
      value: fiscal.carbonTaxRevenue,
      color: '#10b981',
      unit: t.units.billionUsd,
    },
  ];

  // Expenditure composition segments
  const expenditureSegments: StackedSegment[] = [
    {
      id: 'exp_wages',
      label: 'كتلة الأجور العامة',
      value: fiscal.expenditurePublicWages,
      color: '#60a5fa',
      unit: t.units.billionUsd,
    },
    {
      id: 'exp_health',
      label: 'الرعاية الصحية',
      value: fiscal.expenditureHealthcare,
      color: '#34d399',
      unit: t.units.billionUsd,
    },
    {
      id: 'exp_edu',
      label: 'التعليم والتدريب',
      value: fiscal.expenditureEducation,
      color: '#38bdf8',
      unit: t.units.billionUsd,
    },
    {
      id: 'exp_infra',
      label: 'الاستثمار الرأسمالي بالبنية',
      value: fiscal.expenditureInfrastructureCapex,
      color: '#f59e0b',
      unit: t.units.billionUsd,
    },
    {
      id: 'exp_social',
      label: 'الحماية الاجتماعية والدعم',
      value: fiscal.expenditureSocialSafety,
      color: '#ec4899',
      unit: t.units.billionUsd,
    },
    {
      id: 'exp_defense',
      label: 'الدفاع والأمن القومي',
      value: fiscal.expenditureDefense,
      color: '#94a3b8',
      unit: t.units.billionUsd,
    },
    {
      id: 'exp_interest',
      label: 'خدمة فوائد الدين العام',
      value: fiscal.expenditureDebtInterest,
      color: '#f43f5e',
      unit: t.units.billionUsd,
    },
  ];

  // Allocation items comparing Current vs Baseline as % of GDP
  const allocationComparisonItems: BarChartItem[] = [
    {
      id: 'wages',
      label: 'كتلة الأجور (% الناتج)',
      value: (fiscal.expenditurePublicWages / macro.nominalGdp) * 100,
      color: '#60a5fa',
      unit: '%',
    },
    {
      id: 'health',
      label: 'الصحة (% الناتج)',
      value: (fiscal.expenditureHealthcare / macro.nominalGdp) * 100,
      color: '#34d399',
      unit: '%',
    },
    {
      id: 'edu',
      label: 'التعليم (% الناتج)',
      value: (fiscal.expenditureEducation / macro.nominalGdp) * 100,
      color: '#38bdf8',
      unit: '%',
    },
    {
      id: 'infra',
      label: 'البنية الرأسمالية (% الناتج)',
      value: (fiscal.expenditureInfrastructureCapex / macro.nominalGdp) * 100,
      color: '#f59e0b',
      unit: '%',
    },
    {
      id: 'social',
      label: 'الحماية الاجتماعية (% الناتج)',
      value: (fiscal.expenditureSocialSafety / macro.nominalGdp) * 100,
      color: '#ec4899',
      unit: '%',
    },
    {
      id: 'defense',
      label: 'الدفاع والأمن (% الناتج)',
      value: (fiscal.expenditureDefense / macro.nominalGdp) * 100,
      color: '#94a3b8',
      unit: '%',
    },
    {
      id: 'interest',
      label: 'فوائد الدين (% الناتج)',
      value: (fiscal.expenditureDebtInterest / macro.nominalGdp) * 100,
      color: '#f43f5e',
      unit: '%',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Fiscal Balances & Solvency KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        <div
          onClick={() => onInspectMetric('totalRevenue')}
          className="bg-slate-900 border border-slate-800 rounded-lg p-3 hover:border-cyan-500/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>{lang === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenues'}</span>
            <ExplainerBubble itemKey="vatRate" lang={lang} size="sm" />
          </div>
          <div className="text-lg font-bold font-mono text-emerald-400 mt-1 tabular-nums">
            ${fiscal.totalRevenue.toFixed(1)}B
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">
            {((fiscal.totalRevenue / macro.nominalGdp) * 100).toFixed(1)}% {lang === 'ar' ? 'من الناتج' : 'of GDP'}
          </div>
        </div>

        <div
          onClick={() => onInspectMetric('totalExpenditure')}
          className="bg-slate-900 border border-slate-800 rounded-lg p-3 hover:border-cyan-500/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>{lang === 'ar' ? 'إجمالي النفقات' : 'Total Outlays'}</span>
            <ExplainerBubble itemKey="infrastructureSpending" lang={lang} size="sm" />
          </div>
          <div className="text-lg font-bold font-mono text-white mt-1 tabular-nums">
            ${fiscal.totalExpenditure.toFixed(1)}B
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">
            {((fiscal.totalExpenditure / macro.nominalGdp) * 100).toFixed(1)}% {lang === 'ar' ? 'من الناتج' : 'of GDP'}
          </div>
        </div>

        <div
          onClick={() => onInspectMetric('primaryBalance')}
          className="bg-slate-900 border border-slate-800 rounded-lg p-3 hover:border-cyan-500/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>{lang === 'ar' ? 'الرصيد الأولي (قبل الفوائد)' : 'Primary Balance'}</span>
            <ExplainerBubble itemKey="budgetBalance" lang={lang} size="sm" />
          </div>
          <div className={`text-lg font-bold font-mono mt-1 tabular-nums ${
            fiscal.primaryBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {fiscal.primaryBalance > 0 ? `+$${fiscal.primaryBalance.toFixed(1)}B` : `-$${Math.abs(fiscal.primaryBalance).toFixed(1)}B`}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">
            {((fiscal.primaryBalance / macro.nominalGdp) * 100).toFixed(1)}% {lang === 'ar' ? 'من الناتج' : 'of GDP'}
          </div>
        </div>

        <div
          onClick={() => onInspectMetric('overallDeficit')}
          className="bg-slate-900 border border-slate-800 rounded-lg p-3 hover:border-cyan-500/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>{lang === 'ar' ? 'العجز الكلي الصافي' : 'Overall Deficit'}</span>
            <ExplainerBubble itemKey="budgetBalance" lang={lang} size="sm" />
          </div>
          <div className="text-lg font-bold font-mono text-rose-400 mt-1 tabular-nums">
            ${fiscal.overallDeficit.toFixed(1)}B
          </div>
          <div className="text-[10px] text-rose-400 font-mono mt-1">
            {fiscal.deficitToGdpRatio.toFixed(1)}% {lang === 'ar' ? 'من الناتج' : 'of GDP'}
          </div>
        </div>

        <div
          onClick={() => onInspectMetric('expenditureDebtInterest')}
          className="bg-slate-900 border border-slate-800 rounded-lg p-3 hover:border-cyan-500/50 transition-colors cursor-pointer col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>{lang === 'ar' ? 'كلفة فوائد الدين' : 'Debt Service Cost'}</span>
            <ExplainerBubble itemKey="debtToGdpRatio" lang={lang} size="sm" />
          </div>
          <div className="text-lg font-bold font-mono text-amber-400 mt-1 tabular-nums">
            ${fiscal.expenditureDebtInterest.toFixed(1)}B
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">
            {((fiscal.expenditureDebtInterest / fiscal.totalRevenue) * 100).toFixed(1)}% {lang === 'ar' ? 'من الإيرادات' : 'of revenues'}
          </div>
        </div>
      </div>

      {/* Interactive Budget Allocation Workspace & Editor */}
      <div className="bg-slate-900 border border-cyan-800/60 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-semibold text-slate-100">
                {lang === 'ar' ? 'محرر مخصصات الميزانية الوطنية التفاعلي' : 'Interactive National Budget Allocation Editor'}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'ar'
                ? 'تحكم كامل بتوزيع بنود الإنفاق حسب القطاع، اختر وسيلة تمويل العجز، وافحص العجز والدين المتولد فوراً.'
                : 'Direct control over sector allocations, select deficit financing source, and verify debt trajectory.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetToCurrent}
              className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{lang === 'ar' ? 'إعادة ضبط' : 'Reset'}</span>
            </button>
            <button
              onClick={handleCommitBudget}
              className="px-3 py-1 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{justApplied ? (lang === 'ar' ? 'تم الاعتماد ✓' : 'Committed ✓') : (lang === 'ar' ? 'اعتماد الميزانية' : 'Commit Budget')}</span>
            </button>
          </div>
        </div>

        {/* Over-allocation warning banner */}
        {isOverAllocated && (
          <div className="mt-4 p-3 bg-amber-950/40 border border-amber-800/60 rounded-lg flex items-start gap-2 text-xs text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">{lang === 'ar' ? 'تنبيه عجز تمويلي غير مستدام: ' : 'Financing Gap Warning: '}</span>
              {lang === 'ar'
                ? `المخصصات المقترحة ترفع العجز السنوي إلى ${draftDeficitPctGdp}% من الناتج (${draftDeficitUsdB} $B)، مما يتجاوز الحدود المستدامة ويؤدي لتسارع تراكم الدين العام.`
                : `Proposed allocations lift fiscal deficit to ${draftDeficitPctGdp}% of GDP ($${draftDeficitUsdB}B), exceeding sustainable boundaries.`}
            </div>
          </div>
        )}

        {/* Live Calculation Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono">
          <div>
            <span className="text-slate-500 block text-[10px]">{lang === 'ar' ? 'إجمالي المخصصات' : 'Total Allocations'}</span>
            <span className="font-bold text-slate-200 text-sm">{draftTotalPctGdp.toFixed(1)}%</span>
            <span className="text-[10px] text-slate-400 block">${draftOutlaysUsdB.toFixed(1)}B</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">{lang === 'ar' ? 'العجز المتوقع' : 'Projected Deficit'}</span>
            <span className="font-bold text-rose-400 text-sm">${draftDeficitUsdB.toFixed(1)}B</span>
            <span className="text-[10px] text-rose-300 block">{draftDeficitPctGdp.toFixed(1)}% {lang === 'ar' ? 'من الناتج' : 'of GDP'}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">{lang === 'ar' ? 'التمويل الذاتي' : 'Tax Coverage'}</span>
            <span className="font-bold text-emerald-400 text-sm">
              {Math.min(100, Math.round(((fiscal.totalRevenue / draftOutlaysUsdB) * 100) * 10) / 10)}%
            </span>
            <span className="text-[10px] text-slate-400 block">${fiscal.totalRevenue.toFixed(1)}B {lang === 'ar' ? 'إيرادات' : 'revenue'}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">{lang === 'ar' ? 'أداة التمويل' : 'Financing Source'}</span>
            <select
              value={draftAllocations.financingPref}
              onChange={(e) => setDraftAllocations((prev) => ({ ...prev, financingPref: e.target.value as DeficitFinancingPreference }))}
              className="bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-[11px] text-cyan-300 w-full mt-0.5 focus:outline-none"
            >
              <option value="balanced_mix">{lang === 'ar' ? 'مزيج متوازن' : 'Balanced Mix'}</option>
              <option value="domestic_bonds">{lang === 'ar' ? 'سندات محلية' : 'Domestic Bonds'}</option>
              <option value="external_debt">{lang === 'ar' ? 'ديون خارجية' : 'External Debt'}</option>
              <option value="reserve_drawdown">{lang === 'ar' ? 'سحب احتياطيات' : 'Reserve Drawdown'}</option>
            </select>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. Wages */}
          <div className="p-3 bg-slate-950/60 rounded border border-slate-800">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-200">{lang === 'ar' ? 'كتلة الأجور العامة' : 'Public Payroll'}</span>
              <span className="font-mono text-cyan-400 font-bold">{draftAllocations.wages.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="22"
              step="0.5"
              value={draftAllocations.wages}
              onChange={(e) => setDraftAllocations((prev) => ({ ...prev, wages: parseFloat(e.target.value) }))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>5%</span>
              <span>${Math.round(((nominalGdp * draftAllocations.wages) / 100) * 10) / 10}B</span>
              <span>22%</span>
            </div>
          </div>

          {/* 2. Health */}
          <div className="p-3 bg-slate-950/60 rounded border border-slate-800">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-200">{lang === 'ar' ? 'الرعاية الصحية' : 'Healthcare'}</span>
              <span className="font-mono text-emerald-400 font-bold">{draftAllocations.health.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="2"
              max="15"
              step="0.5"
              value={draftAllocations.health}
              onChange={(e) => setDraftAllocations((prev) => ({ ...prev, health: parseFloat(e.target.value) }))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>2%</span>
              <span>${Math.round(((nominalGdp * draftAllocations.health) / 100) * 10) / 10}B</span>
              <span>15%</span>
            </div>
          </div>

          {/* 3. Education */}
          <div className="p-3 bg-slate-950/60 rounded border border-slate-800">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-200">{lang === 'ar' ? 'التعليم ورأس المال البشري' : 'Education'}</span>
              <span className="font-mono text-cyan-400 font-bold">{draftAllocations.education.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="2"
              max="15"
              step="0.5"
              value={draftAllocations.education}
              onChange={(e) => setDraftAllocations((prev) => ({ ...prev, education: parseFloat(e.target.value) }))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>2%</span>
              <span>${Math.round(((nominalGdp * draftAllocations.education) / 100) * 10) / 10}B</span>
              <span>15%</span>
            </div>
          </div>

          {/* 4. Infrastructure */}
          <div className="p-3 bg-slate-950/60 rounded border border-slate-800">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-200">{lang === 'ar' ? 'البنية التحتية والاستثمار' : 'Infrastructure'}</span>
              <span className="font-mono text-amber-400 font-bold">{draftAllocations.infra.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="16"
              step="0.5"
              value={draftAllocations.infra}
              onChange={(e) => setDraftAllocations((prev) => ({ ...prev, infra: parseFloat(e.target.value) }))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1%</span>
              <span>${Math.round(((nominalGdp * draftAllocations.infra) / 100) * 10) / 10}B</span>
              <span>16%</span>
            </div>
          </div>

          {/* 5. Social Safety */}
          <div className="p-3 bg-slate-950/60 rounded border border-slate-800">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-200">{lang === 'ar' ? 'الحماية الاجتماعية والدعم' : 'Social Safety'}</span>
              <span className="font-mono text-pink-400 font-bold">{draftAllocations.social.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="18"
              step="0.5"
              value={draftAllocations.social}
              onChange={(e) => setDraftAllocations((prev) => ({ ...prev, social: parseFloat(e.target.value) }))}
              className="w-full accent-pink-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1%</span>
              <span>${Math.round(((nominalGdp * draftAllocations.social) / 100) * 10) / 10}B</span>
              <span>18%</span>
            </div>
          </div>

          {/* 6. Defense */}
          <div className="p-3 bg-slate-950/60 rounded border border-slate-800">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-200">{lang === 'ar' ? 'الدفاع والأمن القومي' : 'Defense'}</span>
              <span className="font-mono text-slate-400 font-bold">{draftAllocations.defense.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              step="0.2"
              value={draftAllocations.defense}
              onChange={(e) => setDraftAllocations((prev) => ({ ...prev, defense: parseFloat(e.target.value) }))}
              className="w-full accent-slate-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1%</span>
              <span>${Math.round(((nominalGdp * draftAllocations.defense) / 100) * 10) / 10}B</span>
              <span>12%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stacked Compositions: Revenues & Expenditures */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StackedBarChartSvg
          title="هيكل الإيرادات العامة حسب المصدر الضريبي والريعي"
          subtitle="توزيع الحصيلة الضريبية المباشرة وغير المباشرة والمحروقات"
          segments={revenueSegments}
          totalLabel="إجمالي الإيرادات"
          unit={t.units.billionUsd}
        />

        <StackedBarChartSvg
          title="هيكل النفقات العامة وتوزيع الأولويات القطاعية"
          subtitle="توزيع الإنفاق الحكومي بين الأجور والخدمات والاستثمار وخدمة الدين"
          segments={expenditureSegments}
          totalLabel="إجمالي النفقات"
          unit={t.units.billionUsd}
        />
      </div>

      {/* Allocation Percentages vs GDP & Financing Rule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Allocations as % of GDP */}
        <BarChartSvg
          title="مخصصات الميزانية كنسبة مئوية من الناتج المحلي الإجمالي (% of GDP)"
          subtitle="مؤشرات الحجم النسبي للقطاعات في الاقتصاد الوطني"
          items={allocationComparisonItems}
          unit="%"
          orientation="horizontal"
        />

        {/* Explicit Financing Mechanism & Debt Trajectory */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <Scale className="w-4 h-4 text-cyan-400" />
              <span>مصادر تمويل الإنفاق العام وقيد الميزانية الصارم</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              لا يمكن تمويل أي إنفاق عام إلا من خلال الضرائب، الريوع، أو الاقتراض الجديد وتراكم الدين.
            </p>
          </div>

          <div className="my-4 space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">التمويل الذاتي (الضرائب والريوع)</span>
                <span className="font-mono text-emerald-400 font-bold">{fiscal.financingTaxCoveredPct.toFixed(1)}%</span>
              </div>
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, fiscal.financingTaxCoveredPct)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">التمويل بالعجز والاقتراض السيادي</span>
                <span className="font-mono text-rose-400 font-bold">{fiscal.financingNewBorrowingPct.toFixed(1)}%</span>
              </div>
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, fiscal.financingNewBorrowingPct)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 space-y-1 font-mono">
            <div>رصيد الدين التراكمي: <strong className="text-white">${macro.publicDebtStock.toFixed(1)}B</strong> ({macro.debtToGdpRatio.toFixed(1)}% من الناتج)</div>
            <div>عائد السندات السيادية: <strong className="text-amber-400">{macro.sovereignBondYield10y.toFixed(2)}%</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};
