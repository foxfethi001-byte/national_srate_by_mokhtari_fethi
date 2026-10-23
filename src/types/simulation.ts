/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Core Type Definitions for National State Simulator (Phase 2 Architecture)
 * محاكي الدولة الوطنية - تعريفات الأنواع والبيانات الأساسية ونماذج الاقتصاد الكلي الشاملة
 */

export type SectorId = 
  | 'macroeconomy'
  | 'households'
  | 'labor_production'
  | 'fiscal_debt'
  | 'trade_external'
  | 'monetary_prices'
  | 'demographics'
  | 'human_capital'
  | 'energy_environment'
  | 'governance_society'
  // Phase 4 Complete National Sectors A-O:
  | 'economy_production'       // A. الاقتصاد والإنتاج
  | 'agriculture_food'         // B. الزراعة والأمن الغذائي
  | 'energy_resources'         // C. الطاقة والموارد الطبيعية
  | 'education_skills'         // D. التعليم والمهارات
  | 'healthcare_health'        // E. الرعاية الصحية والصحة العامة
  | 'population_labor'         // F. السكان والعمل
  | 'housing_infrastructure'   // G. الإسكان والبنية التحتية
  | 'public_admin'             // H. الإدارة العامة والمؤسسات
  | 'politics_opinion'         // I. السياسة والرأي العام
  | 'foreign_trade'            // J. العلاقات الخارجية والتجارة
  | 'environment_climate'      // K. البيئة والمناخ
  | 'justice_safety'           // L. العدالة والسلامة العامة
  | 'digital_cyber'            // M. الأنظمة الرقمية والأمن السيبراني
  | 'culture_tourism'          // N. الثقافة والسياحة والرياضة
  | 'resilience_defense';      // O. الصمود الوطني والدفاع

export type ConfidenceLevel = 
  | 'accounting_identity'  // تطابق حسابي محكم (100% يقين)
  | 'high_empirical'       // علاقة تجريبية قوية ومثبتة
  | 'moderate_empirical'   // علاقة سلوكية ذات تباين تجريبي
  | 'uncertain_estimate';  // تقدير تقريبي مع عدم يقين مرتفع

export type TimeStepUnit = 'annual' | 'quarterly';

/** Simulated Date */
export interface SimulatedDate {
  year: number;
  quarter?: 1 | 2 | 3 | 4;
}

/** Region in the Country */
export interface Region {
  id: string;
  nameAr: string;
  nameEn: string;
  type: 'metropolitan_capital' | 'industrial_basin' | 'rural_agricultural' | 'coastal_logistics';
  populationMillions: number;
  populationSharePct: number;
  regionalGdpUsdBillion: number;
  gdpSharePct: number;
  publicServiceCapacityIndex: number; // 0-100
  unemploymentRatePct: number;
}

/** Population Demographic Group */
export interface PopulationGroup {
  id: string;
  nameAr: string;
  nameEn: string;
  ageRange: string;
  countMillions: number;
  shareOfTotalPct: number;
  laborParticipationRatePct: number;
  isDependent: boolean;
}

/** Documented Model Assumption */
export interface ModelAssumption {
  id: string;
  parameterNameAr: string;
  parameterNameEn: string;
  value: number | string;
  unit: string;
  validRange: string;
  rationaleAr: string;
  rationaleEn: string;
  confidence: ConfidenceLevel;
}

/** Country Configuration */
export interface CountryConfig {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  currencyAr: string;
  currencyEn: string;
  currencySymbol: string;
  baseYear: number;
  timeStepUnit: TimeStepUnit;
  isSyntheticDataset: true; // Strictly labeled: illustrative synthetic data
  dataSourceDisclosureAr: string;
  dataSourceDisclosureEn: string;
  regions: Region[];
  populationGroups: PopulationGroup[];
  modelAssumptions: ModelAssumption[];
}

