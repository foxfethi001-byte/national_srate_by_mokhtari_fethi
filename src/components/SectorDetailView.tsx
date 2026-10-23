/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Sector Detail & Systems Decomposition View
 * عرض التحليل التفصيلي للقطاعات الوطنية والترابطات البينية
 */

import React, { useState } from 'react';
import { SimulationState, SectorId } from '../types/simulation';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { MetricCard } from './MetricCard';
import { LineChartSvg } from './charts/LineChartSvg';

interface SectorDetailViewProps {
  currentState: SimulationState;
  previousState?: SimulationState;
  baselineState: SimulationState;
  history: SimulationState[];
  lang: Language;
  onInspectMetric: (metricKey: string) => void;
}

export const SectorDetailView: React.FC<SectorDetailViewProps> = ({
  currentState,
  previousState,
  baselineState,
  history,
  lang,
  onInspectMetric,
}) => {
  const t = TRANSLATIONS[lang];
  const [activeSector, setActiveSector] = useState<SectorId>('macroeconomy');

  const sectorTabs: { id: SectorId; label: string }[] = [
    { id: 'macroeconomy', label: t.sectors.macroeconomy },
    { id: 'demographics', label: t.sectors.demographics },
    { id: 'human_capital', label: t.sectors.human_capital },
    { id: 'energy_environment', label: t.sectors.energy_environment },
    { id: 'governance_society', label: t.sectors.governance_society },
  ];

  return (
    <div className="space-y-6">
      {/* Sector Tab Selector */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {sectorTabs.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setActiveSector(sec.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeSector === sec.id
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* 1. Macroeconomy & Fiscal */}
      {activeSector === 'macroeconomy' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricCard
              label={t.metrics.nominalGdp}
              value={currentState.macro.nominalGdp}
              unit={t.units.billionUsd}
              previousValue={previousState?.macro.nominalGdp}
              baselineValue={baselineState.macro.nominalGdp}
              onClickInspect={() => onInspectMetric('nominalGdp')}
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
              label={t.metrics.overallDeficit}
              value={currentState.macro.overallDeficit}
              unit={t.units.billionUsd}
              previousValue={previousState?.macro.overallDeficit}
              baselineValue={baselineState.macro.overallDeficit}
              invertColor
              onClickInspect={() => onInspectMetric('overallDeficit')}
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
              label={t.metrics.sovereignBondYield10y}
              value={currentState.macro.sovereignBondYield10y}
              unit="%"
              previousValue={previousState?.macro.sovereignBondYield10y}
              baselineValue={baselineState.macro.sovereignBondYield10y}
              invertColor
              onClickInspect={() => onInspectMetric('sovereignBondYield10y')}
            />
            <MetricCard
              label={t.metrics.centralBankRate}
              value={currentState.macro.centralBankRate}
              unit="%"
              previousValue={previousState?.macro.centralBankRate}
              baselineValue={baselineState.macro.centralBankRate}
              onClickInspect={() => onInspectMetric('centralBankRate')}
            />
            <MetricCard
              label={t.metrics.foreignReserves}
              value={currentState.macro.foreignReserves}
              unit={t.units.billionUsd}
              previousValue={previousState?.macro.foreignReserves}
              baselineValue={baselineState.macro.foreignReserves}
              onClickInspect={() => onInspectMetric('foreignReserves')}
            />
            <MetricCard
              label={t.metrics.currentAccountBalance}
              value={currentState.macro.currentAccountBalance}
              unit={t.units.billionUsd}
              previousValue={previousState?.macro.currentAccountBalance}
              baselineValue={baselineState.macro.currentAccountBalance}
              onClickInspect={() => onInspectMetric('currentAccountBalance')}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
              <h4 className="text-xs font-semibold text-slate-300 mb-2">
                تطور الإيرادات العامة مقابل النفقات العامة ($B)
              </h4>
              <LineChartSvg
                series={[
                  {
                    id: 'rev',
                    label: t.metrics.totalRevenue,
                    color: '#34d399',
                    data: history.map((s) => ({ year: s.year, value: s.macro.totalRevenue })),
                  },
                  {
                    id: 'exp',
                    label: t.metrics.totalExpenditure,
                    color: '#f87171',
                    data: history.map((s) => ({ year: s.year, value: s.macro.totalExpenditure })),
                  },
                ]}
                unit="$B"
                height={180}
              />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
              <h4 className="text-xs font-semibold text-slate-300 mb-2">
                مسار رصيد الدين العام ($B)
              </h4>
              <LineChartSvg
                series={[
                  {
                    id: 'debtStock',
                    label: t.metrics.publicDebtStock,
                    color: '#fb7185',
                    data: history.map((s) => ({ year: s.year, value: s.macro.publicDebtStock })),
                  },
                ]}
                unit="$B"
                height={180}
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. Demographics & Labor */}
      {activeSector === 'demographics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricCard
              label={t.metrics.totalPopulation}
              value={currentState.demographics.totalPopulation}
              unit={t.units.millionPeople}
              previousValue={previousState?.demographics.totalPopulation}
              baselineValue={baselineState.demographics.totalPopulation}
              onClickInspect={() => onInspectMetric('totalPopulation')}
            />
            <MetricCard
              label={t.metrics.fertilityRate}
              value={currentState.demographics.fertilityRate}
              unit="طفل/امرأة"
              previousValue={previousState?.demographics.fertilityRate}
              baselineValue={baselineState.demographics.fertilityRate}
              decimals={2}
              onClickInspect={() => onInspectMetric('fertilityRate')}
            />
            <MetricCard
              label={t.metrics.dependencyRatio}
              value={currentState.demographics.dependencyRatio}
              unit="%"
              previousValue={previousState?.demographics.dependencyRatio}
              baselineValue={baselineState.demographics.dependencyRatio}
              invertColor
              onClickInspect={() => onInspectMetric('dependencyRatio')}
            />
            <MetricCard
              label={t.metrics.lifeExpectancy}
              value={currentState.demographics.lifeExpectancy}
              unit="سنة"
              previousValue={previousState?.demographics.lifeExpectancy}
              baselineValue={baselineState.demographics.lifeExpectancy}
              onClickInspect={() => onInspectMetric('lifeExpectancy')}
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
              label={t.metrics.youthUnemploymentRate}
              value={currentState.demographics.youthUnemploymentRate}
              unit="%"
              previousValue={previousState?.demographics.youthUnemploymentRate}
              baselineValue={baselineState.demographics.youthUnemploymentRate}
              invertColor
              onClickInspect={() => onInspectMetric('youthUnemploymentRate')}
            />
            <MetricCard
              label={t.metrics.laborForceParticipationRate}
              value={currentState.demographics.laborForceParticipationRate}
              unit="%"
              previousValue={previousState?.demographics.laborForceParticipationRate}
              baselineValue={baselineState.demographics.laborForceParticipationRate}
              onClickInspect={() => onInspectMetric('laborForceParticipationRate')}
            />
            <MetricCard
              label="صافي الهجرة السنوية"
              value={currentState.demographics.netMigration}
              unit="مليون"
              previousValue={previousState?.demographics.netMigration}
              baselineValue={baselineState.demographics.netMigration}
              decimals={3}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
              <h4 className="text-xs font-semibold text-slate-300 mb-2">
                معدلات البطالة: الإجمالي مقابل بطالة الشباب (%)
              </h4>
              <LineChartSvg
                series={[
                  {
                    id: 'unemp',
                    label: t.metrics.unemploymentRate,
                    color: '#f59e0b',
                    data: history.map((s) => ({ year: s.year, value: s.demographics.unemploymentRate })),
                  },
                  {
                    id: 'youthUnemp',
                    label: t.metrics.youthUnemploymentRate,
                    color: '#ef4444',
                    data: history.map((s) => ({ year: s.year, value: s.demographics.youthUnemploymentRate })),
                    isDashed: true,
                  },
                ]}
                unit="%"
                height={180}
              />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
              <h4 className="text-xs font-semibold text-slate-300 mb-2">
                تطور حجم السكان والقوى العاملة (مليون)
              </h4>
              <LineChartSvg
                series={[
                  {
                    id: 'pop',
                    label: t.metrics.totalPopulation,
                    color: '#38bdf8',
                    data: history.map((s) => ({ year: s.year, value: s.demographics.totalPopulation })),
                  },
                  {
                    id: 'labor',
                    label: 'القوى العاملة',
                    color: '#10b981',
                    data: history.map((s) => ({ year: s.year, value: s.demographics.laborForceTotal })),
                    isDashed: true,
                  },
                ]}
                unit="M"
                height={180}
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. Human Capital & Infrastructure */}
      {activeSector === 'human_capital' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <MetricCard
              label={t.metrics.educationQualityIndex}
              value={currentState.humanCapital.educationQualityIndex}
              unit="/100"
              previousValue={previousState?.humanCapital.educationQualityIndex}
              baselineValue={baselineState.humanCapital.educationQualityIndex}
              onClickInspect={() => onInspectMetric('educationQualityIndex')}
            />
            <MetricCard
              label={t.metrics.healthcareQualityIndex}
              value={currentState.humanCapital.healthcareQualityIndex}
              unit="/100"
              previousValue={previousState?.humanCapital.healthcareQualityIndex}
              baselineValue={baselineState.humanCapital.healthcareQualityIndex}
              onClickInspect={() => onInspectMetric('healthcareQualityIndex')}
            />
            <MetricCard
              label={t.metrics.totalFactorProductivity}
              value={currentState.humanCapital.totalFactorProductivity}
              unit="مؤشر"
              previousValue={previousState?.humanCapital.totalFactorProductivity}
              baselineValue={baselineState.humanCapital.totalFactorProductivity}
              onClickInspect={() => onInspectMetric('totalFactorProductivity')}
            />
            <MetricCard
              label={t.metrics.infrastructureStock}
              value={currentState.humanCapital.infrastructureStock}
              unit={t.units.billionUsd}
              previousValue={previousState?.humanCapital.infrastructureStock}
              baselineValue={baselineState.humanCapital.infrastructureStock}
              onClickInspect={() => onInspectMetric('infrastructureStock')}
            />
            <MetricCard
              label={t.metrics.infrastructureQualityIndex}
              value={currentState.humanCapital.infrastructureQualityIndex}
              unit="/100"
              previousValue={previousState?.humanCapital.infrastructureQualityIndex}
              baselineValue={baselineState.humanCapital.infrastructureQualityIndex}
            />
            <MetricCard
              label={t.metrics.rdIntensityPctGdp}
              value={currentState.humanCapital.rdIntensityPctGdp}
              unit="% الناتج"
              previousValue={previousState?.humanCapital.rdIntensityPctGdp}
              baselineValue={baselineState.humanCapital.rdIntensityPctGdp}
              decimals={2}
            />
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <h4 className="text-xs font-semibold text-slate-300 mb-2">
              تراكم مؤشرات جودة رأس المال البشري والإنتاجية الكلية (TFP)
            </h4>
            <LineChartSvg
              series={[
                {
                  id: 'tfp',
                  label: t.metrics.totalFactorProductivity,
                  color: '#6366f1',
                  data: history.map((s) => ({ year: s.year, value: s.humanCapital.totalFactorProductivity })),
                },
                {
                  id: 'edu',
                  label: t.metrics.educationQualityIndex,
                  color: '#0ea5e9',
                  data: history.map((s) => ({ year: s.year, value: s.humanCapital.educationQualityIndex })),
                  isDashed: true,
                },
                {
                  id: 'health',
                  label: t.metrics.healthcareQualityIndex,
                  color: '#14b8a6',
                  data: history.map((s) => ({ year: s.year, value: s.humanCapital.healthcareQualityIndex })),
                  isDashed: true,
                },
              ]}
              unit="pts"
              height={190}
            />
          </div>
        </div>
      )}

      {/* 4. Energy & Environment */}
      {activeSector === 'energy_environment' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricCard
              label={t.metrics.primaryEnergyDemandTwh}
              value={currentState.energy.primaryEnergyDemandTwh}
              unit="TWh"
              previousValue={previousState?.energy.primaryEnergyDemandTwh}
              baselineValue={baselineState.energy.primaryEnergyDemandTwh}
              decimals={0}
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
              label={t.metrics.annualCo2EmissionsMt}
              value={currentState.energy.annualCo2EmissionsMt}
              unit="Mt CO₂"
              previousValue={previousState?.energy.annualCo2EmissionsMt}
              baselineValue={baselineState.energy.annualCo2EmissionsMt}
              invertColor
              decimals={0}
              onClickInspect={() => onInspectMetric('annualCo2EmissionsMt')}
            />
            <MetricCard
              label={t.metrics.gridReliabilityIndex}
              value={currentState.energy.gridReliabilityIndex}
              unit="/100"
              previousValue={previousState?.energy.gridReliabilityIndex}
              baselineValue={baselineState.energy.gridReliabilityIndex}
            />
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <h4 className="text-xs font-semibold text-slate-300 mb-2">
              انبعاثات ثاني أكسيد الكربون (Mt CO₂) عبر مسار التحول الطاقي
            </h4>
            <LineChartSvg
              series={[
                {
                  id: 'emissions',
                  label: t.metrics.annualCo2EmissionsMt,
                  color: '#f97316',
                  data: history.map((s) => ({ year: s.year, value: s.energy.annualCo2EmissionsMt })),
                },
              ]}
              unit="Mt"
              height={180}
            />
          </div>
        </div>
      )}

      {/* 5. Governance & Society */}
      {activeSector === 'governance_society' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricCard
              label={t.metrics.giniCoefficient}
              value={currentState.governance.giniCoefficient}
              unit="/100"
              previousValue={previousState?.governance.giniCoefficient}
              baselineValue={baselineState.governance.giniCoefficient}
              invertColor
              onClickInspect={() => onInspectMetric('giniCoefficient')}
            />
            <MetricCard
              label={t.metrics.povertyRatePct}
              value={currentState.governance.povertyRatePct}
              unit="%"
              previousValue={previousState?.governance.povertyRatePct}
              baselineValue={baselineState.governance.povertyRatePct}
              invertColor
              onClickInspect={() => onInspectMetric('povertyRatePct')}
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
            <MetricCard
              label={t.metrics.pensionFundSolvencyPct}
              value={currentState.governance.pensionFundSolvencyPct}
              unit="%"
              previousValue={previousState?.governance.pensionFundSolvencyPct}
              baselineValue={baselineState.governance.pensionFundSolvencyPct}
              onClickInspect={() => onInspectMetric('pensionFundSolvencyPct')}
            />
            <MetricCard
              label={t.metrics.ruleOfLawIndex}
              value={currentState.governance.ruleOfLawIndex}
              unit="/100"
              previousValue={previousState?.governance.ruleOfLawIndex}
              baselineValue={baselineState.governance.ruleOfLawIndex}
            />
            <MetricCard
              label={t.metrics.corruptionPerceptionIndex}
              value={currentState.governance.corruptionPerceptionIndex}
              unit="/100"
              previousValue={previousState?.governance.corruptionPerceptionIndex}
              baselineValue={baselineState.governance.corruptionPerceptionIndex}
            />
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <h4 className="text-xs font-semibold text-slate-300 mb-2">
              التوتر الاجتماعي، الفقر، وعدم المساواة (جيني)
            </h4>
            <LineChartSvg
              series={[
                {
                  id: 'tension',
                  label: t.metrics.socialTensionIndex,
                  color: '#ef4444',
                  data: history.map((s) => ({ year: s.year, value: s.governance.socialTensionIndex })),
                },
                {
                  id: 'poverty',
                  label: t.metrics.povertyRatePct,
                  color: '#f59e0b',
                  data: history.map((s) => ({ year: s.year, value: s.governance.povertyRatePct })),
                  isDashed: true,
                },
                {
                  id: 'gini',
                  label: t.metrics.giniCoefficient,
                  color: '#a855f7',
                  data: history.map((s) => ({ year: s.year, value: s.governance.giniCoefficient })),
                  isDashed: true,
                },
              ]}
              unit="pts"
              height={190}
            />
          </div>
        </div>
      )}
    </div>
  );
};
