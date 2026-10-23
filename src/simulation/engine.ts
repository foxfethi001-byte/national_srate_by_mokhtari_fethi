/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Core Simulation Engine (Phase 2 - Full Causal Economic Engine)
 * محرك المحاكاة الرياضي والفيزيائي لأنظمة الدولة والاقتصاد الكلي المتكامل
 */

import {
  SimulationState,
  PolicySettings,
  ExternalShocks,
  FullEconomicState,
} from '../types/simulation';
import { simulateNationalSectors } from './sectorEngine';

export interface SimulationStepOptions {
  enableStochasticNoise?: boolean;
  history?: SimulationState[];
}

function clamp(val: number, min: number, max: number): number {
  if (Number.isNaN(val) || !Number.isFinite(val)) return min;
  return Math.min(Math.max(val, min), max);
}

function seededNoise(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

/**
 * Advances the simulation by exactly one step (t -> t+1)
 */
export function simulateNextYear(
  prev: SimulationState,
  policies: PolicySettings,
  shocks: ExternalShocks,
  options: SimulationStepOptions = {}
): SimulationState {
  const year = prev.year + 1;
  const noiseSeed = year * 100 + (options.enableStochasticNoise ? 1 : 0);
  const randomFactor = options.enableStochasticNoise ? (seededNoise(noiseSeed) - 0.5) * 0.15 : 0;

  // -------------------------------------------------------------
  // 1. DEMOGRAPHIC TRANSITIONS & FLOWS
  // -------------------------------------------------------------
  const baselineFertility = prev.demographics.fertilityRate;
  const fertilityShift = (policies.budgetSocialSafetyPctGdp - 5) * 0.01 - (prev.humanCapital.educationQualityIndex - 50) * 0.002;
  const fertilityRate = clamp(baselineFertility + fertilityShift * 0.1, 1.1, 4.5);

  const healthBonus = (prev.humanCapital.healthcareQualityIndex - 60) * 0.05;
  const pollutionPenalty = (prev.energy.annualCo2EmissionsMt / 500) * 0.03;
  const lifeExpectancy = clamp(prev.demographics.lifeExpectancy + healthBonus - pollutionPenalty, 55, 92);

  const crudeDeathRatePct = clamp((1000 / lifeExpectancy) * 0.08, 0.5, 1.8);
  const deathsCount = Math.round(((prev.demographics.totalPopulation * crudeDeathRatePct) / 100) * 1000) / 1000;

  const crudeBirthRatePct = clamp(fertilityRate * 0.75, 0.7, 3.8);
  const birthsCount = Math.round(((prev.demographics.totalPopulation * crudeBirthRatePct) / 100) * 1000) / 1000;

  const unrestDeterrent = (prev.governance.socialTensionIndex - 40) * 0.002;
  const gdpPerCapita = (prev.macro.realGdp * 1000) / prev.demographics.totalPopulation;
  const attractionFactor = (gdpPerCapita - 15000) * 0.000003;
  const netMigration = Math.round(clamp(prev.demographics.netMigration + attractionFactor - unrestDeterrent, -0.4, 0.5) * 1000) / 1000;

  const youthAgingRate = 1 / 15;
  const workingAgingRate = 1 / Math.max(35, policies.statutoryRetirementAge - 18);
  const elderlyMortalityShare = 0.75;

  const youthAgingOut = prev.demographics.cohortYouth * youthAgingRate;
  const workingAgingOut = prev.demographics.cohortWorkingAge * workingAgingRate;

  const newYouth = clamp(prev.demographics.cohortYouth + birthsCount - youthAgingOut - deathsCount * 0.15, 0.5, 300);
  const newWorking = clamp(prev.demographics.cohortWorkingAge + youthAgingOut - workingAgingOut + netMigration - deathsCount * 0.10, 1.0, 500);
  const newElderly = clamp(prev.demographics.cohortElderly + workingAgingOut - deathsCount * elderlyMortalityShare, 0.2, 200);

  const totalPopulation = Math.round((newYouth + newWorking + newElderly) * 1000) / 1000;
  const dependencyRatio = Math.round((((newYouth + newElderly) / newWorking) * 100) * 10) / 10;

  const retirementBonus = (policies.statutoryRetirementAge - 60) * 0.8;
  const laborForceParticipationRate = clamp(prev.demographics.laborForceParticipationRate + retirementBonus * 0.05, 40, 85);
  const laborForceTotal = Math.round(((newWorking * laborForceParticipationRate) / 100) * 100) / 100;

  // -------------------------------------------------------------
  // 2. HUMAN CAPITAL & PHYSICAL INFRASTRUCTURE ACCUMULATION
  // -------------------------------------------------------------
  const educationInvestmentEfficiency = policies.budgetEducationPctGdp * (0.8 + (policies.governanceReformEffort / 100) * 0.4);
  const educationQualityDelta = (educationInvestmentEfficiency - 4.5) * 0.35;
  const educationQualityIndex = clamp(prev.humanCapital.educationQualityIndex + educationQualityDelta, 20, 98);

  const healthcareInvestmentEfficiency = policies.budgetHealthcarePctGdp * (0.8 + (policies.governanceReformEffort / 100) * 0.3);
  let healthShockPenalty = 0;
  if (shocks.pandemicShockActive) {
    healthShockPenalty = 6.0;
  }
  const healthcareQualityDelta = (healthcareInvestmentEfficiency - 4.0) * 0.4 - healthShockPenalty;
  const healthcareQualityIndex = clamp(prev.humanCapital.healthcareQualityIndex + healthcareQualityDelta, 20, 99);

  const civilServiceBonus = ((policies.civilServiceEfficiencyProgram ?? 50) - 50) * 0.06;
  const publicServiceCapacityIndex = Math.round(clamp((healthcareQualityIndex * 0.4 + educationQualityIndex * 0.35 + (prev.humanCapital.infrastructureQualityIndex || 60) * 0.25 + civilServiceBonus), 10, 99) * 10) / 10;

  // Infrastructure Capital Stock: Perpetual Inventory with 4.0% depreciation
  const infraDepreciationRate = 0.04;
  const publicCapexAmount = Math.round(((prev.macro.realGdp * policies.budgetInfrastructurePctGdp) / 100) * 10) / 10;
  const governanceEfficiency = 0.75 + (policies.governanceReformEffort / 100) * 0.35;
  const effectivePublicCapex = publicCapexAmount * governanceEfficiency;
  const infrastructureStock = Math.round((prev.humanCapital.infrastructureStock * (1 - infraDepreciationRate) + effectivePublicCapex) * 10) / 10;
  
  const infraAdequacyRatio = infrastructureStock / (prev.macro.realGdp * 1.2);
  const infrastructureQualityIndex = clamp(infraAdequacyRatio * 75, 25, 98);

  const rdIntensityPctGdp = clamp((policies.budgetEducationPctGdp * 0.20) + ((policies.budgetRnDPctGdp ?? 1.0) * 0.5) + (policies.laborMarketFlexibility / 100) * 0.5, 0.2, 5.0);
  const tfpGrowthRate = (
    (educationQualityIndex - 50) * 0.0003 +
    (healthcareQualityIndex - 50) * 0.0002 +
    (rdIntensityPctGdp * 0.006) +
    (infrastructureQualityIndex - 50) * 0.0003
  );
  const totalFactorProductivity = Math.round((prev.humanCapital.totalFactorProductivity * (1 + tfpGrowthRate)) * 100) / 100;

  // -------------------------------------------------------------
  // 3. INVESTMENT & PRODUCTIVE CAPACITY ACCUMULATION
  // -------------------------------------------------------------
  // Total productive capital stock = private capital + public capital
  const prevTotalCapital = prev.economic?.capacityTrade?.totalCapitalStockReal || (prev.macro.realGdp * 2.2);
  
  // Real interest rate from previous period
  const prevRealRate = prev.economic?.pricesMonetary?.realInterestRate || (prev.macro.centralBankRate - prev.macro.inflationRate);
  
  // Private investment drivers:
  // - Dampened by high corporate tax and high real interest rate
  // - Crowded-in by high public infrastructure quality
  const corpTaxDrag = Math.max(0, policies.taxRateCorporate - 20) * 0.008;
  const realInterestDrag = Math.max(0, prevRealRate - 1.5) * 0.012;
  const publicInfraCrowdingIn = (infrastructureQualityIndex - 50) * 0.003;
  const privateInvestmentMultiplier = clamp(1 - corpTaxDrag - realInterestDrag + publicInfraCrowdingIn, 0.65, 1.4);

  const basePrivateInvestmentRate = 0.16; // 16% of GDP
  const privateInvestmentReal = Math.round((prev.macro.realGdp * basePrivateInvestmentRate * privateInvestmentMultiplier) * 10) / 10;
  const publicInfrastructureInvestmentReal = publicCapexAmount;
  const investmentTotalReal = Math.round((privateInvestmentReal + publicInfrastructureInvestmentReal) * 10) / 10;

  // Total capital stock accumulation (5% depreciation on private/overall capital)
  const capitalDepreciationRate = 0.05;
  const totalCapitalStockReal = Math.round((prevTotalCapital * (1 - capitalDepreciationRate) + investmentTotalReal) * 10) / 10;

  // -------------------------------------------------------------
  // 4. POTENTIAL OUTPUT & REAL GDP (COBB-DOUGLAS)
  // -------------------------------------------------------------
  // Y* = A * K^alpha * (h * L)^(1-alpha), alpha = 0.35
  const capitalGrowth = (totalCapitalStockReal - prevTotalCapital) / prevTotalCapital;
  const laborForceGrowth = (laborForceTotal - prev.demographics.laborForceTotal) / prev.demographics.laborForceTotal;
  const potentialGdpGrowth = (0.35 * capitalGrowth + 0.65 * laborForceGrowth + tfpGrowthRate) * 100;
  const prevPotentialGdp = prev.economic?.nationalAccounts?.potentialGdp || prev.macro.realGdp;
  const potentialGdp = Math.round((prevPotentialGdp * (1 + potentialGdpGrowth / 100)) * 10) / 10;

  // External Shocks Impact on Output
  let shockGrowthImpact = 0;
  const isResourceDependent = prev.macro.resourceRentsRevenue > (prev.macro.totalRevenue * 0.25);
  if (isResourceDependent) {
    shockGrowthImpact += (shocks.commodityPriceShockPct / 100) * 2.5;
  } else {
    shockGrowthImpact -= (shocks.commodityPriceShockPct / 100) * 0.8;
  }
  shockGrowthImpact -= shocks.globalInterestRateShock * 0.4;
  shockGrowthImpact -= (shocks.tradeFrictionShockPct / 100) * 1.2;
  shockGrowthImpact -= (shocks.climateShockIntensity / 100) * 1.8;
  if (shocks.pandemicShockActive) {
    shockGrowthImpact -= 3.5;
  }

  // Fiscal drag from direct and indirect tax hikes or capex contraction
  const prevIncomeTax = 12;
  const prevVat = 15;
  const incomeTaxDrag = Math.max(0, policies.taxRateIncome - prevIncomeTax) * 0.04;
  const vatDrag = Math.max(0, policies.taxRateVat - prevVat) * 0.05;
  const capexAusterityDrag = Math.max(0, 6.5 - policies.budgetInfrastructurePctGdp) * 0.15;
  const fiscalDrag = incomeTaxDrag + vatDrag + capexAusterityDrag;

  // Real GDP growth with cyclical demand feedback, external shocks and fiscal stance
  const realGdpGrowthRate = Math.round(clamp((potentialGdpGrowth + shockGrowthImpact - fiscalDrag + randomFactor), -8.0, 12.0) * 10) / 10;
  const realGdp = Math.round((prev.macro.realGdp * (1 + realGdpGrowthRate / 100)) * 10) / 10;
  const outputGapPct = Math.round((((realGdp - potentialGdp) / potentialGdp) * 100) * 10) / 10;

  // Capacity utilization
  const capacityUtilizationPct = Math.round(clamp(80.0 + outputGapPct * 1.8, 60.0, 98.0) * 10) / 10;

  // Okun's Law: Unemployment changes inversely with output gap
  const okunsCoefficient = -0.38;
  const laborFlexibilityBonus = (policies.laborMarketFlexibility - 50) * 0.02;
  const unemploymentDelta = okunsCoefficient * outputGapPct - laborFlexibilityBonus;
  const unemploymentRate = Math.round(clamp(prev.demographics.unemploymentRate + unemploymentDelta, 2.5, 30.0) * 10) / 10;
  const youthVocationalBonus = ((policies.vocationalTrainingInvestmentPct ?? 1.0) - 1.0) * 0.7;
  const youthUnemploymentRate = Math.round(clamp(unemploymentRate * 2.1 - youthVocationalBonus, 4.0, 55.0) * 10) / 10;

  const employedTotal = Math.round((laborForceTotal * (1 - unemploymentRate / 100)) * 100) / 100;
  const unemployedTotal = Math.round((laborForceTotal - employedTotal) * 100) / 100;

  // Labor productivity per worker ($ thousands/year)
  const laborProductivityPerWorker = Math.round(((realGdp * 1000) / Math.max(0.1, employedTotal)) * 10) / 10;

  // -------------------------------------------------------------
  // 5. INFLATION, PRICES & MONETARY CONDITIONS
  // -------------------------------------------------------------
  // Phillips Curve: Demand-pull inflation from output gap
  const demandPullInflation = Math.max(0, outputGapPct) * 0.45;
  const commodityCostPush = (shocks.commodityPriceShockPct / 100) * 1.8;
  const carbonTaxInflation = (policies.carbonTaxPerTon / 100) * 0.25;
  const tariffPassThrough = (policies.tariffRateAvg / 100) * 0.3;
  const inflationTarget = policies.monetaryTargetInflation;
  
  const targetReversion = 0.4 * (inflationTarget - prev.macro.inflationRate);
  const inflationRate = Math.round(clamp(prev.macro.inflationRate + targetReversion + demandPullInflation + commodityCostPush + carbonTaxInflation + tariffPassThrough, -1.0, 35.0) * 10) / 10;
  const expectedInflationRate = Math.round((inflationRate * 0.7 + inflationTarget * 0.3) * 10) / 10;

  // Price level index (CPI & GDP Deflator, Base = 100)
  const prevGdpDeflator = prev.economic?.nationalAccounts?.gdpDeflator || 100.0;
  const gdpDeflator = Math.round((prevGdpDeflator * (1 + inflationRate / 100)) * 10) / 10;
  const cpiIndex = gdpDeflator;

  // Nominal GDP (Identity: Real GDP * (Deflator / 100))
  const nominalGdp = Math.round((realGdp * (gdpDeflator / 100)) * 10) / 10;

  // Central Bank Policy Rate (Taylor Rule with user discretionary spread)
  const neutralRealRate = 1.5;
  const taylorDesiredRate = Math.round((neutralRealRate + inflationRate + 0.5 * (inflationRate - inflationTarget) + 0.5 * outputGapPct) * 10) / 10;
  const userMonetarySpread = policies.policyRateSpreadTarget ?? 0.0;
  const targetRateWithSpread = taylorDesiredRate + userMonetarySpread;
  const rateSmoothing = 0.65;
  const centralBankRate = Math.round(clamp(prev.macro.centralBankRate * rateSmoothing + targetRateWithSpread * (1 - rateSmoothing), 0.25, 28.0) * 10) / 10;
  const realInterestRate = Math.round((centralBankRate - inflationRate) * 10) / 10;

  // -------------------------------------------------------------
  // 6. DOMESTIC EXPENDITURES, TRADE & EXTERNAL SECTOR
  // -------------------------------------------------------------
  // Real Government Consumption (non-capex: wages, healthcare, education, safety, defense)
  const govConsumptionNominalPct = (
    policies.budgetPublicWagesPctGdp +
    policies.budgetHealthcarePctGdp +
    policies.budgetEducationPctGdp +
    policies.budgetSocialSafetyPctGdp +
    policies.budgetDefensePctGdp
  );
  const governmentConsumptionNominal = Math.round(((nominalGdp * govConsumptionNominalPct) / 100) * 10) / 10;
  const governmentConsumptionReal = Math.round(((governmentConsumptionNominal / (gdpDeflator / 100))) * 10) / 10;

  // Real Exports X: resource endowment + non-resource trade
  const costCompetitiveness = 1.0 - (inflationRate - 2.0) * 0.02 - (policies.tariffRateAvg / 100) * 0.1;
  const baseExportShare = isResourceDependent ? 0.30 : 0.28;
  const commodityShockFactor = 1 + (shocks.commodityPriceShockPct / 100) * 0.4;
  const exportIncentiveBoost = 1 + ((policies.exportIncentiveSubsidyPct ?? 0) / 100) * 0.25;
  const exportsReal = Math.round((realGdp * baseExportShare * costCompetitiveness * commodityShockFactor * exportIncentiveBoost) * 10) / 10;

  // Real Imports M: driven by domestic demand (absorption) and tariffs
  const tariffDampener = 1 - (policies.tariffRateAvg / 100) * 0.5;
  const baseImportShare = isResourceDependent ? 0.38 : 0.26;
  const importsReal = Math.round((realGdp * baseImportShare * tariffDampener) * 10) / 10;
  const netExportsReal = Math.round((exportsReal - importsReal) * 10) / 10;

  // Household Real Consumption C (National Accounts Closure Identity: C = Y - I - G - (X - M))
  const consumptionHouseholdReal = Math.max(0.1, Math.round((realGdp - investmentTotalReal - governmentConsumptionReal - netExportsReal) * 10) / 10);
  const consumptionNominal = Math.round((consumptionHouseholdReal * (gdpDeflator / 100)) * 10) / 10;

  // -------------------------------------------------------------
  // 7. HOUSEHOLD INCOME, SAVINGS & PURCHASING POWER
  // -------------------------------------------------------------
  // Wage income: labor share ~ 48-54% of GDP
  const baseLaborShare = 0.50;
  const laborShareOfGdpPct = Math.round(clamp(baseLaborShare * 100 + (policies.minimumWageIndex - 100) * 0.05 - (unemploymentRate - 6) * 0.4, 35, 68) * 10) / 10;
  const grossWageIncome = Math.round(((nominalGdp * (laborShareOfGdpPct / 100))) * 10) / 10;

  const averageNominalWageMonthly = Math.round(((grossWageIncome * 1000) / Math.max(0.1, employedTotal) / 12));
  const averageRealWageMonthly = Math.round(averageNominalWageMonthly / (gdpDeflator / 100));

  // Personal Income Tax collected (reflecting basic threshold exemption)
  const incomeTaxEffectiveRate = (policies.taxRateIncome / 100) * 0.85; // after deductions
  const exemptionThreshold = policies.taxExemptionThreshold ?? 4.0;
  const totalExemptionDeduction = (employedTotal * exemptionThreshold) / 1000;
  const taxableWageIncome = Math.max(0, grossWageIncome - totalExemptionDeduction);
  const taxRevenueIncome = Math.round((taxableWageIncome * incomeTaxEffectiveRate) * 10) / 10;

  // Social transfers received by households
  const socialTransfersReceived = Math.round(((nominalGdp * policies.budgetSocialSafetyPctGdp) / 100) * 10) / 10;

  // Disposable income
  const disposableIncomeNominal = Math.round((grossWageIncome + socialTransfersReceived - taxRevenueIncome) * 10) / 10;
  const disposableIncomeReal = Math.round((disposableIncomeNominal / (gdpDeflator / 100)) * 10) / 10;

  // Purchasing power index (reflects net disposable real income adjusted for VAT/consumption taxes)
  const baseDisposableReal = prev.economic?.households?.disposableIncomeReal || disposableIncomeReal;
  const vatCostAdjustment = 1 + (policies.taxRateVat - 15) * 0.005;
  const purchasingPowerIndex = Math.round(clamp(((disposableIncomeReal / Math.max(1, baseDisposableReal)) / Math.max(0.7, vatCostAdjustment)) * 100, 20, 200) * 10) / 10;

  // Household Savings
  const householdSavingsNominal = Math.round((disposableIncomeNominal - consumptionNominal) * 10) / 10;
  const householdSavingsRatePct = Math.round(((householdSavingsNominal / Math.max(1, disposableIncomeNominal)) * 100) * 10) / 10;

  // -------------------------------------------------------------
  // 8. FISCAL REVENUES & OUTLAYS ACCOUNTING
  // -------------------------------------------------------------
  // Corporate Tax
  const corporateProfitsBase = nominalGdp * 0.22;
  const corporateBaseElasticity = Math.max(0.7, 1 - (policies.taxRateCorporate / 100) * 0.4);
  const taxRevenueCorporate = Math.round(((corporateProfitsBase * (policies.taxRateCorporate / 100)) * corporateBaseElasticity) * 10) / 10;

  // VAT (Base = Household Consumption)
  const taxRevenueVat = Math.round(((consumptionNominal * (policies.taxRateVat / 100))) * 10) / 10;

  // Tariffs (Base = Imports)
  const importsNominal = importsReal * (gdpDeflator / 100);
  const taxRevenueTariffs = Math.round(((importsNominal * (policies.tariffRateAvg / 100))) * 10) / 10;

  // Energy & Emissions
  const fuelTargetingEfficiency = ((policies.fuelSubsidyTargetingPct ?? 25) / 100) * 0.05;
  const energyEfficiencyFactor = 1 - (policies.carbonTaxPerTon / 100) * 0.05 - fuelTargetingEfficiency;
  const primaryEnergyDemandTwh = Math.round(prev.energy.primaryEnergyDemandTwh * (1 + (realGdpGrowthRate / 100) * 0.7 * energyEfficiencyFactor));
  const carbonPriceDrive = (policies.carbonTaxPerTon / 100) * 1.5;
  const subsidyDrive = (policies.cleanEnergySubsidyPct / 100) * 1.8;
  const renewableTransitionStep = (carbonPriceDrive + subsidyDrive) * (1 - prev.energy.renewableEnergyPct / 100);
  const renewableEnergyPct = Math.round(clamp(prev.energy.renewableEnergyPct + renewableTransitionStep, 2, 98) * 10) / 10;
  const nuclearEnergyPct = prev.energy.nuclearEnergyPct;
  const fossilEnergyPct = Math.round(clamp(100 - renewableEnergyPct - nuclearEnergyPct, 0, 98) * 10) / 10;
  const fossilBurnMtoe = (primaryEnergyDemandTwh * (fossilEnergyPct / 100)) * 0.086;
  const annualCo2EmissionsMt = Math.round(fossilBurnMtoe * 2.4);
  const carbonTaxRevenue = Math.round(((annualCo2EmissionsMt * policies.carbonTaxPerTon) / 1000) * 10) / 10;
  const gridReliabilityIndex = clamp((prev.energy.gridReliabilityIndex || 85) + (infrastructureQualityIndex - 50) * 0.05 + (renewableEnergyPct > 65 ? -0.4 : 0.2), 30, 99);
  const resourceRentsDepletionPct = Math.min(100, (prev.energy.resourceRentsDepletionPct || 0) + (isResourceDependent ? 1.5 : 0.2));

  // Resource Rents
  let resourceRentsRevenue = 0;
  if (prev.macro.resourceRentsRevenue > 0) {
    const shockMultiplier = 1 + (shocks.commodityPriceShockPct / 100);
    const depletionFactor = 1 - 0.015;
    resourceRentsRevenue = Math.round(prev.macro.resourceRentsRevenue * shockMultiplier * depletionFactor * 10) / 10;
  }

  // Total Revenue (Accounting Identity)
  const totalRevenue = Math.round((
    taxRevenueIncome +
    taxRevenueCorporate +
    taxRevenueVat +
    taxRevenueTariffs +
    resourceRentsRevenue +
    carbonTaxRevenue
  ) * 10) / 10;

  // Public Expenditures Breakdown
  const expenditurePublicWages = Math.round(((nominalGdp * policies.budgetPublicWagesPctGdp) / 100) * 10) / 10;
  const expenditureHealthcare = Math.round(((nominalGdp * policies.budgetHealthcarePctGdp) / 100) * 10) / 10;
  const expenditureEducation = Math.round(((nominalGdp * policies.budgetEducationPctGdp) / 100) * 10) / 10;
  const expenditureInfrastructureCapex = Math.round(((nominalGdp * policies.budgetInfrastructurePctGdp) / 100) * 10) / 10;
  const expenditureSocialSafety = Math.round(((nominalGdp * policies.budgetSocialSafetyPctGdp) / 100) * 10) / 10;
  const expenditureDefense = Math.round(((nominalGdp * policies.budgetDefensePctGdp) / 100) * 10) / 10;

  // Sovereign 10-Year Bond Yield & Risk Spread
  const debtRatioPrev = prev.macro.debtToGdpRatio;
  const debtRiskSpread = Math.max(0, debtRatioPrev - 60) * 0.04;
  const programmaticExpenditure = expenditurePublicWages + expenditureHealthcare + expenditureEducation + expenditureInfrastructureCapex + expenditureSocialSafety + expenditureDefense;
  const inYearPrimaryDeficitRatio = Math.max(0, ((programmaticExpenditure - totalRevenue) / nominalGdp) * 100);
  const effectiveDeficitRatio = Math.max(inYearPrimaryDeficitRatio, (prev.macro.overallDeficit / prev.macro.nominalGdp) * 100);
  const deficitSpread = Math.max(0, effectiveDeficitRatio - 3) * 0.25;
  const sovereignBondYield10y = Math.round(clamp(centralBankRate + 1.2 + debtRiskSpread + deficitSpread + shocks.globalInterestRateShock, 1.0, 25.0) * 10) / 10;
  const sovereignRiskSpreadBps = Math.round((sovereignBondYield10y - centralBankRate) * 100);

  // Interest servicing outlay
  const effectiveDebtInterestRate = (prev.macro.sovereignBondYield10y + sovereignBondYield10y) / 200;
  const expenditureDebtInterest = Math.round((prev.macro.publicDebtStock * effectiveDebtInterestRate) * 10) / 10;

  // Total Outlays (Accounting Identity)
  const totalExpenditure = Math.round((
    expenditurePublicWages +
    expenditureHealthcare +
    expenditureEducation +
    expenditureInfrastructureCapex +
    expenditureSocialSafety +
    expenditureDefense +
    expenditureDebtInterest
  ) * 10) / 10;

  // Balances
  const primaryOutlays = totalExpenditure - expenditureDebtInterest;
  const primaryBalance = Math.round((totalRevenue - primaryOutlays) * 10) / 10;
  const overallBalance = Math.round((totalRevenue - totalExpenditure) * 10) / 10;
  const overallDeficit = Math.round(Math.max(0, -overallBalance) * 10) / 10;
  const primaryDeficit = Math.round(Math.max(0, -primaryBalance) * 10) / 10;
  const deficitToGdpRatio = Math.round(((overallDeficit / nominalGdp) * 100) * 10) / 10;

  // Explicit Financing Breakdown
  const financingTaxCoveredPct = Math.round(Math.min(100, (totalRevenue / Math.max(0.1, totalExpenditure)) * 100) * 10) / 10;
  const financingNewBorrowingPct = Math.round(Math.max(0, 100 - financingTaxCoveredPct) * 10) / 10;

  // Public Debt Stock Accumulation (Identity: Debt(t) = Debt(t-1) + Net Borrowing)
  const netBorrowing = overallDeficit;
  const publicDebtStock = Math.max(0, Math.round((prev.macro.publicDebtStock + netBorrowing) * 10) / 10);
  const debtToGdpRatio = Math.round(((publicDebtStock / nominalGdp) * 100) * 10) / 10;

  let debtSustainabilityStatus: 'sustainable' | 'vulnerable' | 'critical' = 'sustainable';
  if (debtToGdpRatio > 95 || deficitToGdpRatio > 7) {
    debtSustainabilityStatus = 'critical';
  } else if (debtToGdpRatio > 65 || deficitToGdpRatio > 4) {
    debtSustainabilityStatus = 'vulnerable';
  }

  // Current Account Balance & Foreign Reserves
  const exportCompetitiveness = 1 + (policies.governanceReformEffort / 100) * 0.1 - (policies.tariffRateAvg / 100) * 0.1;
  const currentAccountBalanceUsd = Math.round(((resourceRentsRevenue * 0.6) - (nominalGdp * 0.08) * (1 / exportCompetitiveness) - (expenditureDebtInterest * 0.3)) * 10) / 10;
  const currentAccountToGdpPct = Math.round(((currentAccountBalanceUsd / nominalGdp) * 100) * 10) / 10;
  const foreignReserves = Math.max(5, Math.round((prev.macro.foreignReserves + currentAccountBalanceUsd * 0.4) * 10) / 10);

  // -------------------------------------------------------------
  // 9. GOVERNANCE, INEQUALITY & SOCIAL STABILITY
  // -------------------------------------------------------------
  const taxRedistribution = (policies.taxRateIncome * 0.12 + policies.budgetSocialSafetyPctGdp * 0.35);
  const inequalityDrivers = (unemploymentRate * 0.25 + policies.taxRateVat * 0.1);
  const giniDelta = (inequalityDrivers - taxRedistribution) * 0.05;
  const giniCoefficient = Math.round(clamp(prev.governance.giniCoefficient + giniDelta, 22, 65) * 10) / 10;

  const cashCoverageBonus = ((policies.cashTransferCoveragePct ?? 40) - 40) * 0.04;
  const povertyDelta = (unemploymentDelta * 0.4 + (inflationRate - 2) * 0.15 - (policies.budgetSocialSafetyPctGdp - 4) * 0.3 - cashCoverageBonus);
  const povertyRatePct = Math.round(clamp(prev.governance.povertyRatePct + povertyDelta, 2.0, 50.0) * 10) / 10;

  const retirementAgeShift = (policies.statutoryRetirementAge - 60) * 1.5;
  const demographicAgingDrag = Math.max(0, dependencyRatio - 50) * 0.4;
  const pensionFundSolvencyPct = Math.round(clamp(prev.governance.pensionFundSolvencyPct + (retirementAgeShift - demographicAgingDrag) * 0.3, 10, 100) * 10) / 10;

  const reformSpeed = (policies.governanceReformEffort - 50) * 0.08;
  const corruptionPerceptionIndex = Math.round(clamp(prev.governance.corruptionPerceptionIndex + reformSpeed, 10, 95) * 10) / 10;
  const ruleOfLawIndex = Math.round(clamp(prev.governance.ruleOfLawIndex + reformSpeed * 0.8, 15, 96) * 10) / 10;
  const institutionalTrustIndex = Math.round(clamp((corruptionPerceptionIndex * 0.5 + ruleOfLawIndex * 0.5) - (deficitToGdpRatio > 8 ? 5 : 0), 10, 95) * 10) / 10;

  const purchasingPowerLoss = Math.max(0, 100 - purchasingPowerIndex) * 0.4;
  const inflationPressure = Math.max(0, inflationRate - (prev.macro.inflationRate || 3.5)) * 1.5;
  const povertyPressure = Math.max(0, povertyRatePct - (prev.governance.povertyRatePct || 14.0)) * 2.0;
  const trustShift = (institutionalTrustIndex - (prev.governance.institutionalTrustIndex || 45)) * 0.3;
  const tensionDelta = purchasingPowerLoss + inflationPressure + povertyPressure - trustShift;
  const socialTensionIndex = Math.round(clamp(prev.governance.socialTensionIndex + tensionDelta, 5, 98) * 10) / 10;

  // Regional updates
  const populationRatio = totalPopulation / prev.demographics.totalPopulation;
  const gdpRatio = realGdp / prev.macro.realGdp;
  const regions = (prev.regions || []).map((r) => ({
    ...r,
    populationMillions: Math.round((r.populationMillions * populationRatio) * 100) / 100,
    regionalGdpUsdBillion: Math.round((r.regionalGdpUsdBillion * gdpRatio) * 10) / 10,
    publicServiceCapacityIndex: Math.round(clamp(r.publicServiceCapacityIndex + (publicServiceCapacityIndex - prev.humanCapital.publicServiceCapacityIndex), 10, 99) * 10) / 10,
    unemploymentRatePct: Math.round(clamp(r.unemploymentRatePct + unemploymentDelta, 2, 35) * 10) / 10,
  }));

  // Full Phase 2 consistent state
  const economic: FullEconomicState = {
    nationalAccounts: {
      realGdp,
      nominalGdp,
      gdpDeflator,
      realGdpGrowthRate,
      potentialGdp,
      outputGapPct,
      consumptionHouseholdReal,
      investmentTotalReal,
      governmentConsumptionReal,
      exportsReal,
      importsReal,
      netExportsReal,
    },
    households: {
      grossWageIncome,
      socialTransfersReceived,
      disposableIncomeNominal,
      disposableIncomeReal,
      consumptionNominal,
      householdSavingsNominal,
      householdSavingsRatePct,
      purchasingPowerIndex,
    },
    laborProductivity: {
      totalPopulation,
      laborForceTotal,
      employedTotal,
      unemployedTotal,
      unemploymentRate,
      youthUnemploymentRate,
      laborProductivityPerWorker,
      averageNominalWageMonthly,
      averageRealWageMonthly,
      laborShareOfGdpPct,
    },
    pricesMonetary: {
      cpiIndex,
      inflationRate,
      expectedInflationRate,
      centralBankRate,
      taylorDesiredRate,
      realInterestRate,
      sovereignBondYield10y,
      sovereignRiskSpreadBps,
    },
    fiscal: {
      taxRevenueIncome,
      taxRevenueCorporate,
      taxRevenueVat,
      taxRevenueTariffs,
      resourceRentsRevenue,
      carbonTaxRevenue,
      totalRevenue,
      expenditurePublicWages,
      expenditureHealthcare,
      expenditureEducation,
      expenditureInfrastructureCapex,
      expenditureSocialSafety,
      expenditureDefense,
      expenditureDebtInterest,
      totalExpenditure,
      primaryBalance,
      overallBalance,
      overallDeficit,
      deficitToGdpRatio,
      financingTaxCoveredPct,
      financingNewBorrowingPct,
    },
    debt: {
      publicDebtStock,
      debtToGdpRatio,
      foreignCurrencyDebtPct: isResourceDependent ? 45.0 : 12.0,
      foreignReserves,
      debtSustainabilityStatus,
    },
    capacityTrade: {
      privateInvestmentReal,
      publicInfrastructureInvestmentReal,
      totalCapitalStockReal,
      capacityUtilizationPct,
      tradeBalanceUsd: netExportsReal,
      currentAccountBalanceUsd,
      currentAccountToGdpPct,
    },
  };

  const partialNextState: SimulationState = {
    date: { year },
    year,
    macro: {
      nominalGdp,
      realGdp,
      realGdpGrowthRate,
      inflationRate,
      centralBankRate,
      sovereignBondYield10y,
      taxRevenueIncome,
      taxRevenueCorporate,
      taxRevenueVat,
      taxRevenueTariffs,
      resourceRentsRevenue,
      totalRevenue,
      expenditurePublicWages,
      expenditureHealthcare,
      expenditureEducation,
      expenditureInfrastructure: expenditureInfrastructureCapex,
      expenditureSocialSafety,
      expenditureDefense,
      expenditureDebtInterest,
      totalExpenditure,
      primaryDeficit,
      overallDeficit,
      publicDebtStock,
      debtToGdpRatio,
      foreignReserves,
      currentAccountBalance: currentAccountBalanceUsd,
    },
    economic,
    demographics: {
      totalPopulation,
      cohortYouth: Math.round(newYouth * 1000) / 1000,
      cohortWorkingAge: Math.round(newWorking * 1000) / 1000,
      cohortElderly: Math.round(newElderly * 1000) / 1000,
      dependencyRatio,
      fertilityRate: Math.round(fertilityRate * 100) / 100,
      birthsCount,
      deathsCount,
      netMigration,
      lifeExpectancy: Math.round(lifeExpectancy * 10) / 10,
      laborForceParticipationRate: Math.round(laborForceParticipationRate * 10) / 10,
      laborForceTotal,
      employedTotal,
      unemploymentRate,
      youthUnemploymentRate,
    },
    humanCapital: {
      educationQualityIndex: Math.round(educationQualityIndex * 10) / 10,
      healthcareQualityIndex: Math.round(healthcareQualityIndex * 10) / 10,
      publicServiceCapacityIndex,
      infrastructureStock,
      infrastructureQualityIndex: Math.round(infrastructureQualityIndex * 10) / 10,
      rdIntensityPctGdp: Math.round(rdIntensityPctGdp * 100) / 100,
      totalFactorProductivity,
    },
    energy: {
      primaryEnergyDemandTwh,
      renewableEnergyPct,
      fossilEnergyPct,
      nuclearEnergyPct,
      annualCo2EmissionsMt,
      gridReliabilityIndex: Math.round(gridReliabilityIndex * 10) / 10,
      resourceRentsDepletionPct: Math.round(resourceRentsDepletionPct * 100) / 100,
    },
    governance: {
      giniCoefficient,
      povertyRatePct,
      pensionFundSolvencyPct,
      ruleOfLawIndex,
      corruptionPerceptionIndex,
      institutionalTrustIndex,
      socialTensionIndex,
    },
    regions,
  };

  const fullHistory: SimulationState[] = options.history && options.history.length > 0 ? options.history : [prev];
  const sectors = simulateNationalSectors(partialNextState, policies, shocks, fullHistory);

  return {
    ...partialNextState,
    sectors,
  };
}
