/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Modular National Sectors Engine (Phase 4)
 * محرك محاكاة القطاعات الوطنية الخمسة عشر والترابطات البينية المعقدة
 */

import {
  SimulationState,
  PolicySettings,
  ExternalShocks,
  NationalSectorsState,
  Region,
} from '../types/simulation';

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

/**
 * Computes the updated state for all 15 national sectors (A to O)
 * using the central cross-sector registry principles and time lags.
 */
export function simulateNationalSectors(
  currentBaseState: SimulationState,
  policies: PolicySettings,
  shocks: ExternalShocks,
  history: SimulationState[]
): NationalSectorsState {
  const prevSectors = currentBaseState.sectors;
  const macro = currentBaseState.macro;
  const econ = currentBaseState.economic;
  const demo = currentBaseState.demographics;
  const human = currentBaseState.humanCapital;
  const energy = currentBaseState.energy;
  const gov = currentBaseState.governance;

  // Multi-year Lag Lookups (from historical trajectory)
  const hist = history.length > 0 ? history : [currentBaseState];
  // For Education -> TFP lag (3 years)
  const state3YearsAgo = hist.length >= 4 ? hist[hist.length - 4] : hist[0];
  const eduSpend3YearsAgo = state3YearsAgo?.sectors?.educationSkills?.workforceSkillMatchIndex || 65.0;

  // For Infrastructure -> Logistics lag (2 years)
  const state2YearsAgo = hist.length >= 3 ? hist[hist.length - 3] : hist[0];
  const infraCap2YearsAgo = state2YearsAgo?.sectors?.housingInfrastructure?.constructionCapacityIndex || 68.0;

  // -------------------------------------------------------------
  // A. Economy and Production
  // -------------------------------------------------------------
  const realGdp = macro.realGdp;
  const manufacturingShare = 0.28 + (policies.budgetInfrastructurePctGdp - 4) * 0.005;
  const servicesShare = 0.58 + (policies.governanceReformEffort - 50) * 0.001;
  const manufacturingOutputUsdB = Math.round(realGdp * manufacturingShare * 10) / 10;
  const servicesOutputUsdB = Math.round(realGdp * servicesShare * 10) / 10;

  // SME Share responds to business regulation and credit conditions
  const smeShareOfOutputPct = Math.round(
    clamp(34.0 + (policies.laborMarketFlexibility - 50) * 0.08 - (macro.centralBankRate - 4) * 0.4, 20.0, 55.0) * 10
  ) / 10;

  // Supply chain friction: improved by lagged infrastructure capex, worsened by trade frictions
  const supplyChainFrictionIndex = Math.round(
    clamp(45.0 - (infraCap2YearsAgo - 60) * 0.35 + (shocks.tradeFrictionShockPct * 0.4), 10.0, 95.0) * 10
  ) / 10;

  const industrialCapacityUtilizationPct = Math.round(
    clamp(econ.capacityTrade.capacityUtilizationPct - (supplyChainFrictionIndex - 40) * 0.1, 55.0, 98.0) * 10
  ) / 10;

  const capitalGoodsImportSharePct = Math.round(
    clamp(24.0 + (macro.realGdpGrowthRate > 3 ? 2.5 : -1.0) - (policies.tariffRateAvg * 0.15), 10.0, 45.0) * 10
  ) / 10;

  const businessFormationRatePct = Math.round(
    clamp(6.5 + (policies.laborMarketFlexibility - 50) * 0.05 + (macro.realGdpGrowthRate * 0.3), 1.5, 15.0) * 10
  ) / 10;

  const economyProduction = {
    isPartiallyModeled: false as const,
    manufacturingOutputUsdB,
    servicesOutputUsdB,
    smeShareOfOutputPct,
    industrialCapacityUtilizationPct,
    supplyChainFrictionIndex,
    capitalGoodsImportSharePct,
    businessFormationRatePct,
  };

  // -------------------------------------------------------------
  // B. Agriculture and Food Security
  // -------------------------------------------------------------
  const baseArableLandM = 8.4;
  const climateSoilDegradation = (shocks.climateShockIntensity * 0.015);
  const arableLandHectaresM = Math.round(Math.max(4.0, baseArableLandM - climateSoilDegradation) * 100) / 100;

  // Water irrigation stress is driven by climate shock, water extraction, and mitigated by desalination & infra
  const desalBonus = ((policies.waterDesalinationInvestmentPct ?? 1.8) - 1.5) * 1.8;
  const waterIrrigationStressPct = Math.round(
    clamp(52.0 + (shocks.climateShockIntensity * 0.4) - (policies.budgetInfrastructurePctGdp * 0.8) - desalBonus, 15.0, 95.0) * 10
  ) / 10;

  // Input costs driven by energy prices and tariffs
  const agriculturalInputCostsIndex = Math.round(
    (100.0 + (shocks.commodityPriceShockPct * 0.3) + (policies.tariffRateAvg * 0.25) + (macro.inflationRate * 0.4)) * 10
  ) / 10;

  // Output constrained by water stress and input costs, boosted by agricultural subsidies
  const agSupportBonus = ((policies.budgetAgricultureSupportPctGdp ?? 2.5) - 2.0) * 0.05;
  const waterPenalty = Math.max(0, waterIrrigationStressPct - 60) * 0.005;
  const agriculturalOutputRealUsdB = Math.round(
    clamp((realGdp * 0.09) * (1.0 - waterPenalty + agSupportBonus) * (100 / Math.max(80, agriculturalInputCostsIndex * 0.8)), 8.0, 95.0) * 10
  ) / 10;

  const nationalFoodConsumptionUsdB = realGdp * 0.12;
  const domesticFoodSufficiencyPct = Math.round(
    clamp((agriculturalOutputRealUsdB / Math.max(1, nationalFoodConsumptionUsdB)) * 100, 30.0, 110.0) * 10
  ) / 10;

  const foodImportsUsdBillion = Math.round(
    Math.max(0.5, nationalFoodConsumptionUsdB - agriculturalOutputRealUsdB) * 10
  ) / 10;

  const foodPriceInflationPct = Math.round(
    clamp(macro.inflationRate + (100 - domesticFoodSufficiencyPct) * 0.08 + (waterIrrigationStressPct > 70 ? 2.5 : 0), -2.0, 35.0) * 10
  ) / 10;

  const agricultureFood = {
    isPartiallyModeled: false as const,
    agriculturalOutputRealUsdB,
    arableLandHectaresM,
    waterIrrigationStressPct,
    agriculturalInputCostsIndex,
    domesticFoodSufficiencyPct,
    foodImportsUsdBillion,
    foodPriceInflationPct,
  };

  // -------------------------------------------------------------
  // C. Energy and Natural Resources
  // -------------------------------------------------------------
  const domesticEnergyDemandTwh = energy.primaryEnergyDemandTwh;
  const cleanEnergySharePct = energy.renewableEnergyPct;
  const fossilFuelSharePct = energy.fossilEnergyPct;
  const totalEnergyProductionTwh = Math.round(domesticEnergyDemandTwh * (energy.resourceRentsDepletionPct < 70 ? 1.05 : 0.88));
  const powerGridCapacityGw = Math.round((domesticEnergyDemandTwh / 4.8) * 10) / 10;
  const gridReliabilityScore = energy.gridReliabilityIndex;
  const strategicFuelReserveDays = Math.round(clamp(90 - (fossilFuelSharePct > 75 ? 15 : 0) - (shocks.commodityPriceShockPct > 25 ? 20 : 0), 20, 150));
  const resourceDepletionPct = energy.resourceRentsDepletionPct;

  const energyResources = {
    isPartiallyModeled: false as const,
    totalEnergyProductionTwh,
    domesticEnergyDemandTwh,
    cleanEnergySharePct,
    fossilFuelSharePct,
    powerGridCapacityGw,
    gridReliabilityScore,
    strategicFuelReserveDays,
    resourceDepletionPct,
  };

  // -------------------------------------------------------------
  // D. Education and Skills
  // -------------------------------------------------------------
  const primarySecondaryEnrollmentPct = Math.round(clamp(92.0 + policies.budgetEducationPctGdp * 0.8, 70.0, 99.8) * 10) / 10;
  const tertiaryEnrollmentPct = Math.round(clamp(35.0 + policies.budgetEducationPctGdp * 1.5, 15.0, 75.0) * 10) / 10;
  const vocationalBonus = ((policies.vocationalTrainingInvestmentPct ?? 1.0) - 1.0) * 4.5;
  const vocationalTrainingSharePct = Math.round(clamp(25.0 + policies.laborMarketFlexibility * 0.15 + vocationalBonus, 10.0, 60.0) * 10) / 10;
  
  // Workforce skill match influenced by education spending
  const workforceSkillMatchIndex = Math.round(
    clamp(human.educationQualityIndex * 0.7 + (tertiaryEnrollmentPct * 0.2) + (vocationalTrainingSharePct * 0.1), 30.0, 95.0) * 10
  ) / 10;

  const stemGraduatesRatePct = Math.round(clamp(22.0 + (human.educationQualityIndex - 50) * 0.25, 10.0, 45.0) * 10) / 10;
  
  // Delayed TFP impact from education spending 3 years ago
  const delayedTfpImpactAccumulator = Math.round(
    clamp((eduSpend3YearsAgo - 50) * 0.0004, -0.01, 0.03) * 1000
  ) / 1000;

  const educationSkills = {
    isPartiallyModeled: false as const,
    primarySecondaryEnrollmentPct,
    tertiaryEnrollmentPct,
    vocationalTrainingSharePct,
    workforceSkillMatchIndex,
    stemGraduatesRatePct,
    delayedTfpImpactAccumulator,
  };

  // -------------------------------------------------------------
  // E. Healthcare and Public Health
  // -------------------------------------------------------------
  const hospitalBedsPer1000 = Math.round(clamp(2.8 + policies.budgetHealthcarePctGdp * 0.25, 1.2, 7.5) * 10) / 10;
  const physiciansPer1000 = Math.round(clamp(1.9 + policies.budgetHealthcarePctGdp * 0.18, 0.8, 5.2) * 10) / 10;
  const healthcareAccessCoveragePct = Math.round(clamp(78.0 + policies.budgetHealthcarePctGdp * 2.2, 45.0, 99.5) * 10) / 10;
  
  // Hospital service pressure increases during health shocks or underfunding
  const hospitalServicePressureIndex = Math.round(
    clamp(62.0 - (hospitalBedsPer1000 - 3.0) * 8.0 + (shocks.pandemicShockActive ? 30.0 : 0.0), 20.0, 99.0) * 10
  ) / 10;

  const preventableMortalityRatePer100k = Math.round(
    clamp(240 - human.healthcareQualityIndex * 1.8 + (hospitalServicePressureIndex > 80 ? 35 : 0), 60, 480)
  );

  const healthyWorkforceParticipationBonus = Math.round(
    clamp((healthcareAccessCoveragePct - 75) * 0.04, -1.5, 2.5) * 10
  ) / 10;

  const healthcareHealth = {
    isPartiallyModeled: false as const,
    hospitalBedsPer1000,
    physiciansPer1000,
    healthcareAccessCoveragePct,
    hospitalServicePressureIndex,
    preventableMortalityRatePer100k,
    healthyWorkforceParticipationBonus,
  };

  // -------------------------------------------------------------
  // F. Population and Labor
  // -------------------------------------------------------------
  const totalPopulationMillions = demo.totalPopulation;
  const youthSharePct = Math.round((demo.cohortYouth / totalPopulationMillions) * 1000) / 10;
  const workingAgeSharePct = Math.round((demo.cohortWorkingAge / totalPopulationMillions) * 1000) / 10;
  const elderlySharePct = Math.round((demo.cohortElderly / totalPopulationMillions) * 1000) / 10;
  const dependencyRatio = demo.dependencyRatio;
  const laborParticipationPct = demo.laborForceParticipationRate;
  const structuralUnemploymentPct = Math.round(clamp(5.0 + (100 - policies.laborMarketFlexibility) * 0.06, 2.5, 12.0) * 10) / 10;
  const formalEmploymentSharePct = Math.round(clamp(68.0 + (gov.ruleOfLawIndex - 50) * 0.3 - (policies.taxRateIncome * 0.2), 40.0, 92.0) * 10) / 10;

  const populationLabor = {
    isPartiallyModeled: false as const,
    totalPopulationMillions,
    youthSharePct,
    workingAgeSharePct,
    elderlySharePct,
    dependencyRatio,
    laborParticipationPct,
    structuralUnemploymentPct,
    formalEmploymentSharePct,
  };

  // -------------------------------------------------------------
  // G. Housing and Infrastructure
  // -------------------------------------------------------------
  const housingUnitsTotalMillions = Math.round((totalPopulationMillions / 3.4) * 100) / 100;
  
  // Housing price to income ratio
  const socialHousingBonus = ((policies.socialHousingAllocationPct ?? 2.0) - 1.5) * 0.25;
  const housingAffordabilityPriceToIncome = Math.round(
    clamp(5.8 + (macro.realGdpGrowthRate * 0.2) - (policies.budgetInfrastructurePctGdp * 0.15) - socialHousingBonus + (macro.inflationRate * 0.1), 3.0, 14.0) * 10
  ) / 10;

  const constructionCapacityIndex = Math.round(
    clamp(65.0 + policies.budgetInfrastructurePctGdp * 2.5, 30.0, 98.0) * 10
  ) / 10;

  const pavedRoadsNetworkKmThousands = Math.round((human.infrastructureStock * 0.14) * 10) / 10;
  const waterSanitationCoveragePct = Math.round(clamp(82.0 + human.infrastructureQualityIndex * 0.18, 50.0, 99.8) * 10) / 10;
  const infrastructureMaintenanceBacklogUsdB = Math.round(
    Math.max(1.0, (human.infrastructureStock * 0.04) * (1 - (policies.budgetInfrastructurePctGdp / 10))) * 10
  ) / 10;

  const housingInfrastructure = {
    isPartiallyModeled: false as const,
    housingUnitsTotalMillions,
    housingAffordabilityPriceToIncome,
    constructionCapacityIndex,
    pavedRoadsNetworkKmThousands,
    waterSanitationCoveragePct,
    infrastructureMaintenanceBacklogUsdB,
  };

  // -------------------------------------------------------------
  // H. Public Administration and Institutions
  // -------------------------------------------------------------
  const civilServiceBonus = ((policies.civilServiceEfficiencyProgram ?? 50) - 50) * 0.12;
  const administrativeCapacityIndex = Math.round(
    clamp(55.0 + policies.governanceReformEffort * 0.45 + civilServiceBonus, 25.0, 98.0) * 10
  ) / 10;

  const publicServiceDeliveryScore = Math.round(
    clamp((administrativeCapacityIndex * 0.5 + human.publicServiceCapacityIndex * 0.5), 20.0, 98.0) * 10
  ) / 10;

  const policyImplementationLagMonths = Math.round(
    clamp(18 - (administrativeCapacityIndex - 50) * 0.2, 4, 36)
  );

  const procurementTransparencyPct = Math.round(
    clamp(gov.ruleOfLawIndex * 0.6 + policies.governanceReformEffort * 0.4, 20.0, 98.0) * 10
  ) / 10;

  const regulatoryBurdenIndex = Math.round(
    clamp(65.0 - (policies.laborMarketFlexibility - 50) * 0.35, 20.0, 90.0) * 10
  ) / 10;

  const antiCorruptionEnforcementScore = gov.corruptionPerceptionIndex;

  const publicAdmin = {
    isPartiallyModeled: false as const,
    administrativeCapacityIndex,
    publicServiceDeliveryScore,
    policyImplementationLagMonths,
    procurementTransparencyPct,
    regulatoryBurdenIndex,
    antiCorruptionEnforcementScore,
  };

  // -------------------------------------------------------------
  // I. Politics and Public Opinion (Simplified behavioral model)
  // -------------------------------------------------------------
  const publicTrustInInstitutionsPct = gov.institutionalTrustIndex;
  const perceivedDistributionalFairnessPct = Math.round(clamp(100 - gov.giniCoefficient * 1.5, 15.0, 85.0) * 10) / 10;
  const publicServiceSatisfactionPct = publicServiceDeliveryScore;
  const reformAcceptanceIndex = Math.round(
    clamp((publicTrustInInstitutionsPct * 0.4 + perceivedDistributionalFairnessPct * 0.3 + (100 - macro.inflationRate * 2.5) * 0.3), 15.0, 90.0) * 10
  ) / 10;
  const socialCohesionScore = Math.round(clamp(100 - gov.socialTensionIndex, 5.0, 95.0) * 10) / 10;

  const politicsOpinion = {
    isPartiallyModeled: false as const,
    publicTrustInInstitutionsPct,
    perceivedDistributionalFairnessPct,
    publicServiceSatisfactionPct,
    reformAcceptanceIndex,
    socialCohesionScore,
    modelDisclaimersAr: 'نموذج سلوكي مبسط لتتبع الرضا وتوزيع المنافع، ولا يشكل تنبؤاً دقيقاً بالرأي العام أو الاستطلاعات الانتخابية.',
  };

  // -------------------------------------------------------------
  // J. Foreign Relations and Trade
  // -------------------------------------------------------------
  const totalTradeUsdB = (econ.nationalAccounts.exportsReal + econ.nationalAccounts.importsReal);
  const tradeOpennessRatioPct = Math.round(((totalTradeUsdB / macro.nominalGdp) * 100) * 10) / 10;
  const top3TradingPartnerConcentrationPct = Math.round(clamp(48.0 - (policies.tariffRateAvg * 0.2), 25.0, 75.0) * 10) / 10;
  
  const criticalImportsVulnerabilityIndex = Math.round(
    clamp(45.0 + (100 - domesticFoodSufficiencyPct) * 0.3 + (fossilFuelSharePct * 0.2) + (shocks.tradeFrictionShockPct * 0.3), 15.0, 95.0) * 10
  ) / 10;

  const fdiNetInflowUsdB = Math.round(
    clamp((realGdp * 0.035) * (gov.ruleOfLawIndex / 50) * (1 - policies.taxRateCorporate / 100), 0.2, 25.0) * 10
  ) / 10;

  const diplomaticStabilityIndex = Math.round(clamp(75.0 - (shocks.tradeFrictionShockPct * 0.3), 20.0, 95.0) * 10) / 10;
  const termsOfTradeIndex = Math.round(clamp(100.0 + (shocks.commodityPriceShockPct * 0.35) - (macro.inflationRate * 0.2), 65.0, 150.0) * 10) / 10;

  const foreignTrade = {
    isPartiallyModeled: false as const,
    tradeOpennessRatioPct,
    top3TradingPartnerConcentrationPct,
    criticalImportsVulnerabilityIndex,
    foreignDirectInvestmentNetUsdB: fdiNetInflowUsdB,
    diplomaticStabilityIndex,
    termsOfTradeIndex,
  };

  // -------------------------------------------------------------
  // K. Environment and Climate
  // -------------------------------------------------------------
  const annualCo2EmissionsMt = energy.annualCo2EmissionsMt;
  const ambientAirQualityIndexAqi = Math.round(clamp(45.0 + (fossilFuelSharePct * 0.55) + (manufacturingOutputUsdB / realGdp * 50), 20.0, 220.0));
  const freshwaterWithdrawalStressPct = waterIrrigationStressPct;
  const forestCoveragePct = Math.round(clamp(21.0 - (shocks.climateShockIntensity * 0.04), 5.0, 65.0) * 10) / 10;
  const climateVulnerabilityScore = Math.round(clamp(35.0 + (shocks.climateShockIntensity * 0.5) - (policies.cleanEnergySubsidyPct * 0.2), 10.0, 90.0) * 10) / 10;

  const environmentClimate = {
    isPartiallyModeled: false as const,
    annualCo2EmissionsMt,
    ambientAirQualityIndexAqi,
    freshwaterWithdrawalStressPct,
    forestCoveragePct,
    climateVulnerabilityScore,
  };

  // -------------------------------------------------------------
  // L. Justice and Public Safety
  // -------------------------------------------------------------
  const courtCaseProcessingDaysAvg = Math.round(clamp(280 - (gov.ruleOfLawIndex - 50) * 3.5, 60, 600));
  const judicialIndependenceIndex = Math.round(clamp(gov.ruleOfLawIndex * 0.95, 20.0, 98.0) * 10) / 10;
  const policeStaffingPer100k = Math.round(clamp(260 + (policies.budgetDefensePctGdp * 15), 120, 550));
  const publicSafetyIndex = Math.round(clamp(78.0 - (gov.socialTensionIndex * 0.25) + (policeStaffingPer100k / 20), 30.0, 98.0) * 10) / 10;
  const legalAidAccessPct = Math.round(clamp(45.0 + (policies.budgetSocialSafetyPctGdp * 2.5), 15.0, 95.0) * 10) / 10;

  const justiceSafety = {
    isPartiallyModeled: false as const,
    courtCaseProcessingDaysAvg,
    judicialIndependenceIndex,
    policeStaffingPer100k,
    publicSafetyIndex,
    legalAidAccessPct,
  };

  // -------------------------------------------------------------
  // M. Digital Systems and Cybersecurity
  // -------------------------------------------------------------
  const broadbandHighSpeedPenetrationPct = Math.round(clamp(65.0 + (human.infrastructureQualityIndex * 0.35), 25.0, 99.0) * 10) / 10;
  const digitalGovServicesAdoptionPct = Math.round(clamp(50.0 + (administrativeCapacityIndex * 0.45), 15.0, 95.0) * 10) / 10;
  const digitalEconomyShareOfGdpPct = Math.round(clamp(7.5 + (broadbandHighSpeedPenetrationPct * 0.08), 2.0, 25.0) * 10) / 10;
  const telecomGridResilienceScore = Math.round(clamp(72.0 + (policies.budgetInfrastructurePctGdp * 1.5), 30.0, 98.0) * 10) / 10;
  const cyberThreatVulnerabilityScore = Math.round(clamp(52.0 - (administrativeCapacityIndex * 0.25) + (broadbandHighSpeedPenetrationPct * 0.15), 15.0, 90.0) * 10) / 10;

  const digitalCyber = {
    isPartiallyModeled: false as const,
    broadbandHighSpeedPenetrationPct,
    digitalGovServicesAdoptionPct,
    digitalEconomyShareOfGdpPct,
    telecomGridResilienceScore,
    cyberThreatVulnerabilityScore,
  };

  // -------------------------------------------------------------
  // N. Culture, Tourism, and Sport
  // -------------------------------------------------------------
  const baseArrivalsM = 6.5;
  const safetyFactor = publicSafetyIndex / 75;
  const annualTouristArrivalsMillions = Math.round(
    Math.max(0.5, baseArrivalsM * safetyFactor * (1 - (shocks.pandemicShockActive ? 0.75 : 0))) * 100
  ) / 100;

  const tourismReceiptsUsdBillion = Math.round(annualTouristArrivalsMillions * 1.15 * 10) / 10;
  const tourismShareOfGdpPct = Math.round(((tourismReceiptsUsdBillion / macro.nominalGdp) * 100) * 10) / 10;
  const culturalHeritageFundingPctGdp = 0.45;
  const sportsPublicParticipationPct = Math.round(clamp(32.0 + (human.healthcareQualityIndex * 0.2), 10.0, 75.0) * 10) / 10;

  const cultureTourism = {
    isPartiallyModeled: false as const,
    annualTouristArrivalsMillions,
    tourismReceiptsUsdBillion,
    tourismShareOfGdpPct,
    tourismEmploymentSharePct: Math.round(clamp(tourismShareOfGdpPct * 0.9, 1.5, 15.0) * 10) / 10,
    culturalHeritageFundingPctGdp,
    sportsPublicParticipationPct,
  };

  // -------------------------------------------------------------
  // O. National Resilience and Defense (Aggregate, Non-Operational)
  // -------------------------------------------------------------
  const supplySecurityReserveMonths = Math.round(
    clamp((strategicFuelReserveDays / 30) * 0.5 + (domesticFoodSufficiencyPct / 100) * 3.5, 1.0, 12.0) * 10
  ) / 10;

  const civilPreparednessIndex = Math.round(
    clamp((administrativeCapacityIndex * 0.4 + publicSafetyIndex * 0.4 + gridReliabilityScore * 0.2), 25.0, 98.0) * 10
  ) / 10;

  const criticalInfraProtectionScore = Math.round(
    clamp((telecomGridResilienceScore * 0.5 + constructionCapacityIndex * 0.5), 25.0, 98.0) * 10
  ) / 10;

  const strategicResilienceIndex = Math.round(
    clamp((civilPreparednessIndex * 0.35 + criticalInfraProtectionScore * 0.35 + supplySecurityReserveMonths * 5), 20.0, 98.0) * 10
  ) / 10;

  const defenseOutlaysShareOfGdpPct = policies.budgetDefensePctGdp;

  const resilienceDefense = {
    isPartiallyModeled: false as const,
    strategicResilienceIndex,
    supplySecurityReserveMonths,
    civilPreparednessIndex,
    criticalInfraProtectionScore,
    defenseOutlaysShareOfGdpPct,
    nonOperationalNoticeAr: 'مؤشرات أمان ومخزون استراتيجي كلية غير تشغيلية، ولا تتضمن أي تعليمات أو أهداف تكتيكية أو تعبوية.',
  };

  return {
    economyProduction,
    agricultureFood,
    energyResources,
    educationSkills,
    healthcareHealth,
    populationLabor,
    housingInfrastructure,
    publicAdmin,
    politicsOpinion,
    foreignTrade,
    environmentClimate,
    justiceSafety,
    digitalCyber,
    cultureTourism,
    resilienceDefense,
  };
}
