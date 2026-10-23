/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Regional Overview & Spatial Disparities View (Phase 3)
 * المشهد الإقليمي، الفجوات التنموية بين الأقاليم، ومصفوفة المقارنة الجغرافية
 */

import React, { useState } from 'react';
import { SimulationState, Region } from '../types/simulation';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { HeatmapSvg, HeatmapColumn, HeatmapRow } from './charts/HeatmapSvg';
import { BarChartSvg, BarChartItem } from './charts/BarChartSvg';
import {
  MapPin,
  Building,
  Factory,
  Tractor,
  Ship,
  TrendingUp,
  Users,
  Briefcase,
  Activity,
  Layers,
} from 'lucide-react';

interface RegionalOverviewProps {
  currentState: SimulationState;
  previousState?: SimulationState;
  history: SimulationState[];
  lang: Language;
}

export const RegionalOverview: React.FC<RegionalOverviewProps> = ({
  currentState,
  lang,
}) => {
  const t = TRANSLATIONS[lang];
  const regions = currentState.regions || [];

  // Regional icons mapping
  const getRegionIcon = (type: Region['type']) => {
    switch (type) {
      case 'metropolitan_capital':
        return <Building className="w-4 h-4 text-cyan-400" />;
      case 'industrial_basin':
        return <Factory className="w-4 h-4 text-amber-400" />;
      case 'rural_agricultural':
        return <Tractor className="w-4 h-4 text-emerald-400" />;
      case 'coastal_logistics':
        return <Ship className="w-4 h-4 text-blue-400" />;
      default:
        return <MapPin className="w-4 h-4 text-slate-400" />;
    }
  };

  // Build Heatmap Matrix for Regions
  const heatmapColumns: HeatmapColumn[] = [
    { id: 'popShare', label: 'حصة السكان', unit: '%' },
    { id: 'gdpShare', label: 'حصة الناتج', unit: '%' },
    { id: 'unemployment', label: 'معدل البطالة', unit: '%', higherIsBetter: false },
    { id: 'serviceCapacity', label: 'كفاءة الخدمات', unit: 'نقطة', higherIsBetter: true },
  ];

  const heatmapRows: HeatmapRow[] = regions.map((reg) => ({
    id: reg.id,
    label: lang === 'ar' ? reg.nameAr : reg.nameEn,
    values: [
      {
        columnId: 'popShare',
        value: reg.populationSharePct,
        formatted: `${reg.populationSharePct.toFixed(1)}%`,
        normalizedScore: reg.populationSharePct / 50,
      },
      {
        columnId: 'gdpShare',
        value: reg.gdpSharePct,
        formatted: `${reg.gdpSharePct.toFixed(1)}%`,
        normalizedScore: reg.gdpSharePct / 50,
      },
      {
        columnId: 'unemployment',
        value: reg.unemploymentRatePct,
        formatted: `${reg.unemploymentRatePct.toFixed(1)}%`,
        normalizedScore: Math.max(0, 1 - reg.unemploymentRatePct / 20),
        isAlert: reg.unemploymentRatePct > 12,
      },
      {
        columnId: 'serviceCapacity',
        value: reg.publicServiceCapacityIndex,
        formatted: `${reg.publicServiceCapacityIndex.toFixed(0)}`,
        normalizedScore: reg.publicServiceCapacityIndex / 100,
        isAlert: reg.publicServiceCapacityIndex < 50,
      },
    ],
  }));

  // Bar chart for Regional GDP comparison
  const regionalGdpBarItems: BarChartItem[] = regions.map((reg) => ({
    id: reg.id,
    label: lang === 'ar' ? reg.nameAr : reg.nameEn,
    value: reg.regionalGdpUsdBillion,
    unit: t.units.billionUsd,
    color:
      reg.type === 'metropolitan_capital'
        ? '#38bdf8'
        : reg.type === 'industrial_basin'
        ? '#fbbf24'
        : reg.type === 'coastal_logistics'
        ? '#60a5fa'
        : '#34d399',
  }));

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'ar' ? 'المشهد الإقليمي والعدالة المكانية' : 'Regional Systems & Spatial Equity'}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {lang === 'ar'
                ? 'تحليل التفاوت التنموي والتركز الاقتصادي وكفاءة المرافق العامة عبر الأقاليم الإدارية الأربعة للدولة.'
                : 'Analyze regional output concentration, employment disparities, and public service distribution.'}
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400">
            عدد الأقاليم المنمذجة: <strong className="text-cyan-400 font-bold">{regions.length}</strong>
          </div>
        </div>
      </div>

      {/* 4 Regional Character Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {regions.map((reg) => (
          <div
            key={reg.id}
            className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col justify-between hover:border-slate-700 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  {getRegionIcon(reg.type)}
                  <span>{lang === 'ar' ? reg.nameAr : reg.nameEn}</span>
                </span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-1.5 py-0.5 rounded">
                  {reg.populationSharePct.toFixed(0)}% سكان
                </span>
              </div>

              <div className="my-3 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">الناتج الإقليمي:</span>
                  <span className="text-white font-bold">${reg.regionalGdpUsdBillion.toFixed(1)}B</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">حصة الناتج الوطني:</span>
                  <span className="text-slate-200">{reg.gdpSharePct.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">معدل البطالة:</span>
                  <span className={`${reg.unemploymentRatePct > 12 ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>
                    {reg.unemploymentRatePct.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">كفاءة الخدمات:</span>
                  <span className={`${reg.publicServiceCapacityIndex < 50 ? 'text-amber-400 font-bold' : 'text-emerald-400'}`}>
                    {reg.publicServiceCapacityIndex.toFixed(0)}/100
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 font-sans">
              السكان: {reg.populationMillions.toFixed(2)} مليون نسمة
            </div>
          </div>
        ))}
      </div>

      {/* Visual Comparison: Heatmap Matrix & Regional Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Heatmap Matrix */}
        <HeatmapSvg
          title="مصفوفة الفوارق الإقليمية (Regional Disparity Heatmap)"
          subtitle="مقارنة مؤشرات البطالة والخدمات وحصص الناتج والسكان"
          columns={heatmapColumns}
          rows={heatmapRows}
        />

        {/* Regional GDP Production Bar Chart */}
        <BarChartSvg
          title="الناتج المحلي الإجمالي حسب الأقاليم ($B)"
          subtitle="توزيع القيمة المضافة الإجمالية ومراكز الإنتاج الاقتصادي"
          items={regionalGdpBarItems}
          unit={t.units.billionUsd}
          orientation="horizontal"
        />
      </div>
    </div>
  );
};
