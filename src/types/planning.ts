/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Strategic Planning, Crisis & Risk Management Types (Phase 5)
 * تعريفات التخطيط الاستراتيجي، إدارة الأزمات، الإنذار المبكر، وسجل التدقيق والمساءلة
 */

import { SimulationState, PolicySettings, ExternalShocks } from './simulation';

export type PlanHorizon = 'short' | 'medium' | 'long'; // قصيرة (1-2 سنة)، متوسطة (3-5 سنوات)، طويلة (10+ سنوات)
export type PlanStatus = 'draft' | 'under_review' | 'approved' | 'rejected' | 'in_progress' | 'achieved';
export type ObjectivePriority = 'critical' | 'high' | 'medium' | 'low';
export type ObjectiveCategory = 
  | 'economic' 
  | 'fiscal' 
  | 'social' 
  | 'infrastructure' 
  | 'environment' 
  | 'governance' 
  | 'health_education'
  | 'digital_cyber'
  | 'resilience_defense';

export interface Milestone {
  id: string;
  year: number;
  titleAr: string;
  titleEn: string;
  targetValue: number;
  completed: boolean;
}

export interface StrategicObjective {
  id: string;
  titleAr: string;
  titleEn: string;
  category: ObjectiveCategory;
  priority: ObjectivePriority;
  indicatorKey: string;
  indicatorNameAr: string;
  indicatorNameEn: string;
  unit: string;
  baselineValue: number;
  targetValue: number;
  targetYear: number;
  budgetAllocatedUsdBillion: number;
  responsibleInstitutionAr: string;
  responsibleInstitutionEn: string;
  requiredResources: {
    workforceThousands: number;
    adminCapacityIndex: number; // 0-100
    capitalInvestBillion: number;
  };
  dependencies: string[]; // Objective IDs
  milestones: Milestone[];
  implementationDelayYears: number;
  constraintsAndTradeoffsAr: string;
  constraintsAndTradeoffsEn: string;
  // M&E Tracking
  currentSimulatedValue?: number;
  progressPct?: number;
  budgetSpentSimulated?: number;
  riskStatus?: 'on_track' | 'at_risk' | 'delayed' | 'off_track' | 'achieved';
  assumptionsAndUncertaintyAr?: string;
  assumptionsAndUncertaintyEn?: string;
}

export interface Contradiction {
  id: string;
  type: 'underfunded' | 'timeline_impossible' | 'conflicting_targets' | 'capacity_overload' | 'policy_incompatibility';
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  severity: 'critical' | 'high' | 'warning';
  affectedObjectiveIds: string[];
  suggestedRemedyAr: string;
  suggestedRemedyEn: string;
}

export interface FeasibilityReport {
  planId: string;
  evaluatedAtYear: number;
  isFeasible: boolean;
  overallScore: number; // 0 - 100
  riskLevel: 'low' | 'moderate' | 'high' | 'prohibitive';
  // Pillar Evaluations
  fiscal: {
    requiredTotalBudgetBillion: number;
    availableFiscalSpaceBillion: number;
    annualDeficitImpactPct: number;
    passed: boolean;
    verdictAr: string;
    verdictEn: string;
  };
  workforce: {
    requiredWorkersThousands: number;
    availableLaborSupplyThousands: number;
    adminCapacityRequired: number;
    adminCapacityActual: number;
    passed: boolean;
    verdictAr: string;
    verdictEn: string;
  };
  timeline: {
    plannedYears: number;
    minFeasibleYears: number;
    implementationDelayAllowanceYears: number;
    passed: boolean;
    verdictAr: string;
    verdictEn: string;
  };
  dependencies: {
    satisfied: boolean;
    bottlenecks: string[];
    verdictAr: string;
    verdictEn: string;
  };
  distributionalImpacts: {
    regionalEquityScore: number; // 0-100
    regionsVerdictAr: string;
    populationGroupVerdictAr: string;
  };
  contradictions: Contradiction[];
}

export interface StrategicPlan {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  version: string; // e.g. "1.0", "1.1"
  horizon: PlanHorizon;
  baseYear: number;
  targetYear: number;
  status: PlanStatus;
  objectives: StrategicObjective[];
  feasibility?: FeasibilityReport;
  associatedPolicies: Partial<PolicySettings>;
  createdAt: string;
  updatedAt: string;
  authorNotesAr?: string;
  authorNotesEn?: string;
}

