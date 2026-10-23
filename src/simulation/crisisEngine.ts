/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Crisis & Event Engine (Phase 5)
 * محرك إدارة الأزمات والصدمات المركبة وقواعد الانتشار والتعافي
 */

import { SimulationState } from '../types/simulation';
import { CrisisEvent, CrisisCategory } from '../types/planning';

/**
 * Standard Library of 9 Configurable National Crisis Archetypes
 */
export const ARCHETYPE_CRISES: CrisisEvent[] = [
  {
    id: 'crisis_commodity_spike',
    category: 'commodity_shock',
    nameAr: 'صدمة قفزة أسعار السلع والمحروقات العالمية',
    nameEn: 'Global Commodity & Fuel Price Shock',
    descriptionAr: 'ارتفاع مفاجئ وحاد في أسعار النفط، الغاز، والقمح في الأسواق الدولية بنسبة 45% نتيجة توترات جيوسياسية في الممرات البحرية.',
    descriptionEn: 'Acute 45% spike in international oil, gas, and grain prices driven by maritime bottleneck disruptions.',
    triggerConditionAr: 'قفزة مؤشر أسعار السلع العالمية فوق 140 نقطة أساس.',
    triggerConditionEn: 'Global commodity price index exceeds 140 baseline points.',
    startYear: 2025,
    durationYears: 2,
    severityPct: 55,
    isActive: false,
    affectedVariables: [
      { variableKey: 'inflationRate', variableNameAr: 'معدل التضخم السنوي', impactFactor: 4.8, unit: '% نقطة مئوية' },
      { variableKey: 'tradeDeficit', variableNameAr: 'فاتورة الواردات الغذائية والطاقية', impactFactor: 12.5, unit: 'مليار دولار' },
      { variableKey: 'subsidyCost', variableNameAr: 'تكاليف دعم المحروقات والخبز', impactFactor: 6.2, unit: 'مليار دولار' },
    ],
    propagationRulesAr: [
      'ارتفاع كلفة الطاقة يزيد تكاليف النقل والإنتاج الصناعي مما يغذي تضخم التكلفة (Cost-Push).',
      'تآكل الدخل المتاح للأسر يقلص الاستهلاك الحقيقي بنسبة 2.5%.',
      'زيادة الإنفاق على الدعم ترفع عجز الموازنة وتضغط على رصيد الاحتياطي النقدي.',
    ],
    propagationRulesEn: [
      'Elevated energy tariffs inflate manufacturing and transportation logistics costs (cost-push inflation).',
      'Purchasing power contraction suppresses household real consumption by 2.5%.',
      'Automatic subsidy stabilizers expand budget deficit and drain foreign exchange reserves.',
    ],
    recoveryHalfLifeYears: 1.5,
  },
  {
    id: 'crisis_drought_water',
    category: 'drought_water',
    nameAr: 'موجة جفاف حاد وشح مائي ممتد',
    nameEn: 'Severe Drought & Acute Water Stress',
    descriptionAr: 'انحباس الأمطار وتراجع منسوب السدود بنسبة 40% لموسمين متتاليين، مما يؤثر على الإنتاج الزراعي وتوليد الطاقة الكهرومائية.',
    descriptionEn: 'Severe rainfall deficit reducing reservoir storage by 40% across two consecutive seasons, curtailing agriculture and hydropower.',
    triggerConditionAr: 'تراجع الهطول المطري السنوي بنسبة 35% عن المعدل التاريخي.',
    triggerConditionEn: 'Annual precipitation drops 35% below 30-year historical mean.',
    startYear: 2025,
    durationYears: 3,
    severityPct: 65,
    isActive: false,
    affectedVariables: [
      { variableKey: 'agriOutput', variableNameAr: 'الإنتاج الزراعي والحيواني', impactFactor: -28.0, unit: '%' },
      { variableKey: 'foodInflation', variableNameAr: 'تضخم السلع الغذائية الطازجة', impactFactor: 8.5, unit: '%' },
      { variableKey: 'ruralEmployment', variableNameAr: 'التوظيف الريفي والموسمي', impactFactor: -12.0, unit: '%' },
    ],
    propagationRulesAr: [
      'تراجع المحاصيل يرفع أسعار المواد الغذائية الطازجة وتضطر الدولة لمضاعفة استيراد الحبوب.',
      'هجرة داخلية من المناطق الريفية الجافة نحو أطراف المدن الكبرى مما يضغط على الخدمات الحضرية.',
      'تراجع توليد الكهرباء من السدود يرفع الاعتماد على الوقود الأحفوري المكلف.',
    ],
    propagationRulesEn: [
      'Crop shortfalls push domestic food prices up and necessitate emergency grain imports.',
      'Rural distress sparks internal migration toward peri-urban settlements, straining municipal services.',
      'Hydro generation slump requires burning costlier liquid thermal fuels.',
    ],
    recoveryHalfLifeYears: 2.0,
  },
  {
    id: 'crisis_trade_disruption',
    category: 'trade_disruption',
    nameAr: 'تعطل سلاسل التوريد والملاحة التجارية',
    nameEn: 'Supply Chain Bottlenecks & Shipping Disruption',
    descriptionAr: 'أزمة لوجستية خانقة وتكدس الحاويات في الموانئ مع ارتفاع أجور الشحن البحري بنسبة 70% وتأخر وصول مدخلات الإنتاج الصناعي.',
    descriptionEn: 'Container port congestion and 70% surge in maritime freight charges delaying delivery of crucial industrial inputs.',
    triggerConditionAr: 'إغلاق أو تعطل ممرات ملاحة رئيسية وتأخر تفريغ الموانئ بأكثر من 18 يوماً.',
    triggerConditionEn: 'Transit choke-points or port turnaround delay exceeding 18 days.',
    startYear: 2025,
    durationYears: 1,
    severityPct: 45,
    isActive: false,
    affectedVariables: [
      { variableKey: 'importPriceIndex', variableNameAr: 'مؤشر أسعار المستوردات الوسيطة', impactFactor: 22.0, unit: '%' },
      { variableKey: 'industrialCapacity', variableNameAr: 'استغلال الطاقة الإنتاجية للمصانع', impactFactor: -15.0, unit: '%' },
      { variableKey: 'exportDelays', variableNameAr: 'حصيلة الصادرات غير النفطية', impactFactor: -9.0, unit: '%' },
    ],
    propagationRulesAr: [
      'نقص قطع الغيار ومدخلات الإنتاج يبطئ وتيرة العمل في المصانع ويؤجل تسليم العقود.',
      'ارتفاع تكاليف الشحن ينعكس مباشرة على أسعار التجزئة في الأسواق المحلية.',
    ],
    propagationRulesEn: [
      'Shortage of intermediate inputs idles industrial assembly lines and delays export commitments.',
      'Surging container rates pass through directly to retail goods prices.',
    ],
    recoveryHalfLifeYears: 1.0,
  },
  {
    id: 'crisis_energy_interruption',
    category: 'energy_interruption',
    nameAr: 'انقطاع إمدادات الطاقة وعجز الشبكة الكهربائية',
    nameEn: 'Power Grid Failure & Critical Energy Disruption',
    descriptionAr: 'عطل فني كبير في خط أنابيب الغاز المغذي لمحطات التوليد مع موجة حر استثنائية أدت لانقطاعات مجدولة للتيار الكهربائي عن المصانع.',
    descriptionEn: 'Major compressor failure on main transmission pipeline during extreme heatwave forcing industrial load shedding.',
    triggerConditionAr: 'عجز التوليد عن تلبية ذروة الطلب بأكثر من 20% لمدة تتجاوز أسبوعين.',
    triggerConditionEn: 'Capacity deficit exceeding 20% of peak load over two weeks.',
    startYear: 2025,
    durationYears: 1,
    severityPct: 50,
    isActive: false,
    affectedVariables: [
      { variableKey: 'manufacturingGdp', variableNameAr: 'الناتج الصناعي التحويلي', impactFactor: -18.0, unit: '%' },
      { variableKey: 'emergencyFuelImports', variableNameAr: 'استيراد وقود طوارئ عاجل', impactFactor: 4.5, unit: 'مليار دولار' },
    ],
    propagationRulesAr: [
      'توقف المصانع عن العمل وتلف بعض المواد نصف المصنعة وخسارة عقود التصدير.',
      'تكاليف إضافية على الشركات لتشغيل مولدات الديزل الخاصة مرتفعة الكلفة.',
    ],
    propagationRulesEn: [
      'Factory downtime damages work-in-progress inventory and defaults on delivery penalties.',
      'Enterprises bear heavy diesel generator operating expenses.',
    ],
    recoveryHalfLifeYears: 0.8,
  },
  {
    id: 'crisis_health_emergency',
    category: 'health_emergency',
    nameAr: 'طوارئ وبائية وضغط حاد على المنظومة الصحية',
    nameEn: 'Epidemic Surge & Healthcare System Stress',
    descriptionAr: 'انتشار موجة وبائية تنفسية حادة ترفع معدلات الإشغال في المستشفيات إلى 95%، وتستدعي إغلاقات جزئية وتدابير تباعد وتخصيص ميزانيات علاج استثنائية.',
    descriptionEn: 'Aggressive respiratory contagion causing 95% ICU bed saturation, partial economic restrictions, and emergency health spending.',
    triggerConditionAr: 'تجاوز عدد الحالات النشطة الطاقة الاستيعابية لأقسام العناية المركزة بنسبة 120%.',
    triggerConditionEn: 'Active acute hospitalizations exceeding ICU capacity by 120%.',
    startYear: 2025,
    durationYears: 2,
    severityPct: 60,
    isActive: false,
    affectedVariables: [
      { variableKey: 'laborParticipation', variableNameAr: 'المشاركة في القوى العاملة (بسبب المرض)', impactFactor: -5.5, unit: '%' },
      { variableKey: 'healthExpenditure', variableNameAr: 'الإنفاق الصحي الاستثنائي', impactFactor: 7.2, unit: 'مليار دولار' },
      { variableKey: 'servicesConsumption', variableNameAr: 'استهلاك خدمات السياحة والترفيه', impactFactor: -25.0, unit: '%' },
    ],
    propagationRulesAr: [
      'تراجع ساعات العمل المنجزة وتوقف قطاعات الضيافة والمطاعم والطيران.',
      'تحويل اعتمادات مالية من استثمارات البنية التحتية إلى بند الأدوية والمستلزمات الطبية.',
    ],
    propagationRulesEn: [
      'Suppressed hours worked and widespread slowdown across hospitality, retail, and transit.',
      'Emergency reallocation of capital expenditure towards medical equipment and clinical staff.',
    ],
    recoveryHalfLifeYears: 1.2,
  },
  {
    id: 'crisis_natural_disaster',
    category: 'natural_disaster',
    nameAr: 'كارثة طبيعية وفيضانات تضرب أقاليم حيوية',
    nameEn: 'Catastrophic Flash Flooding & Infrastructure Washout',
    descriptionAr: 'فيضانات وسيول جارفة تدمر جسوراً وشبكات مياه وطرقاً رئيسية في إقليمين حيويين، مسببة تشريد آلاف السكان وتعطل الحركة التجارية.',
    descriptionEn: 'Catastrophic riverine flooding destroying bridges, roads, and drinking water mains across two key productive provinces.',
    triggerConditionAr: 'حجم الخسائر المادية المباشرة يتجاوز 3.5% من الناتج المحلي الإجمالي.',
    triggerConditionEn: 'Direct physical damage exceeding 3.5% of annual real GDP.',
    startYear: 2025,
    durationYears: 2,
    severityPct: 70,
    isActive: false,
    affectedVariables: [
      { variableKey: 'infrastructureStock', variableNameAr: 'رصيد البنية التحتية الصالحة', impactFactor: -8.0, unit: '%' },
      { variableKey: 'emergencyReconstruction', variableNameAr: 'تكاليف الإغاثة وإعادة الإعمار', impactFactor: 11.0, unit: 'مليار دولار' },
      { variableKey: 'regionalDisplacement', variableNameAr: 'عدد النازحين داخلياً', impactFactor: 320, unit: 'ألف شخص' },
    ],
    propagationRulesAr: [
      'انقطاع سبل الاتصال واللوجستيات بين الموانئ والمصانع الداخلية.',
      'توجيه موازنات الطوارئ لإعادة فتح الطرق وترميم شبكات مياه الشرب والصرف الصحي.',
    ],
    propagationRulesEn: [
      'Logistical severed routes between coastal ports and inland manufacturing basins.',
      'Emergency mobilization of fiscal contingency reserves for bridge and water system restoration.',
    ],
    recoveryHalfLifeYears: 2.5,
  },
  {
    id: 'crisis_financial_pressure',
    category: 'financial_pressure',
    nameAr: 'أزمة ضغوط مالية وقفزة في عوائد السندات السيادية',
    nameEn: 'Sovereign Debt Spread Spike & Liquidity Squeeze',
    descriptionAr: 'تدهور معنويات الأسواق الدولية وخفض التصنيف الائتماني يقفز بهامش الفائدة على سندات الدولة بمقدار 450 نقطة أساس مع خروج تدفقات رؤوس الأموال الساخنة.',
    descriptionEn: 'Credit rating downgrade and global risk-off environment widening sovereign bond yield spread by 450 bps, triggering capital outflows.',
    triggerConditionAr: 'اتساع الفارق بين السندات السيادية والسندات المرجعية الدولية فوق 750 نقطة أساس.',
    triggerConditionEn: 'Sovereign debt risk premium exceeds 750 bps over benchmark treasuries.',
    startYear: 2025,
    durationYears: 2,
    severityPct: 65,
    isActive: false,
    affectedVariables: [
      { variableKey: 'debtServiceCost', variableNameAr: 'فاتورة خدمة الدين والفوائد السنوية', impactFactor: 8.5, unit: 'مليار دولار' },
      { variableKey: 'exchangeRateDepreciation', variableNameAr: 'تراجع سعر صرف العملة المحلية', impactFactor: -18.0, unit: '%' },
      { variableKey: 'privateCreditGrowth', variableNameAr: 'نمو الائتمان المصرفي للشركات', impactFactor: -14.0, unit: '%' },
    ],
    propagationRulesAr: [
      'التصاعد الكبير في تكلفة الفوائد يبتلع ربع الموازنة العامة ويزاحم الإنفاق الاجتماعي.',
      'تراجع سعر الصرف يؤدي لتضخم مستورد ويرفع كلفة سداد الديون المقومة بالعملات الأجنبية.',
    ],
    propagationRulesEn: [
      'Debt servicing obligations absorb over 25% of general budget revenues, crowding out schools and clinics.',
      'Currency depreciation feeds imported inflation and balloons external debt servicing in local currency.',
    ],
    recoveryHalfLifeYears: 2.0,
  },
  {
    id: 'crisis_infrastructure_failure',
    category: 'infrastructure_failure',
    nameAr: 'انهيار محور نقل لوجستي حيوي (شريان التجارة)',
    nameEn: 'Critical Logistics Corridor & Bridge Failure',
    descriptionAr: 'انهيار جسر استراتيجي أو هبوط أرضي على الخط السككي المحوري الرابط بين الميناء الرئيسي وعاصمة الدولة، مما يشل نقل البضائع لمدة 6 أشهر.',
    descriptionEn: 'Structural failure of strategic railway viaduct connecting main container port to capital metropolis, paralyzing bulk transit.',
    triggerConditionAr: 'توقف حركة الشحن عبر الشريان الوطني الرئيسي لأكثر من 30 يوماً.',
    triggerConditionEn: 'Complete freight halt on primary trade artery exceeding 30 days.',
    startYear: 2025,
    durationYears: 1,
    severityPct: 40,
    isActive: false,
    affectedVariables: [
      { variableKey: 'internalFreightCost', variableNameAr: 'تكاليف النقل الداخلي للطن/كم', impactFactor: 38.0, unit: '%' },
      { variableKey: 'deliveryLeadTime', variableNameAr: 'زمن توصيل المواد للأسواق', impactFactor: 250.0, unit: '%' },
    ],
    propagationRulesAr: [
      'اللجوء لطرق التفافية بديلة وعرة يؤدي لزيادة استهلاك الوقود وازدحام شديد وتلف البضائع سريعة العطب.',
    ],
    propagationRulesEn: [
      'Diversion to circuitous secondary roads increases fuel consumption, vehicle wear, and spoilage of perishable goods.',
    ],
    recoveryHalfLifeYears: 0.8,
  },
  {
    id: 'crisis_regional_downturn',
    category: 'regional_downturn',
    nameAr: 'ركود اقتصادي محلي حاد في الحوض الصناعي الرئيسي',
    nameEn: 'Localized Industrial Basin Contraction & Firm Closures',
    descriptionAr: 'إفلاس مجمع بتروكيماويات أو حديد رئيسي في الحوض الصناعي يؤدي لتسريح 45 ألف عامل وإغلاق عشرات الورش المغذية وانخفاض إيرادات البلدية.',
    descriptionEn: 'Insolvency of anchor industrial conglomerate triggering 45k layoffs and cascading supplier shutdowns across industrial basin.',
    triggerConditionAr: 'ارتفاع البطالة في الإقليم بأكثر من 6 نقاط مئوية عن المعدل الوطني.',
    triggerConditionEn: 'Provincial unemployment diverges by >6 percentage points from national average.',
    startYear: 2025,
    durationYears: 2,
    severityPct: 50,
    isActive: false,
    affectedVariables: [
      { variableKey: 'regionalUnemployment', variableNameAr: 'بطالة الحوض الصناعي', impactFactor: 7.5, unit: '%' },
      { variableKey: 'regionalGdpContraction', variableNameAr: 'انكماش الناتج الإقليمي للحوض', impactFactor: -11.0, unit: '%' },
    ],
    propagationRulesAr: [
      'انخفاض القوة الشرائية في الإقليم يؤدي إلى ركود تجارة التجزئة والخدمات المحلية.',
      'مطالبات بتدخل صندوق الإنقاذ الحكومي لتمويل تسويات العمال وحزم التحفيز.',
    ],
    propagationRulesEn: [
      'Local purchasing power contraction depresses municipal commerce and housing values.',
      'Calls for sovereign bailout facility to underwrite worker severance and regional stimulus.',
    ],
    recoveryHalfLifeYears: 1.5,
  },
];

