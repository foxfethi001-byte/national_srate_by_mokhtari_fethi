/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Crisis & Shock Stress Testing Center (Phase 5)
 * مركز إدارة الأزمات السيادية وصدمات الإجهاد المركبة وتتبع انتشار الآثار
 */

import React, { useState } from 'react';
import { SimulationState } from '../types/simulation';
import { CrisisEvent, CrisisCategory } from '../types/planning';
import { ARCHETYPE_CRISES, applyCrisisToState } from '../simulation/crisisEngine';
import { auditTrailManager } from '../simulation/auditTrail';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { ExplainerBubble } from './common/ExplainerBubble';
import {
  Flame,
  AlertTriangle,
  Zap,
  Activity,
  PlusCircle,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Clock,
  HelpCircle,
  Play,
  ArrowRight,
} from 'lucide-react';

interface CrisisCenterViewProps {
  currentState: SimulationState;
  onApplySimulatedState?: (state: SimulationState) => void;
  lang: Language;
}

export const CrisisCenterView: React.FC<CrisisCenterViewProps> = ({
  currentState,
  onApplySimulatedState,
  lang,
}) => {
  const t = TRANSLATIONS[lang];

  // Crises list
  const [crises, setCrises] = useState<CrisisEvent[]>(ARCHETYPE_CRISES);
  const [selectedCrisisId, setSelectedCrisisId] = useState<string>(crises[0].id);

  // Custom Event Modal
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customNameAr, setCustomNameAr] = useState('');
  const [customDescAr, setCustomDescAr] = useState('');
  const [customCategory, setCustomCategory] = useState<CrisisCategory>('custom_event');
  const [customSeverity, setCustomSeverity] = useState<number>(50);
  const [customDuration, setCustomDuration] = useState<number>(2);

  const selectedCrisis = crises.find((c) => c.id === selectedCrisisId) || crises[0];
  const activeCrises = crises.filter((c) => c.isActive);

  // Simulated Stressed State
  const stressedState = applyCrisisToState(currentState, activeCrises);

  // Impact deltas
  const gdpDeltaPct = Math.round(((stressedState.macro.realGdp - currentState.macro.realGdp) / currentState.macro.realGdp) * 1000) / 10;
  const inflationDelta = Math.round((stressedState.macro.inflationRate - currentState.macro.inflationRate) * 10) / 10;
  const deficitDelta = Math.round((stressedState.macro.overallDeficit - currentState.macro.overallDeficit) * 10) / 10;
  const debtDelta = Math.round((stressedState.macro.debtToGdpRatio - currentState.macro.debtToGdpRatio) * 10) / 10;

  // Toggle crisis active status
  const handleToggleCrisis = (id: string) => {
    const target = crises.find((c) => c.id === id);
    if (!target) return;

    const willBeActive = !target.isActive;
    const updated = crises.map((c) => (c.id === id ? { ...c, isActive: willBeActive } : c));
    setCrises(updated);

    auditTrailManager.logEvent({
      simulatedYear: currentState.year,
      eventType: willBeActive ? 'crisis_injected' : 'crisis_resolved',
      actor: 'غرفة إدارة الأزمات الوطنية',
      titleAr: willBeActive ? `حقن أزمة: ${target.nameAr}` : `احتواء وإنهاء أزمة: ${target.nameAr}`,
      titleEn: willBeActive ? `Injected Crisis: ${target.nameEn}` : `Resolved Crisis: ${target.nameEn}`,
      detailsAr: willBeActive
        ? `تم تنشيط الصدمة بشدة ${target.severityPct}% ولمدة ${target.durationYears} سنوات.`
        : `تم رفع الصدمة وبدء مرحلة التعافي التدريجي.`,
      detailsEn: willBeActive
        ? `Activated shock at ${target.severityPct}% severity for ${target.durationYears}y.`
        : `Deactivated shock and commenced gradual recovery.`,
    });
  };

  // Severity slider change
  const handleSeverityChange = (id: string, newSeverity: number) => {
    setCrises(crises.map((c) => (c.id === id ? { ...c, severityPct: newSeverity } : c)));
  };

  // Clear all crises
  const handleClearAll = () => {
    setCrises(crises.map((c) => ({ ...c, isActive: false })));
    auditTrailManager.logEvent({
      simulatedYear: currentState.year,
      eventType: 'crisis_resolved',
      actor: 'غرفة إدارة الأزمات',
      titleAr: 'تصفير كافة الأزمات النشطة واستعادة الاستقرار',
      titleEn: 'Cleared All Active Crises & Restored Baseline',
      detailsAr: 'تم إنهاء كافة اختبارات الإجهاد والعودة للمسار الأساسي.',
      detailsEn: 'Terminated stress simulations and returned to baseline.',
    });
  };

  // Apply Stressed State directly into simulation engine
  const handleCommitStress = () => {
    if (onApplySimulatedState) {
      onApplySimulatedState(stressedState);
    }
  };

  // Add custom event
  const handleAddCustomCrisis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customNameAr.trim()) return;

    const newCrisis: CrisisEvent = {
      id: `custom_${Date.now()}`,
      category: customCategory,
      nameAr: customNameAr.trim(),
      nameEn: customNameAr.trim(),
      descriptionAr: customDescAr.trim() || 'صدمة مخصصة محددة من قبل المستخدم.',
      descriptionEn: 'User-defined custom stress testing event.',
      triggerConditionAr: 'حقن يدوي مخصص من المستخدم.',
      triggerConditionEn: 'Manual user injection.',
      startYear: currentState.year,
      durationYears: customDuration,
      severityPct: customSeverity,
      isActive: true,
      isUserCreated: true,
      affectedVariables: [
        { variableKey: 'inflationRate', variableNameAr: 'معدل التضخم', impactFactor: customSeverity * 0.08, unit: '%' },
        { variableKey: 'realGdp', variableNameAr: 'الناتج المحلي', impactFactor: -customSeverity * 0.05, unit: '%' },
        { variableKey: 'unemploymentRate', variableNameAr: 'البطالة', impactFactor: customSeverity * 0.04, unit: '%' },
      ],
      propagationRulesAr: ['تنتشر الصدمة المخصصة عبر شبكة العلاقات الاقتصادية وفق نسبة الشدة المحددة.'],
      propagationRulesEn: ['Propagates across macroeconomic dependencies weighted by user severity.'],
      recoveryHalfLifeYears: 1.5,
    };

    setCrises([newCrisis, ...crises]);
    setSelectedCrisisId(newCrisis.id);
    setShowCustomModal(false);
    setCustomNameAr('');
    setCustomDescAr('');

    auditTrailManager.logEvent({
      simulatedYear: currentState.year,
      eventType: 'crisis_injected',
      actor: 'المستخدم / مختبر الإجهاد',
      titleAr: `إنشاء وحقن أزمة مخصصة: ${newCrisis.nameAr}`,
      titleEn: `Created Custom Shock: ${newCrisis.nameEn}`,
      detailsAr: `شدة الصدمة ${customSeverity}% لمدة ${customDuration} سنوات.`,
      detailsEn: `Severity ${customSeverity}% across ${customDuration}y.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100">
                  {lang === 'ar' ? 'مركز إدارة الأزمات السيادية واختبارات الإجهاد' : 'Sovereign Crisis & Stress Testing Center'}
                </h2>
                <ExplainerBubble itemKey="crisisCommodity" lang={lang} size="sm" showBadge />
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                {lang === 'ar'
                  ? 'محاكاة 9 أزمات هيكلية وصدمات خارجية (أسعار السلع، الجفاف، سلاسل الإمداد، انهيار المرافق) مع تتبع انتشار الآثار وقواعد التعافي.'
                  : 'Simulate 9 structural national crises with explicit triggers, propagation mechanics, duration, and recovery assumptions.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {activeCrises.length > 0 ? (
              <button
                onClick={handleClearAll}
                className="px-3.5 py-2 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/80 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'تصفير كافة الأزمات النشطة' : 'Clear All Crises'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-800/40">
                <ShieldCheck className="w-4 h-4" />
                <span>{lang === 'ar' ? 'البيئة مستقرة (لا توجد أزمات نشطة)' : 'Stable Environment'}</span>
              </div>
            )}

            <button
              onClick={() => setShowCustomModal(true)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'ar' ? 'أزمة مخصصة جديدة' : 'Custom Shock'}</span>
            </button>
          </div>
        </div>

        {/* Real-time Stress Impact Summary Bar */}
        {activeCrises.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
              <span className="font-sans font-bold text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>{lang === 'ar' ? 'الضرر التراكمي للأزمات النشطة:' : 'Cumulative Impact:'}</span>
              </span>

              <div className="bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 font-sans mr-1">{lang === 'ar' ? 'الناتج GDP:' : 'GDP:'}</span>
                <span className={`font-bold ${gdpDeltaPct < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {gdpDeltaPct > 0 ? '+' : ''}{gdpDeltaPct}%
                </span>
              </div>

              <div className="bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 font-sans mr-1">{lang === 'ar' ? 'التضخم:' : 'Inflation:'}</span>
                <span className="font-bold text-amber-400">+{inflationDelta}%</span>
              </div>

              <div className="bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 font-sans mr-1">{lang === 'ar' ? 'عجز الموازنة:' : 'Deficit:'}</span>
                <span className="font-bold text-rose-400">${deficitDelta}B</span>
              </div>

              <div className="bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 font-sans mr-1">{lang === 'ar' ? 'نسبة الدين:' : 'Debt Ratio:'}</span>
                <span className="font-bold text-rose-300">+{debtDelta}%</span>
              </div>
            </div>

            {onApplySimulatedState && (
              <button
                onClick={handleCommitStress}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5 transition-colors cursor-pointer self-start md:self-auto"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'تثبيت أثر الصدمة في مسار المحاكاة' : 'Commit Stress into Engine'}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Grid: Left List of Crises, Right Detailed Propagation & Parameters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Crisis Cards List */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>{lang === 'ar' ? 'مكتبة الأزمات الوطنية الـ 9' : '9 National Crisis Archetypes'}</span>
            <span className="font-mono text-cyan-400">{activeCrises.length}/{crises.length} {lang === 'ar' ? 'نشطة' : 'active'}</span>
          </h3>

          <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
            {crises.map((crisis) => {
              const isSelected = crisis.id === selectedCrisisId;
              return (
                <div
                  key={crisis.id}
                  onClick={() => setSelectedCrisisId(crisis.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-500/50 shadow-sm'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${crisis.isActive ? 'bg-rose-500 animate-pulse' : 'bg-slate-600'}`} />
                      <h4 className="text-xs font-bold text-slate-100 leading-snug">
                        {lang === 'ar' ? crisis.nameAr : crisis.nameEn}
                      </h4>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleCrisis(crisis.id);
                      }}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                        crisis.isActive
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
                      }`}
                    >
                      {crisis.isActive ? (lang === 'ar' ? 'نشطة الآن' : 'Active') : (lang === 'ar' ? 'تفعيل' : 'Inject')}
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {lang === 'ar' ? crisis.descriptionAr : crisis.descriptionEn}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px] font-mono text-slate-400">
                    <span>{lang === 'ar' ? 'الشدة:' : 'Severity:'} {crisis.severityPct}%</span>
                    <span>{lang === 'ar' ? 'المدة:' : 'Duration:'} {crisis.durationYears} {lang === 'ar' ? 'سنوات' : 'yrs'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Crisis Detailed View */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-100">
                    {lang === 'ar' ? selectedCrisis.nameAr : selectedCrisis.nameEn}
                  </h3>
                  {selectedCrisis.isActive && (
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 uppercase animate-pulse">
                      {lang === 'ar' ? 'تحت الإجهاد الفعلي' : 'Active Shock'}
                    </span>
                  )}
                </div>
                <div className="text-xs text-cyan-400 font-mono mt-0.5">
                  {selectedCrisis.category}
                </div>
              </div>

              <button
                onClick={() => handleToggleCrisis(selectedCrisis.id)}
                className={`px-4 py-2 rounded-lg text-xs font-bold shadow flex items-center gap-2 transition-all cursor-pointer ${
                  selectedCrisis.isActive
                    ? 'bg-rose-950/80 text-rose-300 border border-rose-800 hover:bg-rose-900'
                    : 'bg-gradient-to-r from-rose-600 to-amber-600 text-white hover:from-rose-500 hover:to-amber-500'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>
                  {selectedCrisis.isActive
                    ? (lang === 'ar' ? 'إيقاف الصدمة والبدء في التعافي' : 'Deactivate & Recover')
                    : (lang === 'ar' ? 'حقن هذه الأزمة في الاقتصاد' : 'Inject This Crisis')}
                </span>
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'ar' ? selectedCrisis.descriptionAr : selectedCrisis.descriptionEn}
            </p>

            {/* Configurable Parameters Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-semibold text-slate-300">
                    {lang === 'ar' ? 'حدة وشدة الصدمة (Severity):' : 'Shock Severity:'}
                  </label>
                  <span className="font-mono font-bold text-rose-400">{selectedCrisis.severityPct}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={selectedCrisis.severityPct}
                  onChange={(e) => handleSeverityChange(selectedCrisis.id, parseInt(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <div className="text-[10px] text-slate-400">
                  {lang === 'ar' ? 'تحدد نسبة الهبوط في الطاقة الإنتاجية أو القفزة في الأسعار.' : 'Scales the magnitude of disruption.'}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-semibold text-slate-300">
                    {lang === 'ar' ? 'مدة بقاء الصدمة (Duration):' : 'Duration:'}
                  </label>
                  <span className="font-mono font-bold text-cyan-400">{selectedCrisis.durationYears} {lang === 'ar' ? 'سنوات' : 'years'}</span>
                </div>
                <div className="text-[11px] font-mono text-slate-300 pt-1">
                  نصف عمر التعافي (Half-life): {selectedCrisis.recoveryHalfLifeYears} سنة
                </div>
                <div className="text-[10px] text-slate-400">
                  {lang === 'ar' ? 'الزمن اللازم لعودة المتغيرات إلى 50% من مستواها الطبيعي.' : 'Time to recover 50% of the baseline equilibrium.'}
                </div>
              </div>
            </div>

            {/* Affected Variables Direct Impact */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                {lang === 'ar' ? 'المتغيرات المباشرة المتأثرة:' : 'Directly Affected Variables:'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {selectedCrisis.affectedVariables.map((aff, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs font-mono">
                    <div className="text-[10px] text-slate-400 font-sans">{aff.variableNameAr}</div>
                    <div className="font-bold text-rose-400 mt-1">
                      {aff.impactFactor > 0 ? '+' : ''}{aff.impactFactor} {aff.unit}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Propagation Rules */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>{lang === 'ar' ? 'قواعد الانتشار القطاعي وسلسلة التداعيات:' : 'Propagation Rules & Sector Transmission:'}</span>
              </h4>
              <div className="space-y-1.5">
                {(lang === 'ar' ? selectedCrisis.propagationRulesAr : selectedCrisis.propagationRulesEn).map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2.5 rounded bg-slate-950/40 border border-slate-800/60 text-xs text-slate-300">
                    <span className="font-mono text-cyan-400 font-bold shrink-0">{idx + 1}.</span>
                    <span className="leading-relaxed">{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Custom Crisis Creator */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-400" />
                <span>{lang === 'ar' ? 'تصميم وبناء صدمة أو أزمة مخصصة' : 'Create Custom Shock Event'}</span>
              </h3>
              <button
                onClick={() => setShowCustomModal(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomCrisis} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {lang === 'ar' ? 'اسم الأزمة:' : 'Crisis Name:'}
                </label>
                <input
                  type="text"
                  required
                  value={customNameAr}
                  onChange={(e) => setCustomNameAr(e.target.value)}
                  placeholder="مثال: هجوم سيبراني يعطل محطات توليد الكهرباء"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {lang === 'ar' ? 'وصف آلية الصدمة ومسبباتها:' : 'Mechanism Description:'}
                </label>
                <textarea
                  rows={2}
                  value={customDescAr}
                  onChange={(e) => setCustomDescAr(e.target.value)}
                  placeholder="وصف تداعيات الصدمة على القطاعات المعنية..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {lang === 'ar' ? 'الشدة المبدئية (%):' : 'Severity (%):'}
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={customSeverity}
                    onChange={(e) => setCustomSeverity(parseInt(e.target.value) || 50)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {lang === 'ar' ? 'المدة المقدرة (سنوات):' : 'Duration (years):'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(parseInt(e.target.value) || 2)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium cursor-pointer"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-semibold shadow cursor-pointer"
                >
                  {lang === 'ar' ? 'حقن وتفعيل الأزمة' : 'Inject Shock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