/** 1. National Accounts & Expenditure Components (Y = C + I + G + X - M) */
export interface NationalAccountsState {
  realGdp: number;                 // الناتج المحلي الإجمالي الحقيقي ($B)
  nominalGdp: number;              // الناتج المحلي الإجمالي الاسمي ($B)
  gdpDeflator: number;             // مكمش الناتج المحلي الإجمالي (سنة الأساس = 100)
  realGdpGrowthRate: number;       // معدل النمو الاقتصادي الحقيقي السنوي (%)
  potentialGdp: number;            // الناتج المحلي الممكن / الكامن ($B)
  outputGapPct: number;            // فجوة الناتج (%) = (الفعلي - الكامن) / الكامن
  
  // Expenditure components (National Accounts Identity)
  consumptionHouseholdReal: number;// الاستهلاك العائلي الحقيقي C ($B)
  investmentTotalReal: number;     // الاستثمار الكلي الحقيقي I ($B)
  governmentConsumptionReal: number;// الاستهلاك الحكومي الحقيقي G ($B)
  exportsReal: number;             // الصادرات الحقيقية X ($B)
  importsReal: number;             // الواردات الحقيقية M ($B)
  netExportsReal: number;          // صافي الصادرات (X - M) ($B)
}

/** 2. Households Income, Consumption, Savings & Purchasing Power */
export interface HouseholdEconomyState {
  grossWageIncome: number;         // إجمالي دخل الأجور الوطنية ($B)
  socialTransfersReceived: number; // التحويلات الاجتماعية والإعانات المستلمة ($B)
  disposableIncomeNominal: number;  // الدخل المتاح الاسمي للأسر ($B) = الأجور + التحويلات - ضريبة الدخل
  disposableIncomeReal: number;     // الدخل المتاح الحقيقي ($B)
  consumptionNominal: number;       // الاستهلاك العائلي الاسمي ($B)
  householdSavingsNominal: number;  // المدخرات العائلية الاسمية ($B) = الدخل المتاح - الاستهلاك
  householdSavingsRatePct: number;  // معدل الادخار العائلي (%)
  purchasingPowerIndex: number;     // مؤشر القوة الشرائية الحقيقية للأسر (أساس = 100)
}

/** 3. Employment, Wages, and Labor Productivity */
export interface LaborProductivityState {
  totalPopulation: number;         // إجمالي السكان (ملايين)
  laborForceTotal: number;         // القوى العاملة (ملايين)
  employedTotal: number;           // المشتغلون الفعليون (ملايين)
  unemployedTotal: number;         // العاطلون عن العمل (ملايين)
  unemploymentRate: number;        // معدل البطالة (%)
  youthUnemploymentRate: number;   // بطالة الشباب (%)
  laborProductivityPerWorker: number;// إنتاجية العامل السنوية ($ ألف/عامل) = الناتج الحقيقي / المشتغلين
  averageNominalWageMonthly: number;// متوسط الأجر الاسمي الشهري ($/شهر)
  averageRealWageMonthly: number;   // متوسط الأجر الحقيقي الشهري ($/شهر)
  laborShareOfGdpPct: number;      // حصة العمل من الناتج المحلي (%)
}

/** 4. Prices, Inflation & Monetary Conditions */
export interface PricesMonetaryState {
  cpiIndex: number;                // الرقم القياسي لأسعار المستهلك (أساس = 100)
  inflationRate: number;           // معدل التضخم السنوي (%)
  expectedInflationRate: number;   // التضخم المتوقع (%)
  centralBankRate: number;         // سعر الفائدة الأساسي للبنك المركزي (%)
  taylorDesiredRate: number;       // سعر الفائدة المستهدف حسب قاعدة تايلور (%)
  realInterestRate: number;        // سعر الفائدة الحقيقي (%) = الفائدة الاسمية - التضخم
  sovereignBondYield10y: number;   // عائد السندات السيادية لأجل 10 سنوات (%)
  sovereignRiskSpreadBps: number;  // علاوة المخاطر السيادية (نقاط أساس)
}

