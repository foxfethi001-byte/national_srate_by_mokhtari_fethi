/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Strategic Planning & Feasibility Engine (Phase 5)
 * محرك التخطيط الاستراتيجي الوطني وتحليل الجدوى وكشف التناقضات والمتابعة والتقييم
 */

import { SimulationState, PolicySettings } from '../types/simulation';
import { StrategicPlan, StrategicObjective, FeasibilityReport, Contradiction } from '../types/planning';

/**
 * Pre-configured national strategic plans archetypes
 */
export const ARCHETYPE_STRATEGIC_PLANS: StrategicPlan[] = [
  {
    id: 'vision_industrial_green_2035',
    nameAr: 'رؤية التحول الصناعي والطاقة النظيفة 2035',
    nameEn: 'Vision 2035: Industrial Transformation & Clean Energy',
    descriptionAr: 'استراتيجية تنموية شاملة تستهدف مضاعفة الصادرات غير النفطية، خفض الانبعاثات الكربونية، وتوطين سلاسل الإمداد الصناعية مع تحفيز الاستثمار الخاص.',
    descriptionEn: 'A comprehensive national development strategy aimed at doubling non-commodity exports, reducing carbon emissions, and localizing industrial supply chains.',
    version: '1.2',
    horizon: 'long',
    baseYear: 2024,
    targetYear: 2034,
    status: 'approved',
    associatedPolicies: {
      budgetInfrastructurePctGdp: 8.5,
      cleanEnergySubsidyPct: 35.0,
      carbonTaxPerTon: 45.0,
      budgetEducationPctGdp: 5.5,
      budgetHealthcarePctGdp: 4.5,
      taxRateCorporate: 20.0,
    },
    createdAt: '2024-01-15',
    updatedAt: '2024-06-20',
    authorNotesAr: 'تمت مواءمة الخطة مع التزامات المناخ الدولية ومخرجات الحوار الاقتصادي الوطني.',
    authorNotesEn: 'Aligned with national industrial dialogue and international climate pledges.',
    objectives: [
      {
        id: 'obj_non_oil_gdp',
        titleAr: 'رفع مساهمة الإنتاج الصناعي والخدمات في الناتج',
        titleEn: 'Increase Industrial & Services Output Share',
        category: 'economic',
        priority: 'critical',
        indicatorKey: 'gdpReal',
        indicatorNameAr: 'الناتج المحلي الحقيقي',
        indicatorNameEn: 'Real GDP',
        unit: 'مليار دولار',
        baselineValue: 350,
        targetValue: 520,
        targetYear: 2034,
        budgetAllocatedUsdBillion: 45.0,
        responsibleInstitutionAr: 'وزارة الصناعة والاستثمار وهيئة التنمية الوطنية',
        responsibleInstitutionEn: 'Ministry of Industry & National Development Board',
        requiredResources: {
          workforceThousands: 250,
          adminCapacityIndex: 75,
          capitalInvestBillion: 40.0,
        },
        dependencies: [],
        milestones: [
          { id: 'm1_ind_zones', year: 2026, titleAr: 'تدشين 4 مناطق صناعية متخصصة', titleEn: 'Launch 4 Specialized Industrial Zones', targetValue: 390, completed: true },
          { id: 'm2_supply_chain', year: 2029, titleAr: 'تحقيق 50% قيمة مضافة محلية', titleEn: 'Reach 50% Domestic Value Added', targetValue: 450, completed: false },
          { id: 'm3_export_hub', year: 2034, titleAr: 'مضاعفة حصيلة الصادرات المصنعة', titleEn: 'Double Manufactured Exports', targetValue: 520, completed: false },
        ],
        implementationDelayYears: 2,
        constraintsAndTradeoffsAr: 'يتطلب تخصيص أراضٍ ومرافق مائية وكهربائية ضخمة قد ترفع كلفة المرافق العامة مؤقتاً.',
        constraintsAndTradeoffsEn: 'Requires heavy upfront infrastructure and utility reallocation, temporarily straining municipal budgets.',
      },
      {
        id: 'obj_co2_reduction',
        titleAr: 'خفض كثافة الانبعاثات الكربونية السنوية بنسبة 30%',
        titleEn: 'Cut Annual CO2 Emissions Intensity by 30%',
        category: 'environment',
        priority: 'high',
        indicatorKey: 'co2Emissions',
        indicatorNameAr: 'انبعاثات ثاني أكسيد الكربون',
        indicatorNameEn: 'CO2 Emissions',
        unit: 'مليون طن',
        baselineValue: 120,
        targetValue: 84,
        targetYear: 2034,
        budgetAllocatedUsdBillion: 28.0,
        responsibleInstitutionAr: 'وزارة الطاقة والبيئة والشركة الوطنية للكهرباء',
        responsibleInstitutionEn: 'Ministry of Energy & Environment',
        requiredResources: {
          workforceThousands: 80,
          adminCapacityIndex: 80,
          capitalInvestBillion: 25.0,
        },
        dependencies: ['obj_non_oil_gdp'],
        milestones: [
          { id: 'm1_solar_farms', year: 2027, titleAr: 'ربط 3000 ميغاوات طاقة شمسية ورياح', titleEn: 'Grid Connection of 3,000 MW Solar/Wind', targetValue: 105, completed: false },
          { id: 'm2_grid_storage', year: 2031, titleAr: 'نظام التخزين بالبطاريات والشبكات الذكية', titleEn: 'Battery Storage & Smart Grid Integration', targetValue: 92, completed: false },
        ],
        implementationDelayYears: 3,
        constraintsAndTradeoffsAr: 'قد يرفع تطبيق ضريبة الكربون كلفة الطاقة على بعض الصناعات التقليدية ويستدعي حزم تعويض مؤقتة.',
        constraintsAndTradeoffsEn: 'Carbon taxation elevates operational costs for legacy manufacturers, requiring targeted transition subsidies.',
      },
      {
        id: 'obj_unemployment_reduction',
        titleAr: 'خفض معدل البطالة العامة إلى أقل من 6.5%',
        titleEn: 'Reduce National Unemployment Rate Below 6.5%',
        category: 'social',
        priority: 'critical',
        indicatorKey: 'unemploymentRate',
        indicatorNameAr: 'معدل البطالة',
        indicatorNameEn: 'Unemployment Rate',
        unit: '%',
        baselineValue: 10.5,
        targetValue: 6.2,
        targetYear: 2034,
        budgetAllocatedUsdBillion: 16.0,
        responsibleInstitutionAr: 'وزارة العمل والتدريب المهني وهيئة دعم المنشآت الصغيرة',
        responsibleInstitutionEn: 'Ministry of Labor & Vocational Training',
        requiredResources: {
          workforceThousands: 60,
          adminCapacityIndex: 70,
          capitalInvestBillion: 14.0,
        },
        dependencies: ['obj_non_oil_gdp'],
        milestones: [
          { id: 'm1_skills_acc', year: 2026, titleAr: 'تأهيل 100 ألف خريج في المهن التقنية', titleEn: 'Certify 100k Graduates in Tech Skills', targetValue: 9.0, completed: false },
          { id: 'm2_sme_finance', year: 2030, titleAr: 'صندوق تمويل 25 ألف مشروع ناشئ', titleEn: 'SME Micro-loan Program for 25k Ventures', targetValue: 7.5, completed: false },
        ],
        implementationDelayYears: 1,
        constraintsAndTradeoffsAr: 'المواءمة بين مخرجات التعليم وسوق العمل تستغرق من 3 إلى 5 سنوات لإظهار الأثر الكامل.',
        constraintsAndTradeoffsEn: 'Curriculum reform and skills realignment suffer from a structural lag of 3-5 years.',
      },
    ],
  },
  {
    id: 'stabilization_fiscal_safety_2028',
    nameAr: 'خطة التثبيت المالي والأمان الاجتماعي 2028',
    nameEn: 'Fiscal Stabilization & Social Safety Net 2028',
    descriptionAr: 'خطة متوسطة الأجل لكبح جماح الدين السيادي، خفض عجز الموازنة، وحماية الطبقات الأكثر هشاشة عبر التحويلات النقدية الموجهة.',
    descriptionEn: 'Medium-term consolidation plan to rein in sovereign debt, narrow budget deficit, and safeguard vulnerable households.',
    version: '2.0',
    horizon: 'medium',
    baseYear: 2024,
    targetYear: 2028,
    status: 'in_progress',
    associatedPolicies: {
      budgetInfrastructurePctGdp: 3.5,
      budgetSocialSafetyPctGdp: 3.5,
      taxRateIncome: 24.0,
      taxRateVat: 14.0,
    },
    createdAt: '2024-03-01',
    updatedAt: '2024-07-10',
    objectives: [
      {
        id: 'obj_debt_to_gdp',
        titleAr: 'خفض نسبة الدين العام إلى أقل من 65% من الناتج',
        titleEn: 'Reduce Debt-to-GDP Ratio Below 65%',
        category: 'fiscal',
        priority: 'critical',
        indicatorKey: 'debtToGdpRatio',
        indicatorNameAr: 'نسبة الدين العام إلى الناتج',
        indicatorNameEn: 'Debt-to-GDP Ratio',
        unit: '%',
        baselineValue: 82.0,
        targetValue: 64.0,
        targetYear: 2028,
        budgetAllocatedUsdBillion: 12.0,
        responsibleInstitutionAr: 'وزارة المالية والبنك المركزي',
        responsibleInstitutionEn: 'Ministry of Finance & Central Bank',
        requiredResources: {
          workforceThousands: 15,
          adminCapacityIndex: 85,
          capitalInvestBillion: 5.0,
        },
        dependencies: [],
        milestones: [
          { id: 'm1_primary_surplus', year: 2025, titleAr: 'تحقيق فائض أولي في الموازنة 1.2%', titleEn: 'Achieve Primary Surplus of 1.2%', targetValue: 78.0, completed: true },
          { id: 'm2_debt_refinancing', year: 2027, titleAr: 'إطالة متوسط استحقاق السندات إلى 8 سنوات', titleEn: 'Extend Average Debt Maturity to 8 Yrs', targetValue: 70.0, completed: false },
        ],
        implementationDelayYears: 1,
        constraintsAndTradeoffsAr: 'التقشف المالي السريع يهدد بتباطؤ الطلب الكلي ورفع معدل الفقر إن لم يصاحبه حماية اجتماعية دقيقة.',
        constraintsAndTradeoffsEn: 'Rapid fiscal contraction threatens aggregate demand unless offset by well-targeted cash transfers.',
      },
      {
        id: 'obj_poverty_containment',
        titleAr: 'حصر معدل الفقر النسبي دون 12% أثناء الضبط المالي',
        titleEn: 'Contain Relative Poverty Rate Below 12%',
        category: 'social',
        priority: 'high',
        indicatorKey: 'povertyRate',
        indicatorNameAr: 'معدل الفقر النسبي',
        indicatorNameEn: 'Relative Poverty Rate',
        unit: '%',
        baselineValue: 16.5,
        targetValue: 11.5,
        targetYear: 2028,
        budgetAllocatedUsdBillion: 18.0,
        responsibleInstitutionAr: 'وزارة التضامن الاجتماعي وصندوق الحماية الاجتماعية',
        responsibleInstitutionEn: 'Ministry of Social Welfare & National Safety Fund',
        requiredResources: {
          workforceThousands: 40,
          adminCapacityIndex: 75,
          capitalInvestBillion: 15.0,
        },
        dependencies: ['obj_debt_to_gdp'],
        milestones: [
          { id: 'm1_unified_registry', year: 2025, titleAr: 'استكمال السجل الاجتماعي الموحد الرقمي', titleEn: 'Complete Unified Digital Social Registry', targetValue: 15.0, completed: true },
          { id: 'm2_cash_expanded', year: 2027, titleAr: 'تغطية 1.5 مليون أسرة إضافية بالدعم النقدي المشروط', titleEn: 'Cover 1.5M Families with Conditional Aid', targetValue: 13.0, completed: false },
        ],
        implementationDelayYears: 1,
        constraintsAndTradeoffsAr: 'يتطلب رفع كفاءة الاستهداف الرقمي لمنع تسرب الدعم لغير المستحقين.',
        constraintsAndTradeoffsEn: 'Requires high-integrity digital targeting to minimize inclusion and exclusion errors.',
      },
    ],
  },
];

