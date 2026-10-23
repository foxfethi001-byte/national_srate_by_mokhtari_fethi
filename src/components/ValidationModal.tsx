/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * System Invariant & Scientific Integrity Validator
 * فاحص المتطابقات الرياضية والمحددات المحاسبية والقوانين الفيزيائية
 */

import React from 'react';
import { SimulationState, InvariantTestResult } from '../types/simulation';
import { runValidationSuite } from '../simulation/validator';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { CheckCircle2, XCircle, ShieldCheck, Play, AlertCircle } from 'lucide-react';

interface ValidationModalProps {
  currentState: SimulationState;
  previousState?: SimulationState;
  history: SimulationState[];
  lang: Language;
}

export const ValidationModal: React.FC<ValidationModalProps> = ({
  currentState,
  previousState,
  history,
  lang,
}) => {
  const t = TRANSLATIONS[lang];

  // Run tests on current state
  const testResults: InvariantTestResult[] = runValidationSuite(currentState, previousState);

  // Check all history consistency
  let allHistoryPassed = true;
  for (let i = 1; i < history.length; i++) {
    const historicalTests = runValidationSuite(history[i], history[i - 1]);
    if (historicalTests.some((t) => !t.passed)) {
      allHistoryPassed = false;
      break;
    }
  }

  const allCurrentPassed = testResults.every((r) => r.passed);

  return (
    <div className="space-y-6">
      {/* Overview Status Banner */}
      <div
        className={`p-4 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          allCurrentPassed
            ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200'
            : 'bg-rose-950/40 border-rose-800/80 text-rose-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <h2 className="text-sm font-bold text-white">
              {allCurrentPassed ? t.validation.statusAllPassed : t.validation.statusWarnings}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              تم فحص جميع المتطابقات المحاسبية لسنة {currentState.year}، وعبر السلسلة الزمنية الكاملة ({history.length} سنوات).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-2.5 py-1 rounded bg-slate-900/80 border border-slate-700 text-slate-200">
            اختبارات مجتازة: {testResults.filter((r) => r.passed).length} / {testResults.length}
          </span>
        </div>
      </div>

      {/* Tests Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-sm font-semibold text-slate-200">
            نتائج الفحص الآلي للمتطابقات والقيود
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            تضمن هذه الاختبارات الرياضية عدم حدوث تسريب مالي، أو تضاعف في الحساب، أو أخطاء ناتجة عن الفواصل العائمة.
          </p>
        </div>

        <div className="divide-y divide-slate-800/80">
          {testResults.map((test) => (
            <div key={test.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {test.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span className="font-semibold text-slate-100">
                    {lang === 'ar' ? test.nameAr : test.nameEn}
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">[{test.id}]</span>
                </div>
                <p className="text-slate-400 text-[11px] font-mono pr-6 rtl:pr-6 ltr:pl-6">
                  {lang === 'ar' ? test.detailsAr : test.detailsEn}
                </p>
              </div>

              <div className="flex items-center gap-3 font-mono text-[11px] shrink-0 pr-6 sm:pr-0">
                <span className="text-slate-500">
                  {t.validation.tolerance}: &plusmn;{test.tolerance}
                </span>
                <span
                  className={`px-2 py-0.5 rounded font-semibold ${
                    test.passed
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                      : 'bg-rose-950 text-rose-400 border border-rose-800/60'
                  }`}
                >
                  {test.passed ? t.validation.passed : t.validation.failed}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Epistemological & Limitations Disclosure */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
        <h3 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-cyan-400" />
          <span>حدود النموذج والشفافية المنهجية (Methodological Limitations)</span>
        </h3>
        <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside leading-relaxed">
          <li>
            <strong className="text-slate-200">التمييز بين المتطابقات المحاسبية والسلوك البشري:</strong> المتطابقات (مثل العجز = النفقات - الإيرادات) يقينية 100%. أما استجابات الاستثمار الخاص، التضخم، والتوتر الاجتماعي فهي علاقات سلوكية مشروطة بالافتراضات.
          </li>
          <li>
            <strong className="text-slate-200">حتمية المحاكاة:</strong> المحاكي حتمي (Deterministic) لضمان إمكانية تكرار النتائج والتحقق العلمي منها، ولا يفترض سيناريوهات غير قابلة للاختبار.
          </li>
          <li>
            <strong className="text-slate-200">البيانات التأسيسية:</strong> النماذج الوطنية الثلاثة مصممة استرشادياً لتمثيل أنماط اقتصادية واقعية (دول ريعية، اقتصادات صناعية هرمة، اقتصادات صاعدة)، ولا تمثل دولة بعينها بصورة حصرية.
          </li>
        </ul>
      </div>
    </div>
  );
};