/** 5 & 6. Fiscal Operations, Revenues & Outlays Breakdown */
export interface FiscalSystemState {
  // Revenues
  taxRevenueIncome: number;        // ضريبة الدخل الفردي ($B)
  taxRevenueCorporate: number;     // ضريبة الشركات والأرباح ($B)
  taxRevenueVat: number;           // ضريبة القيمة المضافة / المبيعات ($B)
  taxRevenueTariffs: number;       // الرسوم الجمركية على الواردات ($B)
  resourceRentsRevenue: number;    // ريوع الموارد الطبيعية والمحروقات ($B)
  carbonTaxRevenue: number;        // إيرادات ضريبة الكربون ($B)
  totalRevenue: number;            // إجمالي الإيرادات العامة ($B)

  // Expenditures
  expenditurePublicWages: number;  // كتلة أجور القطاع العام ($B)
  expenditureHealthcare: number;   // نفقات الرعاية الصحية العامة ($B)
  expenditureEducation: number;    // نفقات التعليم والتدريب ($B)
  expenditureInfrastructureCapex: number;// الاستثمار الرأسمالي في البنية الأساسية ($B)
  expenditureSocialSafety: number; // شبكات الحماية الاجتماعية والدعم ($B)
  expenditureDefense: number;      // نفقات الدفاع والأمن القومي ($B)
  expenditureDebtInterest: number; // كلفة خدمة فوائد الدين العام ($B)
  totalExpenditure: number;        // إجمالي النفقات العامة ($B)

  // Budget Balances
  primaryBalance: number;          // الرصيد الأولي ($B) = الإيرادات - (النفقات - الفوائد)
  overallBalance: number;          // الرصيد الكلي الصافي ($B) = الإيرادات - النفقات
  overallDeficit: number;          // العجز الكلي الصافي ($B) = max(0, النفقات - الإيرادات)
  deficitToGdpRatio: number;       // نسبة العجز إلى الناتج المحلي (%)

  // Explicit Financing Breakdown
  financingTaxCoveredPct: number;  // نسبة النفقات المغطاة بالضرائب والريوع (%)
  financingNewBorrowingPct: number;// نسبة النفقات الممولة بالاقتراض الجديد / العجز (%)
}

/** 7. Public Debt, Servicing, and Solvency */
export interface PublicDebtState {
  publicDebtStock: number;         // رصيد الدين العام التراكمي ($B)
  debtToGdpRatio: number;          // نسبة الدين العام إلى الناتج المحلي (%)
  foreignCurrencyDebtPct: number;  // حصة الدين بالعملات الأجنبية (%)
  foreignReserves: number;         // احتياطيات النقد الأجنبي الرسمية ($B)
  debtSustainabilityStatus: 'sustainable' | 'vulnerable' | 'critical';
}

/** 8 & 9. Investment, Capital Stock & Trade */
export interface ProductiveCapacityState {
  privateInvestmentReal: number;   // الاستثمار الخاص الحقيقي ($B)
  publicInfrastructureInvestmentReal: number;// الاستثمار العام في البنية ($B)
  totalCapitalStockReal: number;   // الرصيد التراكمي لرأس المال الإنتاجي ($B)
  capacityUtilizationPct: number;  // معدل استغلال الطاقة الإنتاجية (%)
  tradeBalanceUsd: number;         // الميزان التجاري للسلع والخدمات ($B) = الصادرات - الواردات
  currentAccountBalanceUsd: number;// ميزان الحساب الجاري ($B)
  currentAccountToGdpPct: number;  // نسبة الحساب الجاري إلى الناتج (%)
}

/** Aggregated Macroeconomic State for Phase 2 */
export interface FullEconomicState {
  nationalAccounts: NationalAccountsState;
  households: HouseholdEconomyState;
  laborProductivity: LaborProductivityState;
  pricesMonetary: PricesMonetaryState;
  fiscal: FiscalSystemState;
  debt: PublicDebtState;
  capacityTrade: ProductiveCapacityState;
}

