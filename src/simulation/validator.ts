/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Invariant Validation & Automated Testing Suite
 * فاحص المتطابقات الرياضية والمحددات المحاسبية والسلوكية والجهوية
 */

import { SimulationState, InvariantTestResult } from '../types/simulation';

export function runValidationSuite(currentState: SimulationState, previousState?: SimulationState): InvariantTestResult[] {
  const results: InvariantTestResult[] = [];
  const tolerance = 0.25; // Tolerance for floating point rounding

  // 1. Deficit Accounting Identity
  const calculatedDeficit = currentState.macro.totalExpenditure - currentState.macro.totalRevenue;
  const recordedDeficit = currentState.macro.overallDeficit;
  const deficitDelta = Math.abs(calculatedDeficit - recordedDeficit);
  results.push({
    id: 'TEST_INV_DEFICIT',
    nameAr: 'متطابقة عجز الميزانية العامة (المصروفات - الإيرادات)',
    nameEn: 'Budget Deficit Accounting Identity (Outlays - Revenues)',
    category: 'accounting_identity',
    passed: deficitDelta <= tolerance,
    actualDelta: Math.round(deficitDelta * 1000) / 1000,
    tolerance,
    detailsAr: `المحسوب: ${calculatedDeficit.toFixed(2)} $B، المسجل: ${recordedDeficit.toFixed(2)} $B، الفارق: ${deficitDelta.toFixed(3)} $B`,
    detailsEn: `Calculated: ${calculatedDeficit.toFixed(2)} $B, Recorded: ${recordedDeficit.toFixed(2)} $B, Delta: ${deficitDelta.toFixed(3)} $B`,
  });

  // 2. Debt Accumulation Flow Identity (if previous state exists)
  if (previousState) {
    const expectedDebt = previousState.macro.publicDebtStock + recordedDeficit;
    const actualDebt = currentState.macro.publicDebtStock;
    const debtDelta = Math.abs(expectedDebt - actualDebt);
    results.push({
      id: 'TEST_INV_DEBT_FLOW',
      nameAr: 'متطابقة تراكم رصيد الدين العام مع تدفق العجز السنوي',
      nameEn: 'Public Debt Flow Identity (Debt(t-1) + Deficit(t))',
      category: 'accounting_identity',
      passed: debtDelta <= tolerance,
      actualDelta: Math.round(debtDelta * 1000) / 1000,
      tolerance,
      detailsAr: `المتوقع: ${expectedDebt.toFixed(2)} $B، الفعلي: ${actualDebt.toFixed(2)} $B، الفارق: ${debtDelta.toFixed(3)} $B`,
      detailsEn: `Expected: ${expectedDebt.toFixed(2)} $B, Actual: ${actualDebt.toFixed(2)} $B, Delta: ${debtDelta.toFixed(3)} $B`,
    });
  }

  // 3. Demographic Cohort Sum Identity
  const sumCohorts = currentState.demographics.cohortYouth + currentState.demographics.cohortWorkingAge + currentState.demographics.cohortElderly;
  const recordedTotalPop = currentState.demographics.totalPopulation;
  const popDelta = Math.abs(sumCohorts - recordedTotalPop);
  results.push({
    id: 'TEST_INV_POPULATION',
    nameAr: 'تطابق مجموع الفئات العمرية السكانية مع إجمالي السكان',
    nameEn: 'Demographic Cohorts Sum Conservation Law',
    category: 'demographic_flow',
    passed: popDelta <= tolerance,
    actualDelta: Math.round(popDelta * 1000) / 1000,
    tolerance,
    detailsAr: `مجموع الفئات: ${sumCohorts.toFixed(3)} مليون، المسجل: ${recordedTotalPop.toFixed(3)} مليون`,
    detailsEn: `Sum of cohorts: ${sumCohorts.toFixed(3)} M, Recorded: ${recordedTotalPop.toFixed(3)} M`,
  });

  // 4. Employment Accounting Identity
  const laborForce = currentState.demographics.laborForceTotal;
  const employed = currentState.demographics.employedTotal;
  const unemployed = Math.round((laborForce * (currentState.demographics.unemploymentRate / 100)) * 100) / 100;
  const employmentDelta = Math.abs((employed + unemployed) - laborForce);
  results.push({
    id: 'TEST_INV_EMPLOYMENT',
    nameAr: 'تطابق مجموع المشتغلين والمتعطلين مع حجم القوى العاملة',
    nameEn: 'Employment & Labor Force Conservation (Employed + Unemployed = Labor Force)',
    category: 'accounting_identity',
    passed: employmentDelta <= 0.35,
    actualDelta: Math.round(employmentDelta * 1000) / 1000,
    tolerance: 0.35,
    detailsAr: `المشتغلون: ${employed.toFixed(2)} M + العاطلون: ${unemployed.toFixed(2)} M = ${(employed + unemployed).toFixed(2)} M (القوى العاملة: ${laborForce.toFixed(2)} M)`,
    detailsEn: `Employed: ${employed.toFixed(2)} M + Unemployed: ${unemployed.toFixed(2)} M = ${(employed + unemployed).toFixed(2)} M (Labor Force: ${laborForce.toFixed(2)} M)`,
  });

  // 5. Regional Population Conservation Identity (if regions exist)
  if (currentState.regions && currentState.regions.length > 0) {
    const regionalPopSum = currentState.regions.reduce((acc, r) => acc + r.populationMillions, 0);
    const regionalPopDelta = Math.abs(regionalPopSum - recordedTotalPop);
    results.push({
      id: 'TEST_INV_REGIONAL_POP',
      nameAr: 'تطابق مجموع سكان الأقاليم مع إجمالي السكان الوطني',
      nameEn: 'Regional Population Distribution Conservation Law',
      category: 'demographic_flow',
      passed: regionalPopDelta <= 0.5,
      actualDelta: Math.round(regionalPopDelta * 1000) / 1000,
      tolerance: 0.5,
      detailsAr: `مجموع سكان الأقاليم: ${regionalPopSum.toFixed(2)} M، الإجمالي الوطني: ${recordedTotalPop.toFixed(2)} M`,
      detailsEn: `Regional Sum: ${regionalPopSum.toFixed(2)} M, National Total: ${recordedTotalPop.toFixed(2)} M`,
    });
  }

  // 6. Energy Balance Sum Identity
  const energySum = currentState.energy.renewableEnergyPct + currentState.energy.fossilEnergyPct + currentState.energy.nuclearEnergyPct;
  const energyDelta = Math.abs(energySum - 100.0);
  results.push({
    id: 'TEST_INV_ENERGY_SUM',
    nameAr: 'اكتمال ميزان مزيج الطاقة الكلي (100%)',
    nameEn: 'Total Primary Energy Mix Completeness (100%)',
    category: 'boundary_constraint',
    passed: energyDelta <= tolerance,
    actualDelta: Math.round(energyDelta * 1000) / 1000,
    tolerance,
    detailsAr: `مجموع الحصص: ${energySum.toFixed(2)}% (الانحراف: ${energyDelta.toFixed(2)}%)`,
    detailsEn: `Sum of shares: ${energySum.toFixed(2)}% (Delta: ${energyDelta.toFixed(2)}%)`,
  });

  // 7. Non-Negativity & Bounded Domain Constraints
  const boundsViolations: string[] = [];
  if (currentState.macro.realGdp <= 0) boundsViolations.push('Real GDP <= 0');
  if (currentState.demographics.unemploymentRate < 0 || currentState.demographics.unemploymentRate > 100) boundsViolations.push('Unemployment rate out of [0, 100]');
  if (currentState.governance.giniCoefficient < 0 || currentState.governance.giniCoefficient > 100) boundsViolations.push('Gini out of [0, 100]');
  if (currentState.energy.renewableEnergyPct < 0 || currentState.energy.renewableEnergyPct > 100) boundsViolations.push('Renewable share out of [0, 100]');
  if (currentState.humanCapital.publicServiceCapacityIndex < 0 || currentState.humanCapital.publicServiceCapacityIndex > 100) boundsViolations.push('Public service capacity out of [0, 100]');

  results.push({
    id: 'TEST_INV_NON_NEGATIVE',
    nameAr: 'حدود المجالات الفيزيائية والواقعية (اللاتناقص والنسب المئوية)',
    nameEn: 'Physical & Logical Boundary Invariants (Non-negativity)',
    category: 'boundary_constraint',
    passed: boundsViolations.length === 0,
    actualDelta: boundsViolations.length,
    tolerance: 0,
    detailsAr: boundsViolations.length === 0 ? 'كافة المتغيرات ضمن نطاقاتها الفيزيائية والاقتصادية السليمة.' : `انتهاك في: ${boundsViolations.join(', ')}`,
    detailsEn: boundsViolations.length === 0 ? 'All variables strictly within valid physical and economic bounds.' : `Violations in: ${boundsViolations.join(', ')}`,
  });

  return results;
}
