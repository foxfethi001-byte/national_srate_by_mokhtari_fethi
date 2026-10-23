/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * National State Simulator - Main Application (Phase 3 Visual Control Center)
 * محاكي الدولة الوطنية - مركز القيادة والتحكم البصري ومختبر السياسات العامة
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  SimulationState,
  PolicySettings,
  ExternalShocks,
  Scenario,
  CountryArchetype,
  CountryConfig,
  SimulatedDate,
  TimeStepUnit,
  SimulationCheckpoint,
  ProjectStateExport,
  PolicyAuditEntry,
} from './types/simulation';
import {
  allArchetypes,
  archetypeResourceExporter,
  defaultExternalShocks,
} from './simulation/archetypes';
import { simulateNextYear } from './simulation/engine';
import { TimeEngine } from './simulation/timeEngine';
import { storageManager } from './storage/indexedDb';
import { Language, TRANSLATIONS } from './i18n/translations';

// Components for the 10 Interconnected Views
import { Header } from './components/Header';
import { TimeControls } from './components/TimeControls';
import { NationalOverview } from './components/NationalOverview';
import { EconomicDashboard } from './components/EconomicDashboard';
import { GovernmentBudgetView } from './components/GovernmentBudgetView';
import { InteractiveCausalGraph } from './components/InteractiveCausalGraph';
import { PolicyLaboratory } from './components/PolicyLaboratory';
import { HistoricalTimelineView } from './components/HistoricalTimelineView';
import { ScenarioComparisonView } from './components/ScenarioComparisonView';
import { RiskCenterView } from './components/RiskCenterView';
import { RegionalOverview } from './components/RegionalOverview';
import { DocumentationView } from './components/DocumentationView';

// Additional Specialized Tool Views
import { SectorDetailView } from './components/SectorDetailView';
import { CountryConfigModal } from './components/CountryConfigModal';
import { CheckpointsManager } from './components/CheckpointsManager';
import { ShockSandbox } from './components/ShockSandbox';
import { ValidationModal } from './components/ValidationModal';
import { AutomatedTestRunner } from './components/AutomatedTestRunner';
import { ExportImportModal } from './components/ExportImportModal';
import { StrategicPlanningView } from './components/StrategicPlanningView';
import { CrisisCenterView } from './components/CrisisCenterView';
import { AuditTrailView } from './components/AuditTrailView';