/** State of Demographics & Cohorts */
export interface DemographicsState {
  totalPopulation: number;
  cohortYouth: number;
  cohortWorkingAge: number;
  cohortElderly: number;
  dependencyRatio: number;
  fertilityRate: number;
  birthsCount: number;
  deathsCount: number;
  netMigration: number;
  lifeExpectancy: number;
  laborForceParticipationRate: number;
  laborForceTotal: number;
  employedTotal: number;
  unemploymentRate: number;
  youthUnemploymentRate: number;
}

/** State of Human Capital & Public Service Capacity */
export interface HumanCapitalState {
  educationQualityIndex: number;
  healthcareQualityIndex: number;
  publicServiceCapacityIndex: number;
  infrastructureStock: number;
  infrastructureQualityIndex: number;
  rdIntensityPctGdp: number;
  totalFactorProductivity: number;
}

/** State of Energy, Environment & Resources */
export interface EnergyEnvironmentState {
  primaryEnergyDemandTwh: number;
  renewableEnergyPct: number;
  fossilEnergyPct: number;
  nuclearEnergyPct: number;
  annualCo2EmissionsMt: number;
  gridReliabilityIndex: number;
  resourceRentsDepletionPct: number;
}

/** State of Governance, Institutions & Public Trust */
export interface GovernanceSocietyState {
  giniCoefficient: number;
  povertyRatePct: number;
  pensionFundSolvencyPct: number;
  ruleOfLawIndex: number;
  corruptionPerceptionIndex: number;
  institutionalTrustIndex: number;
  socialTensionIndex: number;
}

/** Backward-compatible flat macroeconomic shape for views */
export interface MacroeconomicState {
  nominalGdp: number;
  realGdp: number;
  realGdpGrowthRate: number;
  inflationRate: number;
  centralBankRate: number;
  sovereignBondYield10y: number;
  taxRevenueIncome: number;
  taxRevenueCorporate: number;
  taxRevenueVat: number;
  taxRevenueTariffs: number;
  resourceRentsRevenue: number;
  totalRevenue: number;
  expenditurePublicWages: number;
  expenditureHealthcare: number;
  expenditureEducation: number;
  expenditureInfrastructure: number;
  expenditureSocialSafety: number;
  expenditureDefense: number;
  expenditureDebtInterest: number;
  totalExpenditure: number;
  primaryDeficit: number;
  overallDeficit: number;
  publicDebtStock: number;
  debtToGdpRatio: number;
  foreignReserves: number;
  currentAccountBalance: number;
}

// =====================================================================
// PHASE 4: 15 MODULAR NATIONAL SECTOR SUBSYSTEMS (MODULES A THROUGH O)
// =====================================================================

/** A. Economy and production */
export interface SectorEconomyProduction {
  isPartiallyModeled: false;
  manufacturingOutputUsdB: number;
  servicesOutputUsdB: number;
  smeShareOfOutputPct: number;
  industrialCapacityUtilizationPct: number;
  supplyChainFrictionIndex: number; // 0-100 scale
  capitalGoodsImportSharePct: number;
  businessFormationRatePct: number;
}

/** B. Agriculture and food security */
export interface SectorAgricultureFood {
  isPartiallyModeled: false;
  agriculturalOutputRealUsdB: number;
  arableLandHectaresM: number;
  waterIrrigationStressPct: number; // 0-100
  agriculturalInputCostsIndex: number; // Base 100
  domesticFoodSufficiencyPct: number; // %
  foodImportsUsdBillion: number;
  foodPriceInflationPct: number;
}

/** C. Energy and natural resources */
export interface SectorEnergyResources {
  isPartiallyModeled: false;
  totalEnergyProductionTwh: number;
  domesticEnergyDemandTwh: number;
  cleanEnergySharePct: number;
  fossilFuelSharePct: number;
  powerGridCapacityGw: number;
  gridReliabilityScore: number; // 0-100
  strategicFuelReserveDays: number;
  resourceDepletionPct: number;
}