/**
 * Evaluates the real feasibility of a strategic plan.
 * Rigorous engine: Never declares a plan feasible simply because the user selected it!
 */
export function evaluatePlanFeasibility(
  plan: StrategicPlan,
  currentState: SimulationState
): FeasibilityReport {
  const contradictions: Contradiction[] = [];
  const gdp = currentState.macro.realGdp;
  const currentDebt = currentState.macro.debtToGdpRatio;
  const adminCap = currentState.governance.ruleOfLawIndex || 60;

  // 1. Fiscal Evaluation
  const totalAllocatedBudget = plan.objectives.reduce((sum, o) => sum + o.budgetAllocatedUsdBillion, 0);
  const plannedYears = Math.max(1, plan.targetYear - plan.baseYear);
  const annualRequiredSpend = totalAllocatedBudget / plannedYears;
  const maxSafeAnnualDeficitExpansion = gdp * 0.035; // safe fiscal expansion without debt explosion

  const availableFiscalSpaceBillion = Math.max(5.0, (100 - currentDebt) * 0.8 + gdp * 0.02);
  const annualDeficitImpactPct = (annualRequiredSpend / gdp) * 100;
  const fiscalPassed = annualRequiredSpend <= availableFiscalSpaceBillion && currentDebt + (annualDeficitImpactPct * plannedYears * 0.6) < 95;

  if (totalAllocatedBudget > availableFiscalSpaceBillion * plannedYears * 1.3) {
    contradictions.push({
      id: 'contra_underfunded',
      type: 'underfunded',
      titleAr: 'فجوة تمويلية سيادية حادة (خطة غير ممولة كفاية)',
      titleEn: 'Severe Sovereign Financing Gap (Underfunded Plan)',
      descriptionAr: `الموازنة المطلوبة (${totalAllocatedBudget.toFixed(1)} مليار $) تتجاوز الحيز المالي المتاح والقدرة على الاقتراض الآمن بمقدار ${(totalAllocatedBudget - availableFiscalSpaceBillion * plannedYears).toFixed(1)} مليار $. تنفيذ الخطة دون زيادة إيرادات سيؤدي لانفجار نسبة الدين.`,
      descriptionEn: `Required budget ($${totalAllocatedBudget.toFixed(1)}B) exceeds available fiscal space and safe borrowing capacity by $${(totalAllocatedBudget - availableFiscalSpaceBillion * plannedYears).toFixed(1)}B.`,
      severity: 'critical',
      affectedObjectiveIds: plan.objectives.map((o) => o.id),
      suggestedRemedyAr: 'زيادة الإيرادات الضريبية، تقليص النفقات الإدارية غير الحيوية، أو تمديد أفق الخطة لتوزيع التكلفة على سنوات أكثر.',
      suggestedRemedyEn: 'Mobilize domestic tax revenue, restructure non-core spending, or lengthen plan horizon.',
    });
  }

  // 2. Workforce & Administrative Capacity Evaluation
  const totalWorkersNeeded = plan.objectives.reduce((sum, o) => sum + o.requiredResources.workforceThousands, 0);
  const maxAdminReq = Math.max(...plan.objectives.map((o) => o.requiredResources.adminCapacityIndex), 50);
  const availableLaborThousands = (currentState.demographics.totalPopulation * 0.03) * 1000; // 3% of pop mobilizeable
  const workforcePassed = totalWorkersNeeded <= availableLaborThousands && adminCap >= maxAdminReq - 15;

  if (adminCap < maxAdminReq - 10) {
    contradictions.push({
      id: 'contra_capacity_overload',
      type: 'capacity_overload',
      titleAr: 'عجز في القدرة المؤسسية والإدارية للتنفيذ',
      titleEn: 'Administrative & Institutional Execution Deficit',
      descriptionAr: `تتطلب أهداف الخطة كفاءة حكومية لا تقل عن ${maxAdminReq}/100، بينما المؤشر الفعلي الحالي هو ${adminCap.toFixed(1)}/100. هذا العجز سيتسبب في تعثر المناقصات وبطء الإنجاز بنسبة تزيد عن 40%.`,
      descriptionEn: `Plan objectives demand an institutional effectiveness score of ${maxAdminReq}/100, while current actual capacity is only ${adminCap.toFixed(1)}/100.`,
      severity: 'high',
      affectedObjectiveIds: plan.objectives.filter((o) => o.requiredResources.adminCapacityIndex > adminCap).map((o) => o.id),
      suggestedRemedyAr: 'إدخال حزمة إصلاح الخدمة المدنية، التحول الرقمي للمشتريات، وتفويض الصلاحيات التنفيذية للجهات المحلية.',
      suggestedRemedyEn: 'Implement civil service modernization, digital procurement, and deconcentrated local delivery.',
    });
  }

  // 3. Timeline & Implementation Delays Evaluation
  const totalMaxDelay = Math.max(...plan.objectives.map((o) => o.implementationDelayYears), 1);
  const minFeasibleYears = totalMaxDelay + 2;
  const timelinePassed = plannedYears >= minFeasibleYears;

  if (plannedYears < minFeasibleYears) {
    contradictions.push({
      id: 'contra_timeline_impossible',
      type: 'timeline_impossible',
      titleAr: 'أفق زمني غير واقعي وضغط مفرط في المواعيد',
      titleEn: 'Unrealistic Compressed Timeline',
      descriptionAr: `الأفق المحدد (${plannedYears} سنوات) أقل من الحد الأدنى الفني للتحول (${minFeasibleYears} سنوات) بالنظر للتأخيرات الهيكلية في دورة المشاريع الرأسمالية.`,
      descriptionEn: `Target horizon (${plannedYears} yrs) is shorter than the technical minimum gestation period (${minFeasibleYears} yrs).`,
      severity: 'critical',
      affectedObjectiveIds: plan.objectives.map((o) => o.id),
      suggestedRemedyAr: 'تمديد أفق الخطة بسنتين إضافيتين وتحديد مراحل إنجاز تدريجية قابلة للقياس.',
      suggestedRemedyEn: 'Extend planning horizon by at least 2 years and introduce phased milestone rollouts.',
    });
  }

  // 4. Dependencies Evaluation
  const objIds = new Set(plan.objectives.map((o) => o.id));
  const missingDependencies: string[] = [];
  for (const obj of plan.objectives) {
    for (const dep of obj.dependencies) {
      if (!objIds.has(dep)) {
        missingDependencies.push(`الهدف (${obj.titleAr}) يعتمد على متطلب مفقود (${dep})`);
      }
    }
  }

  const dependenciesPassed = missingDependencies.length === 0;
  if (!dependenciesPassed) {
    contradictions.push({
      id: 'contra_missing_dep',
      type: 'conflicting_targets',
      titleAr: 'اعتماديات غير مستوفاة بين الأهداف والقطاعات',
      titleEn: 'Unsatisfied Inter-Sector Dependencies',
      descriptionAr: missingDependencies.join(' | '),
      descriptionEn: 'Some objectives depend on predecessor outcomes that are neither funded nor included in the active plan.',
      severity: 'high',
      affectedObjectiveIds: plan.objectives.filter((o) => o.dependencies.length > 0).map((o) => o.id),
      suggestedRemedyAr: 'إدراج المشاريع الممهدة ضمن حزمة الأهداف الممولة أولاً قبل إطلاق المشاريع المعتمدة عليها.',
      suggestedRemedyEn: 'Sequence preparatory projects before launching downstream operations.',
    });
  }

  // 5. Cross-Target Conflicts (e.g., cutting emissions while slashing clean energy budget or drastic austerity with poverty target)
  const hasAusterity = plan.objectives.some((o) => o.indicatorKey === 'debtToGdpRatio');
  const hasPovertyTarget = plan.objectives.some((o) => o.indicatorKey === 'povertyRate');
  if (hasAusterity && hasPovertyTarget && totalAllocatedBudget < 25.0) {
    contradictions.push({
      id: 'contra_austerity_poverty',
      type: 'policy_incompatibility',
      titleAr: 'تعارض هيكلي بين سرعة التقشف المالي ومستهدفات مكافحة الفقر',
      titleEn: 'Structural Friction between Rapid Austerity & Poverty Reduction',
      descriptionAr: 'محاولة خفض الدين العام بسرعة مع خفض الفقر بميزانية حماية اجتماعية محدودة يمثل تناقضاً كلاسيكياً يهدد بارتفاع التوتر الاجتماعي.',
      descriptionEn: 'Simultaneously pursuing aggressive fiscal consolidation and poverty reduction without dedicated ring-fenced social funding creates a policy contradiction.',
      severity: 'warning',
      affectedObjectiveIds: plan.objectives.filter((o) => o.indicatorKey === 'debtToGdpRatio' || o.indicatorKey === 'povertyRate').map((o) => o.id),
      suggestedRemedyAr: 'تخصيص نسبة ثابتة من وفورات ترشيد الدعم لتمويل شبكة الأمان الاجتماعي النقدي المباشر.',
      suggestedRemedyEn: 'Ring-fence a fixed proportion of subsidy rationalization savings for direct targeted cash transfers.',
    });
  }

  // Overall Score Calculation
  const criticalCount = contradictions.filter((c) => c.severity === 'critical').length;
  const highCount = contradictions.filter((c) => c.severity === 'high').length;
  const warningCount = contradictions.filter((c) => c.severity === 'warning').length;

  let score = 100;
  score -= criticalCount * 35;
  score -= highCount * 15;
  score -= warningCount * 5;
  score = Math.max(5, Math.min(98, score));

  const isFeasible = criticalCount === 0 && score >= 60;
  const riskLevel = score >= 75 ? 'low' : score >= 55 ? 'moderate' : score >= 40 ? 'high' : 'prohibitive';

  return {
    planId: plan.id,
    evaluatedAtYear: currentState.year,
    isFeasible,
    overallScore: score,
    riskLevel,
    fiscal: {
      requiredTotalBudgetBillion: totalAllocatedBudget,
      availableFiscalSpaceBillion: availableFiscalSpaceBillion * plannedYears,
      annualDeficitImpactPct,
      passed: fiscalPassed,
      verdictAr: fiscalPassed
        ? `الحيز المالي متاح، والتكلفة السنوية (${annualRequiredSpend.toFixed(1)} مليار $) تقع ضمن طاقة التحمل المالي.`
        : `ضغط مالي حاد؛ التكلفة السنوية (${annualRequiredSpend.toFixed(1)} مليار $) تتجاوز الحدود الآمنة للاستدامة.`,
      verdictEn: fiscalPassed
        ? `Fiscal space available. Annual outlay ($${annualRequiredSpend.toFixed(1)}B) is within safe limits.`
        : `Severe fiscal pressure. Annual outlays ($${annualRequiredSpend.toFixed(1)}B) threaten debt sustainability.`,
    },
    workforce: {
      requiredWorkersThousands: totalWorkersNeeded,
      availableLaborSupplyThousands: availableLaborThousands,
      adminCapacityRequired: maxAdminReq,
      adminCapacityActual: adminCap,
      passed: workforcePassed,
      verdictAr: workforcePassed
        ? `الموارد البشرية والإدارية متوافقة مع متطلبات الخطة.`
        : `فجوة في الكفاءة الإدارية (${adminCap.toFixed(1)} مقابل ${maxAdminReq} مطلوبة).`,
      verdictEn: workforcePassed
        ? `Workforce and administrative capacity match plan demands.`
        : `Capacity gap (${adminCap.toFixed(1)} actual vs ${maxAdminReq} required).`,
    },
    timeline: {
      plannedYears,
      minFeasibleYears,
      implementationDelayAllowanceYears: totalMaxDelay,
      passed: timelinePassed,
      verdictAr: timelinePassed
        ? `الجدول الزمني (${plannedYears} سنوات) كافٍ لاستيعاب تأخيرات التنفيذ.`
        : `الجدول الزمني مضغوط للغاية (${plannedYears} سنوات مقابل ${minFeasibleYears} سنوات مطلوبة على الأقل).`,
      verdictEn: timelinePassed
        ? `Timeline (${plannedYears} yrs) accommodates gestation and delay allowances.`
        : `Timeline excessively compressed (${plannedYears} yrs planned vs ${minFeasibleYears} yrs minimum).`,
    },
    dependencies: {
      satisfied: dependenciesPassed,
      bottlenecks: missingDependencies,
      verdictAr: dependenciesPassed
        ? 'كافة الاعتماديات بين الأهداف والقطاعات مستوفاة ومنسقة.'
        : `توجد ${missingDependencies.length} اعتماديات غير مغطاة أو غير منسقة.`,
      verdictEn: dependenciesPassed
        ? 'All cross-objective and sector dependencies are satisfied.'
        : `${missingDependencies.length} unsatisfied dependencies identified.`,
    },
    distributionalImpacts: {
      regionalEquityScore: Math.min(90, Math.round(score * 0.9)),
      regionsVerdictAr: 'توزيع الاستثمارات يشمل المناطق الريفية والمناطق الصناعية بدرجة مقبولة من العدالة المكانية.',
      populationGroupVerdictAr: 'الفئات الشابة والأسر محدودة الدخل تحظى بحماية نسبية عبر حزم التدريب والدعم النقدي.',
    },
    contradictions,
  };
}

