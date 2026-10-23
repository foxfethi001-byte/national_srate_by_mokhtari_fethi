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

  // Visual state indicator thresholds for simulated macroeconomic indicators
  const growthRate = currentState.macro.realGdpGrowthRate;
  const growthStatus: 'normal' | 'warning' | 'critical' =
    growthRate >= 2.0 ? 'normal' : growthRate >= 0 ? 'warning' : 'critical';

  const inflationRate = currentState.macro.inflationRate;
  const inflationStatus: 'normal' | 'warning' | 'critical' =
    inflationRate <= 4.0 ? 'normal' : inflationRate <= 7.0 ? 'warning' : 'critical';

  const unemploymentRate = currentState.demographics.unemploymentRate;
  const unemploymentStatus: 'normal' | 'warning' | 'critical' =
    unemploymentRate <= 7.5 ? 'normal' : unemploymentRate <= 11.0 ? 'warning' : 'critical';

  const productivityWage = econ.laborProductivity.averageRealWageMonthly;
  const productivityStatus: 'normal' | 'warning' | 'critical' =
    productivityWage >= 1200 ? 'normal' : productivityWage >= 900 ? 'warning' : 'critical';

  const caBalance = econ.capacityTrade.currentAccountBalanceUsd;
  const caStatus: 'normal' | 'warning' | 'critical' =
    caBalance >= -1.5 ? 'normal' : caBalance >= -4.0 ? 'warning' : 'critical';

  const outputGap = econ.nationalAccounts.outputGapPct;
  const gapAbs = Math.abs(outputGap);
  const gapStatus: 'normal' | 'warning' | 'critical' =
    gapAbs <= 1.8 ? 'normal' : gapAbs <= 3.5 ? 'warning' : 'critical';

  const renderStatusDot = (status: 'normal' | 'warning' | 'critical', tooltip: string) => (
    <span className="relative flex h-2 w-2 flex-shrink-0" title={tooltip}>
      {status === 'critical' ? (
        <>
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.7)]"></span>
        </>
      ) : status === 'warning' ? (
        <>
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]"></span>
        </>
      ) : (
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]"></span>
      )}
    </span>
  );

  return (
    <div className="space-y-6">
      {/* Top Macro Indicators Banner with Glassmorphism and Visual Threshold Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Real GDP */}
        <div
          onClick={() => onInspectMetric('realGdp')}
          className="glass-card rounded-xl p-3.5 border border-slate-800/80 hover:border-cyan-500/40 hover:shadow-[0_4px_20px_rgba(6,182,212,0.12)] transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 min-w-0">
              {renderStatusDot(
                growthStatus,
                growthStatus === 'critical'
                  ? (lang === 'ar' ? 'انكماش اقتصادي تحت الصفر (حرج)' : 'Economic contraction below zero (Critical)')
                  : growthStatus === 'warning'
                  ? (lang === 'ar' ? 'نمو بطيء دون المعدل المستهدف' : 'Below target growth (Warning)')
                  : (lang === 'ar' ? 'نمو ضمن النطاق المستهدف الصحي' : 'Healthy target growth (Normal)')
              )}
              <span className="truncate">{lang === 'ar' ? 'الناتج الحقيقي' : 'Real GDP'}</span>
            </div>
            <ExplainerBubble itemKey="gdpReal" lang={lang} size="sm" />
          </div>
          <div className="text-lg font-bold font-mono text-white mt-1 tabular-nums">
            {currentState.macro.realGdp.toFixed(1)}{' '}
            <span className="text-[10px] text-slate-500">{t.units.billionUsd}</span>
          </div>
          <div className={`text-[10px] font-mono mt-1 ${growthRate >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {lang === 'ar' ? 'نمو' : 'Growth'}: {growthRate >= 0 ? `+${growthRate.toFixed(1)}%` : `${growthRate.toFixed(1)}%`}
          </div>
        </div>

        {/* Inflation (CPI) */}
        <div
          onClick={() => onInspectMetric('inflationRate')}
          className="glass-card rounded-xl p-3.5 border border-slate-800/80 hover:border-cyan-500/40 hover:shadow-[0_4px_20px_rgba(6,182,212,0.12)] transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 min-w-0">
              {renderStatusDot(
                inflationStatus,
                inflationStatus === 'critical'
                  ? (lang === 'ar' ? 'تضخم مرتفع فوق 7% (حرج)' : 'High inflation >7% (Critical)')
                  : inflationStatus === 'warning'
                  ? (lang === 'ar' ? 'تضخم أعلى من المستهدف (4-7%)' : 'Above target inflation 4-7% (Warning)')
                  : (lang === 'ar' ? 'تضخم معتدل مستقر (<=4%)' : 'Moderate stable inflation <=4% (Normal)')
              )}
              <span className="truncate">{lang === 'ar' ? 'التضخم (CPI)' : 'Inflation (CPI)'}</span>
            </div>
            <ExplainerBubble itemKey="inflationRate" lang={lang} size="sm" />
          </div>
          <div className={`text-lg font-bold font-mono mt-1 tabular-nums ${
            inflationStatus === 'critical' ? 'text-rose-400' : inflationStatus === 'warning' ? 'text-amber-400' : 'text-white'
          }`}>
            {currentState.macro.inflationRate.toFixed(1)}%
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">
            {lang === 'ar' ? 'فائدة المركزي' : 'CB Rate'}: {currentState.macro.centralBankRate.toFixed(1)}%
          </div>
        </div>

        {/* Unemployment */}
        <div
          onClick={() => onInspectMetric('unemploymentRate')}
          className="glass-card rounded-xl p-3.5 border border-slate-800/80 hover:border-cyan-500/40 hover:shadow-[0_4px_20px_rgba(6,182,212,0.12)] transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 min-w-0">
              {renderStatusDot(
                unemploymentStatus,
                unemploymentStatus === 'critical'
                  ? (lang === 'ar' ? 'بطالة مرتفعة تفوق 11% (حرج)' : 'High unemployment >11% (Critical)')
                  : unemploymentStatus === 'warning'
                  ? (lang === 'ar' ? 'بطالة أعلى من المعدل الطبيعي (7.5-11%)' : 'Elevated unemployment 7.5-11% (Warning)')
                  : (lang === 'ar' ? 'سوق عمل منضبط (<=7.5%)' : 'Controlled labor market <=7.5% (Normal)')
              )}
              <span className="truncate">{lang === 'ar' ? 'معدل البطالة' : 'Unemployment'}</span>
            </div>
            <ExplainerBubble itemKey="unemploymentRate" lang={lang} size="sm" />
          </div>
          <div className={`text-lg font-bold font-mono mt-1 tabular-nums ${
            unemploymentStatus === 'critical' ? 'text-rose-400' : unemploymentStatus === 'warning' ? 'text-amber-400' : 'text-white'
          }`}>
            {currentState.demographics.unemploymentRate.toFixed(1)}%
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">
            {lang === 'ar' ? 'الشباب' : 'Youth'}: {currentState.demographics.youthUnemploymentRate.toFixed(1)}%
          </div>
        </div>

        {/* Labor Productivity */}
        <div
          onClick={() => onInspectMetric('laborProductivityPerWorker')}
          className="glass-card rounded-xl p-3.5 border border-slate-800/80 hover:border-cyan-500/40 hover:shadow-[0_4px_20px_rgba(6,182,212,0.12)] transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 min-w-0">
              {renderStatusDot(
                productivityStatus,
                productivityStatus === 'critical'
                  ? (lang === 'ar' ? 'إنتاجية وأجور منخفضة دون الحد (حرج)' : 'Depressed productivity/wages (Critical)')
                  : productivityStatus === 'warning'
                  ? (lang === 'ar' ? 'إنتاجية تتطلب تحفيزاً وتأهيلاً' : 'Sub-optimal productivity (Warning)')
                  : (lang === 'ar' ? 'إنتاجية وأجور تنافسية مستقرة' : 'Competitive productivity (Normal)')
              )}
              <span className="truncate">{lang === 'ar' ? 'إنتاجية العامل' : 'Productivity'}</span>
            </div>
            <ExplainerBubble itemKey="totalInvestment" lang={lang} size="sm" />
          </div>
          <div className="text-lg font-bold font-mono text-white mt-1 tabular-nums">
            {econ.laborProductivity.laborProductivityPerWorker.toFixed(1)}{' '}
            <span className="text-[10px] text-slate-500">{lang === 'ar' ? 'ألف $' : 'k$'}</span>
          </div>
          <div className="text-[10px] text-cyan-400 font-mono mt-1">
            {lang === 'ar' ? 'الأجر الحقيقي' : 'Real Wage'}: ${econ.laborProductivity.averageRealWageMonthly.toFixed(0)}
          </div>
        </div>

        {/* Current Account */}
        <div
          onClick={() => onInspectMetric('currentAccountBalance')}
          className="glass-card rounded-xl p-3.5 border border-slate-800/80 hover:border-cyan-500/40 hover:shadow-[0_4px_20px_rgba(6,182,212,0.12)] transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 min-w-0">
              {renderStatusDot(
                caStatus,
                caStatus === 'critical'
                  ? (lang === 'ar' ? 'عجز حساب جاري جسيم يهدد الاحتياطي (حرج)' : 'Severe CA deficit (Critical)')
                  : caStatus === 'warning'
                  ? (lang === 'ar' ? 'عجز خارجي معتدل تحت المراقبة' : 'Moderate external deficit (Warning)')
                  : (lang === 'ar' ? 'ميزان خارجي متوازن أو إيجابي' : 'Balanced external position (Normal)')
              )}
              <span className="truncate">{lang === 'ar' ? 'الحساب الجاري' : 'Current Account'}</span>
            </div>
            <ExplainerBubble itemKey="foreignReservesMonths" lang={lang} size="sm" />
          </div>
          <div className={`text-lg font-bold font-mono mt-1 tabular-nums ${
            econ.capacityTrade.currentAccountBalanceUsd >= 0 ? 'text-emerald-400' : caStatus === 'critical' ? 'text-rose-400' : 'text-amber-400'
          }`}>
            {econ.capacityTrade.currentAccountBalanceUsd >= 0 ? `+${econ.capacityTrade.currentAccountBalanceUsd.toFixed(1)}` : econ.capacityTrade.currentAccountBalanceUsd.toFixed(1)}{' '}
            <span className="text-[10px] text-slate-500">{t.units.billionUsd}</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">
            {lang === 'ar' ? 'الاحتياطيات' : 'Reserves'}: ${currentState.macro.foreignReserves.toFixed(1)}B
          </div>
        </div>

        {/* Output Gap */}
        <div
          onClick={() => onInspectMetric('outputGapPct')}
          className="glass-card rounded-xl p-3.5 border border-slate-800/80 hover:border-cyan-500/40 hover:shadow-[0_4px_20px_rgba(6,182,212,0.12)] transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 min-w-0">
              {renderStatusDot(
                gapStatus,
                gapStatus === 'critical'
                  ? (lang === 'ar' ? 'فجوة ركود حادة أو إفراط تضخمي فائق (حرج)' : 'Extreme output gap (Critical)')
                  : gapStatus === 'warning'
                  ? (lang === 'ar' ? 'فجوة ناتج متوسطة دون الطاقة الكامنة' : 'Moderate output gap (Warning)')
                  : (lang === 'ar' ? 'يعمل الاقتصاد قرب الناتج الكامن الطبيعي' : 'Operating near potential (Normal)')
              )}
              <span className="truncate">{lang === 'ar' ? 'فجوة الناتج (Gap)' : 'Output Gap'}</span>
            </div>
            <ExplainerBubble itemKey="householdPurchasingPower" lang={lang} size="sm" />
          </div>
          <div className={`text-lg font-bold font-mono mt-1 tabular-nums ${
            gapStatus === 'critical' ? 'text-rose-400' : gapStatus === 'warning' ? 'text-amber-400' : 'text-cyan-400'
          }`}>
            {econ.nationalAccounts.outputGapPct > 0 ? `+${econ.nationalAccounts.outputGapPct.toFixed(1)}%` : `${econ.nationalAccounts.outputGapPct.toFixed(1)}%`}
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">
            {lang === 'ar' ? 'استغلال الطاقة' : 'Capacity'}: {econ.capacityTrade.capacityUtilizationPct.toFixed(1)}%
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
      <div className="glass-panel rounded-2xl border border-slate-800/80 p-5 shadow-lg">
        <h3 className="text-sm font-semibold text-slate-100 mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>{lang === 'ar' ? 'توزيع الدخل والإنتاجية والقوة الشرائية للأسر' : 'Income Distribution, Productivity & Purchasing Power'}</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="glass-card p-3 rounded-xl border border-slate-800/70 hover:border-slate-700/80 transition-all">
            <span className="text-slate-400 block text-[11px] font-sans">{lang === 'ar' ? 'الدخل المتاح الاسمي للأسر' : 'Disposable Household Income'}</span>
            <span className="text-white font-bold text-base mt-1 block">
              ${econ.households.disposableIncomeNominal.toFixed(1)}B
            </span>
            <span className="text-slate-500 text-[10px] font-sans">{lang === 'ar' ? 'بعد استقطاع الضرائب المباشرة' : 'Net of direct income taxes'}</span>
          </div>

          <div className="glass-card p-3 rounded-xl border border-slate-800/70 hover:border-slate-700/80 transition-all">
            <span className="text-slate-400 block text-[11px] font-sans">{lang === 'ar' ? 'معدل الادخار العائلي' : 'Household Savings Rate'}</span>
            <span className="text-cyan-400 font-bold text-base mt-1 block">
              {econ.households.householdSavingsRatePct.toFixed(1)}%
            </span>
            <span className="text-slate-500 text-[10px] font-sans">{lang === 'ar' ? `المدخرات: $${econ.households.householdSavingsNominal.toFixed(1)}B` : `Savings: $${econ.households.householdSavingsNominal.toFixed(1)}B`}</span>
          </div>

          <div className="glass-card p-3 rounded-xl border border-slate-800/70 hover:border-slate-700/80 transition-all">
            <span className="text-slate-400 block text-[11px] font-sans">{lang === 'ar' ? 'مؤشر القوة الشرائية الحقيقية' : 'Real Purchasing Power Index'}</span>
            <span className="text-white font-bold text-base mt-1 block">
              {econ.households.purchasingPowerIndex.toFixed(1)}
            </span>
            <span className="text-slate-500 text-[10px] font-sans">{lang === 'ar' ? 'سنة الأساس = 100' : 'Baseline year = 100'}</span>
          </div>

          <div className="glass-card p-3 rounded-xl border border-slate-800/70 hover:border-slate-700/80 transition-all">
            <span className="text-slate-400 block text-[11px] font-sans">{lang === 'ar' ? 'حصة العمل من الناتج' : 'Labor Share of GDP'}</span>
            <span className="text-emerald-400 font-bold text-base mt-1 block">
              {econ.laborProductivity.laborShareOfGdpPct.toFixed(1)}%
            </span>
            <span className="text-slate-500 text-[10px] font-sans">{lang === 'ar' ? 'إجمالي الأجور / الناتج الاسمي' : 'Total compensation / Nominal GDP'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
