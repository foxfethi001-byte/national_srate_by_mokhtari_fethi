/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Adversarial Audit Runner (Phases 1-6 Critical Verification)
 * تدقيق اختباري هجومي ومستقل: لا مدح، لا فبركة، فحص الحدود والتناقضات الفعلية
 */

import {
  archetypeResourceExporter,
  archetypeAdvancedIndustrial,
  defaultExternalShocks,
} from './archetypes';
import { simulateNextYear } from './engine';
import { applyCrisisToState, ARCHETYPE_CRISES } from './crisisEngine';
import { evaluatePlanFeasibility } from './strategicPlanning';
import { PolicySettings, ExternalShocks, SimulationState } from '../types/simulation';
import { CrisisEvent, StrategicPlan } from '../types/planning';

export interface AdversarialAuditResult {
  testNumber: number;
  titleAr: string;
  titleEn: string;
  initialStateSummary: string;
  parametersChanged: string;
  modelRulesInvolved: string;
  resultingIndicators: Record<string, any>;
  scientificLimitations: string;
  passed: boolean;
  notes: string;
}

export function runAdversarialAudit(): AdversarialAuditResult[] {
  const auditResults: AdversarialAuditResult[] = [];
  const baseResource = archetypeResourceExporter.initialState;
  const policiesResource = archetypeResourceExporter.defaultPolicies;
  const zeroShocks: ExternalShocks = { ...defaultExternalShocks };

  // =========================================================================
  // Test 1: Policy that improves one indicator while worsening another (Trade-off)
  // =========================================================================
  {
    // Policy: Sharp hike in Corporate Income Tax (15% -> 35%)
    const modifiedPolicies: PolicySettings = {
      ...policiesResource,
      taxRateCorporate: 35,
    };
    const nextState = simulateNextYear(baseResource, modifiedPolicies, zeroShocks);
    const baselineNext = simulateNextYear(baseResource, policiesResource, zeroShocks);

    const corporateTaxRevBaseline = baselineNext.economic.fiscal.taxRevenueCorporate;
    const corporateTaxRevNew = nextState.economic.fiscal.taxRevenueCorporate;
    const privateInvBaseline = baselineNext.economic.capacityTrade.privateInvestmentReal;
    const privateInvNew = nextState.economic.capacityTrade.privateInvestmentReal;

    const improvesRevenue = corporateTaxRevNew > corporateTaxRevBaseline;
    const worsensPrivateInvestment = privateInvNew < privateInvBaseline;
    const passed = improvesRevenue && worsensPrivateInvestment;

    auditResults.push({
      testNumber: 1,
      titleAr: 'سياسة تحسن مؤشراً وتدهور آخر (المقايضة الضريبية/الاستثمارية)',
      titleEn: 'Policy Improving One Metric While Worsening Another (Tax vs Investment)',
      initialStateSummary: `GDP=$${baseResource.macro.realGdp}B, CorporateTax=${policiesResource.taxRateCorporate}%, PrivateInv=$${baseResource.economic.capacityTrade.privateInvestmentReal}B`,
      parametersChanged: 'taxRateCorporate: 15% -> 35%',
      modelRulesInvolved: 'ضريبة الشركات ترفع الحصيلة (Tax Revenue) بينما مرونة الاستثمار الخاص (-0.008 فوق 20%) تقلص تكوين رأس المال.',
      resultingIndicators: {
        corporateTaxRevenue: { baseline: corporateTaxRevBaseline, afterPolicy: corporateTaxRevNew, delta: corporateTaxRevNew - corporateTaxRevBaseline },
        privateInvestment: { baseline: privateInvBaseline, afterPolicy: privateInvNew, delta: privateInvNew - privateInvBaseline },
        overallDeficit: { baseline: baselineNext.macro.overallDeficit, afterPolicy: nextState.macro.overallDeficit },
      },
      scientificLimitations: 'النموذج يفترض استجابة استثمارية خطية لضرائب الشركات؛ لا يحاكي تدفقات الملاذات الضريبية الدولية الدقيقة.',
      passed,
      notes: passed ? 'المقايضة محققة فعلياً: زيادة الإيرادات الضريبية مقابل انكماش الاستثمار الخاص.' : 'فشل رصد المقايضة.',
    });
  }

  // =========================================================================
  // Test 2: Policy that increases expenditure without sufficient financing
  // =========================================================================
  {
    // Policy: Doubling public payroll and infrastructure without matching revenues
    const unfundedPolicies: PolicySettings = {
      ...policiesResource,
      budgetPublicWagesPctGdp: 20.0,
      budgetInfrastructurePctGdp: 14.0,
    };
    const nextState = simulateNextYear(baseResource, unfundedPolicies, zeroShocks);
    const baselineNext = simulateNextYear(baseResource, policiesResource, zeroShocks);

    const outlaysJump = nextState.macro.totalExpenditure - baselineNext.macro.totalExpenditure;
    const deficitJump = nextState.macro.overallDeficit - baselineNext.macro.overallDeficit;
    const debtRatioJump = nextState.macro.debtToGdpRatio - baselineNext.macro.debtToGdpRatio;
    const bondYieldJump = nextState.macro.sovereignBondYield10y - baselineNext.macro.sovereignBondYield10y;

    const passed = outlaysJump > 20 && deficitJump > 15 && debtRatioJump > 5 && bondYieldJump > 0;

    auditResults.push({
      testNumber: 2,
      titleAr: 'سياسة توسع الإنفاق دون تمويل كافٍ (العجز وتراكم الدين السيادي)',
      titleEn: 'Unfunded Expenditure Expansion (Fiscal Deficit & Sovereign Debt Run-up)',
      initialStateSummary: `Expenditure=$${baseResource.macro.totalExpenditure}B, Deficit=$${baseResource.macro.overallDeficit}B, DebtRatio=${baseResource.macro.debtToGdpRatio}%`,
      parametersChanged: 'budgetPublicWagesPctGdp: 12% -> 20%, budgetInfrastructurePctGdp: 6.5% -> 14%',
      modelRulesInvolved: 'متطابقة الإنفاق الكلي والعجز: الديون تتراكم تلقائياً، وعلاوة مخاطر السندات تتسع مع ارتفاع نسبة العجز والدين.',
      resultingIndicators: {
        totalExpenditure: { baseline: baselineNext.macro.totalExpenditure, afterPolicy: nextState.macro.totalExpenditure, delta: outlaysJump },
        overallDeficit: { baseline: baselineNext.macro.overallDeficit, afterPolicy: nextState.macro.overallDeficit, delta: deficitJump },
        debtToGdpRatio: { baseline: baselineNext.macro.debtToGdpRatio, afterPolicy: nextState.macro.debtToGdpRatio, delta: debtRatioJump },
        sovereignBondYield10y: { baseline: baselineNext.macro.sovereignBondYield10y, afterPolicy: nextState.macro.sovereignBondYield10y, delta: bondYieldJump },
      },
      scientificLimitations: 'لا يحاكي النموذج التخلف الصريح عن السداد (Sovereign Default) بل يرفع علاوة المخاطر وسعر الفائدة.',
      passed,
      notes: passed ? 'النظام كشف العجز بدقة: تفاقم الدين وارتفاع عوائد السندات دون اختلاق أموال وهمية.' : 'فشل كشف العجز غير الممول.',
    });
  }

  // =========================================================================
  // Test 3: Policy whose benefits are delayed (Structural multi-year lag)
  // =========================================================================
  {
    // Policy: Doubling education spending (5% -> 11%)
    const highEduPolicies: PolicySettings = {
      ...policiesResource,
      budgetEducationPctGdp: 11.0,
    };
    // Step 1: Immediate next year
    const stateYear1 = simulateNextYear(baseResource, highEduPolicies, zeroShocks);
    const baselineYear1 = simulateNextYear(baseResource, policiesResource, zeroShocks);

    // Advance 4 years
    let trajEdu = stateYear1;
    let trajBase = baselineYear1;
    for (let yr = 0; yr < 3; yr++) {
      trajEdu = simulateNextYear(trajEdu, highEduPolicies, zeroShocks);
      trajBase = simulateNextYear(trajBase, policiesResource, zeroShocks);
    }

    const year1GdpDiff = stateYear1.macro.realGdp - baselineYear1.macro.realGdp;
    const year4TfpDiff = trajEdu.humanCapital.totalFactorProductivity - trajBase.humanCapital.totalFactorProductivity;
    const year4QualityDiff = trajEdu.humanCapital.educationQualityIndex - trajBase.humanCapital.educationQualityIndex;

    const isDelayed = Math.abs(year1GdpDiff) < 3.0 && year4TfpDiff > 0.5 && year4QualityDiff > 5.0;
    const passed = isDelayed;

    auditResults.push({
      testNumber: 3,
      titleAr: 'سياسة تظهر منافعها بتأخير زمني هيكلي (الاستثمار في رأس المال البشري)',
      titleEn: 'Policy With Delayed Structural Benefits (Human Capital Lag)',
      initialStateSummary: `EducationBudget=${policiesResource.budgetEducationPctGdp}%, EducationQuality=${baseResource.humanCapital.educationQualityIndex}, TFP=${baseResource.humanCapital.totalFactorProductivity}`,
      parametersChanged: 'budgetEducationPctGdp: 5% -> 11%',
      modelRulesInvolved: 'الإبطاء الزمني للتعليم: الاستثمار في المدارس يستغرق 3-7 سنوات لترقية جودة المهارات والإنتاجية الكلية TFP.',
      resultingIndicators: {
        year1RealGdpDiff: year1GdpDiff,
        year4EducationQualityIndexDiff: year4QualityDiff,
        year4TotalFactorProductivityDiff: year4TfpDiff,
      },
      scientificLimitations: 'فترة التأخير مقدرة بـ 3 سنوات عبر محاكي التراكم الزمني، بينما قد تمتد واقعياً لعقد كامل حتى دخول الخريجين سوق العمل.',
      passed,
      notes: passed ? 'المنافع لم تظهر فوراً في السنة الأولى، وبدأت بالظهور في السنوات اللاحقة عبر نمو TFP.' : 'فشل تمثيل التأخير الزمني.',
    });
  }

  // =========================================================================
  // Test 4: Policy that produces little or no effect under current model assumptions
  // =========================================================================
  {
    // Policy: Raising retirement age in a young demographic economy (Resource Exporter)
    // Elderly cohort is only 6% of population, so shifting retirement age 60 -> 65 has minimal aggregate output impact
    const youngState = baseResource; // 6% elderly
    const modifiedPolicies: PolicySettings = {
      ...policiesResource,
      statutoryRetirementAge: 65,
    };
    const nextState = simulateNextYear(youngState, modifiedPolicies, zeroShocks);
    const baselineNext = simulateNextYear(youngState, policiesResource, zeroShocks);

    const gdpShift = Math.abs(nextState.macro.realGdp - baselineNext.macro.realGdp);
    const laborParticipationShift = Math.abs(nextState.demographics.laborForceParticipationRate - baselineNext.demographics.laborForceParticipationRate);

    // Should be very small (< 1.5% shift on GDP)
    const passed = gdpShift < 3.0 && laborParticipationShift < 1.0;

    auditResults.push({
      testNumber: 4,
      titleAr: 'سياسة ذات أثر شبه منعدم في ظل هيكل ديموغرافي فتي',
      titleEn: 'Policy Producing Little Effect Under Demographic Assumptions',
      initialStateSummary: `ElderlyShare=6.0%, MedianAge=Young, RetirementAge=60`,
      parametersChanged: 'statutoryRetirementAge: 60 -> 65',
      modelRulesInvolved: 'رفع سن التقاعد في مجتمع فتي لا يوسع القوى العاملة بشكل ملموس نظراً لضآلة حجم الفئة المسنة (6%).',
      resultingIndicators: {
        laborForceParticipationShiftPct: laborParticipationShift,
        gdpShiftUsdBillion: gdpShift,
        pensionSolvencyShift: nextState.governance.pensionFundSolvencyPct - baselineNext.governance.pensionFundSolvencyPct,
      },
      scientificLimitations: 'النموذج لا يفصل بين قطاعات التقاعد المبكر في المهن الشاقة مقابل المهن المكتبية.',
      passed,
      notes: passed ? 'النتيجة واقعية: رفع سن التقاعد لم يحدث فارقاً جوهرياً في دولة فتية تهيمن عليها الفئات الشابة.' : 'أظهر النموذج أثراً مصطنعاً كبيراً غير مبرر.',
    });
  }

  // =========================================================================
  // Test 5: Policy whose apparent benefit disappears when an uncertain parameter changes
  // =========================================================================
  {
    // Policy: Infrastructure investment push (6.5% -> 12%)
    // Under baseline governance (45%): positive capex accumulation
    // Under corrupt/failed governance (reform effort: 10%): efficiency drops, capex wasted in leakage
    const cleanPushPolicies: PolicySettings = {
      ...policiesResource,
      budgetInfrastructurePctGdp: 12.0,
      governanceReformEffort: 75,
    };
    const corruptPushPolicies: PolicySettings = {
      ...policiesResource,
      budgetInfrastructurePctGdp: 12.0,
      governanceReformEffort: 10,
    };

    let cleanNext = baseResource;
    let corruptNext = baseResource;
    for (let yr = 0; yr < 3; yr++) {
      cleanNext = simulateNextYear(cleanNext, cleanPushPolicies, zeroShocks);
      corruptNext = simulateNextYear(corruptNext, corruptPushPolicies, zeroShocks);
    }

    const cleanQuality = cleanNext.humanCapital.infrastructureQualityIndex;
    const corruptQuality = corruptNext.humanCapital.infrastructureQualityIndex;
    const qualityGap = Math.round((cleanQuality - corruptQuality) * 10) / 10;

    const passed = qualityGap >= 4.0;

    auditResults.push({
      testNumber: 5,
      titleAr: 'سياسة تتلاشى جدواها عند تدهور معامل حاسم (كفاءة الحوكمة والفساد)',
      titleEn: 'Policy Benefit Vanishing Under Adverse Parameter State (Governance Leakage)',
      initialStateSummary: `InfrastructureStock=$${baseResource.humanCapital.infrastructureStock}B, Quality=${baseResource.humanCapital.infrastructureQualityIndex}`,
      parametersChanged: 'budgetInfrastructurePctGdp: 12%, governanceReformEffort: 75 vs 10',
      modelRulesInvolved: 'معامل كفاءة تنفيذ المشاريع: الإنفاق الرأسمالي الفعلي = الإنفاق الاسمي * (0.75 + 0.35 * الحوكمة / 100). ضعف الحوكمة يرفع التكاليف دون إضافة طاقة إنتاجية.',
      resultingIndicators: {
        highGovernanceQualityIndex: cleanQuality,
        lowGovernanceQualityIndex: corruptQuality,
        qualityGap: qualityGap,
        lowGovernanceDeficit: corruptNext.macro.overallDeficit,
      },
      scientificLimitations: 'النموذج يمثل التسرب المالي بدالة كفاءة استثمارية كلية وليس بعقود مشتريات فردية.',
      passed,
      notes: passed ? 'المنافع الاستثمارية تلاشت وتبددت في الميزانية عندما كان معامل الحوكمة رديئاً.' : 'فشل اختبار تلاشي المنفعة.',
    });
  }

  // =========================================================================
  // Test 6: A crisis that propagates across sectors
  // =========================================================================
  {
    // Crisis: Severe Agricultural Drought & Water Crisis (severity: 75%)
    const droughtCrisis: CrisisEvent = {
      ...ARCHETYPE_CRISES.find((c) => c.id === 'crisis_drought_water')!,
      isActive: true,
      severityPct: 75,
    };
    const stateUnderCrisis = applyCrisisToState(baseResource, [droughtCrisis]);

    const gdpDrop = stateUnderCrisis.macro.realGdp < baseResource.macro.realGdp;
    const inflationSurge = stateUnderCrisis.macro.inflationRate > baseResource.macro.inflationRate;
    const unemploymentSurge = stateUnderCrisis.demographics.unemploymentRate > baseResource.demographics.unemploymentRate;
    const povertySurge = stateUnderCrisis.governance.povertyRatePct > baseResource.governance.povertyRatePct;

    const passed = gdpDrop && inflationSurge && unemploymentSurge && povertySurge;

    auditResults.push({
      testNumber: 6,
      titleAr: 'أزمة تنتشر عبر قطاعات متعددة (أزمة الجفاف الحاد وشح المياه)',
      titleEn: 'Cross-Sector Crisis Propagation (Severe Agricultural Drought & Water Shock)',
      initialStateSummary: `GDP=$${baseResource.macro.realGdp}B, Inflation=${baseResource.macro.inflationRate}%, Unemployment=${baseResource.demographics.unemploymentRate}%, Poverty=${baseResource.governance.povertyRatePct}%`,
      parametersChanged: 'crisis: crisis_drought_water, severityPct: 75%',
      modelRulesInvolved: 'قواعد انتشار أزمة الجفاف: شح المياه -> انكماش الناتج الزراعي والكلي -> قفزة التضخم الغذائي -> تسريح العمالة الريفية -> اتساع رقعة الفقر.',
      resultingIndicators: {
        realGdp: { before: baseResource.macro.realGdp, after: Math.round(stateUnderCrisis.macro.realGdp * 10) / 10 },
        inflationRate: { before: baseResource.macro.inflationRate, after: Math.round(stateUnderCrisis.macro.inflationRate * 10) / 10 },
        unemploymentRate: { before: baseResource.demographics.unemploymentRate, after: Math.round(stateUnderCrisis.demographics.unemploymentRate * 10) / 10 },
        povertyRatePct: { before: baseResource.governance.povertyRatePct, after: Math.round(stateUnderCrisis.governance.povertyRatePct * 10) / 10 },
      },
      scientificLimitations: 'النموذج يعامل انكماش الناتج وتضخم الأسعار بدوال استجابة متزامنة؛ واقعياً قد يتأخر أثر الأسعار بضعة أشهر حسب المخزون الاستراتيجي للحبوب.',
      passed,
      notes: passed ? 'الصدمة انتشرت عضوياً من قطاع الموارد المائية إلى الاقتصاد الكلي وسوق العمل ثم شبكة الرفاه الاجتماعي.' : 'فشل انتشار الأزمة بين القطاعات.',
    });
  }

  // =========================================================================
  // Test 7: Missing data scenario with explicit uncertainty acknowledgement
  // =========================================================================
  {
    // Strategic Plan with missing dependency data and unfeasible compressed horizon
    const planWithMissingData: StrategicPlan = {
      id: 'plan_missing_data_test',
      nameAr: 'خطة التحول الصناعي ذات الاعتماديات الناقصة والبيانات غير المتوفرة',
      nameEn: 'Industrial Transformation Plan With Missing Data & Dependencies',
      descriptionAr: 'خطة تقترح قفزة تصديرية كبرى مع اعتمادية على مخرجات تعليمية وبنية تحتية غير موجودة أو غير مسجلة.',
      descriptionEn: 'Plan postulating large export growth while depending on unregistered or missing predecessor milestones.',
      version: '1.0',
      horizon: 'short',
      baseYear: 2025,
      targetYear: 2027,
      objectives: [
        {
          id: 'obj_high_tech_export',
          titleAr: 'مضاعفة صادرات التكنولوجيا العالية دون بيانات تأهيل',
          titleEn: 'Double High-Tech Exports Without Training Data',
          category: 'economic',
          priority: 'critical',
          indicatorKey: 'nonOilExports',
          indicatorNameAr: 'الصادرات غير النفطية',
          indicatorNameEn: 'Non-Oil Exports',
          unit: '$B',
          baselineValue: 12.0,
          targetValue: 24.0,
          targetYear: 2027,
          budgetAllocatedUsdBillion: 20.0,
          responsibleInstitutionAr: 'هيئة تنمية الصادرات',
          responsibleInstitutionEn: 'Export Development Authority',
          requiredResources: {
            workforceThousands: 45,
            adminCapacityIndex: 85,
            capitalInvestBillion: 18.0,
          },
          dependencies: ['obj_missing_stem_skills', 'obj_missing_energy_grid'],
          milestones: [],
          implementationDelayYears: 3,
          constraintsAndTradeoffsAr: 'غياب البيانات الأساسية للمشروع واعتماديات مفقودة بالكامل.',
          constraintsAndTradeoffsEn: 'Foundational baseline data absent and dependencies missing entirely.',
        },
      ],
      status: 'draft',
      associatedPolicies: policiesResource,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
    };

    const feasibility = evaluatePlanFeasibility(planWithMissingData, baseResource);
    const hasMissingDepContradiction = feasibility.contradictions.some((c) => c.id === 'contra_missing_dep');
    const hasCapacityDeficitContradiction = feasibility.contradictions.some((c) => c.id === 'contra_capacity_overload');
    const hasTimelineContradiction = feasibility.contradictions.some((c) => c.id === 'contra_timeline_impossible');
    const rejectedAsInfeasible = !feasibility.isFeasible && feasibility.overallScore < 50;

    const passed = hasMissingDepContradiction && hasCapacityDeficitContradiction && hasTimelineContradiction && rejectedAsInfeasible;

    auditResults.push({
      testNumber: 7,
      titleAr: 'سيناريو نقص البيانات واعتراف النموذج الصريح بعدم اليقين والتعارض',
      titleEn: 'Missing Data Scenario & Explicit Uncertainty and Conflict Disclosure',
      initialStateSummary: 'Plan depending on non-existent predecessor milestones and unmeasured administrative capacity',
      parametersChanged: 'dependencies: [obj_missing_stem_skills, obj_missing_energy_grid], adminCapacityRequired: 85 vs 48',
      modelRulesInvolved: 'قواعد فحص الجدوى ترفض افتراض نجاح الخطة وتكتشف الاعتماديات المفقودة، وتخفض درجة الثقة إلى الحضيض مع توثيق المخاطر.',
      resultingIndicators: {
        overallScore: feasibility.overallScore,
        isFeasible: feasibility.isFeasible,
        riskLevel: feasibility.riskLevel,
        contradictionsIdentified: feasibility.contradictions.map((c) => c.id),
      },
      scientificLimitations: 'فحص الجدوى يكتشف الاعتماديات المفقودة على مستوى معرفات الأهداف ومطابقة المصفوفات، ولا يستبدل التدقيق الميداني على الأرض.',
      passed,
      notes: passed ? 'النموذج رفض تزييف النجاح وكشف فوراً الاعتماديات المفقودة وضغط الأفق الزمني وعجز الكفاءة الإدارية.' : 'فشل إفصاح النموذج عن نقص البيانات.',
    });
  }

  // =========================================================================
  // Test 8: Comparison of the same policy under different initial conditions
  // =========================================================================
  {
    // Policy: Carbon Tax of $60/ton on Resource Exporter vs Advanced Industrial
    const carbonTaxPolicyResource: PolicySettings = { ...policiesResource, carbonTaxPerTon: 60 };
    const carbonTaxPolicyAdvanced: PolicySettings = { ...archetypeAdvancedIndustrial.defaultPolicies, carbonTaxPerTon: 60 };

    const resourceNext = simulateNextYear(baseResource, carbonTaxPolicyResource, zeroShocks);
    const advancedNext = simulateNextYear(archetypeAdvancedIndustrial.initialState, carbonTaxPolicyAdvanced, zeroShocks);

    const resourceCarbonRevRatio = (resourceNext.economic.fiscal.carbonTaxRevenue / resourceNext.macro.nominalGdp) * 100;
    const advancedCarbonRevRatio = (advancedNext.economic.fiscal.carbonTaxRevenue / advancedNext.macro.nominalGdp) * 100;

    // Both react differently because initial emissions and GDP structures differ
    const revenueRatiosDiffer = Math.abs(resourceCarbonRevRatio - advancedCarbonRevRatio) > 0.1;
    const passed = revenueRatiosDiffer && resourceNext.energy.renewableEnergyPct > baseResource.energy.renewableEnergyPct;

    auditResults.push({
      testNumber: 8,
      titleAr: 'مقارنة نفس السياسة تحت شروط تأسيسية متباينة (الاعتماد النفطي مقابل الصناعي)',
      titleEn: 'Same Policy Under Different Initial Conditions (Resource vs Industrial)',
      initialStateSummary: `Resource Base GDP=$${baseResource.macro.realGdp}B vs Advanced Base GDP=$${archetypeAdvancedIndustrial.initialState.macro.realGdp}B`,
      parametersChanged: 'carbonTaxPerTon: 60 $/ton across both archetypes',
      modelRulesInvolved: 'استجابة ضريبة الكربون تعتمد على كثافة الانبعاثات التأسيسية وحصة الوقود الأحفوري وحجم الناتج المحلي.',
      resultingIndicators: {
        resourceCarbonRevenueGdpPct: resourceCarbonRevRatio,
        advancedCarbonRevenueGdpPct: advancedCarbonRevRatio,
        ratioDifference: Math.abs(resourceCarbonRevRatio - advancedCarbonRevRatio),
      },
      scientificLimitations: 'المرونة السعرية للطاقة موحدة عبر القطاعات ولا تفرق بين النقل الثقيل والشبكة المنزلية.',
      passed,
      notes: passed ? 'السياسة المتطابقة أنتجت استجابات متباينة تبعاً لاختلاف الشروط الهيكلية الأولية للدولتين.' : 'فشل إظهار التباين المؤسسي.',
    });
  }

  // =========================================================================
  // Test 9: Negative results displayed honestly without softening
  // =========================================================================
  {
    // Destructive austerity shock: hike income tax to 50%, VAT to 25%, slash infrastructure to 1%
    const austerityPolicies: PolicySettings = {
      ...policiesResource,
      taxRateIncome: 50,
      taxRateVat: 25,
      budgetInfrastructurePctGdp: 1.0,
      budgetSocialSafetyPctGdp: 1.5,
    };
    const nextState = simulateNextYear(baseResource, austerityPolicies, zeroShocks);

    const gdpGrowthRate = nextState.macro.realGdpGrowthRate;
    const purchasingPower = nextState.economic.households.purchasingPowerIndex;
    const povertyRate = nextState.governance.povertyRatePct;
    const tension = nextState.governance.socialTensionIndex;

    const showsContraction = gdpGrowthRate < baseResource.macro.realGdpGrowthRate;
    const purchasingPowerCrushed = purchasingPower < 90;
    const povertySpiked = povertyRate > baseResource.governance.povertyRatePct;
    const tensionSpiked = tension > baseResource.governance.socialTensionIndex;

    const passed = showsContraction && purchasingPowerCrushed && povertySpiked && tensionSpiked;

    auditResults.push({
      testNumber: 9,
      titleAr: 'عرض النتائج السلبية بصرامة وأمانة علمية دون تلطيف مصطنع',
      titleEn: 'Negative Results Displayed Honestly Without Artificial Softening',
      initialStateSummary: `Growth=${baseResource.macro.realGdpGrowthRate}%, PurchasingPower=${baseResource.economic.households.purchasingPowerIndex}, Poverty=${baseResource.governance.povertyRatePct}%`,
      parametersChanged: 'taxRateIncome: 50%, taxRateVat: 25%, budgetInfrastructurePctGdp: 1.0%, budgetSocialSafetyPctGdp: 1.5%',
      modelRulesInvolved: 'الصدمة الانكماشية المزدوجة تضغط الاستهلاك، تعمق الفقر، وتفجر مؤشر التوتر الاجتماعي دون أي "مكافأة تلقائية" أو تجميل.',
      resultingIndicators: {
        realGdpGrowthRate: gdpGrowthRate,
        purchasingPowerIndex: purchasingPower,
        povertyRatePct: povertyRate,
        socialTensionIndex: tension,
      },
      scientificLimitations: 'النموذج لا يتنبأ باندلاع اضطرابات عنيفة محددة احتراماً للحدود الأخلاقية والمعرفية.',
      passed,
      notes: passed ? 'النتائج السلبية ظهرت بكامل قسوتها: تراجع حاد في القوة الشرائية وارتفاع الفقر والتوتر.' : 'تم تلطيف النتيجة السلبية بشكل مصطنع.',
    });
  }

  // =========================================================================
  // Test 10: Synthetic data never presented as verified real-world facts
  // =========================================================================
  {
    const config = archetypeResourceExporter.countryConfig;
    const isSyntheticFlag = config.isSyntheticDataset === true;
    const disclosureArPresent = config.dataSourceDisclosureAr.includes('بيانات مصطنعة') || config.dataSourceDisclosureAr.includes('تنبيه');
    const disclosureEnPresent = config.dataSourceDisclosureEn.includes('synthetic') || config.dataSourceDisclosureEn.includes('illustrative');

    const passed = isSyntheticFlag && disclosureArPresent && disclosureEnPresent;

    auditResults.push({
      testNumber: 10,
      titleAr: 'تأكيد توصيف البيانات المصطنعة وعدم ادعاء تمثيلها إحصاءات واقعية',
      titleEn: 'Synthetic Baseline Disclosure (No False Real-World Claims)',
      initialStateSummary: `Country: ${config.nameAr}, isSyntheticDataset=${config.isSyntheticDataset}`,
      parametersChanged: 'Verification of metadata disclosures and epistemic labeling',
      modelRulesInvolved: 'الإفصاح المعرفي الصارم: وسم كافة البيانات بأنها مصفوفات تعليمية مصطنعة متسقة رياضياً وليست إحصاءات سرية أو حية.',
      resultingIndicators: {
        isSyntheticDataset: config.isSyntheticDataset,
        disclosureArabicLength: config.dataSourceDisclosureAr.length,
        disclosureEnglishLength: config.dataSourceDisclosureEn.length,
      },
      scientificLimitations: 'المستخدمون بحاجة لاستيراد بيانات حقيقية من أجهزتهم الإحصائية الوطنية عند الرغبة في اتخاذ قرارات حكومية ملزمة.',
      passed,
      notes: passed ? 'الإفصاح واضح وصريح: تم وسم البيانات بأنها مصطنعة ومتوازنة رياضياً لأغراض النمذجة.' : 'ادعى النموذج تمثيل بيانات واقعية دون إفصاح.',
    });
  }

  return auditResults;
}
