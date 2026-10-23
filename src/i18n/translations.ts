/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Bilingual Arabic-First Localization Dictionary
 * معجم الترجمة والتعريب الكامل للمحاكي الوطني
 */

export type Language = 'ar' | 'en';

export const TRANSLATIONS = {
  ar: {
    // Header & Meta
    appTitle: 'محاكي الدولة الوطنية',
    appSubtitle: 'نموذج محاكاة النظم العامة والسياسات الكلية',
    scenarioActive: 'السيناريو النشط:',
    baselineScenario: 'سيناريو خط الأساس',
    scenarioComparison: 'مقارنة السيناريوهات',
    resetToBaseline: 'إعادة ضبط للأساس',
    stepForwardYear: 'تقدم سنة واحدة (+1)',
    playSimulation: 'تشغيل مستمر',
    pauseSimulation: 'إيقاف مؤقت',
    simulationSpeed: 'السرعة',
    horizonYears: 'أفق المحاكاة',
    year: 'السنة',
    units: {
      billionUsd: 'مليار $',
      percent: '%',
      millionPeople: 'مليون نسمة',
      twh: 'تراواط/ساعة',
      mtCo2: 'مليون طن CO₂',
      points: 'نقطة',
      usdPerTon: '$/طن',
      years: 'سنة',
    },
    
    // Top Tabs
    tabs: {
      overview: 'بطاقة الأداء الوطني',
      economicDashboard: 'لوحة الاقتصاد الكلي',
      budget: 'الميزانية العامة وتوزيع الموارد',
      causality: 'شبكة العلاقات السببية',
      policyLab: 'مختبر السياسات ومعاينة الأثر',
      timeline: 'السلسلة الزمنية واللقطات',
      scenarios: 'مقارنة السيناريوهات',
      riskCenter: 'مركز المخاطر والإنذار المبكر',
      regional: 'المشهد الإقليمي',
      documentation: 'توثيق النموذج والمنهجية',
      sectors: 'القطاعات التفصيلية',
      countryConfig: 'تكوين الدولة والأقاليم',
      checkpoints: 'المحطات المرجعية',
      shocks: 'صندوق الصدمات',
      validation: 'فاحص المتطابقات',
      testRunner: 'اختبارات القبول الآلية',
      dataExport: 'استيراد وتصدير البيانات',
      strategicPlanning: 'التخطيط الاستراتيجي M&E',
      crisisCenter: 'إدارة الأزمات والصدمات',
      auditTrail: 'سجل التدقيق والمساءلة',
    },

    // Sectors
    sectors: {
      macroeconomy: 'الاقتصاد الكلي والمالية العامة',
      demographics: 'الديموغرافيا والقوى العاملة',
      human_capital: 'رأس المال البشري والبنية الأساسية',
      energy_environment: 'الطاقة والبيئة والمناخ',
      governance_society: 'الحوكمة والمؤسسات والعدالة',
    },

    // Macro Metrics
    metrics: {
      realGdp: 'الناتج المحلي الحقيقي',
      nominalGdp: 'الناتج المحلي الاسمي',
      realGdpGrowthRate: 'معدل النمو الحقيقي',
      inflationRate: 'معدل التضخم',
      centralBankRate: 'سعر فائدة البنك المركزي',
      sovereignBondYield10y: 'عائد السندات السيادية (10 سنوات)',
      totalRevenue: 'إجمالي الإيرادات العامة',
      totalExpenditure: 'إجمالي النفقات العامة',
      overallDeficit: 'العجز المالي الكلي',
      primaryDeficit: 'العجز المالي الأولي',
      publicDebtStock: 'رصيد الدين العام',
      debtToGdpRatio: 'نسبة الدين إلى الناتج',
      foreignReserves: 'احتياطيات النقد الأجنبي',
      currentAccountBalance: 'ميزان الحساب الجاري',

      // Demographics
      totalPopulation: 'إجمالي السكان',
      cohortYouth: 'فئة الشباب (0-14)',
      cohortWorkingAge: 'الفئة العاملة (15-64)',
      cohortElderly: 'كبار السن (65+)',
      dependencyRatio: 'نسبة الإعالة العمرية',
      fertilityRate: 'معدل الخصوبة',
      lifeExpectancy: 'متوسط العمر المتوقع',
      unemploymentRate: 'معدل البطالة العام',
      youthUnemploymentRate: 'بطالة الشباب',
      laborForceParticipationRate: 'نسبة المشاركة في العمل',

      // Human capital & Infra
      educationQualityIndex: 'مؤشر جودة التعليم',
      healthcareQualityIndex: 'مؤشر كفاءة الرعاية الصحية',
      infrastructureStock: 'رصيد البنية التحتية',
      infrastructureQualityIndex: 'كفاءة البنية التحتية',
      totalFactorProductivity: 'الإنتاجية الكلية (TFP)',
      rdIntensityPctGdp: 'كثافة البحث والتطوير (% الناتج)',

      // Energy
      primaryEnergyDemandTwh: 'الطلب الكلي على الطاقة',
      renewableEnergyPct: 'حصة الطاقة المتجددة',
      fossilEnergyPct: 'حصة الوقود الأحفوري',
      annualCo2EmissionsMt: 'انبعاثات ثاني أكسيد الكربون',
      gridReliabilityIndex: 'موثوقية الشبكة الكهربائية',

      // Governance
      giniCoefficient: 'معامل جيني لعدم المساواة',
      povertyRatePct: 'نسبة الفقر الوطنية',
      pensionFundSolvencyPct: 'ملاءة صناديق التقاعد',
      ruleOfLawIndex: 'مؤشر سيادة القانون',
      corruptionPerceptionIndex: 'مدركات الفساد (النزاهة)',
      socialTensionIndex: 'مؤشر الاحتقان الاجتماعي',
    },

    // Policy levers
    policies: {
      title: 'أدوات التحكم في السياسات العامة',
      subtitle: 'تعديل السياسات يؤثر ديناميكياً عبر فجوات زمنية، بدون نتائج سحرية أو افتراضات مسبقة.',
      activeModifications: 'سياسات معدلة عن الأساس:',
      resetAllPolicies: 'إعادة ضبط السياسات للأساس',
      
      taxRateIncome: 'ضريبة الدخل الفردي المتوسطة',
      taxRateCorporate: 'ضريبة أرباح الشركات',
      taxRateVat: 'ضريبة القيمة المضافة / المبيعات',
      tariffRateAvg: 'متوسط الرسوم الجمركية',
      
      budgetPublicWagesPctGdp: 'مخصصات أجور القطاع العام (% الناتج)',
      budgetHealthcarePctGdp: 'مخصصات الصحة العامة (% الناتج)',
      budgetEducationPctGdp: 'مخصصات التعليم والتدريب (% الناتج)',
      budgetInfrastructurePctGdp: 'مخصصات البنية التحتية والرأسمال (% الناتج)',
      budgetSocialSafetyPctGdp: 'مخصصات الحماية الاجتماعية والدعم (% الناتج)',
      budgetDefensePctGdp: 'مخصصات الدفاع والأمن (% الناتج)',

      monetaryTargetInflation: 'معدل التضخم المستهدف نقدياً',
      statutoryRetirementAge: 'سن التقاعد القانوني',
      laborMarketFlexibility: 'مرونة سوق العمل وتسهيل التوظيف',
      
      carbonTaxPerTon: 'ضريبة الكربون على الانبعاثات',
      cleanEnergySubsidyPct: 'دعم وحوافز الطاقة النظيفة',
      governanceReformEffort: 'جهد مكافحة الفساد والإصلاح المؤسسي',

      tradeoffNotes: {
        taxCorporate: 'رفعها يعزز إيرادات الخزينة ولكنه يثبط الاستثمار الخاص وتكوين رأس المال.',
        taxIncome: 'تزيد إيرادات الدولة وتقلل عجز الميزانية، لكنها تقلل الدخل المتاح والاستهلاك.',
        vat: 'ضريبة سريعة التحصيل ولكنها رجعية تزيد كلفة المعيشة على الفئات الأقل دخلاً.',
        healthcare: 'الإنفاق الصحي يحسن العمر والإنتاجية ولكن أثره الإيجابي يستغرق سنوات للظهور.',
        education: 'الاستثمار في المهارات يرفع الإنتاجية الكلية بعد 3-5 سنوات ويزيد التنافسية.',
        infra: 'بناء البنية يعزز الطاقة الاستيعابية للاقتصاد ويهتلك بمعدل 4% سنوياً.',
        retirementAge: 'رفعه يحمي صناديق التقاعد من الإفلاس لكنه قد يرفع بطالة الداخلين الجدد لسوق العمل.',
        carbonTax: 'يخفض الانبعاثات الكربونية ويحفز الانتقال الطاقي ولكنه يزيد تكاليف الطاقة مؤقتاً.',
      }
    },

    // Shocks
    shocks: {
      title: 'صندوق اختبارات الإجهاد والصدمات الخارجية',
      subtitle: 'محاكاة ردود فعل الاقتصاد والمجتمع إزاء الأزمات الجيوسياسية والكوارث المناخية والصحية.',
      commodityPriceShock: 'صدمة أسعار السلع والمحروقات العالمية',
      globalInterestRateShock: 'قفزة في أسعار الفائدة العالمية',
      tradeFrictionShock: 'صدمة الرسوم والحروب التجارية الدولية',
      climateShock: 'شدة الصدمة المناخية أو الجفاف الحاد',
      pandemicShock: 'تفعيل أزمة وبائية طارئة',
      activeShocksCount: 'الصدمات النشطة:',
      clearShocks: 'إلغاء كافة الصدمات',
    },

    // Causality Explorer
    causality: {
      title: 'سجل المعادلات والترابطات السببية',
      subtitle: 'كل متغيّر في النموذج موثق بالمعادلة الرياضية الدقيقة، الفجوة الزمنية، ومستوى الموثوقية التجريبية.',
      selectVariable: 'اختر متغيراً لفحص شجرة سببيته ومعادلته:',
      identityBadge: 'متطابقة حسابية ملزمة',
      highEmpiricalBadge: 'علاقة تجريبية قوية',
      moderateEmpiricalBadge: 'علاقة سلوكية مقدرة',
      uncertainBadge: 'تقدير استرشادي ذو عدم يقين',
      formulaTitle: 'المعادلة الرياضية / الصيغة المطبقة:',
      timeLagTitle: 'فجوة التأثير الزمني (Time Lag):',
      confidenceTitle: 'مستوى اليقين المنهجي:',
      rationaleTitle: 'الأساس النظري والتجريبي:',
      verifiedByTest: 'تم التحقق عبر الفحص الآلي:',
      searchPlaceholder: 'ابحث في المتغيرات أو المعادلات...',
    },

    // Scenarios
    scenarios: {
      title: 'مدير ومقارن السيناريوهات',
      subtitle: 'قارن المسار التنموي لسيناريو خط الأساس مع سيناريوهات الإصلاح الهيكلي أو الأزمات البديلة.',
      saveCurrentAsScenario: 'حفظ الوضع الحالي كسيناريو جديد',
      scenarioNamePlaceholder: 'اسم السيناريو (مثال: برنامج التحول الأخضر 2035)...',
      compareWith: 'المقارنة مع:',
      metricDiff: 'الفارق التراكمي',
      projectionPeriod: 'فترة الاستشراف',
      noAlternativeScenarios: 'لم يتم حفظ سيناريوهات بديلة بعد. اضغط على حفظ لإنشاء فرع للمقارنة.',
    },

    // Validation
    validation: {
      title: 'فاحص النزاهة العلمية والمتطابقات المحاسبية',
      subtitle: 'يتحقق المحاكي في كل سنة من انطباق قوانين حفظ المادة، القيود المحاسبية الصارمة، وعدم وجود تناقضات رياضية.',
      statusAllPassed: 'كافة المتطابقات والحدود الفيزيائية متوافقة بنسبة 100%',
      statusWarnings: 'تم رصد انحرافات حسابية تتجاوز هوامش التسامح المقبولة',
      passed: 'ناجح',
      failed: 'فشل',
      tolerance: 'هامش التسامح',
      delta: 'الفارق المحسوب',
    },

    // Archetypes
    archetypes: {
      selectLabel: 'النموذج الوطني المؤسس:',
      switchWarning: 'تغيير النموذج سيعيد تهيئة المحاكاة بالبيانات التأسيسية الخاصة به.',
      switchConfirm: 'تأكيد التبديل',
    },

    // Data Export
    dataExport: {
      title: 'تصدير واستيراد بيانات المحاكاة',
      subtitle: 'تصدير السلسلة الزمنية الكاملة لكافة المتغيرات بصيغ CSV و JSON لاستخدامها في التحليلات الخارجية.',
      exportCsv: 'تحميل ملف CSV (جداول زمنية)',
      exportJson: 'تحميل ملف JSON (الحالة الكاملة)',
      importJson: 'استيراد سيناريو من ملف JSON',
      copyToClipboard: 'نسخ ملخص البيانات للحافظة',
      copiedSuccess: 'تم النسخ بنجاح!',
    },

    // Neutrality note
    scientificNote: 'تنبيه علمي ومنهجي: هذا المحاكي أداة تحليل استكشافية تعتمد على معادلات الاقتصاد الكلي ونماذج التراكم الرأسمالي والديموغرافي. لا يمثل تنبؤاً قطعياً بالمستقبل، ولا يتبنى أي أيديولوجيا سياسية مسبقة.',
  },

  en: {
    // Header & Meta
    appTitle: 'National State Simulator',
    appSubtitle: 'Public Policy, Systems Dynamics & Macroeconomic Simulator',
    scenarioActive: 'Active Scenario:',
    baselineScenario: 'Baseline Scenario',
    scenarioComparison: 'Scenario Comparison',
    resetToBaseline: 'Reset to Baseline',
    stepForwardYear: 'Step +1 Year',
    playSimulation: 'Play',
    pauseSimulation: 'Pause',
    simulationSpeed: 'Speed',
    horizonYears: 'Horizon',
    year: 'Year',
    units: {
      billionUsd: '$B USD',
      percent: '%',
      millionPeople: 'Million',
      twh: 'TWh',
      mtCo2: 'Mt CO₂',
      points: 'pts',
      usdPerTon: '$/ton',
      years: 'years',
    },

    // Top Tabs
    tabs: {
      overview: 'National Scorecard',
      economicDashboard: 'Economic Dashboard',
      budget: 'Government Budget',
      causality: 'Causal Graph',
      policyLab: 'Policy Laboratory',
      timeline: 'Timeline & History',
      scenarios: 'Scenario Comparison',
      riskCenter: 'Risk & Early Warning',
      regional: 'Regional Overview',
      documentation: 'Model Documentation',
      sectors: 'Sector Details',
      countryConfig: 'Country & Regions',
      checkpoints: 'Checkpoints',
      shocks: 'Stress Sandbox',
      validation: 'Invariant Checks',
      testRunner: 'Automated Tests',
      dataExport: 'Import & Export',
      strategicPlanning: 'Strategic Planning & M&E',
      crisisCenter: 'Crisis & Stress Testing',
      auditTrail: 'Audit Trail & Accountability',
    },

    // Sectors
    sectors: {
      macroeconomy: 'Macroeconomy & Fiscal',
      demographics: 'Demographics & Labor Force',
      human_capital: 'Human Capital & Infrastructure',
      energy_environment: 'Energy & Climate Transition',
      governance_society: 'Governance & Social Cohesion',
    },

    // Metrics
    metrics: {
      realGdp: 'Real GDP',
      nominalGdp: 'Nominal GDP',
      realGdpGrowthRate: 'Real GDP Growth Rate',
      inflationRate: 'Inflation Rate',
      centralBankRate: 'Central Bank Policy Rate',
      sovereignBondYield10y: 'Sovereign 10-Year Bond Yield',
      totalRevenue: 'Total Fiscal Revenue',
      totalExpenditure: 'Total Fiscal Outlays',
      overallDeficit: 'Overall Budget Deficit',
      primaryDeficit: 'Primary Deficit',
      publicDebtStock: 'Public Debt Stock',
      debtToGdpRatio: 'Debt-to-GDP Ratio',
      foreignReserves: 'Foreign Reserves',
      currentAccountBalance: 'Current Account Balance',

      // Demographics
      totalPopulation: 'Total Population',
      cohortYouth: 'Youth Cohort (0-14)',
      cohortWorkingAge: 'Working-Age Cohort (15-64)',
      cohortElderly: 'Elderly Cohort (65+)',
      dependencyRatio: 'Age Dependency Ratio',
      fertilityRate: 'Fertility Rate',
      lifeExpectancy: 'Life Expectancy at Birth',
      unemploymentRate: 'Unemployment Rate',
      youthUnemploymentRate: 'Youth Unemployment Rate',
      laborForceParticipationRate: 'Labor Force Participation',

      // Human capital & Infra
      educationQualityIndex: 'Education Quality Index',
      healthcareQualityIndex: 'Healthcare Coverage & Quality',
      infrastructureStock: 'Public Infrastructure Stock',
      infrastructureQualityIndex: 'Infrastructure Quality',
      totalFactorProductivity: 'Total Factor Productivity (TFP)',
      rdIntensityPctGdp: 'R&D Intensity (% GDP)',

      // Energy
      primaryEnergyDemandTwh: 'Primary Energy Demand',
      renewableEnergyPct: 'Renewable Energy Share',
      fossilEnergyPct: 'Fossil Energy Share',
      annualCo2EmissionsMt: 'Annual CO₂ Emissions',
      gridReliabilityIndex: 'Grid Reliability Index',

      // Governance
      giniCoefficient: 'Gini Inequality Index',
      povertyRatePct: 'National Poverty Rate',
      pensionFundSolvencyPct: 'Pension Fund Solvency',
      ruleOfLawIndex: 'Rule of Law Index',
      corruptionPerceptionIndex: 'Corruption Perception Index',
      socialTensionIndex: 'Social Tension & Unrest Index',
    },

    // Policy levers
    policies: {
      title: 'Public Policy Control Levers',
      subtitle: 'Modifying policies operates through transmission lags and structural trade-offs without artificial outcomes.',
      activeModifications: 'Active policy deviations:',
      resetAllPolicies: 'Reset all policies to baseline',
      
      taxRateIncome: 'Average Personal Income Tax',
      taxRateCorporate: 'Corporate Income Tax Rate',
      taxRateVat: 'Value Added Tax (VAT) / Sales',
      tariffRateAvg: 'Average Import Tariff Rate',
      
      budgetPublicWagesPctGdp: 'Public Wage Outlays (% GDP)',
      budgetHealthcarePctGdp: 'Public Healthcare Outlays (% GDP)',
      budgetEducationPctGdp: 'Education & Training Outlays (% GDP)',
      budgetInfrastructurePctGdp: 'Infrastructure Capital Outlays (% GDP)',
      budgetSocialSafetyPctGdp: 'Social Welfare & Subsidies (% GDP)',
      budgetDefensePctGdp: 'Defense & Security Outlays (% GDP)',

      monetaryTargetInflation: 'Monetary Target Inflation Rate',
      statutoryRetirementAge: 'Statutory Retirement Age',
      laborMarketFlexibility: 'Labor Market Flexibility Index',
      
      carbonTaxPerTon: 'Carbon Tax on Emissions',
      cleanEnergySubsidyPct: 'Clean Energy Capital Subsidies',
      governanceReformEffort: 'Governance & Anti-Corruption Effort',

      tradeoffNotes: {
        taxCorporate: 'Higher rates boost treasury revenue but dampen private capital accumulation.',
        taxIncome: 'Increases state revenues and narrows deficits, but lowers disposable household consumption.',
        vat: 'Fast and broad revenue generator, but regressive on lower-income households.',
        healthcare: 'Improves life expectancy and productivity, but gains require several years to compound.',
        education: 'Boosts long-term TFP after a 3-5 year lag and strengthens workforce competitiveness.',
        infra: 'Expands productive capacity; subject to 4% annual economic depreciation.',
        retirementAge: 'Improves actuarial pension balance, but may delay entry-level workforce absorption.',
        carbonTax: 'Accelerates green transition and reduces emissions, but induces short-term energy cost push.',
      }
    },

    // Shocks
    shocks: {
      title: 'Stress Testing & External Shocks Sandbox',
      subtitle: 'Simulate system resilience against geopolitical, commodity, and climate disruptions.',
      commodityPriceShock: 'Global Commodity & Hydrocarbon Price Shock',
      globalInterestRateShock: 'Global Interest Rate Spike',
      tradeFrictionShock: 'Global Trade Barriers & Tariffs Shock',
      climateShock: 'Climate Disaster / Severe Drought Intensity',
      pandemicShock: 'Activate Public Health Pandemic Emergency',
      activeShocksCount: 'Active Shocks:',
      clearShocks: 'Clear All Shocks',
    },

    // Causality Explorer
    causality: {
      title: 'Causal Registry & Equations Explorer',
      subtitle: 'Every modeled relationship is grounded in mathematical equations, explicit lags, and confidence ratings.',
      selectVariable: 'Select a relationship to inspect its mathematical formulation and empirical basis:',
      identityBadge: 'Binding Accounting Identity',
      highEmpiricalBadge: 'High Empirical Support',
      moderateEmpiricalBadge: 'Behavioral Estimate',
      uncertainBadge: 'Uncertain Composite Metric',
      formulaTitle: 'Applied Formula / Equation:',
      timeLagTitle: 'Transmission Time Lag:',
      confidenceTitle: 'Epistemic Confidence Level:',
      rationaleTitle: 'Theoretical & Empirical Rationale:',
      verifiedByTest: 'Verified by automated invariant test:',
      searchPlaceholder: 'Search variables or equations...',
    },

    // Scenarios
    scenarios: {
      title: 'Scenario Manager & Diff Explorer',
      subtitle: 'Compare trajectory projections between baseline and proposed reform or shock scenarios.',
      saveCurrentAsScenario: 'Save Current State as New Scenario',
      scenarioNamePlaceholder: 'Scenario name (e.g., Green Transition Program 2035)...',
      compareWith: 'Compare against:',
      metricDiff: 'Cumulative Delta',
      projectionPeriod: 'Projection Horizon',
      noAlternativeScenarios: 'No alternative scenarios saved yet. Click Save to branch from current state.',
    },

    // Validation
    validation: {
      title: 'Scientific Integrity & Invariant Validator',
      subtitle: 'Verifies strict conservation laws, accounting identities, and boundary domains every simulated year.',
      statusAllPassed: 'All accounting identities and physical boundary constraints 100% verified',
      statusWarnings: 'Deviations detected exceeding defined numerical tolerances',
      passed: 'Passed',
      failed: 'Failed',
      tolerance: 'Tolerance Margin',
      delta: 'Computed Delta',
    },

    // Archetypes
    archetypes: {
      selectLabel: 'Foundational Country Archetype:',
      switchWarning: 'Switching archetypes will reinitialize the simulation with baseline calibrated data.',
      switchConfirm: 'Confirm Switch',
    },

    // Data Export
    dataExport: {
      title: 'Simulation Data Import & Export',
      subtitle: 'Export full historical time-series for all variables in CSV and JSON formats for external analysis.',
      exportCsv: 'Download CSV (Time-Series Table)',
      exportJson: 'Download JSON (Complete State)',
      importJson: 'Import Scenario JSON File',
      copyToClipboard: 'Copy Data Summary to Clipboard',
      copiedSuccess: 'Copied to clipboard successfully!',
    },

    // Neutrality note
    scientificNote: 'Methodological & Scientific Notice: This simulator is an exploratory systems analysis tool based on macroeconomic, demographic, and capital accumulation models. It does not constitute an infallible forecast and adopts no political or ideological dogmas.',
  }
};
