/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Audit Trail & Accountability Ledger (Phase 5)
 * سجل التدقيق والمساءلة الشامل ومفسر تباين السيناريوهات والنتائج
 */

import React, { useState } from 'react';
import { Scenario, SimulationState } from '../types/simulation';
import { AuditRecord, AuditEventType } from '../types/planning';
import { auditTrailManager, explainScenarioDivergence } from '../simulation/auditTrail';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { ExplainerBubble } from './common/ExplainerBubble';
import {
  FileText,
  Clock,
  GitBranch,
  Filter,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Scale,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Percent,
  Search,
} from 'lucide-react';

interface AuditTrailViewProps {
  currentScenario: Scenario;
  savedScenarios: Scenario[];
  currentState: SimulationState;
  baseState: SimulationState;
  lang: Language;
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({
  currentScenario,
  savedScenarios,
  currentState,
  baseState,
  lang,
}) => {
  const t = TRANSLATIONS[lang];

  // Audit Records State
  const [records, setRecords] = useState<AuditRecord[]>(auditTrailManager.getRecords());
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Divergence Explainer State
  const allScenarios = [currentScenario, ...savedScenarios];
  const [scenarioAId, setScenarioAId] = useState<string>(currentScenario.id);
  const [scenarioBId, setScenarioBId] = useState<string>(
    savedScenarios[0]?.id || currentScenario.id
  );
  const [divergenceMetric, setDivergenceMetric] = useState<'realGdp' | 'debtToGdpRatio' | 'inflationRate' | 'unemploymentRate'>('realGdp');

  // Baseline Scenario Wrapper
  const baselineScenario: Scenario = {
    id: 'baseline_anchor',
    nameAr: 'سيناريو خط الأساس (المرجعي)',
    nameEn: 'Baseline Scenario (Anchor)',
    descriptionAr: 'المسار المرجعي قبل أي تدخل بالسياسات',
    descriptionEn: 'Status quo baseline reference trajectory',
    baseArchetypeId: 'balanced',
    policies: { ...currentScenario.policies },
    shocks: { ...currentScenario.shocks },
    history: [baseState],
    currentYear: baseState.year,
    currentDate: { year: baseState.year },
  };

  const scenarioA = allScenarios.find((s) => s.id === scenarioAId) || currentScenario;
  const scenarioB =
    scenarioBId === 'baseline_anchor'
      ? baselineScenario
      : allScenarios.find((s) => s.id === scenarioBId) || currentScenario;

  // Compute divergence report
  const divergenceReport = explainScenarioDivergence(scenarioA, scenarioB, divergenceMetric);

  // Filtered Audit Records
  const filteredRecords = records.filter((r) => {
    if (filterType !== 'all' && r.eventType !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.titleAr.toLowerCase().includes(q) ||
        r.titleEn.toLowerCase().includes(q) ||
        r.detailsAr.toLowerCase().includes(q) ||
        r.actor.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleRefreshRecords = () => {
    setRecords(auditTrailManager.getRecords());
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100">
                  {lang === 'ar' ? 'سجل التدقيق والمساءلة ومفسر تباين النتائج' : 'Audit Trail & Scenario Divergence Explainer'}
                </h2>
                <ExplainerBubble itemKey="auditTrail" lang={lang} size="sm" showBadge />
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                {lang === 'ar'
                  ? 'سجل زمني دقيق لكل تعديل في السياسات أو حقن للأزمات أو حفظ للمحطات، مع تحليل رياضي يفسر بدقة أسباب اختلاف نتائج السيناريوهات.'
                  : 'Immutable chronological ledger of policy shifts, shocks, and plans, paired with an algorithmic engine explaining why scenarios diverge.'}
              </p>
            </div>
          </div>

          <button
            onClick={handleRefreshRecords}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start md:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'تحديث السجل' : 'Refresh Ledger'}</span>
          </button>
        </div>
      </div>

      {/* ===================== SECTION 1: SCENARIO DIVERGENCE EXPLAINER ===================== */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-100">
                {lang === 'ar' ? 'مفسر أسباب تباين النتائج بين السيناريوهات' : 'Explain Why Scenarios Diverged'}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'ar'
                ? 'قارن بين أي مسارين للتعرف على المساهمة النسبية لكل سياسة أو صدمة في إحداث الفارق في النتائج.'
                : 'Decomposes the exact mathematical and policy drivers behind outcome discrepancies.'}
            </p>
          </div>

          {/* Selectors */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
            <select
              value={scenarioAId}
              onChange={(e) => setScenarioAId(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 cursor-pointer"
            >
              {allScenarios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id === currentScenario.id ? (lang === 'ar' ? 'السيناريو النشط حالياً' : 'Current Active') : (lang === 'ar' ? s.nameAr : s.nameEn)}
                </option>
              ))}
            </select>

            <span className="text-slate-500 font-sans font-bold">VS</span>

            <select
              value={scenarioBId}
              onChange={(e) => setScenarioBId(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 cursor-pointer"
            >
              <option value="baseline_anchor">
                {lang === 'ar' ? 'خط الأساس الأولي (2024)' : 'Initial Baseline (2024)'}
              </option>
              {allScenarios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id === currentScenario.id ? (lang === 'ar' ? 'السيناريو النشط' : 'Current Active') : (lang === 'ar' ? s.nameAr : s.nameEn)}
                </option>
              ))}
            </select>

            <select
              value={divergenceMetric}
              onChange={(e) => setDivergenceMetric(e.target.value as any)}
              className="bg-slate-950 border border-cyan-500/50 text-cyan-300 font-semibold rounded-lg px-2.5 py-1.5 cursor-pointer"
            >
              <option value="realGdp">{lang === 'ar' ? 'الناتج الحقيقي GDP' : 'Real GDP'}</option>
              <option value="debtToGdpRatio">{lang === 'ar' ? 'نسبة الدين العام' : 'Debt-to-GDP Ratio'}</option>
              <option value="inflationRate">{lang === 'ar' ? 'معدل التضخم' : 'Inflation Rate'}</option>
              <option value="unemploymentRate">{lang === 'ar' ? 'معدل البطالة' : 'Unemployment Rate'}</option>
            </select>
          </div>
        </div>

        {/* Divergence Card Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-sans block">{divergenceReport.scenarioAName}</span>
            <span className="text-xl font-bold text-cyan-300 mt-1 block">{divergenceReport.valueA}</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-sans block">{divergenceReport.scenarioBName}</span>
            <span className="text-xl font-bold text-amber-300 mt-1 block">{divergenceReport.valueB}</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-sans block">{lang === 'ar' ? 'فارق التباين النسبي' : 'Variance Delta'}</span>
            <span className={`text-xl font-bold mt-1 block ${divergenceReport.absoluteDiff >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {divergenceReport.absoluteDiff >= 0 ? '+' : ''}{divergenceReport.absoluteDiff} ({divergenceReport.pctDiff}%)
            </span>
          </div>
        </div>

        {/* Drivers Breakdown List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            {lang === 'ar' ? 'تفكيك العوامل المسؤولة عن التباين (Drivers Decomposition):' : 'Key Drivers Breakdown:'}
          </h4>

          <div className="space-y-2.5">
            {divergenceReport.keyDrivers.map((driver, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    {lang === 'ar' ? driver.factorAr : driver.factorEn}
                  </span>
                  <span className="font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 text-[11px]">
                    {driver.contributionPct}% {lang === 'ar' ? 'من الفارق' : 'of delta'}
                  </span>
                </div>

                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full"
                    style={{ width: `${driver.contributionPct}%` }}
                  />
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {lang === 'ar' ? driver.explanationAr : driver.explanationEn}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Narrative */}
        <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200 flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{lang === 'ar' ? divergenceReport.summaryConclusionAr : divergenceReport.summaryConclusionEn}</span>
        </div>
      </div>

      {/* ===================== SECTION 2: CHRONOLOGICAL AUDIT LEDGER ===================== */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>{lang === 'ar' ? 'سجل التدقيق الزمني والقرارات السيادية' : 'Chronological Audit Timeline'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'ar' ? `إجمالي السجلات المسجلة: ${records.length}` : `Total logged events: ${records.length}`}
            </p>
          </div>

          {/* Filters & Search */}
          <div className="flex items-center gap-2 text-xs">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'ar' ? 'بحث في السجل...' : 'Search ledger...'}
                className="bg-slate-950 border border-slate-800 rounded-lg pr-8 pl-3 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 cursor-pointer"
            >
              <option value="all">{lang === 'ar' ? 'كافة الأحداث' : 'All Events'}</option>
              <option value="policy_change">{lang === 'ar' ? 'تعديل سياسات' : 'Policy Changes'}</option>
              <option value="plan_created">{lang === 'ar' ? 'خطط واستراتيجيات' : 'Plans'}</option>
              <option value="crisis_injected">{lang === 'ar' ? 'أزمات وصدمات' : 'Crises'}</option>
              <option value="checkpoint_saved">{lang === 'ar' ? 'نقاط تفتيش' : 'Checkpoints'}</option>
              <option value="model_version_changed">{lang === 'ar' ? 'إصدار النموذج' : 'Model Version'}</option>
            </select>
          </div>
        </div>

        {/* Timeline Items */}
        <div className="space-y-3">
          {filteredRecords.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              {lang === 'ar' ? 'لا توجد سجلات مطابقة للبحث المحدد.' : 'No audit records match the current filter.'}
            </div>
          ) : (
            filteredRecords.map((rec) => (
              <div
                key={rec.id}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded uppercase ${
                        rec.eventType === 'crisis_injected'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : rec.eventType === 'plan_created' || rec.eventType === 'plan_approved'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          : rec.eventType === 'policy_change'
                          ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {rec.eventType}
                    </span>

                    <span className="font-bold text-slate-200">
                      {lang === 'ar' ? rec.titleAr : rec.titleEn}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                    <span>السنة {rec.simulatedYear}</span>
                    <span>•</span>
                    <span>{new Date(rec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                <p className="text-slate-400 leading-relaxed text-[11.5px]">
                  {lang === 'ar' ? rec.detailsAr : rec.detailsEn}
                </p>

                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 font-mono">
                  <span>{lang === 'ar' ? 'الجهة الفاعلة:' : 'Actor:'} {rec.actor}</span>
                  {rec.previousValue !== undefined && rec.newValue !== undefined && (
                    <span className="text-cyan-400">
                      {rec.previousValue} → {rec.newValue}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