/** D. Education and skills */
export interface SectorEducationSkills {
  isPartiallyModeled: false;
  primarySecondaryEnrollmentPct: number;
  tertiaryEnrollmentPct: number;
  vocationalTrainingSharePct: number;
  workforceSkillMatchIndex: number; // 0-100
  stemGraduatesRatePct: number;
  delayedTfpImpactAccumulator: number; // Multi-year lagged impact on TFP
}

/** E. Healthcare and public health */
export interface SectorHealthcareHealth {
  isPartiallyModeled: false;
  hospitalBedsPer1000: number;
  physiciansPer1000: number;
  healthcareAccessCoveragePct: number;
  hospitalServicePressureIndex: number; // 0-100
  preventableMortalityRatePer100k: number;
  healthyWorkforceParticipationBonus: number;
}

/** F. Population and labor */
export interface SectorPopulationLabor {
  isPartiallyModeled: false;
  totalPopulationMillions: number;
  youthSharePct: number;
  workingAgeSharePct: number;
  elderlySharePct: number;
  dependencyRatio: number;
  laborParticipationPct: number;
  structuralUnemploymentPct: number;
  formalEmploymentSharePct: number;
}

/** G. Housing and infrastructure */
export interface SectorHousingInfrastructure {
  isPartiallyModeled: false;
  housingUnitsTotalMillions: number;
  housingAffordabilityPriceToIncome: number; // Multiplier
  constructionCapacityIndex: number; // 0-100
  pavedRoadsNetworkKmThousands: number;
  waterSanitationCoveragePct: number;
  infrastructureMaintenanceBacklogUsdB: number;
}

/** H. Public administration and institutions */
export interface SectorPublicAdmin {
  isPartiallyModeled: false;
  administrativeCapacityIndex: number; // 0-100
  publicServiceDeliveryScore: number; // 0-100
  policyImplementationLagMonths: number;
  procurementTransparencyPct: number;
  regulatoryBurdenIndex: number; // 0-100
  antiCorruptionEnforcementScore: number;
}

/** I. Politics and public opinion (Simplified behavioral model) */
export interface SectorPoliticsOpinion {
  isPartiallyModeled: false;
  publicTrustInInstitutionsPct: number;
  perceivedDistributionalFairnessPct: number;
  publicServiceSatisfactionPct: number;
  reformAcceptanceIndex: number; // 0-100
  socialCohesionScore: number; // 0-100
  modelDisclaimersAr: string;
}

/** J. Foreign relations and trade */
export interface SectorForeignTrade {
  isPartiallyModeled: false;
  tradeOpennessRatioPct: number; // (X+M)/GDP
  top3TradingPartnerConcentrationPct: number;
  criticalImportsVulnerabilityIndex: number; // 0-100
  foreignDirectInvestmentNetUsdB: number;
  diplomaticStabilityIndex: number; // 0-100
  termsOfTradeIndex: number; // Base 100
}

/** K. Environment and climate */
export interface SectorEnvironmentClimate {
  isPartiallyModeled: false;
  annualCo2EmissionsMt: number;
  ambientAirQualityIndexAqi: number;
  freshwaterWithdrawalStressPct: number;
  forestCoveragePct: number;
  climateVulnerabilityScore: number; // 0-100
}

/** L. Justice and public safety */
export interface SectorJusticeSafety {
  isPartiallyModeled: false;
  courtCaseProcessingDaysAvg: number;
  judicialIndependenceIndex: number; // 0-100
  policeStaffingPer100k: number;
  publicSafetyIndex: number; // 0-100
  legalAidAccessPct: number;
}

/** M. Digital systems and cybersecurity */
export interface SectorDigitalCyber {
  isPartiallyModeled: false;
  broadbandHighSpeedPenetrationPct: number;
  digitalGovServicesAdoptionPct: number;
  digitalEconomyShareOfGdpPct: number;
  telecomGridResilienceScore: number; // 0-100
  cyberThreatVulnerabilityScore: number; // 0-100
}

/** N. Culture, tourism, and sport */
export interface SectorCultureTourism {
  isPartiallyModeled: false;
  annualTouristArrivalsMillions: number;
  tourismReceiptsUsdBillion: number;
  tourismEmploymentSharePct: number;
  culturalHeritageFundingPctGdp: number;
  sportsPublicParticipationPct: number;
}

