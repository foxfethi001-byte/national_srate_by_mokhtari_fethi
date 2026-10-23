/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * National Overview & Multi-Sector Scorecard (Phase 3)
 * بطاقة الأداء الوطني الشاملة والمؤشرات الاستراتيجية مع الأهداف والمحاذير
 */

import React, { useState } from 'react';
import { SimulationState, ConfidenceLevel } from '../types/simulation';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { LineChartSvg } from './charts/LineChartSvg';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  ArrowUpRight,
  ShieldAlert,
  Target,
  Sliders,
  Info,
} from 'lucide-react';
import { ExplainerBubble } from './common/ExplainerBubble';

export interface StrategicIndicator {
  key: string;
  labelAr: string;
  labelEn: string;
  sectorAr: string;
  sectorEn: string;
  currentValue: number;
  previousValue?: number;
  unit: string;
  target?: number;
  warningStatus: 'normal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'neutral';
  trendPositive: boolean; // Is 'up' beneficial? e.g. GDP up is good, Unemployment up is bad
  provenanceAr: string;
  provenanceEn: string;
  confidence: ConfidenceLevel;
}

interface NationalOverviewProps {
  currentState: SimulationState;
  previousState?: SimulationState;
  baselineState: SimulationState;
  history: SimulationState[];
  lang: Language;
  onInspectMetric: (metricKey: string) => void;
  onNavigateToTab: (tabId: string) => void;
}

