/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Early-Warning System (EWS) Engine (Phase 5)
 * نظام الإنذار المبكر السيادي لعشرة مؤشرات بنيوية حيوية مع عتبات قابلة للتهيئة وتوصيات سياساتية
 */

import { SimulationState } from '../types/simulation';
import { EarlyWarningIndicator } from '../types/planning';

export interface CustomThresholds {
  [indicatorKey: string]: {
    warning: number;
    critical: number;
  };
}

/**
 * Evaluates the 10 core structural Early Warning System indicators
 */
export function evaluateEarlyWarnings(
  currentState: SimulationState,
  history: SimulationState[],
  customThresholds: CustomThresholds = {}
): EarlyWarningIndicator[] {
  const macro = currentState.macro;
  const demo = currentState.demographics;
  const gov = currentState.governance;
  const energy = currentState.energy;

  // 1. Fiscal Pressure
  // Primary deficit as % of GDP
  const fiscalDeficitPct = Math.abs((macro.overallDeficit || 0) / (macro.nominalGdp || 1)) * 100;
  const fpThresh = customThresholds['fiscal_pressure'] || { warning: 3.5, critical: 6.0 };
  const fpStatus = fiscalDeficitPct >= fpThresh.critical ? 'critical' : fiscalDeficitPct >= fpThresh.warning ? 'warning' : 'normal';

  // 2. Debt Sustainability Risk
  // Debt to GDP
  const dsThresh = customThresholds['debt_sustainability'] || { warning: 75.0, critical: 90.0 };
  const dsVal = macro.debtToGdpRatio;
  const dsStatus = dsVal >= dsThresh.critical ? 'critical' : dsVal >= dsThresh.warning ? 'warning' : 'normal';

  // 3. Inflation Pressure
  const infThresh = customThresholds['inflation_pressure'] || { warning: 6.0, critical: 10.0 };
  const infVal = macro.inflationRate;
  const infStatus = infVal >= infThresh.critical ? 'critical' : infVal >= infThresh.warning ? 'warning' : 'normal';

  // 4. Food and Energy Supply Stress
  // Energy import dependence + carbon intensity
  const feVal = Math.min(100, Math.round(((macro.currentAccountBalance || 0) < -10 ? 30 : 10) + (macro.inflationRate > 5 ? 35 : 15) + (energy.renewableEnergyPct < 25 ? 25 : 10)));
  const feThresh = customThresholds['food_energy_stress'] || { warning: 55, critical: 75 };
  const feStatus = feVal >= feThresh.critical ? 'critical' : feVal >= feThresh.warning ? 'warning' : 'normal';

  // 5. Employment Deterioration
  const unempThresh = customThresholds['employment_deterioration'] || { warning: 9.0, critical: 12.0 };
  const unempVal = demo.unemploymentRate;
  const unempStatus = unempVal >= unempThresh.critical ? 'critical' : unempVal >= unempThresh.warning ? 'warning' : 'normal';

  // 6. Healthcare Capacity Pressure
  // Derived from healthcare quality index and population
  const healthVal = Math.round(100 - (currentState.humanCapital.healthcareQualityIndex || 60) * 0.8);
  const healthThresh = customThresholds['healthcare_pressure'] || { warning: 50, critical: 70 };
  const healthStatus = healthVal >= healthThresh.critical ? 'critical' : healthVal >= healthThresh.warning ? 'warning' : 'normal';

  // 7. Water Stress & Scarcity
  // Synthetic water stress index based on climate and investment
  const waterVal = Math.round(45 + (currentState.year - 2024) * 1.5 - (currentState.energy.renewableEnergyPct * 0.2));
  const waterThresh = customThresholds['water_stress'] || { warning: 60, critical: 80 };
  const waterStatus = waterVal >= waterThresh.critical ? 'critical' : waterVal >= waterThresh.warning ? 'warning' : 'normal';

  // 8. Infrastructure Deterioration
  // Public investment insufficiency vs depreciation
  const infraVal = Math.round(Math.max(10, 75 - (currentState.macro.expenditureInfrastructure ? currentState.macro.expenditureInfrastructure * 1.5 : 25)));
  const infraThresh = customThresholds['infrastructure_decay'] || { warning: 55, critical: 75 };
  const infraStatus = infraVal >= infraThresh.critical ? 'critical' : infraVal >= infraThresh.warning ? 'warning' : 'normal';

  // 9. Regional Inequality
  // Spatial Gini / territorial divergence
  const regGiniVal = Math.round((gov.giniCoefficient || 36) * 10) / 10;
  const regThresh = customThresholds['regional_inequality'] || { warning: 40.0, critical: 46.0 };
  const regStatus = regGiniVal >= regThresh.critical ? 'critical' : regGiniVal >= regThresh.warning ? 'warning' : 'normal';

  // 10. Public-Service Deterioration
  // Inverted government effectiveness
  const govEff = gov.ruleOfLawIndex || 62;
  const srvVal = Math.round(100 - govEff);
  const srvThresh = customThresholds['service_deterioration'] || { warning: 45, critical: 60 };
  const srvStatus = srvVal >= srvThresh.critical ? 'critical' : srvVal >= srvThresh.warning ? 'warning' : 'normal';

  return [
    {
      id: 'EWS_FISCAL',
      key: 'fiscal_pressure',
      titleAr: 'الضغط المالي وعجز الموازنة العامة',
      titleEn: 'Fiscal Pressure & Budget Deficit',
      category: 'fiscal',
      currentValue: Math.round(fiscalDeficitPct * 10) / 10,
      thresholdWarning: fpThresh.warning,
      thresholdCritical: fpThresh.critical,
      unit: '% من الناتج',
      status: fpStatus,
      confidenceScorePct: 95,
      contributingVariables: [
        { nameAr: 'عجز الموازنة الفعلي', nameEn: 'Actual Deficit', value: `$${(macro.overallDeficit || 0).toFixed(1)}B`, weightPct: 60 },
        { nameAr: 'الناتج المحلي الإجمالي', nameEn: 'Nominal GDP', value: `$${macro.nominalGdp.toFixed(1)}B`, weightPct: 40 },
      ],
      thresholdRationaleAr: 'عجز يتجاوز 3.5% يزيد الاعتماد على الاستدانة، وفوق 6.0% يهدد بالتعثر وفقدان الانضباط المالي.',
      thresholdRationaleEn: 'Deficits above 3.5% elevate debt burden; above 6.0% risks loss of market access and fiscal insolvency.',
      recommendedResponsesAr: [
        'إصلاح وإعادة هيكلة الدعم العام وتوجيهه نقدياً للمستحقين.',
        'توسيع الوعاء الضريبي ومكافحة التهرب الضريبي عبر الفوترة الإلكترونية.',
      ],
      recommendedResponsesEn: [
        'Rationalize general subsidies and transition to targeted cash relief.',
        'Broaden domestic tax base and crack down on informal tax evasion.',
      ],
    },
    {
      id: 'EWS_DEBT',
      key: 'debt_sustainability',
      titleAr: 'مخاطر استدامة الدين السيادي',
      titleEn: 'Sovereign Debt Sustainability Risk',
      category: 'debt',
      currentValue: Math.round(dsVal * 10) / 10,
      thresholdWarning: dsThresh.warning,
      thresholdCritical: dsThresh.critical,
      unit: '% من الناتج',
      status: dsStatus,
      confidenceScorePct: 98,
      contributingVariables: [
        { nameAr: 'رصيد الدين السيادي القائم', nameEn: 'Total Sovereign Debt', value: `${dsVal.toFixed(1)}%`, weightPct: 70 },
        { nameAr: 'سعر الفائدة الحقيقي ومعدل النمو', nameEn: 'Interest-Growth Differential (r - g)', value: '+1.4%', weightPct: 30 },
      ],
      thresholdRationaleAr: 'تجاوز الدين لنسبة 75% يرفع علاوة المخاطر السيادية، وفوق 90% يزاحم الاستثمار الخاص بقوة.',
      thresholdRationaleEn: 'Debt above 75% widens sovereign spreads; above 90% causes severe crowding out and restructuring risk.',
      recommendedResponsesAr: [
        'وضع سقف تشريعي دستوري ملزم لنمو الدين العام.',
        'إعادة تمويل السندات قصيرة الأجل بسندات تنموية خضراء طويلة الأجل.',
      ],
      recommendedResponsesEn: [
        'Enact statutory fiscal debt anchors.',
        'Refinance short-dated maturities with long-dated green development bonds.',
      ],
    },
    {
      id: 'EWS_INFLATION',
      key: 'inflation_pressure',
      titleAr: 'الضغوط التضخمية وتآكل القوة الشرائية',
      titleEn: 'Inflation Pressure & Purchasing Power Erosion',
      category: 'inflation',
      currentValue: Math.round(infVal * 10) / 10,
      thresholdWarning: infThresh.warning,
      thresholdCritical: infThresh.critical,
      unit: '%',
      status: infStatus,
      confidenceScorePct: 92,
      contributingVariables: [
        { nameAr: 'معدل التضخم السنوي العام', nameEn: 'Headline Annual CPI', value: `${infVal.toFixed(1)}%`, weightPct: 65 },
        { nameAr: 'فجوة الناتج الإجمالي', nameEn: 'Output Gap', value: `${((macro.realGdp - 350) / 3.5).toFixed(1)}%`, weightPct: 35 },
      ],
      thresholdRationaleAr: 'تضخم أعلى من 6% يقوض دخل الفئات المتوسطة، وأعلى من 10% يؤدي لدوامة أجور-أسعار يصعب كبحها.',
      thresholdRationaleEn: 'Inflation above 6% destabilizes household budgets; above 10% risks an entrenched wage-price spiral.',
      recommendedResponsesAr: [
        'رفع سعر الفائدة الأساسي للبنك المركزي للوصول إلى معدل فائدة حقيقي موجب.',
        'تسهيل تدفق الواردات الغذائية الأساسية لزيادة المعروض.',
      ],
      recommendedResponsesEn: [
        'Hike central bank policy rates to restore positive real interest rates.',
        'Ease logistics and tariff bottlenecks on essential food imports.',
      ],
    },
    {
      id: 'EWS_FOOD_ENERGY',
      key: 'food_energy_stress',
      titleAr: 'إجهاد إمدادات الغذاء والطاقة',
      titleEn: 'Food & Energy Supply Stress Index',
      category: 'food_energy',
      currentValue: feVal,
      thresholdWarning: feThresh.warning,
      thresholdCritical: feThresh.critical,
      unit: 'نقطة (0-100)',
      status: feStatus,
      confidenceScorePct: 85,
      contributingVariables: [
        { nameAr: 'الاعتماد على استيراد الوقود والغذاء', nameEn: 'Import Vulnerability', value: '42%', weightPct: 50 },
        { nameAr: 'حصة الطاقة المتجددة في الشبكة', nameEn: 'Renewable Power Share', value: `${energy.renewableEnergyPct.toFixed(1)}%`, weightPct: 50 },
      ],
      thresholdRationaleAr: 'تجاوز 55 نقطة يشير لتعرض الدولة الشديد للتقلبات الخارجية، وفوق 75 نقطة ينذر بانقطاعات إمداد فعلية.',
      thresholdRationaleEn: 'Above 55 points indicates severe exposure to external commodity shocks; above 75 signals physical shortfall risk.',
      recommendedResponsesAr: [
        'تسريع مشروعات الصوامع الاستراتيجية لتأمين مخزون حبوب لـ 9 أشهر.',
        'تحفيز إنتاج الطاقة المتجددة اللامركزية وتحديث شبكة التوزيع.',
      ],
      recommendedResponsesEn: [
        'Expand strategic grain silos to secure at least 9 months of buffer reserves.',
        'Accelerate distributed solar adoption and upgrade grid transmission capacity.',
      ],
    },
    {
      id: 'EWS_LABOR',
      key: 'employment_deterioration',
      titleAr: 'تدهور سوق العمل وتراكم البطالة',
      titleEn: 'Labor Market Deterioration & Unemployment',
      category: 'labor',
      currentValue: Math.round(unempVal * 10) / 10,
      thresholdWarning: unempThresh.warning,
      thresholdCritical: unempThresh.critical,
      unit: '%',
      status: unempStatus,
      confidenceScorePct: 90,
      contributingVariables: [
        { nameAr: 'معدل البطالة العام', nameEn: 'National Unemployment Rate', value: `${unempVal.toFixed(1)}%`, weightPct: 70 },
        { nameAr: 'نسبة المشاركة في القوى العاملة', nameEn: 'Labor Participation Rate', value: `${demo.laborForceParticipationRate.toFixed(1)}%`, weightPct: 30 },
      ],
      thresholdRationaleAr: 'ارتفاع البطالة فوق 9% يهدر الطاقات الإنتاجية، وفوق 12% يتسبب في ركود دائم وهجرة العقول.',
      thresholdRationaleEn: 'Unemployment above 9% indicates substantial productive slack; above 12% induces long-term scarring and brain drain.',
      recommendedResponsesAr: [
        'تخفيف الرسوم والاشتراكات التأمينية على المنشآت الصغيرة لتشجيع التوظيف الرسمي.',
        'إطلاق برامج تدريب مهني مكثفة ممولة بالشراكة مع القطاع الخاص.',
      ],
      recommendedResponsesEn: [
        'Reduce payroll taxes on small enterprises to foster formal job creation.',
        'Roll out co-funded apprenticeships aligned with private sector skill demands.',
      ],
    },
    {
      id: 'EWS_HEALTH',
      key: 'healthcare_pressure',
      titleAr: 'الضغط على الطاقة الاستيعابية للرعاية الصحية',
      titleEn: 'Healthcare System Capacity Pressure',
      category: 'health',
      currentValue: healthVal,
      thresholdWarning: healthThresh.warning,
      thresholdCritical: healthThresh.critical,
      unit: 'مؤشر الضغط (0-100)',
      status: healthStatus,
      confidenceScorePct: 84,
      contributingVariables: [
        { nameAr: 'مؤشر جودة الرعاية الصحية العامة', nameEn: 'Healthcare Quality Index', value: `${(currentState.humanCapital.healthcareQualityIndex || 60).toFixed(1)}/100`, weightPct: 60 },
        { nameAr: 'مؤشر الضغط الديموغرافي', nameEn: 'Demographic Strain', value: '38%', weightPct: 40 },
      ],
      thresholdRationaleAr: 'مؤشر فوق 50 يعكس طول قوائم الانتظار في المستشفيات، وفوق 70 يشير لخطر نقص الأسرة والأطباء.',
      thresholdRationaleEn: 'Above 50 points reflects surgical wait times; above 70 indicates critical shortages of clinical staff and acute beds.',
      recommendedResponsesAr: [
        'زيادة مخصصات التشغيل والصيانة للمراكز الصحية الأولية بالأرياف.',
        'تحسين كادر رواتب الأطباء والتمريض للحد من الهجرة الطبية.',
      ],
      recommendedResponsesEn: [
        'Augment operational budgets for primary health centers in rural provinces.',
        'Upgrade clinical compensation scales to stem medical professional emigration.',
      ],
    },
    {
      id: 'EWS_WATER',
      key: 'water_stress',
      titleAr: 'الإجهاد المائي والشح الهيدرولوجي',
      titleEn: 'Hydrological Scarcity & Water Stress Index',
      category: 'water',
      currentValue: waterVal,
      thresholdWarning: waterThresh.warning,
      thresholdCritical: waterThresh.critical,
      unit: 'مؤشر الشح (0-100)',
      status: waterStatus,
      confidenceScorePct: 82,
      contributingVariables: [
        { nameAr: 'نصيب الفرد السنوي من المياه المتجددة', nameEn: 'Per Capita Renewable Water', value: '580 م³', weightPct: 60 },
        { nameAr: 'كفاءة شبكات توزيع مياه الشرب', nameEn: 'Water Distribution Loss', value: '28%', weightPct: 40 },
      ],
      thresholdRationaleAr: 'فوق 60 نقطة تصنف الدولة تحت خط الفقر المائي الحرج وتتعرض الزراعة لمخاطر فقدان المحاصيل.',
      thresholdRationaleEn: 'Above 60 points classifies the country under critical water stress, threatening irrigation security.',
      recommendedResponsesAr: [
        'تأهيل شبكات المياه لتقليص الفاقد المائي الفيزيائي.',
        'التحول الإلزامي للري بالتنقيط في الزراعة مع التوسع في محطات التحلية بالطاقة الشمسية.',
      ],
      recommendedResponsesEn: [
        'Rehabilitate municipal pipe networks to cut distribution losses.',
        'Mandate precision drip irrigation and expand solar-powered desalination.',
      ],
    },
    {
      id: 'EWS_INFRA',
      key: 'infrastructure_decay',
      titleAr: 'تدهور وتآكل البنية التحتية واللوجستيات',
      titleEn: 'Infrastructure Decay & Asset Depreciation',
      category: 'infrastructure',
      currentValue: infraVal,
      thresholdWarning: infraThresh.warning,
      thresholdCritical: infraThresh.critical,
      unit: 'مؤشر التدهور (0-100)',
      status: infraStatus,
      confidenceScorePct: 88,
      contributingVariables: [
        { nameAr: 'الاستثمار العام السنوي في البنية', nameEn: 'Annual Infrastructure Capex', value: `$${(currentState.macro.expenditureInfrastructure || 18).toFixed(1)}B`, weightPct: 65 },
        { nameAr: 'معدل إهلاك الأصول الرأسمالية', nameEn: 'Capital Asset Depreciation Rate', value: '4.8%', weightPct: 35 },
      ],
      thresholdRationaleAr: 'فوق 55 نقطة يعني أن الاستثمار الجديد لا يغطي إهلاك الطرق والموانئ، مما يرفع كلفة التشغيل.',
      thresholdRationaleEn: 'Above 55 points indicates capital renewal lags physical depreciation, escalating transport costs.',
      recommendedResponsesAr: [
        'تخصيص صندوق مستقل لصيانة الأصول الحيوية والبنية التحتية.',
        'إشراك القطاع الخاص بنظام الشراكة (PPP) في إدارة وتشغيل الموانئ والمطارات.',
      ],
      recommendedResponsesEn: [
        'Establish a ring-fenced preventive infrastructure maintenance fund.',
        'Deploy Public-Private Partnerships (PPP) for airport and freight terminal modernization.',
      ],
    },
    {
      id: 'EWS_INEQUALITY',
      key: 'regional_inequality',
      titleAr: 'تفاوت الدخل وعدم المساواة الإقليمية',
      titleEn: 'Regional & Income Inequality (Gini Index)',
      category: 'inequality',
      currentValue: regGiniVal,
      thresholdWarning: regThresh.warning,
      thresholdCritical: regThresh.critical,
      unit: 'نقطة جيني (0-100)',
      status: regStatus,
      confidenceScorePct: 89,
      contributingVariables: [
        { nameAr: 'معامل جيني لتوزيع الدخل', nameEn: 'Gini Coefficient', value: `${regGiniVal}`, weightPct: 70 },
        { nameAr: 'فجوة الدخل بين العاصمة والأقاليم', nameEn: 'Metropolitan vs Regional Income Gap', value: '2.4x', weightPct: 30 },
      ],
      thresholdRationaleAr: 'معامل جيني فوق 40 نقطة يعكس فجوات اجتماعية واسعة، وفوق 46 ينذر بتراجع الحراك الاجتماعي.',
      thresholdRationaleEn: 'Gini above 40 points reflects high income polarization; above 46 indicates stagnating economic mobility.',
      recommendedResponsesAr: [
        'تطبيق ضريبة تصاعدية عادلة على الدخول العليا وإعادة توزيع الحصيلة للأقاليم الأقل نمواً.',
        'تقديم حوافز ضريبية للمصانع والشركات التي تنشئ فروعاً في المحافظات النائية.',
      ],
      recommendedResponsesEn: [
        'Apply progressive income tax schedules and redistribute proceeds through regional equalization grants.',
        'Provide targeted tax holidays for manufacturing setups in disadvantaged provinces.',
      ],
    },
    {
      id: 'EWS_SERVICES',
      key: 'service_deterioration',
      titleAr: 'تراجع كفاءة وجودة الخدمات الإدارية والعامة',
      titleEn: 'Public Service Delivery Deterioration',
      category: 'services',
      currentValue: srvVal,
      thresholdWarning: srvThresh.warning,
      thresholdCritical: srvThresh.critical,
      unit: 'مؤشر التراجع (0-100)',
      status: srvStatus,
      confidenceScorePct: 87,
      contributingVariables: [
        { nameAr: 'مؤشر الفعالية الحكومية', nameEn: 'Government Effectiveness Index', value: `${govEff.toFixed(1)}/100`, weightPct: 75 },
        { nameAr: 'زمن إنجاز المعاملات والتراخيص', nameEn: 'Business Licensing Delays', value: '24 يوماً', weightPct: 25 },
      ],
      thresholdRationaleAr: 'مؤشر تراجع الخدمات فوق 45 يضعف مناخ الأعمال، وفوق 60 نقطة يشير إلى جمود بيروقراطي مزمن.',
      thresholdRationaleEn: 'Above 45 points harms domestic business environment; above 60 indicates severe bureaucratic inertia.',
      recommendedResponsesAr: [
        'أتمتة كافة التراخيص الحكومية وربط قواعد البيانات رقمياً للقضاء على الروتين.',
        'ربط تقييم القيادات التنفيذية بمؤشرات أداء واضحة (KPIs) لسرعة إنجاز معاملات المواطنين.',
      ],
      recommendedResponsesEn: [
        'Digitize all municipal licensing and interconnect inter-agency registries.',
        'Link senior administrative compensation to transparent delivery KPIs.',
      ],
    },
  ];
}