/** O. National resilience and defense (Aggregate, non-operational) */
export interface SectorResilienceDefense {
  isPartiallyModeled: false;
  strategicResilienceIndex: number; // 0-100
  supplySecurityReserveMonths: number;
  civilPreparednessIndex: number; // 0-100
  criticalInfraProtectionScore: number; // 0-100
  defenseOutlaysShareOfGdpPct: number;
  nonOperationalNoticeAr: string;
}

/** Unified 15 National Sectors Aggregate State */
export interface NationalSectorsState {
  economyProduction: SectorEconomyProduction;
  agricultureFood: SectorAgricultureFood;
  energyResources: SectorEnergyResources;
  educationSkills: SectorEducationSkills;
  healthcareHealth: SectorHealthcareHealth;
  populationLabor: SectorPopulationLabor;
  housingInfrastructure: SectorHousingInfrastructure;
  publicAdmin: SectorPublicAdmin;
  politicsOpinion: SectorPoliticsOpinion;
  foreignTrade: SectorForeignTrade;
  environmentClimate: SectorEnvironmentClimate;
  justiceSafety: SectorJusticeSafety;
  digitalCyber: SectorDigitalCyber;
  cultureTourism: SectorCultureTourism;
  resilienceDefense: SectorResilienceDefense;
}

/** Cross-Sector Documented Dependency Definition */
export interface CrossSectorDependency {
  id: string;
  sourceSector: SectorId;
  targetSector: SectorId;
  sourceVar: string;
  sourceVarNameAr: string;
  targetVar: string;
  targetVarNameAr: string;
  sign: '+' | '-' | '+/-';
  formula: string;
  timeLagYears: number;
  elasticity: number; // Sensitivity factor
  rationaleAr: string;
  rationaleEn: string;
  conditionsAr: string;
  conditionsEn: string;
  confidence: ConfidenceLevel;
  isConfigurable: boolean;
}

/** Dataset Provenance & Uncertainty Metadata */
export interface DatasetMetadata {
  id: string;
  nameAr: string;
  nameEn: string;
  sourceOrganization: string;
  sourceUrl?: string;
  publicationDate: string;
  referencePeriod: string;
  targetSectorId: SectorId;
  variableKey: string;
  units: string;
  geographicCoverage: string;
  missingValuesHandling: 'interpolate' | 'forward_fill' | 'explicit_null' | 'synthetic_labeled';
  transformationStepsAr: string;
  transformationStepsEn: string;
  knownLimitationsAr: string;
  knownLimitationsEn: string;
  isSynthetic: boolean;
  sampleObservations: { date: string; value: number | null }[];
}

/** Complete System State at each simulated step */
export interface SimulationState {
  date: SimulatedDate;
  year: number;
  macro: MacroeconomicState; // Backward compatibility
  economic: FullEconomicState; // Full Phase 2 consistent state
  demographics: DemographicsState;
  humanCapital: HumanCapitalState;
  energy: EnergyEnvironmentState;
  governance: GovernanceSocietyState;
  regions: Region[];
  sectors?: NationalSectorsState; // Phase 4 Modular 15-Sector Subsystems
}

export type DeficitFinancingPreference = 'domestic_bonds' | 'external_debt' | 'balanced_mix' | 'reserve_drawdown';

/** User Policy Levers */
export interface PolicySettings {
  // 1. Fiscal Taxation & Revenues
  taxRateIncome: number;           // ضريبة الدخل (%)
  taxRateCorporate: number;        // ضريبة الشركات (%)
  taxRateVat: number;              // ضريبة القيمة المضافة (%)
  taxExemptionThreshold: number;   // حد الإعفاء الضريبي السنوي للدخل ($ ألف)
  tariffRateAvg: number;           // الرسوم الجمركية على الواردات (%)
  exportIncentiveSubsidyPct: number;// حوافز الصادرات غير النفطية (%)
  
