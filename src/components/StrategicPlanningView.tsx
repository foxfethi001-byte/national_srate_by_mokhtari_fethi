/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Strategic Planning & M&E Dashboard Component (Phase 5)
 * منظومة التخطيط الاستراتيجي الوطني، فحص الجدوى وكشف التناقضات، المتابعة والتقييم، وبدائل السياسات
 */

import React, { useState } from 'react';
import { SimulationState, PolicySettings } from '../types/simulation';
import { StrategicPlan, StrategicObjective, ObjectiveCategory, ObjectivePriority, PlanHorizon } from '../types/planning';
import { ARCHETYPE_STRATEGIC_PLANS, evaluatePlanFeasibility, evaluateMonitoringProgress } from '../simulation/strategicPlanning';
import { getPolicyAlternatives } from '../simulation/policyAlternatives';
import { auditTrailManager } from '../simulation/auditTrail';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { ExplainerBubble } from './common/ExplainerBubble';
import {
  Target,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  DollarSign,
  Building,
  Layers,
  ArrowRight,
  ShieldCheck,
  Scale,
  Activity,
  PlusCircle,
  FileCheck,
  Split,
  ChevronRight,
  HelpCircle,
  Sparkles,
  Info,
} from 'lucide-react';

interface StrategicPlanningViewProps {
  currentState: SimulationState;
  baseState: SimulationState;
  policies: PolicySettings;
  lang: Language;
  onApplyPlanPolicies?: (policies: Partial<PolicySettings>) => void;
}