/**
 * Evaluates real-time monitoring & progress for each objective
 * Distinguishes observed baseline values from simulated forward progress
 */
export function evaluateMonitoringProgress(
  plan: StrategicPlan,
  currentState: SimulationState,
  baseState: SimulationState
): StrategicObjective[] {
  return plan.objectives.map((obj) => {
    // Extract current simulated value based on indicatorKey
    let currentVal = obj.baselineValue;
    if (obj.indicatorKey === 'gdpReal') {
      currentVal = currentState.macro.realGdp;
    } else if (obj.indicatorKey === 'debtToGdpRatio') {
      currentVal = currentState.macro.debtToGdpRatio;
    } else if (obj.indicatorKey === 'unemploymentRate') {
      currentVal = currentState.demographics.unemploymentRate;
    } else if (obj.indicatorKey === 'inflationRate') {
      currentVal = currentState.macro.inflationRate;
    } else if (obj.indicatorKey === 'co2Emissions') {
      currentVal = currentState.energy.annualCo2EmissionsMt;
    } else if (obj.indicatorKey === 'povertyRate') {
      currentVal = currentState.governance.povertyRatePct;
    } else if (obj.indicatorKey === 'gini') {
      currentVal = currentState.governance.giniCoefficient;
    }

    // Progress computation
    const totalDelta = obj.targetValue - obj.baselineValue;
    const currentDelta = currentVal - obj.baselineValue;
    let progressPct = 0;
    if (Math.abs(totalDelta) > 0.0001) {
      progressPct = Math.round((currentDelta / totalDelta) * 100);
      progressPct = Math.max(0, Math.min(100, progressPct));
    }

    // Spent budget simulation (pro-rated by year elapsed)
    const totalYears = Math.max(1, obj.targetYear - plan.baseYear);
    const yearsElapsed = Math.max(0, currentState.year - plan.baseYear);
    const spentFraction = Math.min(1.0, yearsElapsed / totalYears);
    const budgetSpent = Math.round(obj.budgetAllocatedUsdBillion * spentFraction * 10) / 10;

    // Risk Status
    const expectedProgressPct = Math.round((yearsElapsed / totalYears) * 100);
    let riskStatus: StrategicObjective['riskStatus'] = 'on_track';
    if (progressPct >= 100) {
      riskStatus = 'achieved';
    } else if (progressPct >= expectedProgressPct - 10) {
      riskStatus = 'on_track';
    } else if (progressPct >= expectedProgressPct - 25) {
      riskStatus = 'at_risk';
    } else if (progressPct >= expectedProgressPct - 40) {
      riskStatus = 'delayed';
    } else {
      riskStatus = 'off_track';
    }

    return {
      ...obj,
      currentSimulatedValue: Math.round(currentVal * 100) / 100,
      progressPct,
      budgetSpentSimulated: budgetSpent,
      riskStatus,
      assumptionsAndUncertaintyAr: `القيم الحالية هي نتائج محاكاة خوارزمية افتراضية وليست رصداً إحصائياً ميدانياً واقعياً. مستوى عدم اليقين يقدر بنحو ±${(12 + (currentState.year - plan.baseYear) * 2)}%.`,
      assumptionsAndUncertaintyEn: `Current values are synthetic algorithmic model projections, not empirical census observations. Forecast uncertainty interval is ±${(12 + (currentState.year - plan.baseYear) * 2)}%.`,
    };
  });
}