export const NationalOverview: React.FC<NationalOverviewProps> = ({
  currentState,
  previousState,
  baselineState,
  history,
  lang,
  onInspectMetric,
  onNavigateToTab,
}) => {
  const t = TRANSLATIONS[lang];

  // Configurable targets for national indicators
  const [targets, setTargets] = useState<Record<string, number>>({
    gdpGrowth: 3.5, // 3.5%
    inflation: 2.5, // 2.5%
    debtToGdp: 60.0, // 60%
    unemployment: 5.0, // 5%
    renewableEnergy: 40.0, // 40%
    publicServiceCapacity: 80.0, // 80/100
  });

  const [showTargetEditor, setShowTargetEditor] = useState<boolean>(false);
  const [filterSector, setFilterSector] = useState<string>('all');

  // Compute scorecard indicators
  const indicators: StrategicIndicator[] = [
    {
      key: 'realGdp',
      labelAr: 'الناتج المحلي الإجمالي الحقيقي',
      labelEn: 'Real GDP',
      sectorAr: 'الاقتصاد الكلي',
      sectorEn: 'Macroeconomy',
      currentValue: currentState.macro.realGdp,
      previousValue: previousState?.macro.realGdp,
      unit: t.units.billionUsd,
      warningStatus: currentState.macro.realGdpGrowthRate < 0 ? 'critical' : currentState.macro.realGdpGrowthRate < 1.5 ? 'warning' : 'normal',
      trend: (previousState?.macro.realGdp ?? currentState.macro.realGdp) < currentState.macro.realGdp ? 'up' : (previousState?.macro.realGdp ?? currentState.macro.realGdp) > currentState.macro.realGdp ? 'down' : 'neutral',
      trendPositive: true,
      provenanceAr: 'متطابقة الحسابات القومية (C + I + G + X - M) مقومة بالأسعار الثابتة',
      provenanceEn: 'National accounts identity deflated by GDP deflator',
      confidence: 'accounting_identity',
    },
    {
      key: 'realGdpGrowthRate',
      labelAr: 'معدل النمو الاقتصادي السنوي',
      labelEn: 'Annual Real GDP Growth',
      sectorAr: 'الاقتصاد الكلي',
      sectorEn: 'Macroeconomy',
      currentValue: currentState.macro.realGdpGrowthRate,
      previousValue: previousState?.macro.realGdpGrowthRate,
      unit: '%',
      target: targets.gdpGrowth,
      warningStatus: currentState.macro.realGdpGrowthRate < 0 ? 'critical' : currentState.macro.realGdpGrowthRate < 1.5 ? 'warning' : 'normal',
      trend: (previousState?.macro.realGdpGrowthRate ?? currentState.macro.realGdpGrowthRate) < currentState.macro.realGdpGrowthRate ? 'up' : 'down',
      trendPositive: true,
      provenanceAr: 'دالة الإنتاج سولوه-كوب-دوغلاس ومساهمات الإنتاجية الكلية TFP',
      provenanceEn: 'Solow-Cobb-Douglas production function and TFP growth',
      confidence: 'high_empirical',
    },
    {
      key: 'inflationRate',
      labelAr: 'معدل التضخم السنوي (CPI)',
      labelEn: 'Inflation Rate (CPI)',
      sectorAr: 'الأسعار والنقد',
      sectorEn: 'Monetary & Prices',
      currentValue: currentState.macro.inflationRate,
      previousValue: previousState?.macro.inflationRate,
      unit: '%',
      target: targets.inflation,
      warningStatus: currentState.macro.inflationRate > 10 ? 'critical' : currentState.macro.inflationRate > 5 ? 'warning' : 'normal',
      trend: (previousState?.macro.inflationRate ?? currentState.macro.inflationRate) < currentState.macro.inflationRate ? 'up' : 'down',
      trendPositive: false,
      provenanceAr: 'منحنى فيليبس المعزز بالتوقعات وفجوة الناتج وضغوط الاستيراد',
      provenanceEn: 'Expectations-augmented Phillips curve with import shocks',
      confidence: 'high_empirical',
    },
    {
      key: 'debtToGdpRatio',
      labelAr: 'نسبة الدين العام إلى الناتج',
      labelEn: 'Public Debt-to-GDP Ratio',
      sectorAr: 'المالية العامة',
      sectorEn: 'Fiscal & Debt',
      currentValue: currentState.macro.debtToGdpRatio,
      previousValue: previousState?.macro.debtToGdpRatio,
      unit: '%',
      target: targets.debtToGdp,
      warningStatus: currentState.macro.debtToGdpRatio > 90 ? 'critical' : currentState.macro.debtToGdpRatio > 70 ? 'warning' : 'normal',
      trend: (previousState?.macro.debtToGdpRatio ?? currentState.macro.debtToGdpRatio) < currentState.macro.debtToGdpRatio ? 'up' : 'down',
      trendPositive: false,
      provenanceAr: 'متطابقة تراكم الدين: D_t = D_{t-1}(1+r) + العجز الأولي',
      provenanceEn: 'Debt accumulation identity: D_t = D_{t-1}(1+r) + Primary Deficit',
      confidence: 'accounting_identity',
    },
    {
      key: 'unemploymentRate',
      labelAr: 'معدل البطالة العام',
      labelEn: 'Unemployment Rate',
      sectorAr: 'سوق العمل',
      sectorEn: 'Labor Market',
      currentValue: currentState.demographics.unemploymentRate,
      previousValue: previousState?.demographics.unemploymentRate,
      unit: '%',
      target: targets.unemployment,
      warningStatus: currentState.demographics.unemploymentRate > 12 ? 'critical' : currentState.demographics.unemploymentRate > 8 ? 'warning' : 'normal',
      trend: (previousState?.demographics.unemploymentRate ?? currentState.demographics.unemploymentRate) < currentState.demographics.unemploymentRate ? 'up' : 'down',
      trendPositive: false,
      provenanceAr: 'قانون أوكون ومعدل المشاركة في القوى العاملة',
      provenanceEn: "Okun's law and labor force participation rate",
      confidence: 'high_empirical',
    },
    {
      key: 'renewableEnergyPct',
      labelAr: 'حصة الطاقة المتجددة في المزيج',
      labelEn: 'Renewable Energy Share',
      sectorAr: 'الطاقة والمناخ',
      sectorEn: 'Energy & Climate',
      currentValue: currentState.energy.renewableEnergyPct,
      previousValue: previousState?.energy.renewableEnergyPct,
      unit: '%',
      target: targets.renewableEnergy,
      warningStatus: currentState.energy.renewableEnergyPct < 15 ? 'warning' : 'normal',
      trend: (previousState?.energy.renewableEnergyPct ?? currentState.energy.renewableEnergyPct) < currentState.energy.renewableEnergyPct ? 'up' : 'down',
      trendPositive: true,
      provenanceAr: 'نموذج استبدال الطاقة وتأثير ضريبة الكربون وحوافز الاستثمار النظيف',
      provenanceEn: 'Capital substitution model with carbon tax incentives',
      confidence: 'moderate_empirical',
    },
    {
      key: 'publicServiceCapacity',
      labelAr: 'كفاءة الخدمات العامة والبنية',
      labelEn: 'Public Service & Infra Capacity',
      sectorAr: 'رأس المال البشري',
      sectorEn: 'Human Capital',
      currentValue: currentState.humanCapital.publicServiceCapacityIndex,
      previousValue: previousState?.humanCapital.publicServiceCapacityIndex,
      unit: 'نقطة',
      target: targets.publicServiceCapacity,
      warningStatus: currentState.humanCapital.publicServiceCapacityIndex < 50 ? 'critical' : currentState.humanCapital.publicServiceCapacityIndex < 65 ? 'warning' : 'normal',
      trend: (previousState?.humanCapital.publicServiceCapacityIndex ?? currentState.humanCapital.publicServiceCapacityIndex) < currentState.humanCapital.publicServiceCapacityIndex ? 'up' : 'down',
      trendPositive: true,
      provenanceAr: 'دالة تراكم رأس المال البشري بنفقات الصحة والتعليم التراكمية مع إهلاك 4%',
      provenanceEn: 'Cumulative health/education expenditure stock with 4% depreciation',
      confidence: 'moderate_empirical',
    },
    {
      key: 'socialTensionIndex',
      labelAr: 'مؤشر الاحتقان الاجتماعي',
      labelEn: 'Social Tension Index',
      sectorAr: 'الحوكمة والمجتمع',
      sectorEn: 'Governance & Society',
      currentValue: currentState.governance.socialTensionIndex,
      previousValue: previousState?.governance.socialTensionIndex,
      unit: 'نقطة',
      warningStatus: currentState.governance.socialTensionIndex > 65 ? 'critical' : currentState.governance.socialTensionIndex > 45 ? 'warning' : 'normal',
      trend: (previousState?.governance.socialTensionIndex ?? currentState.governance.socialTensionIndex) < currentState.governance.socialTensionIndex ? 'up' : 'down',
      trendPositive: false,
      provenanceAr: 'مؤشر مركب: التفاوت الطبقي (جيني) + بطالة الشباب + غلاء المعيشة',
      provenanceEn: 'Composite index: Gini inequality + youth unemployment + inflation',
      confidence: 'uncertain_estimate',
    },
  ];

  const filteredIndicators = indicators.filter((ind) =>
    filterSector === 'all' ? true : ind.sectorEn.toLowerCase().includes(filterSector.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Synthetic Dataset Explicit Scientific Disclosure */}
      <div className="bg-slate-900 border-r-4 border-r-amber-500 border border-slate-800 rounded-lg p-4 text-xs">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-slate-100">
              {lang === 'ar' ? 'إفصاح المنهجية العلمية والبيانات التوضيحية المصطنعة' : 'Scientific Methodology & Synthetic Data Disclosure'}
            </h4>
            <p className="text-slate-300 leading-relaxed">
              {lang === 'ar'
                ? 'جميع الأرقام والمؤشرات المعروضة مشتقة من نموذج محاكاة حسابي وديناميكي مبني على بيانات تأسيسية توضيحية مصطنعة ومتوازنة رياضياً. النتائج المعروضة تعكس آليات النموذج ولا تمثل توقعات قطعية أو حقائق إحصائية لدولة حقيقية.'
                : 'All presented indicators originate from a computational dynamic model with mathematically consistent synthetic datasets. Simulation trajectories reflect model mechanics, not real-world factual forecasts.'}
            </p>
          </div>
        </div>
      </div>

      {/* Strategic Scorecard Header & Target Editor Toggle */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'ar' ? 'بطاقة الأداء الوطني الاستراتيجية (National Scorecard)' : 'National Strategic Scorecard'}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {lang === 'ar'
                ? 'متابعة المتغيرات الأساسية مع بيان القيمة السابقة، المسار، المستهدفات القابلة للتهيئة، ومستوى اليقين المنهجي.'
                : 'Monitor core national metrics with historical deltas, configurable targets, and provenance ratings.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTargetEditor(!showTargetEditor)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs transition-colors cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'ar' ? 'تعديل المستهدفات' : 'Configure Targets'}</span>
            </button>
          </div>
        </div>

        {/* Target Editor Drawer */}
        {showTargetEditor && (
          <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-3">
            <h4 className="font-semibold text-slate-200">
              {lang === 'ar' ? 'تحديد المستهدفات الاستراتيجية المخصصة:' : 'Customize Strategic Benchmark Targets:'}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">النمو المستهدف (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={targets.gdpGrowth}
                  onChange={(e) => setTargets({ ...targets, gdpGrowth: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 font-mono text-cyan-300"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">التضخم المستهدف (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={targets.inflation}
                  onChange={(e) => setTargets({ ...targets, inflation: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 font-mono text-cyan-300"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">سقف الدين (% الناتج)</label>
                <input
                  type="number"
                  step="5"
                  value={targets.debtToGdp}
                  onChange={(e) => setTargets({ ...targets, debtToGdp: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 font-mono text-cyan-300"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">سقف البطالة (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={targets.unemployment}
                  onChange={(e) => setTargets({ ...targets, unemployment: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 font-mono text-cyan-300"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">مستهدف الطاقة النظيفة (%)</label>
                <input
                  type="number"
                  step="5"
                  value={targets.renewableEnergy}
                  onChange={(e) => setTargets({ ...targets, renewableEnergy: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 font-mono text-cyan-300"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">كفاءة الخدمات (0-100)</label>
                <input
                  type="number"
                  step="5"
                  value={targets.publicServiceCapacity}
                  onChange={(e) => setTargets({ ...targets, publicServiceCapacity: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 font-mono text-cyan-300"
                />
              </div>
            </div>
          </div>
        )}

        {/* Scorecard Table View */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-2.5 px-3">المؤشر الوطني</th>
                <th className="py-2.5 px-3">القطاع</th>
                <th className="py-2.5 px-3 text-center">القيمة الحالية</th>
                <th className="py-2.5 px-3 text-center">القيمة السابقة</th>
                <th className="py-2.5 px-3 text-center">الاتجاه السنوي</th>
                <th className="py-2.5 px-3 text-center">المستهدف</th>
                <th className="py-2.5 px-3 text-center">حالة التحذير</th>
                <th className="py-2.5 px-3">المنهجية والمصدر</th>
                <th className="py-2.5 px-3 text-center">اليقين العلمي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredIndicators.map((ind) => {
                const diff = ind.previousValue !== undefined ? ind.currentValue - ind.previousValue : null;
                const isTargetAchieved = ind.target !== undefined
                  ? ind.trendPositive
                    ? ind.currentValue >= ind.target
                    : ind.currentValue <= ind.target
                  : null;

                return (
                  <tr
                    key={ind.key}
                    onClick={() => onInspectMetric(ind.key)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-3 font-sans font-medium text-slate-200 flex items-center gap-1.5">
                      <ExplainerBubble itemKey={ind.key} lang={lang} size="sm" />
                      <span>{lang === 'ar' ? ind.labelAr : ind.labelEn}</span>
                      <ArrowUpRight className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-400 text-[11px]">
                      {lang === 'ar' ? ind.sectorAr : ind.sectorEn}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-white text-[13px] tabular-nums">
                      {ind.currentValue.toLocaleString(undefined, { maximumFractionDigits: 1 })}{' '}
                      <span className="text-[10px] text-slate-500 font-normal">{ind.unit}</span>
                    </td>
                    <td className="py-3 px-3 text-center text-slate-400 tabular-nums">
                      {ind.previousValue !== undefined ? (
                        `${ind.previousValue.toLocaleString(undefined, { maximumFractionDigits: 1 })} ${ind.unit}`
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {diff !== null ? (
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                            diff > 0
                              ? ind.trendPositive
                                ? 'text-emerald-400'
                                : 'text-rose-400'
                              : diff < 0
                              ? ind.trendPositive
                                ? 'text-rose-400'
                                : 'text-emerald-400'
                              : 'text-slate-500'
                          }`}
                        >
                          {diff > 0 ? (
                            <TrendingUp className="w-3.5 h-3.5" />
                          ) : diff < 0 ? (
                            <TrendingDown className="w-3.5 h-3.5" />
                          ) : (
                            <Minus className="w-3.5 h-3.5" />
                          )}
                          <span>{diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)}</span>
                        </span>
                      ) : (
                        <span className="text-slate-600">خط الأساس</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {ind.target !== undefined ? (
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            isTargetAchieved
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                              : 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                          }`}
                        >
                          {ind.target} {ind.unit}
                        </span>
                      ) : (
                        <span className="text-slate-600 text-[10px]">-</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {ind.warningStatus === 'critical' ? (
                        <span className="inline-flex items-center gap-1 text-rose-400 bg-rose-950/60 border border-rose-800/60 px-2 py-0.5 rounded text-[10px] font-semibold">
                          <ShieldAlert className="w-3 h-3" />
                          <span>حرج</span>
                        </span>
                      ) : ind.warningStatus === 'warning' ? (
                        <span className="inline-flex items-center gap-1 text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded text-[10px] font-semibold">
                          <AlertTriangle className="w-3 h-3" />
                          <span>تنبيه</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded text-[10px]">
                          <CheckCircle className="w-3 h-3" />
                          <span>مستقر</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-400 text-[11px] max-w-xs truncate" title={lang === 'ar' ? ind.provenanceAr : ind.provenanceEn}>
                      {lang === 'ar' ? ind.provenanceAr : ind.provenanceEn}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-sans font-medium ${
                          ind.confidence === 'accounting_identity'
                            ? 'bg-blue-950/60 text-blue-300 border border-blue-800/60'
                            : ind.confidence === 'high_empirical'
                            ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/60'
                            : ind.confidence === 'moderate_empirical'
                            ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                            : 'bg-rose-950/60 text-rose-300 border border-rose-800/60'
                        }`}
                      >
                        {ind.confidence === 'accounting_identity'
                          ? 'متطابقة حسابية'
                          : ind.confidence === 'high_empirical'
                          ? 'علاقة تجريبية'
                          : ind.confidence === 'moderate_empirical'
                          ? 'نمذجة سلوكية'
                          : 'تقدير تقريبي'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trajectory Highlights Mini Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LineChartSvg
          title="مسار الناتج المحلي ومعدل النمو السنوي"
          subtitle="استعراض السلسلة الزمنية الحقيقية مع تطور الإنتاجية الكلية"
          series={[
            {
              id: 'realGdp',
              label: 'الناتج الحقيقي ($B)',
              color: '#38bdf8',
              data: history.map((s) => ({ year: s.year, value: s.macro.realGdp })),
            },
            {
              id: 'growthRate',
              label: 'النمو السنوي (%)',
              color: '#34d399',
              data: history.map((s) => ({ year: s.year, value: s.macro.realGdpGrowthRate })),
              isDashed: true,
            },
          ]}
          unit="مليار $"
        />

        <LineChartSvg
          title="الاستدامة المالية ومسار الدين العام"
          subtitle="نسبة الدين العام إلى الناتج والعجز الكلي الصافي"
          series={[
            {
              id: 'debtRatio',
              label: 'الدين / الناتج (%)',
              color: '#f87171',
              data: history.map((s) => ({ year: s.year, value: s.macro.debtToGdpRatio })),
            },
            {
              id: 'deficit',
              label: 'العجز الكلي ($B)',
              color: '#fbbf24',
              data: history.map((s) => ({ year: s.year, value: s.macro.overallDeficit })),
              isDashed: true,
            },
          ]}
          unit="%"
        />
      </div>
    </div>
  );
};