/**
 * Propagates active crises onto simulation state variables realistically
 */
export function applyCrisisToState(
  state: SimulationState,
  activeCrises: CrisisEvent[]
): SimulationState {
  if (activeCrises.length === 0) return state;

  // Clone deeply
  const updated: SimulationState = JSON.parse(JSON.stringify(state));

  for (const crisis of activeCrises) {
    if (!crisis.isActive) continue;

    const intensity = crisis.severityPct / 100;

    switch (crisis.category) {
      case 'commodity_shock':
        updated.macro.inflationRate += 3.5 * intensity;
        updated.macro.overallDeficit += 5.0 * intensity;
        updated.macro.realGdp *= (1 - 0.015 * intensity);
        break;

      case 'drought_water':
        updated.macro.realGdp *= (1 - 0.025 * intensity);
        updated.macro.inflationRate += 2.0 * intensity;
        updated.demographics.unemploymentRate += 1.2 * intensity;
        updated.governance.povertyRatePct += 1.5 * intensity;
        break;

      case 'trade_disruption':
        updated.macro.realGdp *= (1 - 0.018 * intensity);
        updated.macro.inflationRate += 2.2 * intensity;
        break;

      case 'energy_interruption':
        updated.macro.realGdp *= (1 - 0.022 * intensity);
        updated.macro.overallDeficit += 3.0 * intensity;
        break;

      case 'health_emergency':
        updated.demographics.laborForceParticipationRate *= (1 - 0.03 * intensity);
        updated.macro.realGdp *= (1 - 0.03 * intensity);
        updated.macro.overallDeficit += 6.5 * intensity;
        updated.macro.debtToGdpRatio += 3.0 * intensity;
        break;

      case 'natural_disaster':
        updated.macro.realGdp *= (1 - 0.035 * intensity);
        updated.macro.overallDeficit += 8.0 * intensity;
        updated.macro.debtToGdpRatio += 4.5 * intensity;
        break;

      case 'financial_pressure':
        updated.macro.debtToGdpRatio += 5.0 * intensity;
        updated.macro.inflationRate += 3.0 * intensity;
        updated.macro.realGdp *= (1 - 0.02 * intensity);
        break;

      case 'infrastructure_failure':
        updated.macro.realGdp *= (1 - 0.015 * intensity);
        updated.macro.inflationRate += 1.2 * intensity;
        break;

      case 'regional_downturn':
        updated.demographics.unemploymentRate += 1.5 * intensity;
        updated.governance.socialTensionIndex += 8.0 * intensity;
        break;

      case 'custom_event':
        // Custom user event
        for (const aff of crisis.affectedVariables) {
          if (aff.variableKey === 'inflationRate') {
            updated.macro.inflationRate += aff.impactFactor * intensity;
          } else if (aff.variableKey === 'realGdp') {
            updated.macro.realGdp *= (1 + (aff.impactFactor / 100) * intensity);
          } else if (aff.variableKey === 'unemploymentRate') {
            updated.demographics.unemploymentRate += aff.impactFactor * intensity;
          } else if (aff.variableKey === 'debtToGdpRatio') {
            updated.macro.debtToGdpRatio += aff.impactFactor * intensity;
          }
        }
        break;
    }
  }

  // Bound variables within realistic economic ranges
  updated.macro.inflationRate = Math.max(-5, Math.min(80, updated.macro.inflationRate));
  updated.demographics.unemploymentRate = Math.max(1, Math.min(45, updated.demographics.unemploymentRate));
  updated.macro.debtToGdpRatio = Math.max(5, Math.min(250, updated.macro.debtToGdpRatio));

  return updated;
}