export const StrategicPlanningView: React.FC<StrategicPlanningViewProps> = ({
  currentState,
  baseState,
  policies,
  lang,
  onApplyPlanPolicies,
}) => {
  const t = TRANSLATIONS[lang];

  // Sub-tabs in Strategic Planning
  const [subTab, setSubTab] = useState<'plans' | 'feasibility' | 'monitoring' | 'alternatives'>('plans');

  // Active Plan State
  const [plans, setPlans] = useState<StrategicPlan[]>(ARCHETYPE_STRATEGIC_PLANS);
  const [activePlanId, setActivePlanId] = useState<string>(plans[0].id);

  // Selected Plan
  const activePlan = plans.find((p) => p.id === activePlanId) || plans[0];

  // Feasibility Report calculation
  const feasibilityReport = evaluatePlanFeasibility(activePlan, currentState);

  // M&E Progress calculation
  const evaluatedObjectives = evaluateMonitoringProgress(activePlan, currentState, baseState);

  // Policy Alternatives
  const alternatives = getPolicyAlternatives(baseState, activePlan.associatedPolicies);

  // Modal / Form state for adding an objective
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitleAr, setNewTitleAr] = useState('');
  const [newTitleEn, setNewTitleEn] = useState('');
  const [newCategory, setNewCategory] = useState<ObjectiveCategory>('economic');
  const [newPriority, setNewPriority] = useState<ObjectivePriority>('high');
  const [newTargetVal, setNewTargetVal] = useState<number>(100);
  const [newTargetYear, setNewTargetYear] = useState<number>(2030);
  const [newBudget, setNewBudget] = useState<number>(10.0);
  const [newInstitutionAr, setNewInstitutionAr] = useState('وزارة التخطيط والمالية');

  const handleAddObjective = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitleAr.trim()) return;

    const newObj: StrategicObjective = {
      id: `obj_${Date.now()}`,
      titleAr: newTitleAr.trim(),
      titleEn: newTitleEn.trim() || newTitleAr.trim(),
      category: newCategory,
      priority: newPriority,
      indicatorKey: 'gdpReal',
      indicatorNameAr: 'الناتج المحلي الحقيقي',
      indicatorNameEn: 'Real GDP',
      unit: 'مليار دولار',
      baselineValue: currentState.macro.realGdp,
      targetValue: newTargetVal,
      targetYear: newTargetYear,
      budgetAllocatedUsdBillion: newBudget,
      responsibleInstitutionAr: newInstitutionAr,
      responsibleInstitutionEn: 'Ministry of Planning',
      requiredResources: {
        workforceThousands: 30,
        adminCapacityIndex: 70,
        capitalInvestBillion: newBudget * 0.8,
      },
      dependencies: [],
      milestones: [
        {
          id: `m_${Date.now()}`,
          year: Math.round((currentState.year + newTargetYear) / 2),
          titleAr: 'المرحلة الانتقالية ومراجعة الأداء',
          titleEn: 'Mid-term Review',
          targetValue: (currentState.macro.realGdp + newTargetVal) / 2,
          completed: false,
        },
      ],
      implementationDelayYears: 1,
      constraintsAndTradeoffsAr: 'يتطلب مواءمة مخصصات الموازنة العامة والانضباط الإداري.',
      constraintsAndTradeoffsEn: 'Requires fiscal prioritization and administrative compliance.',
    };

    const updatedPlan: StrategicPlan = {
      ...activePlan,
      objectives: [...activePlan.objectives, newObj],
      version: `${parseFloat(activePlan.version) + 0.1}`,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setPlans(plans.map((p) => (p.id === activePlan.id ? updatedPlan : p)));
    setShowAddModal(false);
    setNewTitleAr('');
    setNewTitleEn('');

    auditTrailManager.logEvent({
      simulatedYear: currentState.year,
      eventType: 'plan_updated',
      actor: 'مجلس التخطيط الوطني',
      titleAr: `إضافة هدف استراتيجي جديد: ${newTitleAr}`,
      titleEn: `Added Strategic Objective: ${newTitleAr}`,
      detailsAr: `تم إدراج الهدف بموازنة ${newBudget} مليار $ للتحقيق بحلول عام ${newTargetYear}.`,
      detailsEn: `Objective budgeted at $${newBudget}B targeting ${newTargetYear}.`,
    });
  };

  const handleApplyPlan = () => {
    if (onApplyPlanPolicies && activePlan.associatedPolicies) {
      onApplyPlanPolicies(activePlan.associatedPolicies);
      auditTrailManager.logEvent({
        simulatedYear: currentState.year,
        eventType: 'plan_approved',
        actor: 'مجلس الوزراء',
        titleAr: `اعتماد وتطبيق حزمة سياسات: ${activePlan.nameAr}`,
        titleEn: `Enacted Policy Deck: ${activePlan.nameEn}`,
        detailsAr: `تم تحديث مؤشرات الاستثمار العام والضرائب والدعم وفق مستهدفات الخطة.`,
        detailsEn: `Updated public investment, tax and subsidy rates to match plan goals.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Explainer Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100">
                  {lang === 'ar' ? 'منظومة التخطيط الاستراتيجي الوطني وإدارة الأداء' : 'National Strategic Planning & Performance System'}
                </h2>
                <ExplainerBubble itemKey="strategicPlan" lang={lang} size="sm" showBadge />
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                {lang === 'ar'
                  ? 'صياغة الأهداف الوطنية، فحص الجدوى الصارم وكشف التناقضات المالية والإدارية، ورصد الإنجاز الفعلي مقارنة بالمستهدفات.'
                  : 'Formulate national objectives, evaluate rigorous fiscal/workforce feasibility, identify contradictions, and monitor simulated delivery.'}
              </p>
            </div>
          </div>

          {/* Plan Selector & Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={activePlanId}
              onChange={(e) => setActivePlanId(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs text-slate-200 px-3 py-2 rounded-lg font-medium focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {lang === 'ar' ? p.nameAr : p.nameEn} (v{p.version})
                </option>
              ))}
            </select>

            <button
              onClick={handleApplyPlan}
              className="px-3.5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-semibold shadow flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'تطبيق سياسات الخطة' : 'Enact Plan Policies'}</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800 overflow-x-auto text-xs">
          <button
            onClick={() => setSubTab('plans')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              subTab === 'plans'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'الأهداف والبرامج التنموية' : 'Objectives & Programs'}</span>
          </button>

          <button
            onClick={() => setSubTab('feasibility')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              subTab === 'feasibility'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'تحليل الجدوى وكشف التناقضات' : 'Feasibility & Contradictions'}</span>
            {feasibilityReport.contradictions.length > 0 && (
              <span className="bg-rose-500/20 text-rose-300 text-[10px] px-1.5 py-0.2 rounded-full border border-rose-500/40 font-mono">
                {feasibilityReport.contradictions.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setSubTab('monitoring')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              subTab === 'monitoring'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'المتابعة والتقييم (M&E)' : 'Monitoring & Evaluation'}</span>
          </button>

          <button
            onClick={() => setSubTab('alternatives')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              subTab === 'alternatives'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Split className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'مصفوفة البدائل الاستراتيجية' : 'Policy Alternatives'}</span>
          </button>
        </div>
      </div>

      {/* ===================== SUBTAB 1: OBJECTIVES & PROGRAMS ===================== */}
      {subTab === 'plans' && (
        <div className="space-y-5">
          {/* Active Plan Meta Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  {activePlan.horizon === 'long' ? (lang === 'ar' ? 'طويلة الأجل (10 سنوات)' : 'Long Term (10y)') : (lang === 'ar' ? 'متوسطة الأجل (4 سنوات)' : 'Medium Term (4y)')}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {lang === 'ar' ? 'أفق التنفيذ:' : 'Horizon:'} {activePlan.baseYear} — {activePlan.targetYear}
                </span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs text-slate-400 font-mono">الإصدار {activePlan.version}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                {lang === 'ar' ? activePlan.descriptionAr : activePlan.descriptionEn}
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer self-start md:self-auto"
            >
              <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'ar' ? 'إضافة هدف وطني جديد' : 'Add New Objective'}</span>
            </button>
          </div>

          {/* Objectives List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activePlan.objectives.map((obj) => (
              <div
                key={obj.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        obj.priority === 'critical'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800/80'
                          : obj.priority === 'high'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800/80'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {obj.priority === 'critical' ? (lang === 'ar' ? 'أولوية قصوى' : 'Critical') : (lang === 'ar' ? 'أولوية مرتفعة' : 'High Priority')}
                    </span>

                    <span className="text-[11px] font-mono font-semibold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                      {obj.targetYear}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-100 mt-2.5 leading-snug">
                    {lang === 'ar' ? obj.titleAr : obj.titleEn}
                  </h3>

                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-xs font-mono">
                    <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
                      <div className="text-[10px] text-slate-400 font-sans">{lang === 'ar' ? 'خط الأساس' : 'Baseline'}</div>
                      <div className="font-bold text-slate-200 mt-0.5">
                        {obj.baselineValue} {obj.unit}
                      </div>
                    </div>
                    <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
                      <div className="text-[10px] text-emerald-400 font-sans">{lang === 'ar' ? 'المستهدف' : 'Target'}</div>
                      <div className="font-bold text-emerald-300 mt-0.5">
                        {obj.targetValue} {obj.unit}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 mt-3 text-xs text-slate-300">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-cyan-400" />
                        <span>{lang === 'ar' ? 'الموازنة المرصودة:' : 'Budget:'}</span>
                      </span>
                      <span className="font-mono font-bold text-slate-200">${obj.budgetAllocatedUsdBillion}B</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Building className="w-3 h-3 text-indigo-400" />
                        <span>{lang === 'ar' ? 'الجهة المسؤولة:' : 'Institution:'}</span>
                      </span>
                      <span className="truncate max-w-[170px]" title={lang === 'ar' ? obj.responsibleInstitutionAr : obj.responsibleInstitutionEn}>
                        {lang === 'ar' ? obj.responsibleInstitutionAr : obj.responsibleInstitutionEn}
                      </span>
                    </div>
                  </div>

                  {/* Milestones Preview */}
                  {obj.milestones.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1.5">
                        {lang === 'ar' ? 'المحطات الرئيسية (Milestones):' : 'Key Milestones:'}
                      </div>
                      <div className="space-y-1">
                        {obj.milestones.map((m) => (
                          <div key={m.id} className="flex items-center gap-1.5 text-[11px]">
                            {m.completed ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                            ) : (
                              <Clock className="w-3 h-3 text-slate-500 shrink-0" />
                            )}
                            <span className="text-slate-400 font-mono text-[10px]">{m.year}:</span>
                            <span className="truncate text-slate-300">{lang === 'ar' ? m.titleAr : m.titleEn}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-[10px] text-slate-400 bg-slate-950/40 p-2 rounded border border-slate-800/60 leading-relaxed">
                  <span className="font-semibold text-amber-400/90">{lang === 'ar' ? 'القيود والتضحيات: ' : 'Trade-offs: '}</span>
                  {lang === 'ar' ? obj.constraintsAndTradeoffsAr : obj.constraintsAndTradeoffsEn}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== SUBTAB 2: FEASIBILITY & CONTRADICTIONS ===================== */}
      {subTab === 'feasibility' && (
        <div className="space-y-5">
          {/* Verdict Scorecard */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-100">
                    {lang === 'ar' ? 'تقرير الجدوى الشامل واختبار التناقضات' : 'Comprehensive Feasibility & Contradiction Audit'}
                  </h3>
                  <ExplainerBubble itemKey="feasibilityAnalysis" lang={lang} size="sm" showBadge />
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                  {lang === 'ar'
                    ? 'تقييم علمي صارم يحظر إقرار أي خطة دون التحقق الرياضي من توفر الأموال، والكوادر الإدارية، والجدول الزمني.'
                    : 'Algorithmic audit: Never declares a plan feasible simply because it is selected.'}
                </p>
              </div>

              {/* Status Badge & Score */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    {lang === 'ar' ? 'درجة الجدوى الواقعية' : 'Feasibility Score'}
                  </div>
                  <div className="text-2xl font-black font-mono text-cyan-400">
                    {feasibilityReport.overallScore}/100
                  </div>
                </div>

                <div
                  className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 ${
                    feasibilityReport.isFeasible
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60'
                      : 'bg-rose-950/60 text-rose-300 border-rose-700/60'
                  }`}
                >
                  {feasibilityReport.isFeasible ? (
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                  )}
                  <div>
                    <div>{feasibilityReport.isFeasible ? (lang === 'ar' ? 'الخطة مجدية وقابلة للتطبيق' : 'Plan Feasible') : (lang === 'ar' ? 'الخطة غير مجدية وتحتوي تناقضات' : 'Plan Unfeasible')}</div>
                    <div className="text-[10px] opacity-80 uppercase">
                      {lang === 'ar' ? `مستوى المخاطر: ${feasibilityReport.riskLevel}` : `Risk: ${feasibilityReport.riskLevel}`}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Assessment Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800 text-xs">
              {/* 1. Fiscal Pillar */}
              <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">{lang === 'ar' ? '1. الحيز المالي والموازنة' : '1. Fiscal Space'}</span>
                  {feasibilityReport.fiscal.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {lang === 'ar' ? feasibilityReport.fiscal.verdictAr : feasibilityReport.fiscal.verdictEn}
                </p>
                <div className="font-mono text-[10px] text-slate-500 pt-1">
                  المطلوب: ${feasibilityReport.fiscal.requiredTotalBudgetBillion.toFixed(1)}B
                </div>
              </div>

              {/* 2. Workforce Pillar */}
              <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">{lang === 'ar' ? '2. الكفاءة والكوادر' : '2. Workforce & Admin'}</span>
                  {feasibilityReport.workforce.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {lang === 'ar' ? feasibilityReport.workforce.verdictAr : feasibilityReport.workforce.verdictEn}
                </p>
                <div className="font-mono text-[10px] text-slate-500 pt-1">
                  العمالة المطلوبة: {feasibilityReport.workforce.requiredWorkersThousands} ألف
                </div>
              </div>

              {/* 3. Timeline Pillar */}
              <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">{lang === 'ar' ? '3. الأفق والجدول الزمني' : '3. Timeline Realism'}</span>
                  {feasibilityReport.timeline.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {lang === 'ar' ? feasibilityReport.timeline.verdictAr : feasibilityReport.timeline.verdictEn}
                </p>
                <div className="font-mono text-[10px] text-slate-500 pt-1">
                  المدة المخططة: {feasibilityReport.timeline.plannedYears} سنوات
                </div>
              </div>

              {/* 4. Dependencies Pillar */}
              <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">{lang === 'ar' ? '4. ترابط القطاعات' : '4. Dependencies'}</span>
                  {feasibilityReport.dependencies.satisfied ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {lang === 'ar' ? feasibilityReport.dependencies.verdictAr : feasibilityReport.dependencies.verdictEn}
                </p>
                <div className="font-mono text-[10px] text-slate-500 pt-1">
                  عدالة الأقاليم: {feasibilityReport.distributionalImpacts.regionalEquityScore}%
                </div>
              </div>
            </div>
          </div>

          {/* Contradictions & Conflict Detector */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>{lang === 'ar' ? 'كاشف التناقضات الهيكلية وفجوات التنفيذ' : 'Detected Structural Contradictions & Bottlenecks'}</span>
            </h4>

            {feasibilityReport.contradictions.length === 0 ? (
              <div className="p-4 bg-emerald-950/30 border border-emerald-800/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{lang === 'ar' ? 'لم يتم رصد أي تناقضات حادة بين الأهداف والميزانية والجدول الزمني المخصص.' : 'No severe structural contradictions detected between goals, budgets, and capacity.'}</span>
              </div>
            ) : (
              <div className="space-y-3">
                {feasibilityReport.contradictions.map((contra) => (
                  <div
                    key={contra.id}
                    className="bg-slate-900 border border-rose-900/50 rounded-xl p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-300 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        {lang === 'ar' ? contra.titleAr : contra.titleEn}
                      </span>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800">
                        {contra.severity}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {lang === 'ar' ? contra.descriptionAr : contra.descriptionEn}
                    </p>

                    <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800 text-xs text-slate-400">
                      <span className="font-semibold text-cyan-400">{lang === 'ar' ? 'الحل والمعالجة المقترحة: ' : 'Remedy: '}</span>
                      {lang === 'ar' ? contra.suggestedRemedyAr : contra.suggestedRemedyEn}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================== SUBTAB 3: MONITORING & EVALUATION (M&E) ===================== */}
      {subTab === 'monitoring' && (
        <div className="space-y-5">
          {/* Model Clarification & Simulated Notice Banner */}
          <div className="bg-amber-950/40 border border-amber-800/60 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-200">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="font-bold text-amber-300 block mb-0.5">
                {lang === 'ar' ? 'تنبيه النزاهة العلمية والشفافية:' : 'Scientific Integrity Notice:'}
              </strong>
              {lang === 'ar'
                ? 'البيانات المعروضة أدناه تمثل نتائج محاكاة خوارزمية افتراضية للمسار المستقبلي للدولة وليست رصداً إحصائياً واقعياً على أرض الواقع. النظام لا يدعي أن هذه السياسات تم تطبيقها فعلياً في العالم الحقيقي.'
                : 'Data below represents algorithmic simulation projections of the national model and NOT empirical field observations. The simulator does not claim that simulated policies are implemented in the real world.'}
            </div>
          </div>

          {/* M&E Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-100">
                  {lang === 'ar' ? 'لوحة المتابعة والتقييم الدوري للأهداف التنموية' : 'Periodic Monitoring & Evaluation (M&E) Scorecard'}
                </h3>
                <ExplainerBubble itemKey="monitoringEvaluation" lang={lang} size="sm" showBadge />
              </div>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-800">
                {lang === 'ar' ? 'السنة المحاكاة الحالية:' : 'Current Simulated Year:'} {currentState.year}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">{lang === 'ar' ? 'الهدف الاستراتيجي' : 'Objective'}</th>
                    <th className="py-3 px-3">{lang === 'ar' ? 'خط الأساس' : 'Baseline'}</th>
                    <th className="py-3 px-3">{lang === 'ar' ? 'القيمة المحاكاة الحالية' : 'Simulated Value'}</th>
                    <th className="py-3 px-3">{lang === 'ar' ? 'المستهدف' : 'Target'}</th>
                    <th className="py-3 px-3">{lang === 'ar' ? 'نسبة الإنجاز' : 'Progress'}</th>
                    <th className="py-3 px-3">{lang === 'ar' ? 'الميزانية المنفقة' : 'Spent Budget'}</th>
                    <th className="py-3 px-4">{lang === 'ar' ? 'حالة المخاطر' : 'Risk Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {evaluatedObjectives.map((obj) => (
                    <tr key={obj.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 font-sans font-medium text-slate-200">
                        <div className="flex items-center gap-1.5">
                          <ExplainerBubble itemKey={obj.indicatorKey} lang={lang} size="sm" />
                          <span>{lang === 'ar' ? obj.titleAr : obj.titleEn}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {obj.responsibleInstitutionAr}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-400">
                        {obj.baselineValue} {obj.unit}
                      </td>
                      <td className="py-3 px-3 font-bold text-cyan-300">
                        {obj.currentSimulatedValue} {obj.unit}
                      </td>
                      <td className="py-3 px-3 text-emerald-300">
                        {obj.targetValue} {obj.unit}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                (obj.progressPct || 0) >= 100
                                  ? 'bg-emerald-400'
                                  : (obj.progressPct || 0) >= 50
                                  ? 'bg-cyan-400'
                                  : 'bg-amber-400'
                              }`}
                              style={{ width: `${Math.min(100, obj.progressPct || 0)}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-bold text-slate-200">
                            {obj.progressPct}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        ${obj.budgetSpentSimulated}B / ${obj.budgetAllocatedUsdBillion}B
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            obj.riskStatus === 'achieved'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : obj.riskStatus === 'on_track'
                              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                              : obj.riskStatus === 'at_risk'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}
                        >
                          {obj.riskStatus === 'achieved'
                            ? (lang === 'ar' ? 'تم الإنجاز' : 'Achieved')
                            : obj.riskStatus === 'on_track'
                            ? (lang === 'ar' ? 'على المسار' : 'On Track')
                            : obj.riskStatus === 'at_risk'
                            ? (lang === 'ar' ? 'مهدد بالتأخر' : 'At Risk')
                            : (lang === 'ar' ? 'خارج المسار' : 'Off Track')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================== SUBTAB 4: POLICY ALTERNATIVES ===================== */}
      {subTab === 'alternatives' && (
        <div className="space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-100">
                  {lang === 'ar' ? 'مقارنة البدائل الاستراتيجية المتكاملة للسياسات' : 'Integrated Policy Alternatives Matrix'}
                </h3>
                <ExplainerBubble itemKey="policyAlternatives" lang={lang} size="sm" showBadge />
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'ar'
                  ? 'مقارنة 4 مسارات كبرى من نفس نقطة الانطلاق: الوضع الراهن، التحول المتوازن، التقشف المالي، والدفعة الاستثمارية بالاستدانة.'
                  : 'Multi-criteria comparison across 4 pathways from identical initial conditions.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {alternatives.map((alt) => (
              <div
                key={alt.id}
                className={`bg-slate-900 border rounded-xl p-4 space-y-4 flex flex-col justify-between ${
                  alt.id === 'proposed'
                    ? 'border-cyan-500/60 shadow-md ring-1 ring-cyan-500/30'
                    : 'border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        alt.riskRating === 'low'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : alt.riskRating === 'moderate'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          : alt.riskRating === 'high'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}
                    >
                      {lang === 'ar' ? `مخاطرة: ${alt.riskRating}` : `Risk: ${alt.riskRating}`}
                    </span>

                    {alt.id === 'proposed' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500 text-slate-950">
                        {lang === 'ar' ? 'الموصى به' : 'Recommended'}
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-slate-100 mt-2">
                    {lang === 'ar' ? alt.titleAr : alt.titleEn}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {lang === 'ar' ? alt.descriptionAr : alt.descriptionEn}
                  </p>

                  {/* Projected Key Metrics */}
                  <div className="grid grid-cols-2 gap-2 mt-3 p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">
                        {lang === 'ar' ? 'النمو (5 سنوات):' : '5y GDP Growth:'}
                      </span>
                      <span className="font-bold text-cyan-300">{alt.projectedMetrics.gdpGrowth5YrAvg}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">
                        {lang === 'ar' ? 'نسبة الدين النهائي:' : 'Final Debt Ratio:'}
                      </span>
                      <span className="font-bold text-slate-200">{alt.projectedMetrics.debtToGdpFinal}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">
                        {lang === 'ar' ? 'متوسط التضخم:' : 'Avg Inflation:'}
                      </span>
                      <span className="font-bold text-amber-300">{alt.projectedMetrics.inflationAvg}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">
                        {lang === 'ar' ? 'البطالة النهائية:' : 'Final Unemployment:'}
                      </span>
                      <span className="font-bold text-indigo-300">{alt.projectedMetrics.unemploymentFinal}%</span>
                    </div>
                  </div>

                  {/* Pros & Cons */}
                  <div className="space-y-2 mt-3 text-xs">
                    <div>
                      <span className="font-semibold text-emerald-400 block text-[11px] mb-1">
                        {lang === 'ar' ? '✓ المكاسب الرئيسية:' : '✓ Key Benefits:'}
                      </span>
                      <ul className="list-disc list-inside text-slate-300 space-y-0.5 text-[11px]">
                        {(lang === 'ar' ? alt.benefitsAr : alt.benefitsEn).slice(0, 2).map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="font-semibold text-rose-400 block text-[11px] mb-1">
                        {lang === 'ar' ? '✗ التكاليف والتضحيات:' : '✗ Costs & Trade-offs:'}
                      </span>
                      <ul className="list-disc list-inside text-slate-300 space-y-0.5 text-[11px]">
                        {(lang === 'ar' ? alt.costsAr : alt.costsEn).slice(0, 2).map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 bg-slate-950/40 p-2 rounded">
                  <strong className="text-amber-400/90 block mb-0.5">
                    {lang === 'ar' ? 'الآثار غير المقصودة والعدالة:' : 'Unintended Consequences & Equity:'}
                  </strong>
                  {lang === 'ar' ? alt.distributionalImpactAr : alt.distributionalImpactEn}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add New Objective */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-400" />
                <span>{lang === 'ar' ? 'إضافة هدف تنموي استراتيجي جديد' : 'Add Strategic Objective'}</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddObjective} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {lang === 'ar' ? 'عنوان الهدف (بالعربية):' : 'Objective Title (Arabic):'}
                </label>
                <input
                  type="text"
                  required
                  value={newTitleAr}
                  onChange={(e) => setNewTitleAr(e.target.value)}
                  placeholder="مثال: مضاعفة سعة تخزين المياه العذبة بنسبة 40%"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {lang === 'ar' ? 'القطاع التنموي:' : 'Category:'}
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ObjectiveCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="economic">{lang === 'ar' ? 'اقتصادي وإنتاجي' : 'Economic'}</option>
                    <option value="fiscal">{lang === 'ar' ? 'مالي واستدامة الدين' : 'Fiscal'}</option>
                    <option value="social">{lang === 'ar' ? 'اجتماعي وحماية' : 'Social'}</option>
                    <option value="infrastructure">{lang === 'ar' ? 'بنية تحتية ونقل' : 'Infrastructure'}</option>
                    <option value="environment">{lang === 'ar' ? 'بيئة ومناخ ومياه' : 'Environment'}</option>
                    <option value="health_education">{lang === 'ar' ? 'صحة وتعليم ومهارات' : 'Health & Edu'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {lang === 'ar' ? 'الأولوية السيادية:' : 'Priority:'}
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as ObjectivePriority)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="critical">{lang === 'ar' ? 'قصوى (Critical)' : 'Critical'}</option>
                    <option value="high">{lang === 'ar' ? 'مرتفعة (High)' : 'High'}</option>
                    <option value="medium">{lang === 'ar' ? 'متوسطة (Medium)' : 'Medium'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {lang === 'ar' ? 'القيمة المستهدفة:' : 'Target Value:'}
                  </label>
                  <input
                    type="number"
                    value={newTargetVal}
                    onChange={(e) => setNewTargetVal(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {lang === 'ar' ? 'سنة الإنجاز:' : 'Target Year:'}
                  </label>
                  <input
                    type="number"
                    value={newTargetYear}
                    onChange={(e) => setNewTargetYear(parseInt(e.target.value) || 2030)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {lang === 'ar' ? 'الموازنة ($B):' : 'Budget ($B):'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={newBudget}
                    onChange={(e) => setNewBudget(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium cursor-pointer"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold shadow cursor-pointer"
                >
                  {lang === 'ar' ? 'حفظ وإدراج الهدف' : 'Save Objective'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
