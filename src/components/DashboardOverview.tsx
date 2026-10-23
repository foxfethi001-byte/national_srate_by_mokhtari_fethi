/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Overview Dashboard Component
 * لوحة القيادة العامة للمحاكاة الوطنية
 */

import React from 'react';
import { SimulationState } from '../types/simulation';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { MetricCard } from './MetricCard';
import { LineChartSvg } from './charts/LineChartSvg';
import { AlertTriangle, TrendingUp, ShieldAlert, Cpu } from 'lucide-react';

interface DashboardOverviewProps {
  currentState: SimulationState;
  previousState?: SimulationState;
  baselineState: SimulationState;
  history: SimulationState[];
  lang: Language;
  onInspectMetric: (metricKey: string) => void;
  onNavigateToTab: (tabId: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  currentState,
  previousState,
  baselineState,
  history,
  lang,
  onInspectMetric,
  onNavigateToTab,
}) => {
  const t = TRANSLATIONS[lang];

  // System vulnerability signals
  const alerts: { id: string; textAr: string; textEn: string; severity: 'high' | 'medium' }[] = [];

  if (currentState.macro.debtToGdpRatio > 100) {
    alerts.push({
      id: 'DEBT_CRITICAL',
      textAr: `تجاوز الدين العام عتبة الأمان الاستراتيجي (${currentState.macro.debtToGdpRatio}% من الناتج)، مما يرفع علاوة المخاطر السيادية وكلفة الاقتراض.`,
      textEn: `Public debt exceeds strategic threshold (${currentState.macro.debtToGdpRatio}% of GDP), elevating sovereign risk premiums and debt servicing costs.`,
      severity: 'high',
    });
  } else if (currentState.macro.debtToGdpRatio > 75) {
    alerts.push({
      id: 'DEBT_ELEVATED',
      textAr: `نسبة الدين العام مرتفعة (${currentState.macro.debtToGdpRatio}% من الناتج)، مما يقلص الحيز المالي أمام الصدمات المستقبلية.`,
      textEn: `Elevated public debt ratio (${currentState.macro.debtToGdpRatio}% of GDP) restricts fiscal space against future shocks.`,
      severity: 'medium',
    });
  }

  if (currentState.macro.inflationRate > 10) {
    alerts.push({
      id: 'INFLATION_HIGH',
      textAr: `تسارع التضخم لمستويات مقلقة (${currentState.macro.inflationRate}%)، مما يؤدي لتآكل الدخل الحقيقي ويدفع البنك المركزي للتشديد النقدي الحاد.`,
      textEn: `Inflation has spiked to concerning levels (${currentState.macro.inflationRate}%), eroding real household income and forcing monetary tightening.`,
      severity: 'high',
    });
  }

  if (currentState.governance.socialTensionIndex > 65) {
    alerts.push({
      id: 'SOCIAL_UNREST',
      textAr: `ارتفاع مؤشر الاحتقان الاجتماعي (${currentState.governance.socialTensionIndex}/100) بسبب تراكم ضغوط المعيشة وبطالة الشباب والتفاوت الطبقي.`,
      textEn: `Social tension index elevated (${currentState.governance.socialTensionIndex}/100) driven by living costs, youth joblessness, and inequality.`,
      severity: 'high',
    });
  }

  if (currentState.governance.pensionFundSolvencyPct < 60) {
    alerts.push({
      id: 'PENSION_RISK',
      textAr: `تراجع الملاءة المالية لصناديق التقاعد إلى ${currentState.governance.pensionFundSolvencyPct}% نتيجة الشيخوخة السكانية واتساع فجوة الاشتراكات.`,
      textEn: `Pension solvency fell to ${currentState.governance.pensionFundSolvencyPct}% due to demographic aging and widening contribution deficits.`,
      severity: 'medium',
    });
  }

  // Time-series preparations
  const gdpSeries = [
    {
      id: 'realGdp',
      label: t.metrics.realGdp,
      color: '#38bdf8',
      data: history.map((s) => ({ year: s.year, value: s.macro.realGdp })),
    },
    {
      id: 'gdpGrowth',
      label: `${t.metrics.realGdpGrowthRate} (%)`,
      color: '#34d399',
      data: history.map((s) => ({ year: s.year, value: s.macro.realGdpGrowthRate })),
      isDashed: true,
    },
  ];

  const fiscalSeries = [
    {
      id: 'debtRatio',
      label: t.metrics.debtToGdpRatio,
      color: '#f87171',
      data: history.map((s) => ({ year: s.year, value: s.macro.debtToGdpRatio })),
    },
    {
      id: 'deficitRatio',
      label: 'نسبة العجز (% الناتج)',
      color: '#fbbf24',
      data: history.map((s) => ({
        year: s.year,
        value: Math.round(((s.macro.overallDeficit / s.macro.nominalGdp) * 100) * 10) / 10,
      })),
      isDashed: true,
    },
  ];

  const monetarySeries = [
    {
      id: 'inflation',
      label: t.metrics.inflationRate,
      color: '#f97316',
      data: history.map((s) => ({ year: s.year, value: s.macro.inflationRate })),
    },
    {
      id: 'policyRate',
      label: t.metrics.centralBankRate,
      color: '#a855f7',
      data: history.map((s) => ({ year: s.year, value: s.macro.centralBankRate })),
    },
    {
      id: 'bondYield',
      label: t.metrics.sovereignBondYield10y,
      color: '#cbd5e1',
      data: history.map((s) => ({ year: s.year, value: s.macro.sovereignBondYield10y })),
      isDashed: true,
    },
  ];

  const energySeries = [
    {
      id: 'renewable',
      label: t.metrics.renewableEnergyPct,
      color: '#10b981',
      data: history.map((s) => ({ year: s.year, value: s.energy.renewableEnergyPct })),
    },
    {
      id: 'fossil',
      label: t.metrics.fossilEnergyPct,
      color: '#94a3b8',
      data: history.map((s) => ({ year: s.year, value: s.energy.fossilEnergyPct })),
      isDashed: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Scientific Neutrality Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 text-xs text-slate-400 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{t.scientificNote}</span>
        </div>
        <button
          onClick={() => onNavigateToTab('causality')}
          className="text-cyan-400 hover:text-cyan-300 font-medium whitespace-nowrap cursor-pointer"
        >
          {t.tabs.causality} &larr;
        </button>
      </div>

      {/* System Vulnerabilities & Alert Panel if any */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border text-xs flex items-start gap-3 ${
                alert.severity === 'high'
                  ? 'bg-rose-950/40 border-rose-800/80 text-rose-200'
                  : 'bg-amber-950/40 border-amber-800/80 text-amber-200'
              }`}
            >
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                {lang === 'ar' ? alert.textAr : alert.textEn}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <MetricCard
          label={t.metrics.realGdp}
          value={currentState.macro.realGdp}
          unit={t.units.billionUsd}
          previousValue={previousState?.macro.realGdp}
          baselineValue={baselineState.macro.realGdp}
          onClickInspect={() => onInspectMetric('realGdp')}
        />
        <MetricCard
          label={t.metrics.realGdpGrowthRate}
          value={currentState.macro.realGdpGrowthRate}
          unit="%"
          previousValue={previousState?.macro.realGdpGrowthRate}
          baselineValue={baselineState.macro.realGdpGrowthRate}
          onClickInspect={() => onInspectMetric('realGdpGrowthRate')}
        />
        <MetricCard
          label={t.metrics.inflationRate}
          value={currentState.macro.inflationRate}
          unit="%"
          previousValue={previousState?.macro.inflationRate}
          baselineValue={baselineState.macro.inflationRate}
          invertColor
          onClickInspect={() => onInspectMetric('inflationRate')}
        />
        <MetricCard
          label={t.metrics.debtToGdpRatio}
          value={currentState.macro.debtToGdpRatio}
          unit="%"
          previousValue={previousState?.macro.debtToGdpRatio}
          baselineValue={baselineState.macro.debtToGdpRatio}
          invertColor
          onClickInspect={() => onInspectMetric('debtToGdpRatio')}
        />
        <MetricCard
          label={t.metrics.unemploymentRate}
          value={currentState.demographics.unemploymentRate}
          unit="%"
          previousValue={previousState?.demographics.unemploymentRate}
          baselineValue={baselineState.demographics.unemploymentRate}
          invertColor
          onClickInspect={() => onInspectMetric('unemploymentRate')}
        />
        <MetricCard
          label={t.metrics.renewableEnergyPct}
          value={currentState.energy.renewableEnergyPct}
          unit="%"
          previousValue={previousState?.energy.renewableEnergyPct}
          baselineValue={baselineState.energy.renewableEnergyPct}
          onClickInspect={() => onInspectMetric('renewableEnergyPct')}
        />
        <MetricCard
          label={t.metrics.socialTensionIndex}
          value={currentState.governance.socialTensionIndex}
          unit="/100"
          previousValue={previousState?.governance.socialTensionIndex}
          baselineValue={baselineState.governance.socialTensionIndex}
          invertColor
          onClickInspect={() => onInspectMetric('socialTensionIndex')}
        />
      </div>

      {/* Dynamic Multi-Series Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Real GDP & Growth */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-200">
              مسار الناتج المحلي الحقيقي ومعدل النمو السنوي
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              {baselineState.year} &rarr; {currentState.year}
            </span>
          </div>
          <LineChartSvg series={gdpSeries} unit="$B" height={190} />
        </div>

        {/* Chart 2: Public Debt & Budget Deficit */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-200">
              استدامة المالية العامة: الدين والعجز كنسبة من الناتج
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              سقف الأمان: 60%
            </span>
          </div>
          <LineChartSvg
            series={fiscalSeries}
            unit="%"
            height={190}
            referenceLineY={60}
            referenceLineLabel="عتبة الأمان (60%)"
          />
        </div>

        {/* Chart 3: Inflation, Policy Rate & Bond Yield */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-200">
              السياسة النقدية والتضخم وعوائد السندات السيادية
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              معدلات الفائدة (%)
            </span>
          </div>
          <LineChartSvg series={monetarySeries} unit="%" height={190} />
        </div>

        {/* Chart 4: Energy Transition */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-200">
              التحول الطاقي: حصة الطاقة المتجددة مقابل الوقود الأحفوري
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              الانبعاثات: {currentState.energy.annualCo2EmissionsMt} {t.units.mtCo2}
            </span>
          </div>
          <LineChartSvg series={energySeries} unit="%" height={190} />
        </div>
      </div>

      {/* Fiscal Architecture Breakdown & Demographics Cohort Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fiscal Balance Flow */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-200">
              الميزانية العامة: مقارنة الإيرادات والنفقات
            </h3>
            <span className="text-xs font-mono text-slate-400">
              العجز الصافي: {currentState.macro.overallDeficit > 0 ? '-' : '+'}
              {Math.abs(currentState.macro.overallDeficit)} {t.units.billionUsd}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Revenue bar */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>إجمالي الإيرادات المحصلة</span>
                <span className="font-mono tabular-nums font-semibold text-emerald-400">
                  {currentState.macro.totalRevenue} {t.units.billionUsd}
                </span>
              </div>
              <div className="h-3 bg-slate-800 rounded overflow-hidden flex">
                <div
                  title="ضريبة الدخل"
                  style={{ width: `${(currentState.macro.taxRevenueIncome / currentState.macro.totalRevenue) * 100}%` }}
                  className="bg-blue-500"
                />
                <div
                  title="ضريبة الشركات"
                  style={{ width: `${(currentState.macro.taxRevenueCorporate / currentState.macro.totalRevenue) * 100}%` }}
                  className="bg-cyan-500"
                />
                <div
                  title="ضريبة القيمة المضافة"
                  style={{ width: `${(currentState.macro.taxRevenueVat / currentState.macro.totalRevenue) * 100}%` }}
                  className="bg-indigo-500"
                />
                <div
                  title="الجمارك"
                  style={{ width: `${(currentState.macro.taxRevenueTariffs / currentState.macro.totalRevenue) * 100}%` }}
                  className="bg-purple-500"
                />
                <div
                  title="ريوع الموارد الطبيعية"
                  style={{ width: `${(currentState.macro.resourceRentsRevenue / currentState.macro.totalRevenue) * 100}%` }}
                  className="bg-amber-500"
                />
              </div>
            </div>

            {/* Expenditure bar */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>إجمالي النفقات العامة المنفذة</span>
                <span className="font-mono tabular-nums font-semibold text-rose-400">
                  {currentState.macro.totalExpenditure} {t.units.billionUsd}
                </span>
              </div>
              <div className="h-3 bg-slate-800 rounded overflow-hidden flex">
                <div
                  title="أجور القطاع العام"
                  style={{ width: `${(currentState.macro.expenditurePublicWages / currentState.macro.totalExpenditure) * 100}%` }}
                  className="bg-rose-500"
                />
                <div
                  title="الصحة"
                  style={{ width: `${(currentState.macro.expenditureHealthcare / currentState.macro.totalExpenditure) * 100}%` }}
                  className="bg-teal-500"
                />
                <div
                  title="التعليم"
                  style={{ width: `${(currentState.macro.expenditureEducation / currentState.macro.totalExpenditure) * 100}%` }}
                  className="bg-sky-500"
                />
                <div
                  title="البنية التحتية"
                  style={{ width: `${(currentState.macro.expenditureInfrastructure / currentState.macro.totalExpenditure) * 100}%` }}
                  className="bg-emerald-500"
                />
                <div
                  title="الحماية الاجتماعية"
                  style={{ width: `${(currentState.macro.expenditureSocialSafety / currentState.macro.totalExpenditure) * 100}%` }}
                  className="bg-orange-500"
                />
                <div
                  title="الدفاع"
                  style={{ width: `${(currentState.macro.expenditureDefense / currentState.macro.totalExpenditure) * 100}%` }}
                  className="bg-slate-500"
                />
                <div
                  title="خدمة الدين"
                  style={{ width: `${(currentState.macro.expenditureDebtInterest / currentState.macro.totalExpenditure) * 100}%` }}
                  className="bg-red-700"
                />
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 flex flex-wrap gap-3">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-rose-500" />أجور عامة: {currentState.macro.expenditurePublicWages} $B</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-teal-500" />صحة: {currentState.macro.expenditureHealthcare} $B</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-sky-500" />تعليم: {currentState.macro.expenditureEducation} $B</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500" />بنية تحتية: {currentState.macro.expenditureInfrastructure} $B</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-red-700" />خدمة دين: {currentState.macro.expenditureDebtInterest} $B</span>
            </div>
          </div>
        </div>

        {/* Demographics Cohort Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-200">
              الهيكل الديموغرافي ونسب الإعالة
            </h3>
            <span className="text-xs font-mono text-slate-400">
              السكان: {currentState.demographics.totalPopulation} مليون
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>توزيع الفئات العمرية الثلاث</span>
                <span className="font-mono text-slate-400">
                  نسبة الإعالة: {currentState.demographics.dependencyRatio}%
                </span>
              </div>
              <div className="h-4 bg-slate-800 rounded overflow-hidden flex font-mono text-[10px] text-white">
                <div
                  style={{ width: `${(currentState.demographics.cohortYouth / currentState.demographics.totalPopulation) * 100}%` }}
                  className="bg-sky-600 flex items-center justify-center"
                  title="الشباب (0-14)"
                >
                  {Math.round((currentState.demographics.cohortYouth / currentState.demographics.totalPopulation) * 100)}%
                </div>
                <div
                  style={{ width: `${(currentState.demographics.cohortWorkingAge / currentState.demographics.totalPopulation) * 100}%` }}
                  className="bg-emerald-600 flex items-center justify-center"
                  title="الفئة العاملة (15-64)"
                >
                  {Math.round((currentState.demographics.cohortWorkingAge / currentState.demographics.totalPopulation) * 100)}%
                </div>
                <div
                  style={{ width: `${(currentState.demographics.cohortElderly / currentState.demographics.totalPopulation) * 100}%` }}
                  className="bg-purple-600 flex items-center justify-center"
                  title="كبار السن (65+)"
                >
                  {Math.round((currentState.demographics.cohortElderly / currentState.demographics.totalPopulation) * 100)}%
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-xs">
              <div className="p-2 rounded bg-slate-800/60 border border-slate-700/60">
                <div className="text-[10px] text-slate-400">الشباب (0-14)</div>
                <div className="text-base font-bold text-sky-400 tabular-nums">
                  {currentState.demographics.cohortYouth} M
                </div>
                <div className="text-[10px] text-slate-500">الخصوبة: {currentState.demographics.fertilityRate}</div>
              </div>
              <div className="p-2 rounded bg-slate-800/60 border border-slate-700/60">
                <div className="text-[10px] text-slate-400">القوى العاملة</div>
                <div className="text-base font-bold text-emerald-400 tabular-nums">
                  {currentState.demographics.cohortWorkingAge} M
                </div>
                <div className="text-[10px] text-slate-500">المشاركة: {currentState.demographics.laborForceParticipationRate}%</div>
              </div>
              <div className="p-2 rounded bg-slate-800/60 border border-slate-700/60">
                <div className="text-[10px] text-slate-400">كبار السن (65+)</div>
                <div className="text-base font-bold text-purple-400 tabular-nums">
                  {currentState.demographics.cohortElderly} M
                </div>
                <div className="text-[10px] text-slate-500">العمر المتوقع: {currentState.demographics.lifeExpectancy} س</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