  // 2. Public Budget Allocations (% of GDP)
  budgetPublicWagesPctGdp: number; // الأجور والرواتب العامة (%)
  budgetHealthcarePctGdp: number;  // الرعاية الصحية والمستشفيات (%)
  budgetEducationPctGdp: number;   // التعليم والجامعات (%)
  budgetInfrastructurePctGdp: number;// البنية التحتية والنقل والأشغال (%)
  budgetSocialSafetyPctGdp: number;// شبكات الأمان الاجتماعي والدعم (%)
  budgetDefensePctGdp: number;     // الدفاع والأمن الوطني (%)
  budgetAgricultureSupportPctGdp: number;// دعم الزراعة والري والأمن الغذائي (%)
  budgetRnDPctGdp: number;         // البحث العلمي والتطوير الصناعي (%)
  budgetRegionalDevelopmentPctGdp: number;// صندوق التوازن والتنمية الجهوية (%)

  // 3. Public Debt & Financing Assumptions
  deficitFinancingPreference: DeficitFinancingPreference; // وسيلة تمويل العجز
  debtCeilingTargetPctGdp: number; // سقف الدين العام المستهدف (% من الناتج)

  // 4. Monetary Policy & Interest Rates
  monetaryTargetInflation: number; // المستهدف للتضخم (%)
  policyRateSpreadTarget: number;  // هامش الموقف النقدي للبنك المركزي (+/- %)

  // 5. Subsidies, Transfers & Social Support
  fuelSubsidyTargetingPct: number; // نسبة ترشيد وتوجيه دعم الطاقة (0 = دعم عام، 100 = موجه)
  cashTransferCoveragePct: number; // نسبة تغطية الأسر الهشة بالتحويلات المباشرة (%)

  // 6. Labor, Employment & Human Capital
  statutoryRetirementAge: number;  // سن التقاعد القانوني
  minimumWageIndex: number;        // مؤشر الحد الأدنى للأجور
  laborMarketFlexibility: number;  // مرونة سوق العمل والتعاقد
  vocationalTrainingInvestmentPct: number; // مخصصات التدريب والتأهيل المهني (%)

  // 7. Energy, Water, Housing & Environment
  carbonTaxPerTon: number;         // ضريبة الكربون ($/طن)
  cleanEnergySubsidyPct: number;   // دعم الطاقة النظيفة (%)
  waterDesalinationInvestmentPct: number;// استثمارات تحلية المياه والأمن المائي (%)
  socialHousingAllocationPct: number;    // مخصصات برامج الإسكان الاجتماعي (%)

  // 8. Public Administration & Governance
  governanceReformEffort: number;  // مكافحة الفساد والرقمنة المؤسسية
  civilServiceEfficiencyProgram: number; // برنامج ترشيد كفاءة الجهاز الإداري
}

/** External Shocks */
export interface ExternalShocks {
  commodityPriceShockPct: number;
  globalInterestRateShock: number;
  tradeFrictionShockPct: number;
  climateShockIntensity: number;
  pandemicShockActive: boolean;
}

/** Policy Draft Item within Coordinated Package */
export interface PolicyDraftItem {
  policyKey: keyof PolicySettings;
  baselineValue: number | string;
  draftValue: number | string;
  unit: string;
  category: string;
  labelAr: string;
  labelEn: string;
}

/** Modeled Indicator Consequence */
export interface PolicyPackageConsequence {
  indicatorKey: string;
  labelAr: string;
  labelEn: string;
  sector: string;
  unit: string;
  baselineValue: number;
  simulatedValue: number;
  absoluteDelta: number;
  percentDelta: number | null;
  timeLagYears: number;
  trajectory: { shortTerm: number; mediumTerm: number; longTerm: number };
  impactType: 'positive' | 'negative' | 'mixed' | 'unmodeled';
  causalMechanismAr: string;
  causalMechanismEn: string;
  affectedGroups: string[];
  budgetImplicationAr: string;
  budgetImplicationEn: string;
  uncertaintyRange: string;
}