export default function App() {
  // Localization State: Arabic-First
  const [lang, setLang] = useState<Language>('ar');
  const t = TRANSLATIONS[lang];

  // Theme State: 'light' or 'dark' (Light theme supported)
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  // Plain Explainer Mode: enabled by default for accessible understanding
  const [explainMode, setExplainMode] = useState<boolean>(true);

  // Sync HTML dir, lang and theme attributes
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  // Active Archetype & Configuration
  const [activeArchetype, setActiveArchetype] = useState<CountryArchetype>(archetypeResourceExporter);
  const [countryConfig, setCountryConfig] = useState<CountryConfig>(archetypeResourceExporter.countryConfig);

  // Active Policies & Shocks
  const [policies, setPolicies] = useState<PolicySettings>(activeArchetype.defaultPolicies);
  const [shocks, setShocks] = useState<ExternalShocks>(defaultExternalShocks);

  // Policy Audit Trail Log (for Undo & Record tracking)
  const [auditLog, setAuditLog] = useState<PolicyAuditEntry[]>([]);

  // Simulation Time Horizon & Time Step
  const startYear = activeArchetype.initialState.year;
  const maxHorizonYear = startYear + 30; // 30-year horizon
  const [timeStep, setTimeStep] = useState<TimeStepUnit>('annual');
  const [currentDate, setCurrentDate] = useState<SimulatedDate>({ year: startYear });
  const [currentYear, setCurrentYear] = useState<number>(startYear);

  // Simulation History (Chronological sequence of states)
  const [history, setHistory] = useState<SimulationState[]>([activeArchetype.initialState]);

  // Scenarios & Checkpoints Management
  const [savedScenarios, setSavedScenarios] = useState<Scenario[]>([]);
  const [checkpoints, setCheckpoints] = useState<SimulationCheckpoint[]>([]);

  // Simulation Playback State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const playbackTimerRef = useRef<number | null>(null);

  // Navigation Tab State (Defaults to National Scorecard Overview)
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [inspectedMetricKey, setInspectedMetricKey] = useState<string | undefined>(undefined);

  // Load saved checkpoints & scenarios from IndexedDB on startup
  useEffect(() => {
    const loadPersistedData = async () => {
      try {
        const storedCheckpoints = await storageManager.getCheckpoints();
        setCheckpoints(storedCheckpoints);
        const storedScenarios = await storageManager.getScenarios();
        setSavedScenarios(storedScenarios);
      } catch (err) {
        console.warn('Could not load data from IndexedDB:', err);
      }
    };
    loadPersistedData();
  }, []);

  // Derived current & previous state
  const currentState = history[history.length - 1];
  const previousState = history.length > 1 ? history[history.length - 2] : undefined;
  const baselineState = history[0];

  // Active Scenario Object
  const activeScenario: Scenario = {
    id: 'active_scenario',
    nameAr: countryConfig.nameAr,
    nameEn: countryConfig.nameEn,
    descriptionAr: countryConfig.descriptionAr,
    descriptionEn: countryConfig.descriptionEn,
    baseArchetypeId: activeArchetype.id,
    policies,
    shocks,
    history,
    currentYear,
    currentDate,
  };

  // Step Forward Handler (Discrete Step)
  const handleStepForward = () => {
    if (currentYear >= maxHorizonYear) {
      setIsPlaying(false);
      return;
    }

    let nextDate: SimulatedDate;
    if (timeStep === 'quarterly') {
      const q = currentDate.quarter || 1;
      if (q < 4) {
        nextDate = { year: currentDate.year, quarter: (q + 1) as 1 | 2 | 3 | 4 };
      } else {
        nextDate = { year: currentDate.year + 1, quarter: 1 };
      }
    } else {
      nextDate = { year: currentDate.year + 1 };
    }

    const nextState = simulateNextYear(currentState, policies, shocks, { history });
    const stateWithDate = {
      ...nextState,
      date: nextDate,
      year: nextDate.year,
    };

    setHistory((prev) => [...prev, stateWithDate]);
    setCurrentDate(nextDate);
    setCurrentYear(nextDate.year);
  };

  // Jump Forward Multiple Years (Horizon Fast Jump)
  const handleFastJumpYears = (yearsToAdd: number) => {
    setIsPlaying(false);
    setHistory((prevHist) => {
      let current = prevHist[prevHist.length - 1];
      const newSteps: SimulationState[] = [];
      const targetYear = Math.min(maxHorizonYear, current.year + yearsToAdd);

      while (current.year < targetYear) {
        const nextDate: SimulatedDate = { year: current.year + 1 };
        const nextState = simulateNextYear(current, policies, shocks, { history: [...prevHist, ...newSteps] });
        current = {
          ...nextState,
          date: nextDate,
          year: nextDate.year,
        };
        newSteps.push(current);
      }

      if (newSteps.length > 0) {
        const finalState = newSteps[newSteps.length - 1];
        setCurrentDate(finalState.date || { year: finalState.year });
        setCurrentYear(finalState.year);
        return [...prevHist, ...newSteps];
      }
      return prevHist;
    });
  };

  // Continuous Clock Play / Pause Timer
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.max(250, (timeStep === 'quarterly' ? 700 : 1400) / speedMultiplier);
      playbackTimerRef.current = window.setInterval(() => {
        setHistory((prevHist) => {
          const latest = prevHist[prevHist.length - 1];
          if (latest.year >= maxHorizonYear) {
            setIsPlaying(false);
            if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
            return prevHist;
          }

          let nextDate: SimulatedDate;
          const curr = latest.date || { year: latest.year };
          if (timeStep === 'quarterly') {
            const q = curr.quarter || 1;
            if (q < 4) {
              nextDate = { year: curr.year, quarter: (q + 1) as 1 | 2 | 3 | 4 };
            } else {
              nextDate = { year: curr.year + 1, quarter: 1 };
            }
          } else {
            nextDate = { year: curr.year + 1 };
          }

          const nextState = simulateNextYear(latest, policies, shocks, { history: prevHist });
          const stateWithDate = {
            ...nextState,
            date: nextDate,
            year: nextDate.year,
          };

          setCurrentDate(nextDate);
          setCurrentYear(nextDate.year);
          return [...prevHist, stateWithDate];
        });
      }, intervalMs);
    } else {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
        playbackTimerRef.current = null;
      }
    }

    return () => {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
      }
    };
  }, [isPlaying, speedMultiplier, policies, shocks, maxHorizonYear, timeStep]);

  // Reset Simulation to Baseline Archetype State
  const handleResetSimulation = () => {
    setIsPlaying(false);
    setCurrentYear(activeArchetype.initialState.year);
    setCurrentDate({ year: activeArchetype.initialState.year });
    setPolicies(activeArchetype.defaultPolicies);
    setShocks(defaultExternalShocks);
    setAuditLog([]);
    setHistory([activeArchetype.initialState]);
  };

  // Switch Country Archetype
  const handleArchetypeChange = (archetypeId: string) => {
    const target = allArchetypes.find((a) => a.id === archetypeId);
    if (!target) return;
    setIsPlaying(false);
    setActiveArchetype(target);
    setCountryConfig(target.countryConfig);
    setCurrentYear(target.initialState.year);
    setCurrentDate({ year: target.initialState.year });
    setPolicies(target.defaultPolicies);
    setShocks(defaultExternalShocks);
    setAuditLog([]);
    setHistory([target.initialState]);
  };

  // Policy Lab: Apply Proposed Change (Single or Coordinated Package) & Record in Audit Log
  const handleApplyPolicyChange = (
    key: keyof PolicySettings | 'policy_package',
    newValue: any,
    auditEntry: PolicyAuditEntry,
    packageUpdate?: Partial<PolicySettings>
  ) => {
    if (packageUpdate) {
      setPolicies((prev) => ({
        ...prev,
        ...packageUpdate,
      }));
    } else if (key !== 'policy_package') {
      setPolicies((prev) => ({
        ...prev,
        [key]: newValue,
      }));
    }
    setAuditLog((prev) => [auditEntry, ...prev]);
  };

  // Policy Lab: Undo Last Applied Policy Change (Single or Coordinated Package)
  const handleUndoLastPolicyChange = () => {
    if (auditLog.length === 0) return;
    const last = auditLog[0];
    if (last.packageDetails && last.packageDetails.length > 0) {
      setPolicies((prev) => {
        const reverted = { ...prev };
        for (const item of last.packageDetails!) {
          (reverted as any)[item.key] = item.from;
        }
        return reverted;
      });
    } else if (last.policyKey !== 'policy_package') {
      setPolicies((prev) => ({
        ...prev,
        [last.policyKey]: last.previousValue,
      }));
    }
    setAuditLog((prev) => prev.slice(1));
  };

  // Policy Lab: Reset All Policies to Archetype Baseline Defaults
  const handleResetAllPolicies = () => {
    setPolicies(activeArchetype.defaultPolicies);
  };

  // Restore Historical Snapshot State (without silently subtracting variables)
  const handleRestoreSnapshotState = (snapshot: SimulationState) => {
    setIsPlaying(false);
    const snapshotIdx = history.findIndex((s) => s.year === snapshot.year);
    if (snapshotIdx !== -1) {
      const trimmed = history.slice(0, snapshotIdx + 1);
      setHistory(trimmed);
      setCurrentDate(snapshot.date || { year: snapshot.year });
      setCurrentYear(snapshot.year);
    }
  };

  // Branch a new scenario from a specific simulated year
  const handleBranchScenarioFromYear = async (branchName: string, fromYear: number) => {
    const snapshotIdx = history.findIndex((s) => s.year === fromYear);
    const branchHistory = snapshotIdx !== -1 ? history.slice(0, snapshotIdx + 1) : [...history];
    const lastState = branchHistory[branchHistory.length - 1];

    const newScenario: Scenario = {
      id: `branch_${Date.now()}`,
      nameAr: branchName,
      nameEn: branchName,
      descriptionAr: `مسار متفرع من سنة ${fromYear}`,
      descriptionEn: `Scenario branched from year ${fromYear}`,
      baseArchetypeId: activeArchetype.id,
      policies: { ...policies },
      shocks: { ...shocks },
      history: branchHistory,
      currentYear: fromYear,
      currentDate: lastState.date || { year: fromYear },
    };

    setSavedScenarios((prev) => [...prev, newScenario]);
    await storageManager.saveScenario(newScenario);
  };

  // Update a single external shock
  const handleUpdateShock = <K extends keyof ExternalShocks>(key: K, value: ExternalShocks[K]) => {
    setShocks((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Clear all external shocks
  const handleClearShocks = () => {
    setShocks(defaultExternalShocks);
  };

  // Save current trajectory as a new branch scenario
  const handleSaveCurrentScenario = async (name: string, description: string) => {
    const newScenario: Scenario = {
      id: `scenario_${Date.now()}`,
      nameAr: name,
      nameEn: name,
      descriptionAr: description,
      descriptionEn: description,
      baseArchetypeId: activeArchetype.id,
      policies: { ...policies },
      shocks: { ...shocks },
      history: [...history],
      currentYear,
      currentDate,
    };
    setSavedScenarios((prev) => [...prev, newScenario]);
    await storageManager.saveScenario(newScenario);
  };

  // Delete saved scenario
  const handleDeleteScenario = async (id: string) => {
    setSavedScenarios((prev) => prev.filter((s) => s.id !== id));
    await storageManager.deleteScenario(id);
  };

  // Restore Checkpoint
  const handleRestoreCheckpoint = (cp: SimulationCheckpoint) => {
    setIsPlaying(false);
    setPolicies(cp.policies);
    setShocks(cp.shocks);
    setCurrentDate(cp.date);
    setCurrentYear(cp.date.year);
    setHistory((prev) => [...prev, cp.state]);
  };

  // Import standalone Scenario
  const handleImportScenario = (imported: Scenario) => {
    setIsPlaying(false);
    setPolicies(imported.policies);
    setShocks(imported.shocks || defaultExternalShocks);
    setHistory(imported.history);
    setCurrentYear(imported.currentYear);
    setCurrentDate(imported.currentDate || { year: imported.currentYear });
    const matchingArchetype = allArchetypes.find((a) => a.id === imported.baseArchetypeId);
    if (matchingArchetype) {
      setActiveArchetype(matchingArchetype);
      setCountryConfig(matchingArchetype.countryConfig);
    }
    setCurrentTab('overview');
  };

  // Import Full Project Bundle
  const handleImportProjectBundle = (bundle: ProjectStateExport) => {
    setIsPlaying(false);
    setCountryConfig(bundle.countryConfig);
    setSavedScenarios(bundle.savedScenarios || []);
    setCheckpoints(bundle.checkpoints || []);
    handleImportScenario(bundle.activeScenario);
  };

  // Inspect causal relationship for a metric
  const handleInspectMetric = (metricKey: string) => {
    setInspectedMetricKey(metricKey);
    setCurrentTab('causality');
  };

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'theme-light bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'} flex flex-col font-sans transition-colors duration-150`}>
      {/* Top Bar Navigation (Zone 1, 2, 3 Contract) */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => {
          if (tab !== 'causality') setInspectedMetricKey(undefined);
          setCurrentTab(tab);
        }}
        lang={lang}
        onLangToggle={() => setLang((prev) => (prev === 'ar' ? 'en' : 'ar'))}
        theme={theme}
        onThemeToggle={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        explainMode={explainMode}
        onExplainModeToggle={() => setExplainMode((m) => !m)}
        activeArchetypeId={activeArchetype.id}
        onArchetypeChange={handleArchetypeChange}
        onResetSimulation={handleResetSimulation}
      />

      {/* Time & Horizon Controls Bar */}
      <TimeControls
        currentDate={currentDate}
        currentYear={currentYear}
        startYear={startYear}
        maxHorizonYear={maxHorizonYear}
        timeStep={timeStep}
        onToggleTimeStep={setTimeStep}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onStepForward={handleStepForward}
        onFastJumpYears={handleFastJumpYears}
        onReset={handleResetSimulation}
        speedMultiplier={speedMultiplier}
        onChangeSpeed={setSpeedMultiplier}
        scenarioName={lang === 'ar' ? countryConfig.nameAr : countryConfig.nameEn}
        lang={lang}
      />

      {/* Explainer Bubbles Welcome / Guidance Callout (فقاعة الشرح الترحيبية) */}
      {explainMode && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3 pb-0 w-full animate-in fade-in duration-200">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center justify-between gap-3 text-xs text-amber-500 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-base p-1 bg-amber-500/20 rounded-md">💬</span>
              <span className="leading-relaxed">
                {lang === 'ar'
                  ? 'فقاعات الشرح والتوضيح مفعّلة لكافة المستويات: انقر على أيقونة 💬 بجوار أي مؤشر أو سياسة في بطاقة الأداء أو لوحة الاقتصاد أو مختبر السياسات لمعرفة معناها الحقيقي للمواطن وتداعياتها ونصيحة صانع القرار.'
                  : 'Plain Explainer Bubbles are active: Click any 💬 icon next to metrics or policies to see what they mean for citizens, their consequences, and policy tips.'}
              </span>
            </div>
            <button
              onClick={() => setExplainMode(false)}
              className="text-[11px] text-amber-500 hover:text-amber-400 underline cursor-pointer shrink-0 font-medium"
            >
              {lang === 'ar' ? 'إخفاء الإرشاد' : 'Dismiss'}
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area - 10 Core Interconnected Views & Tools */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* 1. National Overview & Scorecard */}
        {currentTab === 'overview' && (
          <NationalOverview
            currentState={currentState}
            previousState={previousState}
            baselineState={baselineState}
            history={history}
            lang={lang}
            onInspectMetric={handleInspectMetric}
            onNavigateToTab={setCurrentTab}
          />
        )}

        {/* Strategic Planning & M&E Dashboard (Phase 5) */}
        {currentTab === 'strategicPlanning' && (
          <StrategicPlanningView
            currentState={currentState}
            baseState={baselineState}
            policies={policies}
            lang={lang}
            onApplyPlanPolicies={(newPolicies) => {
              setPolicies((prev) => ({ ...prev, ...newPolicies }));
            }}
          />
        )}

        {/* 2. Economic Dashboard */}
        {currentTab === 'economicDashboard' && (
          <EconomicDashboard
            currentState={currentState}
            previousState={previousState}
            baselineState={baselineState}
            history={history}
            lang={lang}
            onInspectMetric={handleInspectMetric}
          />
        )}

        {/* 3. Government Budget & Resource Allocation */}
        {currentTab === 'budget' && (
          <GovernmentBudgetView
            currentState={currentState}
            previousState={previousState}
            baselineState={baselineState}
            history={history}
            policies={policies}
            onUpdatePolicies={(updated) => setPolicies((prev) => ({ ...prev, ...updated }))}
            lang={lang}
            onInspectMetric={handleInspectMetric}
            onNavigateToPolicyLab={() => setCurrentTab('policyLab')}
          />
        )}

        {/* 4. Interactive Causal Graph */}
        {currentTab === 'causality' && (
          <InteractiveCausalGraph
            lang={lang}
            onSelectVariable={setInspectedMetricKey}
          />
        )}

        {/* 5. Policy Laboratory */}
        {currentTab === 'policyLab' && (
          <PolicyLaboratory
            policies={policies}
            baselinePolicies={activeArchetype.defaultPolicies}
            currentState={currentState}
            auditLog={auditLog}
            onApplyPolicyChange={handleApplyPolicyChange}
            onUndoLastChange={handleUndoLastPolicyChange}
            onResetAllPolicies={handleResetAllPolicies}
            lang={lang}
          />
        )}

        {/* 6. Timeline and Historical Indicators */}
        {currentTab === 'timeline' && (
          <HistoricalTimelineView
            history={history}
            currentYear={currentYear}
            startYear={startYear}
            maxHorizonYear={maxHorizonYear}
            auditLog={auditLog}
            checkpoints={checkpoints}
            onRestoreSnapshotState={handleRestoreSnapshotState}
            onRestoreCheckpoint={handleRestoreCheckpoint}
            onBranchNewScenario={handleBranchScenarioFromYear}
            lang={lang}
          />
        )}

        {/* 7. Scenario Comparison */}
        {currentTab === 'scenarios' && (
          <ScenarioComparisonView
            currentScenario={activeScenario}
            savedScenarios={savedScenarios}
            onSaveCurrentScenario={handleSaveCurrentScenario}
            onDeleteScenario={handleDeleteScenario}
            lang={lang}
          />
        )}

        {/* 8. Risk and Early-Warning Center */}
        {currentTab === 'riskCenter' && (
          <RiskCenterView
            currentState={currentState}
            previousState={previousState}
            history={history}
            lang={lang}
            onNavigateToPolicies={() => setCurrentTab('policyLab')}
            onNavigateToShocks={() => setCurrentTab('shocks')}
          />
        )}

        {/* 9. Regional Overview */}
        {currentTab === 'regional' && (
          <RegionalOverview
            currentState={currentState}
            previousState={previousState}
            history={history}
            lang={lang}
          />
        )}

        {/* 10. Data Sources, Assumptions & Model Documentation */}
        {currentTab === 'documentation' && (
          <DocumentationView lang={lang} currentState={currentState} />
        )}

        {/* Secondary Supporting Tools */}
        {currentTab === 'sectors' && (
          <SectorDetailView
            currentState={currentState}
            previousState={previousState}
            baselineState={baselineState}
            history={history}
            lang={lang}
            onInspectMetric={handleInspectMetric}
          />
        )}

        {currentTab === 'countryConfig' && (
          <CountryConfigModal
            config={countryConfig}
            onUpdateConfig={setCountryConfig}
            onResetConfirmed={handleResetSimulation}
            lang={lang}
          />
        )}

        {currentTab === 'checkpoints' && (
          <CheckpointsManager
            currentState={currentState}
            policies={policies}
            shocks={shocks}
            onRestoreCheckpoint={handleRestoreCheckpoint}
            lang={lang}
          />
        )}

        {currentTab === 'shocks' && (
          <ShockSandbox
            shocks={shocks}
            onUpdateShock={handleUpdateShock}
            onClearShocks={handleClearShocks}
            lang={lang}
          />
        )}

        {/* Crisis & Shock Stress Testing Center (Phase 5) */}
        {currentTab === 'crisisCenter' && (
          <CrisisCenterView
            currentState={currentState}
            lang={lang}
            onApplySimulatedState={(stressed) => {
              setHistory((prev) => [...prev.slice(0, -1), stressed]);
            }}
          />
        )}

        {/* Audit Trail & Scenario Divergence Explainer (Phase 5) */}
        {currentTab === 'auditTrail' && (
          <AuditTrailView
            currentScenario={activeScenario}
            savedScenarios={savedScenarios}
            currentState={currentState}
            baseState={baselineState}
            lang={lang}
          />
        )}

        {currentTab === 'validation' && (
          <ValidationModal
            currentState={currentState}
            previousState={previousState}
            history={history}
            lang={lang}
          />
        )}

        {currentTab === 'testRunner' && (
          <AutomatedTestRunner lang={lang} />
        )}

        {currentTab === 'dataExport' && (
          <ExportImportModal
            currentScenario={activeScenario}
            countryConfig={countryConfig}
            savedScenarios={savedScenarios}
            checkpoints={checkpoints}
            onImportScenario={handleImportScenario}
            onImportProjectBundle={handleImportProjectBundle}
            lang={lang}
          />
        )}
      </main>

      {/* Persistent Scientific Footnote */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-6 text-center text-[11px] text-slate-500 font-sans">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            {t.appTitle} &copy; {new Date().getFullYear()} — نموذج محاكاة علمي مفتوح المصدر (بيانات توضيحية مصطنعة)
          </span>
          <span className="font-mono text-slate-400">
            التاريخ: {TimeEngine.formatDate(currentDate, lang)} | خط الأساس: {startYear} | الأفق: {maxHorizonYear}
          </span>
        </div>
      </footer>
    </div>
  );
}
