/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Interactive Explainer Speech Bubble Component (فقاعة الشرح المبسط)
 * توفر شروحات واضحة ومبسطة لأي مؤشر أو سياسة أو نتيجة لتناسب كافة المستويات
 */

import React, { useState, useRef, useEffect } from 'react';
import { getPlainExplainer } from '../../simulation/plainExplainers';
import { Language } from '../../i18n/translations';
import { HelpCircle, X, Sparkles, Home, ArrowUpRight, Target } from 'lucide-react';

interface ExplainerBubbleProps {
  itemKey: string;
  lang: Language;
  customTitle?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
}

export const ExplainerBubble: React.FC<ExplainerBubbleProps> = ({
  itemKey,
  lang,
  customTitle,
  className = '',
  size = 'sm',
  showBadge = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const explainer = getPlainExplainer(itemKey);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on outside click or Esc
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        bubbleRef.current &&
        !bubbleRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const title = customTitle || (lang === 'ar' ? explainer.titleAr : explainer.titleEn);

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        title={lang === 'ar' ? `اضغط لفهم: ${title}` : `Click to understand: ${title}`}
        className={`inline-flex items-center gap-1 rounded-full transition-all cursor-pointer ${
          size === 'sm'
            ? 'p-0.5 text-xs text-amber-500 hover:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30'
            : size === 'md'
            ? 'px-2 py-0.5 text-xs text-amber-500 hover:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30'
            : 'px-2.5 py-1 text-xs text-amber-500 hover:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30'
        } ${isOpen ? 'ring-2 ring-amber-400 bg-amber-500/20' : ''}`}
        aria-expanded={isOpen}
      >
        <span className="text-[12px] leading-none" role="img" aria-label="explainer">
          {explainer.icon || '💬'}
        </span>
        {showBadge && (
          <span className="text-[10px] font-medium hidden sm:inline">
            {lang === 'ar' ? 'شرح مبسط' : 'Plain Explain'}
          </span>
        )}
      </button>

      {/* Speech Bubble Popover */}
      {isOpen && (
        <div
          ref={bubbleRef}
          role="dialog"
          aria-modal="true"
          className="absolute z-50 bottom-full mb-2 right-0 rtl:right-0 rtl:left-auto ltr:left-0 ltr:right-auto w-72 sm:w-84 max-w-[90vw] bg-slate-900 border-2 border-amber-500/50 rounded-2xl shadow-2xl p-4 text-slate-100 text-xs font-sans animate-in fade-in zoom-in-95 duration-150 bubble-tail-bottom"
          style={{ filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.35))' }}
        >
          {/* Header of the Bubble */}
          <div className="flex items-start justify-between gap-2 pb-2.5 mb-2.5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xl p-1 bg-amber-500/20 border border-amber-500/40 rounded-lg">
                {explainer.icon || '💬'}
              </span>
              <div>
                <div className="font-bold text-sm text-amber-400 leading-tight">
                  {title}
                </div>
                <div className="text-[10px] text-slate-400">
                  {lang === 'ar' ? 'فقاعة الشرح المبسط لكافة المستويات' : 'Simplified Explainer Bubble'}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title={lang === 'ar' ? 'إغلاق' : 'Close'}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bubble Explainer Sections */}
          <div className="space-y-2.5 text-[11px] leading-relaxed max-h-72 overflow-y-auto pr-1">
            {/* 1. الفكرة الأساسية */}
            <div className="bg-slate-800/80 rounded-xl p-2.5 border border-slate-700/60">
              <div className="flex items-center gap-1.5 font-semibold text-slate-200 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>{lang === 'ar' ? 'ما هو هذا المؤشر / السياسة؟' : 'What is this?'}</span>
              </div>
              <p className="text-slate-300">
                {lang === 'ar' ? explainer.summaryAr : explainer.summaryEn}
              </p>
            </div>

            {/* 2. ماذا يعني للمواطن العادي؟ */}
            <div className="bg-emerald-950/30 rounded-xl p-2.5 border border-emerald-500/30">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-400 mb-1">
                <Home className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'ماذا يعني للمواطن في حياته اليومية؟' : 'What it means for the citizen:'}</span>
              </div>
              <p className="text-emerald-200/90">
                {lang === 'ar' ? explainer.citizenMeaningAr : explainer.citizenMeaningEn}
              </p>
            </div>

            {/* 3. كيف يؤثر التغيير؟ */}
            <div className="bg-amber-950/30 rounded-xl p-2.5 border border-amber-500/30">
              <div className="flex items-center gap-1.5 font-semibold text-amber-400 mb-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'كيف يؤثر الارتفاع أو الانخفاض؟' : 'How it impacts outcomes:'}</span>
              </div>
              <p className="text-amber-200/90">
                {lang === 'ar' ? explainer.impactAr : explainer.impactEn}
              </p>
            </div>

            {/* 4. نصيحة عملية */}
            <div className="bg-purple-950/30 rounded-xl p-2.5 border border-purple-500/30">
              <div className="flex items-center gap-1.5 font-semibold text-purple-300 mb-1">
                <Target className="w-3.5 h-3.5 text-purple-400" />
                <span>{lang === 'ar' ? 'نصيحة لصانع القرار:' : 'Tip for Decision Makers:'}</span>
              </div>
              <p className="text-purple-200/90">
                {lang === 'ar' ? explainer.tipAr : explainer.tipEn}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