/** Policy Conflict & Feasibility Contradiction */
export interface PolicyConflictItem {
  id: string;
  titleAr: string;
  titleEn: string;
  severity: 'high' | 'medium' | 'critical';
  descriptionAr: string;
  descriptionEn: string;
  calculationProofAr: string;
  calculationProofEn: string;
  conflictingPolicies: (keyof PolicySettings)[];
  userChoiceOptions: { id: string; labelAr: string; labelEn: string; suggestionAr: string; suggestionEn: string }[];
}

/** Policy Proposal for Laboratory Preview */
export interface PolicyProposal {
  policyKey: keyof PolicySettings | 'policy_package';
  labelAr: string;
  labelEn: string;
  unit: string;
  baselineValue: number;
  proposedValue: number;
  estimatedImpact: {
    deltaGdpGrowthPct: number;
    deltaDeficitBillion: number;
    deltaInflationPct: number;
    deltaDebtRatioPct: number;
    deltaPurchasingPowerPct: number;
  };
  assumptionsUsedAr: string;
  assumptionsUsedEn: string;
  constraintsAr: string;
  constraintsEn: string;
}

/** Policy Change Audit Log Entry */
export interface PolicyAuditEntry {
  id: string;
  timestamp: string;
  simulatedYear: number;
  policyKey: keyof PolicySettings | 'policy_package';
  labelAr: string;
  labelEn: string;
  previousValue: number | string;
  newValue: number | string;
  delta: number;
  status: 'accepted' | 'reverted';
  rationaleAr: string;
  packageDetails?: { key: keyof PolicySettings; from: any; to: any; label: string }[];
}

/** Comprehensive Causal Graph Model */
export interface CausalNode {
  id: string;
  labelAr: string;
  labelEn: string;
  sector: SectorId;
  unit: string;
  isStock: boolean; // Distinction between stocks and flows
}

export interface CausalEdge {
  id: string;
  source: string;
  target: string;
  sign: '+' | '-' | '+/-';
  mechanismAr: string;
  mechanismEn: string;
  formulaAr: string;
  formulaEn: string;
  parameters: string;
  units: string;
  timeDelayYears: number;
  conditions: string;
  relationshipType: 'accounting_identity' | 'empirical_relationship' | 'modeling_assumption';
  confidence: ConfidenceLevel;
  evidenceRef: string;
  testId: string;
}

export interface CausalLink {
  id: string;
  sourceVar: string;
  targetVar: string;
  effectDirection: 'positive' | 'negative' | 'non_linear';
  formulaArabic: string;
  formulaEnglish: string;
  coefficientNotes: string;
  timeLagYears: number;
  confidence: ConfidenceLevel;
  economicRationaleAr: string;
  economicRationaleEn: string;
  verifiedByTestId: string;
}

export interface SimulationCheckpoint {
  id: string;
  name: string;
  createdAt: string;
  date: SimulatedDate;
  state: SimulationState;
  policies: PolicySettings;
  shocks: ExternalShocks;
  notes?: string;
}

export interface CountryArchetype {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  countryConfig: CountryConfig;
  initialState: SimulationState;
  defaultPolicies: PolicySettings;
}

export interface Scenario {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  baseArchetypeId: string;
  policies: PolicySettings;
  shocks: ExternalShocks;
  history: SimulationState[];
  currentYear: number;
  currentDate: SimulatedDate;
}

export interface InvariantTestResult {
  id: string;
  nameAr: string;
  nameEn: string;
  category: 'accounting_identity' | 'demographic_flow' | 'boundary_constraint' | 'time_engine' | 'persistence' | 'economic_consistency';
  passed: boolean;
  actualDelta: number;
  tolerance: number;
  detailsAr: string;
  detailsEn: string;
}

export interface ProjectStateExport {
  formatVersion: '1.0.0';
  exportedAt: string;
  activeArchetypeId: string;
  countryConfig: CountryConfig;
  activeScenario: Scenario;
  savedScenarios: Scenario[];
  checkpoints: SimulationCheckpoint[];
}