// ================= Policy Alternatives =================
export interface PolicyAlternative {
  id: 'baseline' | 'proposed' | 'conservative' | 'high_push';
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  stanceAr: string;
  stanceEn: string;
  riskRating: 'low' | 'moderate' | 'high' | 'speculative';
  keyPolicies: Partial<PolicySettings>;
  projectedMetrics: {
    gdpGrowth5YrAvg: number;
    debtToGdpFinal: number;
    inflationAvg: number;
    unemploymentFinal: number;
    povertyRateFinal: number;
    co2ReductionPct: number;
  };
  benefitsAr: string[];
  benefitsEn: string[];
  costsAr: string[];
  costsEn: string[];
  tradeoffsAr: string[];
  tradeoffsEn: string[];
  distributionalImpactAr: string;
  distributionalImpactEn: string;
  implementationRisksAr: string[];
  implementationRisksEn: string[];
  unintendedConsequencesAr: string[];
  unintendedConsequencesEn: string[];
}

// ================= Crises & Events Engine =================
export type CrisisCategory =
  | 'commodity_shock'
  | 'drought_water'
  | 'trade_disruption'
  | 'energy_interruption'
  | 'health_emergency'
  | 'natural_disaster'
  | 'financial_pressure'
  | 'infrastructure_failure'
  | 'regional_downturn'
  | 'custom_event';

export interface CrisisEvent {
  id: string;
  category: CrisisCategory;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  triggerConditionAr: string;
  triggerConditionEn: string;
  startYear: number;
  durationYears: number;
  severityPct: number; // 0 - 100%
  isActive: boolean;
  affectedVariables: {
    variableKey: string;
    variableNameAr: string;
    impactFactor: number; // e.g. +0.4 for 40% inflation shock
    unit: string;
  }[];
  propagationRulesAr: string[];
  propagationRulesEn: string[];
  recoveryHalfLifeYears: number; // years to recover 50%
  isUserCreated?: boolean;
}

// ================= Early Warning System (EWS) =================
export interface EarlyWarningIndicator {
  id: string;
  key: string;
  titleAr: string;
  titleEn: string;
  category: 'fiscal' | 'debt' | 'inflation' | 'food_energy' | 'labor' | 'health' | 'water' | 'infrastructure' | 'inequality' | 'services';
  currentValue: number;
  thresholdWarning: number;
  thresholdCritical: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  confidenceScorePct: number; // 0-100%
  contributingVariables: {
    nameAr: string;
    nameEn: string;
    value: string;
    weightPct: number;
  }[];
  thresholdRationaleAr: string;
  thresholdRationaleEn: string;
  recommendedResponsesAr: string[];
  recommendedResponsesEn: string[];
}

// ================= Audit Trail & Accountability =================
export type AuditEventType =
  | 'policy_change'
  | 'plan_created'
  | 'plan_updated'
  | 'plan_approved'
  | 'crisis_injected'
  | 'crisis_resolved'
  | 'checkpoint_saved'
  | 'checkpoint_restored'
  | 'dataset_imported'
  | 'model_version_changed';

export interface AuditRecord {
  id: string;
  timestamp: string;
  simulatedYear: number;
  simulatedQuarter?: 1 | 2 | 3 | 4;
  eventType: AuditEventType;
  actor: string;
  titleAr: string;
  titleEn: string;
  detailsAr: string;
  detailsEn: string;
  previousValue?: string | number;
  newValue?: string | number;
  rationale?: string;
}

export interface ScenarioDivergenceFactor {
  factorAr: string;
  factorEn: string;
  contributionPct: number;
  explanationAr: string;
  explanationEn: string;
}

export interface ScenarioDivergenceReport {
  scenarioAId: string;
  scenarioAName: string;
  scenarioBId: string;
  scenarioBName: string;
  comparedMetricKey: string;
  comparedMetricNameAr: string;
  valueA: number;
  valueB: number;
  absoluteDiff: number;
  pctDiff: number;
  keyDrivers: ScenarioDivergenceFactor[];
  summaryConclusionAr: string;
  summaryConclusionEn: string;
}
