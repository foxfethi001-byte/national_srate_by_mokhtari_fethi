/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Causal Inspector & Formal Equations Explorer
 * مستكشف العلاقات السببية والمعادلات الرياضية ومحددات اليقين المنهجي
 */

import React, { useState } from 'react';
import { CAUSAL_RELATIONSHIPS } from '../simulation/causalGraph';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { Search, CheckCircle2, AlertOctagon, HelpCircle, BookOpen } from 'lucide-react';
import { ConfidenceLevel } from '../types/simulation';

interface CausalInspectorProps {
  lang: Language;
  preselectedMetricKey?: string;
  onClearPreselection?: () => void;
}

export const CausalInspector: React.FC<CausalInspectorProps> = ({
  lang,
  preselectedMetricKey,
}) => {
  const t = TRANSLATIONS[lang];
  const [searchTerm, setSearchTerm] = useState<string>(preselectedMetricKey || '');
  const [selectedConfidence, setSelectedConfidence] = useState<string>('all');
  const [selectedLinkId, setSelectedLinkId] = useState<string>(
    CAUSAL_RELATIONSHIPS[0].id
  );

  const filteredLinks = CAUSAL_RELATIONSHIPS.filter((link) => {
    const matchesSearch =
      searchTerm === '' ||
      link.sourceVar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.targetVar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.formulaArabic.includes(searchTerm) ||
      link.formulaEnglish.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.economicRationaleAr.includes(searchTerm) ||
      link.economicRationaleEn.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesConfidence =
      selectedConfidence === 'all' || link.confidence === selectedConfidence;

    return matchesSearch && matchesConfidence;
  });

  const activeLink = CAUSAL_RELATIONSHIPS.find((l) => l.id === selectedLinkId) || filteredLinks[0] || CAUSAL_RELATIONSHIPS[0];

  const getConfidenceBadge = (confidence: ConfidenceLevel) => {
    switch (confidence) {
      case 'accounting_identity':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-800/80 px-2 py-0.5 rounded">
            <CheckCircle2 className="w-3 h-3" />
            {t.causality.identityBadge}
          </span>
        );
      case 'high_empirical':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400 bg-cyan-950/70 border border-cyan-800/80 px-2 py-0.5 rounded">
            <CheckCircle2 className="w-3 h-3" />
            {t.causality.highEmpiricalBadge}
          </span>
        );
      case 'moderate_empirical':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-950/70 border border-amber-800/80 px-2 py-0.5 rounded">
            <AlertOctagon className="w-3 h-3" />
            {t.causality.moderateEmpiricalBadge}
          </span>
        );
      case 'uncertain_estimate':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-400 bg-purple-950/70 border border-purple-800/80 px-2 py-0.5 rounded">
            <HelpCircle className="w-3 h-3" />
            {t.causality.uncertainBadge}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <h2 className="text-base font-semibold text-slate-100">{t.causality.title}</h2>
        <p className="text-xs text-slate-400 mt-0.5">{t.causality.subtitle}</p>

        {/* Search and Filters */}
        <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute top-2.5 right-3 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto" />
            <input
              type="text"
              placeholder={t.causality.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/90 text-slate-200 text-xs rounded border border-slate-700 py-2 pr-9 pl-3 rtl:pr-9 rtl:pl-3 ltr:pl-9 ltr:pr-3 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded p-1 text-xs">
            <button
              onClick={() => setSelectedConfidence('all')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                selectedConfidence === 'all' ? 'bg-cyan-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setSelectedConfidence('accounting_identity')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                selectedConfidence === 'accounting_identity' ? 'bg-cyan-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              متطابقات
            </button>
            <button
              onClick={() => setSelectedConfidence('high_empirical')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                selectedConfidence === 'high_empirical' ? 'bg-cyan-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              تجريبية
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left/Right Links List */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-1.5 max-h-[640px] overflow-y-auto">
          <div className="text-[11px] font-medium text-slate-400 px-2 pb-1 border-b border-slate-800">
            العلاقات المسجلة ({filteredLinks.length})
          </div>
          {filteredLinks.map((link) => {
            const isSelected = activeLink.id === link.id;
            return (
              <div
                key={link.id}
                onClick={() => setSelectedLinkId(link.id)}
                className={`p-3 rounded border text-xs cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-800 border-cyan-500/60 shadow-sm'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-semibold text-slate-200 line-clamp-1">{link.targetVar}</span>
                  {getConfidenceBadge(link.confidence)}
                </div>
                <div className="text-[11px] text-slate-400 font-mono line-clamp-1">
                  &larr; {link.sourceVar}
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail Inspection Card */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-5">
          {/* Header */}
          <div className="border-b border-slate-800 pb-3 flex items-start justify-between gap-4">
            <div>
              <div className="text-xs text-cyan-400 font-mono mb-1">{activeLink.id}</div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {activeLink.targetVar}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                المتغيرات المؤثرة / المدخلات: <span className="text-slate-200 font-mono">{activeLink.sourceVar}</span>
              </p>
            </div>
            {getConfidenceBadge(activeLink.confidence)}
          </div>

          {/* Formula Display in LaTeX / Math code block */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-300">
              {t.causality.formulaTitle}
            </span>
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs text-cyan-300 leading-relaxed overflow-x-auto">
              <div>{activeLink.formulaArabic}</div>
              <div className="text-slate-400 text-[11px] mt-1 border-t border-slate-800/80 pt-1">
                {activeLink.formulaEnglish}
              </div>
            </div>
          </div>

          {/* Parameters & Lags */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded">
              <span className="text-slate-400 text-[11px] block">{t.causality.timeLagTitle}</span>
              <span className="text-sm font-bold text-slate-100">
                {activeLink.timeLagYears === 0
                  ? 'فوري (السنة الحالية t)'
                  : `${activeLink.timeLagYears} سنوات تأخير`}
              </span>
            </div>
            <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded">
              <span className="text-slate-400 text-[11px] block">اتجاه الأثر:</span>
              <span className="text-sm font-bold text-slate-100">
                {activeLink.effectDirection === 'positive' && 'طردي (+)'}
                {activeLink.effectDirection === 'negative' && 'عكسي (-)'}
                {activeLink.effectDirection === 'non_linear' && 'غير خطي / مركب (Non-linear)'}
              </span>
            </div>
          </div>

          {/* Coefficients and calibration */}
          <div className="space-y-1 text-xs">
            <span className="text-slate-400 font-medium">معاملات الحساسية والمعايرة:</span>
            <p className="text-slate-300 leading-relaxed font-mono text-[11px] bg-slate-850 p-2.5 rounded border border-slate-800">
              {activeLink.coefficientNotes}
            </p>
          </div>

          {/* Rationale and Literature */}
          <div className="space-y-1.5 text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.causality.rationaleTitle}</span>
            </span>
            <div className="text-slate-300 leading-relaxed bg-slate-800/40 p-3 rounded border border-slate-800 text-xs">
              <p>{lang === 'ar' ? activeLink.economicRationaleAr : activeLink.economicRationaleEn}</p>
            </div>
          </div>

          {/* Test Link */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>{t.causality.verifiedByTest}</span>
            <span className="font-mono text-cyan-400 font-semibold">{activeLink.verifiedByTestId}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
