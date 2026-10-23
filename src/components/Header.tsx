/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Top Bar Navigation adhering to 3-zone contract (Phase 3 Visual Control Center)
 * شريط الملاحة الرئيسي ومستكشف العروض العشرة المتكاملة
 */

import React, { useState } from 'react';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { allArchetypes } from '../simulation/archetypes';
import {
  Globe,
  RefreshCw,
  LayoutDashboard,
  TrendingUp,
  Landmark,
  Share2,
  FlaskConical,
  History,
  GitCompare,
  ShieldAlert,
  Layers,
  BookOpen,
  ChevronDown,
  Wrench,
  Sun,
  Moon,
  Lightbulb,
  Target,
  Flame,
  FileText,
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tabId: string) => void;
  lang: Language;
  onLangToggle: () => void;
  theme: 'dark' | 'light';
  onThemeToggle: () => void;
  explainMode: boolean;
  onExplainModeToggle: () => void;
  activeArchetypeId: string;
  onArchetypeChange: (archetypeId: string) => void;
  onResetSimulation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  lang,
  onLangToggle,
  theme,
  onThemeToggle,
  explainMode,
  onExplainModeToggle,
  activeArchetypeId,
  onArchetypeChange,
  onResetSimulation,
}) => {
  const t = TRANSLATIONS[lang];
  const [toolsOpen, setToolsOpen] = useState<boolean>(false);

  // The Core Interconnected Views
  const coreViews = [
    { id: 'overview', label: t.tabs.overview, icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    { id: 'strategicPlanning', label: t.tabs.strategicPlanning, icon: <Target className="w-3.5 h-3.5" /> },
    { id: 'economicDashboard', label: t.tabs.economicDashboard, icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { id: 'budget', label: t.tabs.budget, icon: <Landmark className="w-3.5 h-3.5" /> },
    { id: 'causality', label: t.tabs.causality, icon: <Share2 className="w-3.5 h-3.5" /> },
    { id: 'policyLab', label: t.tabs.policyLab, icon: <FlaskConical className="w-3.5 h-3.5" /> },
    { id: 'timeline', label: t.tabs.timeline, icon: <History className="w-3.5 h-3.5" /> },
    { id: 'scenarios', label: t.tabs.scenarios, icon: <GitCompare className="w-3.5 h-3.5" /> },
    { id: 'riskCenter', label: t.tabs.riskCenter, icon: <ShieldAlert className="w-3.5 h-3.5" /> },
    { id: 'regional', label: t.tabs.regional, icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'documentation', label: t.tabs.documentation, icon: <BookOpen className="w-3.5 h-3.5" /> },
  ];

  // Secondary Tools
  const secondaryTools = [
    { id: 'crisisCenter', label: t.tabs.crisisCenter },
    { id: 'auditTrail', label: t.tabs.auditTrail },
    { id: 'sectors', label: t.tabs.sectors },
    { id: 'countryConfig', label: t.tabs.countryConfig },
    { id: 'checkpoints', label: t.tabs.checkpoints },
    { id: 'shocks', label: t.tabs.shocks },
    { id: 'validation', label: t.tabs.validation },
    { id: 'testRunner', label: t.tabs.testRunner },
    { id: 'dataExport', label: t.tabs.dataExport },
  ];

  const isSecondaryActive = secondaryTools.some((st) => st.id === currentTab);

  return (
    <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold font-mono text-sm shadow-inner">
            NS
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold text-white tracking-tight leading-none whitespace-nowrap">
              {t.appTitle}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 hidden sm:block">
              {t.appSubtitle}
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Scrollable or multi-device) */}
        <nav className="hidden xl:flex items-center gap-1 text-xs font-medium text-slate-400 overflow-x-auto py-1">
          {coreViews.map((view) => {
            const isActive = currentTab === view.id;
            return (
              <button
                key={view.id}
                onClick={() => onTabChange(view.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30 shadow-sm'
                    : 'hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {view.icon}
                <span>{view.label}</span>
              </button>
            );
          })}

          {/* Tools Dropdown */}
          <div className="relative">
            <button
              onClick={() => setToolsOpen(!toolsOpen)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                isSecondaryActive
                  ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30'
                  : 'hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'أدوات متقدمة' : 'Tools'}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {toolsOpen && (
              <div
                className="absolute left-0 right-auto rtl:right-0 rtl:left-auto top-full mt-1 w-48 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1 z-50 text-xs font-sans"
                onMouseLeave={() => setToolsOpen(false)}
              >
                {secondaryTools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      onTabChange(tool.id);
                      setToolsOpen(false);
                    }}
                    className={`w-full text-right rtl:text-right ltr:text-left px-3 py-2 transition-colors cursor-pointer ${
                      currentTab === tool.id
                        ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {tool.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Zone 3: Quick Controls & Language Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Archetype Selector */}
          <select
            value={activeArchetypeId}
            onChange={(e) => onArchetypeChange(e.target.value)}
            className="text-xs bg-slate-800/90 text-slate-200 border border-slate-700 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer max-w-[130px] sm:max-w-none"
            title={t.archetypes.selectLabel}
          >
            {allArchetypes.map((arch) => (
              <option key={arch.id} value={arch.id}>
                {lang === 'ar' ? arch.nameAr : arch.nameEn}
              </option>
            ))}
          </select>

          {/* Explainer Bubbles Mode Toggle */}
          <button
            onClick={onExplainModeToggle}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded transition-all cursor-pointer ${
              explainMode
                ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-750 border border-slate-700'
            }`}
            title={
              lang === 'ar'
                ? explainMode
                  ? 'إخفاء فقاعات الشرح المبسط'
                  : 'تفعيل فقاعات الشرح والتوضيح لكافة النتائج والسياسات'
                : explainMode
                ? 'Hide Plain Explain Bubbles'
                : 'Enable Plain Explainer Bubbles for all metrics'
            }
          >
            <Lightbulb className={`w-3.5 h-3.5 ${explainMode ? 'text-amber-400 fill-amber-400' : 'text-slate-400'}`} />
            <span className="hidden md:inline">
              {lang === 'ar' ? 'فقاعات الشرح' : 'Explain'}
            </span>
          </button>

          {/* Light / Dark Theme Switcher */}
          <button
            onClick={onThemeToggle}
            className="p-1.5 rounded text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
            title={
              theme === 'dark'
                ? lang === 'ar'
                  ? 'التبديل إلى الثيم الفاتح'
                  : 'Switch to Light Theme'
                : lang === 'ar'
                ? 'التبديل إلى الثيم الداكن'
                : 'Switch to Dark Theme'
            }
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400" />
            )}
          </button>

          {/* Reset button */}
          <button
            onClick={onResetSimulation}
            title={t.resetToBaseline}
            className="p-1.5 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-slate-700/60 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Language Switcher */}
          <button
            onClick={onLangToggle}
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            title="تبديل اللغة / Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'ar' ? 'English' : 'عربي'}</span>
          </button>
        </div>
      </div>

      {/* Sub-bar for medium & small viewports to access all 10 core views easily */}
      <div className="xl:hidden flex items-center gap-1 px-4 py-2 bg-slate-900 border-t border-slate-800/80 overflow-x-auto text-xs text-slate-400">
        {coreViews.map((view) => (
          <button
            key={view.id}
            onClick={() => onTabChange(view.id)}
            className={`whitespace-nowrap px-2.5 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer ${
              currentTab === view.id
                ? 'bg-cyan-500/15 text-cyan-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            {view.icon}
            <span>{view.label}</span>
          </button>
        ))}
        {secondaryTools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onTabChange(tool.id)}
            className={`whitespace-nowrap px-2.5 py-1 rounded transition-colors cursor-pointer ${
              currentTab === tool.id
                ? 'bg-cyan-500/15 text-cyan-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            {tool.label}
          </button>
        ))}
      </div>
    </header>
  );
};
