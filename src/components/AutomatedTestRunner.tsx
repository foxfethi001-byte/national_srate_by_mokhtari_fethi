/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Interactive Automated Test Runner UI
 * واجهة تشغيل اختبارات القبول الآلية والتحقق من النزاهة المنهجية
 */

import React, { useState, useEffect } from 'react';
import { AutomatedTestCaseResult, runAllAutomatedTests } from '../simulation/automatedTests';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { Play, CheckCircle2, XCircle, RefreshCw, Cpu, CheckCheck } from 'lucide-react';

interface AutomatedTestRunnerProps {
  lang: Language;
}

export const AutomatedTestRunner: React.FC<AutomatedTestRunnerProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<AutomatedTestCaseResult[]>([]);
  const [lastRunTimestamp, setLastRunTimestamp] = useState<string | null>(null);

  const executeTests = async () => {
    setIsRunning(true);
    try {
      const results = await runAllAutomatedTests();
      setTestResults(results);
      setLastRunTimestamp(new Date().toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-US'));
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    executeTests();
  }, []);

  const totalTests = testResults.length;
  const passedTests = testResults.filter((r) => r.passed).length;
  const allPassed = totalTests > 0 && passedTests === totalTests;

  return (
    <div className="space-y-6">
      {/* Top Banner & Trigger */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>منصة اختبارات القبول الآلية (Phase 1 Acceptance Test Suite)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            فحص متكامل للمحرك الحسابي، ومحرك الزمن، والتخزين المحلي، ورفض المدخلات التالفة، ونزاهة إعادة الضبط.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {lastRunTimestamp && (
            <span className="text-[11px] font-mono text-slate-400">
              آخر تشغيل: {lastRunTimestamp}
            </span>
          )}
          <button
            onClick={executeTests}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 rounded transition-colors cursor-pointer"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>جاري التنفيذ...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>إعادة تشغيل كافة الاختبارات</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Summary Scorecard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center justify-between">
          <span className="text-slate-400">الحالة الإجمالية:</span>
          <span className={`font-bold flex items-center gap-1 ${allPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
            {allPassed ? (
              <>
                <CheckCheck className="w-4 h-4" />
                <span>كافة الاختبارات ناجحة 100%</span>
              </>
            ) : (
              <span>توجد اختبارات لم تجتز</span>
            )}
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center justify-between">
          <span className="text-slate-400">معدل الاجتياز:</span>
          <span className="text-cyan-400 font-bold tabular-nums">
            {passedTests} من أصل {totalTests}
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center justify-between">
          <span className="text-slate-400">زمن التنفيذ الإجمالي:</span>
          <span className="text-slate-200 tabular-nums">
            {testResults.reduce((acc, r) => acc + r.durationMs, 0).toFixed(2)} ms
          </span>
        </div>
      </div>

      {/* Test Cases Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h4 className="text-xs font-semibold text-slate-200">
            تفاصيل حالات الاختبار المنفذة
          </h4>
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
                  <span className="font-mono text-[10px] text-slate-500">[{test.suite}]</span>
                </div>
                <p className="text-slate-400 text-[11px] font-mono pr-6 rtl:pr-6 ltr:pl-6 leading-relaxed">
                  {lang === 'ar' ? test.messageAr : test.messageEn}
                </p>
              </div>

              <div className="flex items-center gap-3 font-mono text-[11px] shrink-0 pr-6 sm:pr-0">
                <span className="text-slate-500 tabular-nums">
                  {test.durationMs} ms
                </span>
                <span
                  className={`px-2 py-0.5 rounded font-semibold ${
                    test.passed
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                      : 'bg-rose-950 text-rose-400 border border-rose-800/60'
                  }`}
                >
                  {test.passed ? 'ناجح (Passed)' : 'فشل (Failed)'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
