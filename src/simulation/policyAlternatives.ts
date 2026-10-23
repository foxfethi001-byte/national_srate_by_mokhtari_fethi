/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Policy Alternatives Multi-Criteria Evaluation Matrix (Phase 5)
 * مصفوفة مقارنة البدائل الاستراتيجية للسياسات العامة وتحليل الآثار غير المقصودة والعدالة التوزيعية
 */

import { SimulationState, PolicySettings } from '../types/simulation';
import { PolicyAlternative } from '../types/planning';

/**
 * Generates the 4 standardized strategic policy alternatives from identical initial conditions
 */
export function getPolicyAlternatives(
  baseState: SimulationState,
  plannedPolicies?: Partial<PolicySettings>
): PolicyAlternative[] {
  const gdp = baseState.macro.realGdp;
  const debt = baseState.macro.debtToGdpRatio;

  return [
    {
      id: 'baseline',
      titleAr: 'السيناريو المرجعي (الوضع الراهن دون تغيير السياسات)',
      titleEn: 'Baseline Scenario (Status Quo / No Policy Shift)',
      descriptionAr: 'استمرار العمل بالقواعد المالية والنقدية والضرائبية الحالية دون إطلاق برامج تنموية أو استثمارية إضافية.',
      descriptionEn: 'Continuation of prevailing fiscal, monetary, and tax frameworks without introducing major new structural programs.',
      stanceAr: 'جمود السياسات والاعتماد على النمو العفوي',
      stanceEn: 'Policy inertia & spontaneous market evolution',
      riskRating: 'moderate',
      keyPolicies: {
        budgetInfrastructurePctGdp: 4.5,
        taxRateIncome: 20.0,
        taxRateCorporate: 20.0,
        budgetSocialSafetyPctGdp: 2.0,
        carbonTaxPerTon: 0,
      },
      projectedMetrics: {
        gdpGrowth5YrAvg: 2.2,
        debtToGdpFinal: Math.round((debt + 4.2) * 10) / 10,
        inflationAvg: 3.4,
        unemploymentFinal: 9.8,
        povertyRateFinal: 15.2,
        co2ReductionPct: 2.5,
      },
      benefitsAr: [
        'استقرار نسبي في بيئة الأعمال وتجنب صدمات التغيير التنظيمي السريع.',
        'عدم فرض أعباء ضريبية جديدة على الشركات أو المواطنين.',
        'وضوح المسار للمستثمرين في المدى القريب دون مفاجآت تشريعية.',
      ],
      benefitsEn: [
        'Regulatory predictability without sudden compliance costs.',
        'No immediate tax hikes on businesses or households.',
        'Short-term stability for incumbent market participants.',
      ],
      costsAr: [
        'خسارة فرص التحول الصناعي ومواكبة الثورة الرقمية والطاقة المتجددة.',
        'تآكل بطيء في البنية التحتية القائمة نتيجة انخفاض مخصصات الصيانة.',
        'بقاء معدلات البطالة بين الشباب مرتفعة فوق 9%.',
      ],
      costsEn: [
        'Missed opportunities in industrial modernization and green transition.',
        'Gradual infrastructure decay due to lean capital budgets.',
        'Persistent youth unemployment above 9%.',
      ],
      tradeoffsAr: [
        'التفضيل للأمان المالي اللحظي على حساب الإنتاجية والنمو في المدى الطويل.',
        'الحفاظ على الركود المستقر بدلاً من المخاطرة التنموية المحسوبة.',
      ],
      tradeoffsEn: [
        'Prioritizes immediate fiscal comfort over long-term structural productivity.',
        'Accepts steady sub-par growth to avoid reform friction.',
      ],
      distributionalImpactAr: 'المكاسب تتركز في المراكز الحضرية القائمة والشركات الكبرى المستقرة، بينما تتراجع فرص العمل في الأقاليم الطرفية.',
      distributionalImpactEn: 'Benefits accrue primarily to established urban centers and incumbent firms; peripheral regions face slow job stagnation.',
      implementationRisksAr: [
        'تراكم الهشاشة الهيكلية مع أي صدمة خارجية مستقبلية في أسعار السلع.',
        'تآكل تدريجي في الثقة الشعبية بالقدرة على إحداث تحول نوعي.',
      ],
      implementationRisksEn: [
        'Cumulative vulnerability to external terms-of-trade shocks.',
        'Gradual erosion of public trust in structural modernization.',
      ],
      unintendedConsequencesAr: [
        'هجرة الكفاءات والشباب المتعلم نحو الخارج بحثاً عن فرص عمل أوسع.',
        'تضخم الاقتصاد غير الرسمي نتيجة نقص ديناميكية القطاع المنظم.',
      ],
      unintendedConsequencesEn: [
        'Brain drain of skilled youth seeking broader global horizons.',
        'Expansion of informal sector due to sluggish formal hiring.',
      ],
    },
    {
      id: 'proposed',
      titleAr: 'الاستراتيجية الوطنية المقترحة (تحول هيكلي متوازن وممول)',
      titleEn: 'Proposed National Strategy (Balanced & Funded Transformation)',
      descriptionAr: 'برنامج إصلاحي متكامل يجمع بين رفع الاستثمار في البنية التحتية والمهارات، مع تعبئة الموارد المحلية وشبكة أمان اجتماعي محكمة.',
      descriptionEn: 'Integrated reform package combining elevated capital investment in green tech and skills, paired with domestic revenue mobilization.',
      stanceAr: 'إصلاح هيكلي متوازن مع انضباط مالي ذكي',
      stanceEn: 'Balanced structural reform with smart fiscal discipline',
      riskRating: 'moderate',
      keyPolicies: {
        budgetInfrastructurePctGdp: 7.8,
        taxRateIncome: 22.0,
        taxRateCorporate: 22.0,
        budgetSocialSafetyPctGdp: 3.2,
        cleanEnergySubsidyPct: 30.0,
        carbonTaxPerTon: 35.0,
        ...plannedPolicies,
      },
      projectedMetrics: {
        gdpGrowth5YrAvg: 4.6,
        debtToGdpFinal: Math.round((debt - 2.5) * 10) / 10,
        inflationAvg: 4.1,
        unemploymentFinal: 6.8,
        povertyRateFinal: 11.2,
        co2ReductionPct: 24.0,
      },
      benefitsAr: [
        'تحفيز النمو الحقيقي وخلق أكثر من 180 ألف فرصة عمل نوعية في الصناعة والخدمات.',
        'خفض انبعاثات الكربون بنسبة 24% وتعزيز الصمود البيئي والمائي.',
        'توسيع الوعاء الضريبي مما يتيح تمويلاً ذاتياً مستداماً للخدمات العامة.',
      ],
      benefitsEn: [
        'Spurs real GDP growth to 4.6% and generates 180k high-skill jobs.',
        'Reduces national carbon emissions by 24% and bolsters climate resilience.',
        'Broadens domestic tax base, achieving sustainable self-funding.',
      ],
      costsAr: [
        'ارتفاع طفيف في معدل التضخم السنوي إلى 4.1% خلال مرحلة ضخ الاستثمارات.',
        'كلفة إدارية وتشريعية لتحديث المنظومة الضريبية وسجل الحماية الاجتماعية.',
      ],
      costsEn: [
        'Mild inflationary uptick to 4.1% during the upfront capital injection phase.',
        'Administrative compliance costs for updating tax and social registry systems.',
      ],
      tradeoffsAr: [
        'تحمل تكاليف انتقالية قصيرة الأجل لصالح مكاسب إنتاجية كبرى في العقد القادم.',
        'إعادة توجيه الدعم من السلع العامة غير الموجهة إلى التحويلات النقدية المشروطة.',
      ],
      tradeoffsEn: [
        'Absorbs short-run transitional friction in exchange for major decade-long productivity gains.',
        'Shifts from inefficient general price subsidies to targeted cash transfers.',
      ],
      distributionalImpactAr: 'أثر إيجابي قوي وملموس على الطبقات العاملة والوسطى؛ توزيع عادل للمشاريع في الأقاليم مع تقليص الفوارق المكانية بنسبة 18%.',
      distributionalImpactEn: 'Strong positive incidence across working and middle classes; balanced territorial distribution narrows regional gaps by 18%.',
      implementationRisksAr: [
        'مخاطر اختناقات التوريد أو تأخير تنفيذ المشاريع الرأسمالية الكبرى.',
        'مقاومة بعض جماعات المصالح لتوسيع الفاتورة الضريبية أو ضريبة الكربون.',
      ],
      implementationRisksEn: [
        'Procurement bottlenecks and execution delays on major capital works.',
        'Political friction from corporate lobbies facing carbon or tax base broadening.',
      ],
      unintendedConsequencesAr: [
        'احتمال ارتفاع أسعار بعض الخدمات اللوجستية محلياً أثناء فترة إنشاء المشاريع.',
        'ضغط مؤقت على قطاع المقاولات المحلي لرفع كفاءة الجودة والسلامة.',
      ],
      unintendedConsequencesEn: [
        'Transient uptick in local freight and logistics rates during peak construction.',
        'Short-term capacity squeeze across domestic civil contracting firms.',
      ],
    },
    {
      id: 'conservative',
      titleAr: 'البديل التحفظي (أولوية التقشف وكبح الدين وإلغاء الاقتراض)',
      titleEn: 'Conservative Alternative (Austerity, Debt Minimization & Reserve Building)',
      descriptionAr: 'استراتيجية تركز حصراً على خفض الإنفاق العام، تجميد التوظيف الحكومي، والتخلص السريع من عجز الموازنة لحماية التصنيف الائتماني.',
      descriptionEn: 'Strategy prioritizing debt reduction, public wage freezes, and rapid zero-deficit achievement to shield sovereign ratings.',
      stanceAr: 'انضباط مالي صارم وتقليص تدخل الدولة',
      stanceEn: 'Strict fiscal discipline & state contraction',
      riskRating: 'high',
      keyPolicies: {
        budgetInfrastructurePctGdp: 2.8,
        taxRateIncome: 18.0,
        taxRateCorporate: 18.0,
        budgetSocialSafetyPctGdp: 1.5,
      },
      projectedMetrics: {
        gdpGrowth5YrAvg: 1.4,
        debtToGdpFinal: Math.round((debt - 14.5) * 10) / 10,
        inflationAvg: 1.8,
        unemploymentFinal: 12.4,
        povertyRateFinal: 19.8,
        co2ReductionPct: 6.0,
      },
      benefitsAr: [
        'هبوط سريع وحاسم في نسبة الدين السيادي وتراجع فوائد خدمة الدين بمقدار 35%.',
        'انخفاض معدل التضخم إلى مستويات متدنية (1.8%) واستقرار سعر الصرف.',
        'رفع الجدارة الائتمانية السيادية لدى وكالات التصنيف الدولية.',
      ],
      benefitsEn: [
        'Rapid reduction in debt-to-GDP with debt service costs falling by 35%.',
        'Anchors inflation down to 1.8% and fortifies currency reserves.',
        'Improves sovereign credit rating profile with international agencies.',
      ],
      costsAr: [
        'تباطؤ حاد في النمو الاقتصادي وركود في نشاط القطاع الخاص المحلي.',
        'قفزة في معدل البطالة إلى 12.4% وارتفاع معدل الفقر إلى قرابة 20%.',
        'تدهور جودة المرافق الصحية والتعليمية نتيجة شح ميزانيات التشغيل والصيانة.',
      ],
      costsEn: [
        'Severe economic slowdown and subdued domestic private activity.',
        'Spike in unemployment to 12.4% and poverty climbing towards 20%.',
        'Deterioration in public hospitals and schools due to maintenance cutbacks.',
      ],
      tradeoffsAr: [
        'التضحية بالعدالة الاجتماعية والنمو في سبيل السلامة المالية المحاسبية المطلقة.',
        'تحميل الفئات محدودة الدخل عبء تصحيح الموازنة عبر تقليص الخدمات والوظائف.',
      ],
      tradeoffsEn: [
        'Sacrifices social equity and employment for accounting solvency.',
        'Places the burden of fiscal consolidation disproportionately on lower-income households.',
      ],
      distributionalImpactAr: 'تأثير تراجعي حاد على الأسر الفقيرة وموظفي الخدمة العامة؛ اتساع الفوارق بين من يملكون أصولاً مالية ومن يعتمدون على الأجر.',
      distributionalImpactEn: 'Regressive distributional impact on civil servants and low-income groups; widens wealth divide.',
      implementationRisksAr: [
        'تصاعد التوتر الاجتماعي والإضرابات العمالية والاحتجاجات ضد تدابير التقشف.',
        'انخفاض الامتثال الضريبي مع تراجع جودة الخدمات المقدمة من الدولة.',
      ],
      implementationRisksEn: [
        'Heightened social tension, labor strikes, and public pushback against austerity.',
        'Tax evasion increases as perceived return on public services deteriorates.',
      ],
      unintendedConsequencesAr: [
        'انكماش حلقة الطلب الكلي (Paradox of Thrift) مما يخفض الإيرادات الضريبية ذاتها.',
        'تدهور رأس المال البشري طويل الأجل بسبب هجرة الأطباء والمهندسين.',
      ],
      unintendedConsequencesEn: [
        'Keynesian Paradox of Thrift: spending cuts depress tax revenues, requiring deeper cuts.',
        'Permanent human capital damage from emigration of medical and engineering professionals.',
      ],
    },
    {
      id: 'high_push',
      titleAr: 'البديل التوسعي عالي المخاطر (دفعة استثمارية كبرى بالاستدانة)',
      titleEn: 'High-Push Alternative (Debt-Financed Mega-Investment Push)',
      descriptionAr: 'استراتيجية طموحة تعتمد على مضاعفة الإنفاق الرأسمالي والمشاريع الكبرى عبر التوسع في الاقتراض الداخلي والخارجي لكسر حلقة التخلف.',
      descriptionEn: 'Aggressive "Big Push" relying on heavy debt financing to accelerate mega-infrastructure and break underdevelopment traps.',
      stanceAr: 'مغامرة تنموية كبرى بالاستدانة السريعة',
      stanceEn: 'Aggressive debt-financed investment gamble',
      riskRating: 'speculative',
      keyPolicies: {
        budgetInfrastructurePctGdp: 14.0,
        budgetEducationPctGdp: 6.0,
        budgetHealthcarePctGdp: 5.0,
        budgetSocialSafetyPctGdp: 4.5,
        monetaryTargetInflation: 5.0,
      },
      projectedMetrics: {
        gdpGrowth5YrAvg: 6.8,
        debtToGdpFinal: Math.round((debt + 22.0) * 10) / 10,
        inflationAvg: 8.9,
        unemploymentFinal: 4.5,
        povertyRateFinal: 8.5,
        co2ReductionPct: 15.0,
      },
      benefitsAr: [
        'طفرة نمو استثنائية (6.8%) واكتمال فوري لشبكات النقل والموانئ والمدن الذكية.',
        'هبوط البطالة إلى أدنى مستوى تاريخي (4.5%) وزيادة سريعة في الوظائف.',
        'تحديث شامل للبنية الرقمية ومحطات الكهرباء في كافة أرجاء البلاد.',
      ],
      benefitsEn: [
        'Spectacular headline growth (6.8%) and accelerated completion of ports and transit hubs.',
        'Plunge in unemployment to record lows (4.5%) with surging job creation.',
        'Complete modernization of digital backbone and energy grids nationwide.',
      ],
      costsAr: [
        'قفزة خطيرة في نسبة الدين العام لتقترب من 105% من الناتج المحلي.',
        'تصاعد التضخم إلى قرابة 9% مما يؤدي إلى تآكل زيادات الرواتب النقدية.',
        'ارتفاع عجز الحساب الجاري الخارجي نتيجة استيراد كميات هائلة من معدات البناء.',
      ],
      costsEn: [
        'Dangerous surge in debt-to-GDP ratio approaching 105% of national output.',
        'Inflation spirals to 8.9%, eroding real wage increases.',
        'Widening balance of payments deficit due to heavy capital equipment imports.',
      ],
      tradeoffsAr: [
        'المراهنة على أن النمو المستقبلي سيسدد الديون قبل وقوع أزمة سيولة أو تعثر مالي.',
        'المخاطرة باستقرار العملة الوطنية مقابل سرعة التشييد المادي للمشاريع.',
      ],
      tradeoffsEn: [
        'Gambles that future productivity will outpace debt amortization before a liquidity crunch hits.',
        'Risks currency stability in exchange for rapid physical asset construction.',
      ],
      distributionalImpactAr: 'مكاسب هائلة وفورية لقطاعات المقاولات والمصارف والتوريد، لكن الفئات ذات الدخل الثابت والمتقاعدين يتضررون بشدة من موجة الغلاء.',
      distributionalImpactEn: 'Windfall gains for construction conglomerates and banks; fixed-income retirees severely hurt by high inflation.',
      implementationRisksAr: [
        'خطر التعثر عن سداد الديون الخارجية (Sovereign Default) في حال حدوث أي هبوط عالمي مفاجئ.',
        'عجز الجهاز الإداري عن مراقبة مليارات الدولارات مما يرفع مخاطر الهدر وسوء التخصيص.',
      ],
      implementationRisksEn: [
        'High risk of sovereign debt distress if global credit conditions tighten abruptly.',
        'Institutional capacity failure to oversee huge disbursements, inviting waste and misallocation.',
      ],
      unintendedConsequencesAr: [
        'مزاحمة القطاع الخاص في أسواق الائتمان المصرفي (Crowding Out).',
        'فقاعة عقارية وتضخم في أسعار الأراضي والمضاربات المالية غير المنتجة.',
      ],
      unintendedConsequencesEn: [
        'Severe crowding-out of private enterprise credit by sovereign bond issuance.',
        'Real estate bubbles and speculative asset inflation in urban land.',
      ],
    },
  ];
}
