/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Economic Dashboard & National Accounts View (Phase 3)
 * لوحة الاقتصاد الكلي، الحسابات القومية، الطاقة الإنتاجية، وسوق العمل
 */

import React, { useState } from 'react';
import { SimulationState } from '../types/simulation';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { LineChartSvg } from './charts/LineChartSvg';
import { BarChartSvg } from './charts/BarChartSvg';
import { ScatterPlotSvg } from './charts/ScatterPlotSvg';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Users,
  Building,
  Globe2,
  PieChart,
} from 'lucide-react';
import { ExplainerBubble } from './common/ExplainerBubble';

interface EconomicDashboardProps {
  currentState: SimulationState;
  previousState?: SimulationState;
  baselineState: SimulationState;
  history: SimulationState[];
  lang: Language;
  onInspectMetric: (metricKey: string) => void;
}

export const EconomicDashboard: React.FC<EconomicDashboardProps> = ({
  currentState,
  previousState,
  history,
  lang,
  onInspectMetric,
}) => {
  const t = TRANSLATIONS[lang];
  const econ = currentState.economic;

  // Prepare scatter plot points for Phillips Curve (Unemployment vs Inflation)
  const phillipsPoints = history.map((s) => ({
    id: `ph_${s.year}`,
    x: s.demographics.unemploymentRate,
    y: s.macro.inflationRate,
    year: s.year,
    label: `السنة ${s.year}`,
    isCurrent: s.year === currentState.year,
  }));

  // Prepare scatter plot points for Okun's Law (GDP Growth vs Unemployment)
  const okunsPoints = history.map((s) => ({
    id: `ok_${s.year}`,
    x: s.macro.realGdpGrowthRate,
    y: s.demographics.unemploymentRate,
    year: s.year,
    label: `السنة ${s.year}`,
    isCurrent: s.year === currentState.year,
  }));

  // Expenditure components (GDP breakdown)
  const expenditureItems = [
    {
      id: 'c',
      label: 'الاستهلاك العائلي الحقيقي (C)',
      value: econ.nationalAccounts.consumptionHouseholdReal,
      unit: t.units.billionUsd,
      color: '#38bdf8',
    },
    {
      id: 'i',
      label: 'الاستثمار الكلي الحقيقي (I)',
      value: econ.nationalAccounts.investmentTotalReal,
      unit: t.units.billionUsd,
      color: '#818cf8',
    },
    {
      id: 'g',
      label: 'الإنفاق الحكومي الاستهلاكي (G)',
      value: econ.nationalAccounts.governmentConsumptionReal,
      unit: t.units.billionUsd,
      color: '#34d399',
    },
    {
      id: 'x',
      label: 'الصادرات الحقيقية (X)',
      value: econ.nationalAccounts.exportsReal,
      unit: t.units.billionUsd,
      color: '#fbbf24',
    },
    {
      id: 'm',
      label: 'الواردات الحقيقية (M - تطرح)',
      value: econ.nationalAccounts.importsReal,
      unit: t.units.billionUsd,
      color: '#f87171',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Macro Indicators Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div
          onClick={() => onInspectMetric('realGdp')}
          className="bg-slate-900 border border-slate-800 rounded-lg p-3 hover:border-cyan-500/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>الناتج الحقيقي</span>
            <ExplainerBubble itemKey="gdpReal" lang={lang} size="sm" />
          </div>
          <div className="text-lg font-bold font-mono text-white mt-1 tabular-nums">
            {currentState.macro.realGdp.toFixed(1)}{' '}
            <span className="text-[10px] text-slate-500">{t.units.billionUsd}</span>
          </div>
          <div className="text-[10px] text-emerald-400 font-mono mt-1">
            نمو: {currentState.macro.realGdpGrowthRate.toFixed(1)}%
          </div>
        </div>

        <div
          onClick={() => onInspectMetric('inflationRate')}
          className="bg-slate-900 border border-slate-800 rounded-lg p-3 hover:border-cyan-500/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>التضخم السنوي (CPI)</span>
            <ExplainerBubble itemKey="inflationRate" lang={lang} size="sm" />
          </div>
          <div className="text-lg font-bold font-mono text-white mt-1 tabular-nums">
            {currentState.macro.inflationRate.toFixed(1)}%
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">
            فائدة المركزي: {currentState.macro.centralBankRate.toFixed(1)}%
          </div>
        </div>

        <div
          onClick={() => onInspectMetric('unemploymentRate')}
          className="bg-slate-900 border border-slate-800 rounded-lg p-3 hover:border-cyan-500/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>معدل البطالة</span>
            <ExplainerBubble itemKey="unemploymentRate" lang={lang} size="sm" />
          </div>
          <div className="text-lg font-bold font-mono text-white mt-1 tabular-nums">
            {currentState.demographics.unemploymentRate.toFixed(1)}%
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">
            بطالة الشباب: {currentState.demographics.youthUnemploymentRate.toFixed(1)}%
          </div>
        </div>

        <div
          onClick={() => onInspectMetric('laborProductivityPerWorker')}
          className="bg-slate-900 border border-slate-800 rounded-lg p-3 hover:border-cyan-500/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>إنتاجية العامل</span>
            <ExplainerBubble itemKey="totalInvestment" lang={lang} size="sm" />
          </div>
          <div className="text-lg font-bold font-mono text-white mt-1 tabular-nums">
            {econ.laborProductivity.laborProductivityPerWorker.toFixed(1)}{' '}
            <span className="text-[10px] text-slate-500">ألف $</span>
          </div>
          <div className="text-[10px] text-cyan-400 font-mono mt-1">
            الأجر الحقيقي: ${econ.laborProductivity.averageRealWageMonthly.toFixed(0)}
          </div>
        </div>

        <div
          onClick={() => onInspectMetric('currentAccountBalance')}
          className="bg-slate-900 border border-slate-800 rounded-lg p-3 hover:border-cyan-500/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>الحساب الجاري</span>
            <ExplainerBubble itemKey="foreignReservesMonths" lang={lang} size="sm" />
          </div>
          <div className={`text-lg font-bold font-mono mt-1 tabular-nums ${
            econ.capacityTrade.currentAccountBalanceUsd >= 0 ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {econ.capacityTrade.currentAccountBalanceUsd.toFixed(1)}{' '}
            <span className="text-[10px] text-slate-500">{t.units.billionUsd}</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">
            الاحتياطيات: ${currentState.macro.foreignReserves.toFixed(1)}B
          </div>
        </div>

        <div
          onClick={() => onInspectMetric('outputGapPct')}
          className="bg-slate-900 border border-slate-800 rounded-lg p-3 hover:border-cyan-500/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>فجوة الناتج (Gap)</span>
            <ExplainerBubble itemKey="householdPurchasingPower" lang={lang} size="sm" />
          </div>
          <div className={`text-lg font-bold font-mono mt-1 tabular-nums ${
            econ.nationalAccounts.outputGapPct >= 0 ? 'text-cyan-400' : 'text-amber-400'
          }`}>
            {econ.nationalAccounts.outputGapPct > 0 ? `+${econ.nationalAccounts.outputGapPct.toFixed(1)}%` : `${econ.nationalAccounts.outputGapPct.toFixed(1)}%`}
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">
            استغلال الطاقة: {econ.capacityTrade.capacityUtilizationPct.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Main Charts: Expenditure Decomposition & Solow Production */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* National Accounts Expenditure Breakdown */}
        <BarChartSvg
          title="مكونات الحسابات القومية والطلب الكلي (Y = C + I + G + X - M)"
          subtitle="توزيع بنود الناتج المحلي الإجمالي الحقيقي بأسعار الأساس"
          items={expenditureItems}
          unit={t.units.billionUsd}
          orientation="horizontal"
        />

        {/* Real vs Potential GDP Trajectory */}
        <LineChartSvg
          title="الناتج الفعلي مقابل الناتج الكامن ومسار الفجوة الاقتصادية"
          subtitle="مقارنة مسار الناتج الحقيقي بالناتج الممكن بدون إفراط تضخمي"
          series={[
            {
              id: 'realGdp',
              label: 'الناتج الحقيقي الفعلي ($B)',
              color: '#38bdf8',
              data: history.map((s) => ({ year: s.year, value: s.macro.realGdp })),
            },
            {
              id: 'potentialGdp',
              label: 'الناتج الكامن الممكن ($B)',
              color: '#94a3b8',
              data: history.map((s) => ({ year: s.year, value: s.economic.nationalAccounts.potentialGdp })),
              isDashed: true,
            },
          ]}
          unit={t.units.billionUsd}
        />
      </div>

      {/* Empirical Relationships: Scatter Plots for Scientific Validation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Phillips Curve Scatter */}
        <ScatterPlotSvg
          title="منحنى فيليبس التجريبي (العلاقة بين البطالة والتضخم)"
          subtitle="تتبع ديناميكية المقايضة بين معدل البطالة وتسارع الرقم القياسي لأسعار المستهلك"
          xAxisLabel="معدل البطالة (%)"
          yAxisLabel="معدل التضخم السنوي (%)"
          points={phillipsPoints}
          theoreticalCurve={{
            formulaLabel: 'π_t = π^e - β(u_t - u^n) + s_t',
            description: 'التضخم يتسارع عندما تنخفض البطالة دون المعدل الهيكلي الطبيعي، أو نتيجة صدمات العرض والسلع المستوردة.',
          }}
        />

        {/* Okun's Law Scatter */}
        <ScatterPlotSvg
          title="قانون أوكون (العلاقة بين نمو الناتج والبطالة)"
          subtitle="تتبع استجابة معدل البطالة لمعدلات النمو الاقتصادي فوق عتبة النمو التوازني"
          xAxisLabel="معدل نمو الناتج الحقيقي (%)"
          yAxisLabel="معدل البطالة (%)"
          points={okunsPoints}
          theoreticalCurve={{
            formulaLabel: 'Δu = -γ(g_y - g*)',
            description: 'تتراجع البطالة بمقدار تقريبي 0.4% مقابل كل 1% نمو إضافي في الناتج يفوق معدل النمو الكامن للاقتصاد.',
          }}
        />
      </div>

      {/* Income, Wages and Productivity Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <h3 className="text-sm font-semibold text-slate-100 mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>توزيع الدخل والإنتاجية والقوة الشرائية للأسر</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-slate-950 p-3 rounded border border-slate-800/80">
            <span className="text-slate-400 block text-[11px]">الدخل المتاح الاسمي للأسر</span>
            <span className="text-white font-bold text-base mt-1 block">
              ${econ.households.disposableIncomeNominal.toFixed(1)}B
            </span>
            <span className="text-slate-500 text-[10px]">بعد استقطاع الضرائب المباشرة</span>
          </div>

          <div className="bg-slate-950 p-3 rounded border border-slate-800/80">
            <span className="text-slate-400 block text-[11px]">معدل الادخار العائلي</span>
            <span className="text-cyan-400 font-bold text-base mt-1 block">
              {econ.households.householdSavingsRatePct.toFixed(1)}%
            </span>
            <span className="text-slate-500 text-[10px]">المدخرات: ${econ.households.householdSavingsNominal.toFixed(1)}B</span>
          </div>

          <div className="bg-slate-950 p-3 rounded border border-slate-800/80">
            <span className="text-slate-400 block text-[11px]">مؤشر القوة الشرائية الحقيقية</span>
            <span className="text-white font-bold text-base mt-1 block">
              {econ.households.purchasingPowerIndex.toFixed(1)}
            </span>
            <span className="text-slate-500 text-[10px]">سنة الأساس = 100</span>
          </div>

          <div className="bg-slate-950 p-3 rounded border border-slate-800/80">
            <span className="text-slate-400 block text-[11px]">حصة العمل من الناتج (Labor Share)</span>
            <span className="text-emerald-400 font-bold text-base mt-1 block">
              {econ.laborProductivity.laborShareOfGdpPct.toFixed(1)}%
            </span>
            <span className="text-slate-500 text-[10px]">إجمالي الأجور / الناتج الاسمي</span>
          </div>
        </div>
      </div>
    </div>
  );
};
