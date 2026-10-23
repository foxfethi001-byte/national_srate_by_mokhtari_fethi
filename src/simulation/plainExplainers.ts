/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Plain-Language Explainer Dictionary for Every Metric & Policy
 * قاموس الشرح المبسط لكافة المؤشرات والسياسات والنتائج على شكل فقاعات توضيحية
 * مصمم لتسهيل الفهم والمحاكاة لجميع المستخدمين بصرف النظر عن تخصصهم
 */

export interface PlainExplainer {
  key: string;
  titleAr: string;
  titleEn: string;
  category: 'metric' | 'policy' | 'result' | 'concept';
  icon?: string;
  // 1. الشرح البسيط الأساسي
  summaryAr: string;
  summaryEn: string;
  // 2. ماذا يعني للمواطن العادي وحياته اليومية؟
  citizenMeaningAr: string;
  citizenMeaningEn: string;
  // 3. كيف يؤثر الارتفاع أو الانخفاض؟
  impactAr: string;
  impactEn: string;
  // 4. نصيحة عملية مبسطة
  tipAr: string;
  tipEn: string;
}

export const EXPLAINER_DICTIONARY: Record<string, PlainExplainer> = {
  // ====================== المؤشرات والنتائج الاقتصادية ======================
  gdpNominal: {
    key: 'gdpNominal',
    titleAr: 'الناتج المحلي الإجمالي (الاسمي)',
    titleEn: 'Nominal GDP',
    category: 'metric',
    icon: '💰',
    summaryAr: 'القيمة المالية الإجمالية لكل ما تنتجه المصانع والمزارع والشركات داخل الدولة بالأسعار الحالية.',
    summaryEn: 'The total market value of all goods and services produced within the country at current prices.',
    citizenMeaningAr: 'هو مقياس حجم الكعكة الاقتصادية؛ كلما كبرت زادت فرص العمل والرواتب وحركة البيع والشراء في الأسواق.',
    citizenMeaningEn: 'It measures the overall size of the economic pie; when it grows, businesses thrive and more jobs are created.',
    impactAr: 'ارتفاعه ينعش التجارة، لكن إذا كان الارتفاع ناتجاً فقط عن غلاء الأسعار دون زيادة إنتاج فعلي، فلن يشعر المواطن بفرق حقيقي.',
    impactEn: 'Growth stimulates commerce, but if it is driven only by inflation rather than real output, purchasing power will not improve.',
    tipAr: 'احرص على رفع الإنتاجية الحقيقية وليس مجرد تضخيم الأسعار.',
    tipEn: 'Focus on boosting real productive capacity rather than nominal price increases.'
  },
  gdpReal: {
    key: 'gdpReal',
    titleAr: 'الناتج المحلي الإجمالي (الحقيقي)',
    titleEn: 'Real GDP',
    category: 'metric',
    icon: '🏭',
    summaryAr: 'حجم الإنتاج الحقيقي للبضائع والخدمات بعد إزالة وتجريد أثر التضخم وغلاء الأسعار.',
    summaryEn: 'The actual volume of production after stripping out inflation and price hikes.',
    citizenMeaningAr: 'يجيب على السؤال الأهم: "هل صنعنا هذا العام أطنان قمح وسيارات وساعات تدريس أكثر من العام الماضي، أم نفس الكمية ولكن بسعر أغلى؟".',
    citizenMeaningEn: 'Answers the critical question: Did we actually produce more food, cars, and services this year, or did prices just rise?',
    impactAr: 'نموه الحقيقي هو الضمانة الوحيدة لرفع مستوى معيشة الأجيال القادمة والحد من البطالة.',
    impactEn: 'Real growth is the primary driver of rising living standards and long-term job creation.',
    tipAr: 'الاستثمار في المصانع والتعليم والتكنولوجيا هو محرك نمو الناتج الحقيقي.',
    tipEn: 'Invest in infrastructure, human capital, and technology to stimulate real growth.'
  },
  inflationRate: {
    key: 'inflationRate',
    titleAr: 'معدل التضخم السنوي',
    titleEn: 'Inflation Rate',
    category: 'metric',
    icon: '📈',
    summaryAr: 'نسبة الزيادة في أسعار السلع الغذائية والفواتير والخدمات التي يشتريها الناس يومياً.',
    summaryEn: 'The rate at which consumer prices for everyday groceries, housing, and utilities increase.',
    citizenMeaningAr: 'الوحش الذي يلتهم الراتب؛ فإذا كان التضخم 10% ولم يزد راتبك، فأنت فعلياً أصبحت أفقر بنسبة 10% مقارنة بالعام الماضي.',
    citizenMeaningEn: 'The invisible tax on your paycheck; if inflation is 10% without a raise, your paycheck buys 10% less groceries.',
    impactAr: 'التضخم المرتفع يرهق الأسر الضعيفة ويثبط المدخرات، بينما التضخم المنخفض المعتدل (2%-3%) صحي ويشجع حركة التجارة.',
    impactEn: 'High inflation hurts low-income families and erodes savings; a mild rate (2-3%) signals healthy consumer demand.',
    tipAr: 'تجنب طباعة النقود دون غطاء، واضبط عجز الميزانية لتهدئة الأسعار.',
    tipEn: 'Avoid excessive money creation and contain deficits to stabilize consumer prices.'
  },
  unemploymentRate: {
    key: 'unemploymentRate',
    titleAr: 'معدل البطالة',
    titleEn: 'Unemployment Rate',
    category: 'metric',
    icon: '👥',
    summaryAr: 'نسبة المواطنين القادرين على العمل والباحثين عنه ولكنهم لم يجدوا وظيفة.',
    summaryEn: 'Percentage of the available workforce actively seeking employment but currently without a job.',
    citizenMeaningAr: 'يمثل عدد الشباب والأرباب العاطلين عن العمل؛ انخفاضه يعني أماناً اجتماعياً ودخلاً مستقراً لكل بيت.',
    citizenMeaningEn: 'Represents citizens unable to find work; lower unemployment brings household stability and social peace.',
    impactAr: 'ارتفاع البطالة يسبب الفقر، الجريمة، الإحباط، ويثقل كاهل الدولة بصرف إعانات إضافية.',
    impactEn: 'High unemployment drives poverty, lowers tax revenue, and raises social safety spending.',
    tipAr: 'شجع القطاع الخاص واستثمر في تدريب الشباب على المهارات التي يطلبها السوق فعلياً.',
    tipEn: 'Incentivize private hiring and tailor vocational education to market demands.'
  },
  budgetBalance: {
    key: 'budgetBalance',
    titleAr: 'عجز / فائض الميزانية العامة',
    titleEn: 'Fiscal Balance',
    category: 'metric',
    icon: '⚖️',
    summaryAr: 'الفرق الصافي بين ما تجمعه الدولة من ضرائب ورسوم وما تنفقه على الرواتب والمشاريع.',
    summaryEn: 'The net difference between government revenues (taxes, duties) and total spending.',
    citizenMeaningAr: 'مثل ميزانية المنزل تماماً: إذا كان دخلك 5000 ومصاريفك 6000 فعندك عجز 1000 ستضطر للاستدانة لتغطيته.',
    citizenMeaningEn: 'Just like a family budget: if you earn 5000 but spend 6000, you have a deficit that must be borrowed.',
    impactAr: 'العجز المستمر يضطر الدولة للاستدانة بفوائد باهظة تسددها الأجيال القادمة، بينما الفائض يتيح بناء احتياطيات للأزمات.',
    impactEn: 'Persistent deficits pile on debt and interest costs; surpluses allow rainy-day emergency funds.',
    tipAr: 'لا تدع العجز يتجاوز 3%-4% من الناتج الإجمالي إلا في أوقات الطوارئ الكبرى.',
    tipEn: 'Keep deficits below 3-4% of GDP under normal peacetime conditions.'
  },
  debtToGdpRatio: {
    key: 'debtToGdpRatio',
    titleAr: 'نسبة الدين العام إلى الناتج',
    titleEn: 'Debt-to-GDP Ratio',
    category: 'metric',
    icon: '🏛️',
    summaryAr: 'حجم إجمالي الديون المستحقة على الدولة كنسبة مئوية من حجم اقتصادها السنوي.',
    summaryEn: 'Total accumulated national debt expressed as a percentage of annual economic output.',
    citizenMeaningAr: 'مؤشر مدى ثقل ديون الوطن على ظهورنا؛ إذا تجاوز 90% فإن جزءاً كبيراً من أموال الضرائب يذهب للبنوك الخارجية بدلاً من المستشفيات.',
    citizenMeaningEn: 'Shows national debt burden; if above 90%, large chunks of tax revenue go to paying interest rather than public services.',
    impactAr: 'تجاوز الحدود الآمنة يفقد الدولة ثقة المستثمرين ويرفع أسعار الفائدة وقد يقود إلى أزمة عملة وإفلاس سيادي.',
    impactEn: 'Excessive debt spooks lenders, hikes borrowing costs, and raises default risks.',
    tipAr: 'استخدم القروض فقط لتمويل مشاريع بنية تحتية ومصانع تدر دخلاً يسدد الدين مستقبلاً.',
    tipEn: 'Borrow only for productive capital investments that generate future returns.'
  },
  householdPurchasingPower: {
    key: 'householdPurchasingPower',
    titleAr: 'القوة الشرائية للمواطنين',
    titleEn: 'Purchasing Power',
    category: 'metric',
    icon: '🛒',
    summaryAr: 'كمية السلع والخدمات الحقيقية التي تستطيع الأسرة شراؤها بدخلها الشهري.',
    summaryEn: 'The actual volume of necessities and comfort goods a family can purchase with their monthly income.',
    citizenMeaningAr: 'المعيار الذهبي لرضا الناس: هل عربة التسوق في السوبرماركت أصبحت أكثر امتلاءً أم نقصت محتوياتها مقارنة بالماضي؟',
    citizenMeaningEn: 'The everyday test of prosperity: Is the grocery cart fuller or emptier compared to last year?',
    impactAr: 'زيادتها تعني رخاءً وسعادة للأسر، ونقصانها يسبب التذمر والفقر وتراجع ثقة المواطنين بالحكومة.',
    impactEn: 'Rises mean better nutrition, comfort, and satisfaction; drops trigger public frustration and social strain.',
    tipAr: 'احمِ القوة الشرائية بمكافحة الاحتكار، وتخفيض التضخم، وزيادة الإنتاجية.',
    tipEn: 'Safeguard purchasing power by curbing inflation, fostering competition, and boosting real wages.'
  },
  foreignReservesMonths: {
    key: 'foreignReservesMonths',
    titleAr: 'احتياطي النقد الأجنبي (بالشهور)',
    titleEn: 'Foreign Reserves (Months)',
    category: 'metric',
    icon: '🛡️',
    summaryAr: 'عدد الشهور التي تستطيع الدولة خلالها مواصلة استيراد الدواء والقمح والوقود لو توقفت صادراتها بالكامل.',
    summaryEn: 'How many months the nation can pay for vital imports (food, medicine, fuel) if all exports ceased.',
    citizenMeaningAr: 'درع الأمان القومي للعملة؛ يحمي الجنيه/الدينار من الانهيار المفاجئ في الأزمات العالمية.',
    citizenMeaningEn: 'The nation currency shock absorber; prevents abrupt devaluations and supply shortages during global crises.',
    impactAr: 'إذا هبط الاحتياطي عن 3 شهور، تدخل الدولة في مرحلة خطر شديد وقد تنقطع السلع الأساسية من الأسواق.',
    impactEn: 'Falling below 3 months signals imminent currency crisis, rationing, and import gridlock.',
    tipAr: 'حافظ دائماً على احتياطي يغطي ما لا يقل عن 6 إلى 8 شهور من الواردات لضمان السيادة والاستقرار.',
    tipEn: 'Maintain at least 6 to 8 months of import cover to insulate against global shocks.'
  },
  totalInvestment: {
    key: 'totalInvestment',
    titleAr: 'إجمالي الاستثمار والقدرة الإنتاجية',
    titleEn: 'Total Investment',
    category: 'metric',
    icon: '🏗️',
    summaryAr: 'الأموال الموجهة لبناء المصانع الجديدة، شراء الآلات، واستصلاح الأراضي وحفر الآبار.',
    summaryEn: 'Total capital expenditures directed toward new plants, machinery, technology, and equipment.',
    citizenMeaningAr: 'بذور المستقبل: استثمار اليوم هو وظائف ومصانع الغد التي ستشغل أبناءنا.',
    citizenMeaningEn: 'The seeds of future wealth: today investment creates tomorrow jobs and modern factories for our children.',
    impactAr: 'ارتفاعه يوسع طاقة الاقتصاد الإنتاجية ويخفض الاستيراد ويعزز الاكتفاء الذاتي.',
    impactEn: 'Higher investment expands output limits, boosts self-reliance, and cuts import reliance.',
    tipAr: 'شجع المستثمرين بتسهيل التراخيص وتوفير طاقة موثوقة وبنية تحتية متطورة.',
    tipEn: 'Incentivize investment by streamlining permits and ensuring reliable power and transport.'
  },
  povertyRate: {
    key: 'povertyRate',
    titleAr: 'معدل الفقر والهشاشة',
    titleEn: 'Poverty Rate',
    category: 'metric',
    icon: '🤝',
    summaryAr: 'نسبة الأسر التي يقل دخلها عن تكلفة تلبية الاحتياجات الغذائية والمعيشية الأساسية.',
    summaryEn: 'Share of households whose earnings fall below the minimum threshold required for basic nutrition and shelter.',
    citizenMeaningAr: 'مرآة العدالة الاجتماعية: كم بيتاً ينام أفراده دون طعام كافٍ أو مأوى كريم.',
    citizenMeaningEn: 'The mirror of social justice: how many families struggle to afford basic food, medicine, and warm shelter.',
    impactAr: 'انخفاضه دليل على أن ثمار النمو الاقتصادي تصل للجميع ولا تنحصر في فئة قليلة.',
    impactEn: 'A declining poverty rate proves economic growth benefits all layers of society.',
    tipAr: 'ركز على برامج الدعم النقدي المشروط بالتعليم والصحة لقطع حلقة الفقر عبر الأجيال.',
    tipEn: 'Link social cash transfers to school attendance and health checkups to break generational poverty.'
  },

  // ====================== أدوات ومحددات السياسة العامة ======================
  incomeTaxRate: {
    key: 'incomeTaxRate',
    titleAr: 'ضريبة الدخل على الأفراد',
    titleEn: 'Personal Income Tax',
    category: 'policy',
    icon: '📋',
    summaryAr: 'نسبة مئوية تستقطعها الخزينة من رواتب الموظفين ودخل المهنيين لتمويل المدارس والمستشفيات والجيش.',
    summaryEn: 'A percentage levied on wages and individual income to finance public services, healthcare, and safety.',
    citizenMeaningAr: 'الجزء المخصوم من قسيمة راتبك كل شهر؛ إذا رُفعت يقل ما في جيبك للشراء، وإذا خُفضت يزيد راتبك الصافي.',
    citizenMeaningEn: 'The portion deducted from your paycheck; raising it lowers disposable cash, lowering it puts money in your pocket.',
    impactAr: 'رفعها يزيد إيرادات الميزانية لكنه قد يقلل استهلاك الناس، وخفضها ينعش التجارة لكنه قد يعمق عجز الميزانية.',
    impactEn: 'Hikes replenish state revenues but depress retail consumption; cuts spur spending but expand budget deficits.',
    tipAr: 'اعتمد نظاماً تصاعدياً يعفي الدخول المنخفضة ويفرض نسباً أعلى على الدخول الكبيرة لتحقيق العدالة.',
    tipEn: 'Use progressive brackets protecting low wages while asking higher earners to contribute proportionally.'
  },
  corporateTaxRate: {
    key: 'corporateTaxRate',
    titleAr: 'ضريبة أرباح الشركات',
    titleEn: 'Corporate Tax Rate',
    category: 'policy',
    icon: '🏢',
    summaryAr: 'نسبة تفرض على الأرباح الصافية للشركات والمصانع والمؤسسات التجارية.',
    summaryEn: 'A tax levied on the net annual profits of corporations, factories, and commercial firms.',
    citizenMeaningAr: 'المساهمة التي تدفعها الشركات الكبرى لخزينة الوطن؛ تؤثر على قرار المستثمر هل يبني مصنعه هنا أم في دولة مجاورة؟',
    citizenMeaningEn: 'Corporate contribution to public coffers; influences whether investors build plants locally or abroad.',
    impactAr: 'رفعها بشكل مبالغ فيه يطرد رؤوس الأموال ويثبط التوظيف، وخفضها جداً يحرم الدولة من حقها في الأرباح الاقتصادية.',
    impactEn: 'Excessive rates drive capital away; overly low rates starve public coffers of fair economic returns.',
    tipAr: 'وازن بين سعر تنافسي يجذب المستثمرين وحصيلة عادلة لتمويل البنية التحتية التي تستفيد منها تلك الشركات.',
    tipEn: 'Keep rates competitive with regional peers while closing loopholes.'
  },
  vatRate: {
    key: 'vatRate',
    titleAr: 'ضريبة القيمة المضافة (المبيعات)',
    titleEn: 'Value Added Tax (VAT)',
    category: 'policy',
    icon: '🧾',
    summaryAr: 'نسبة مضافة على كل فاتورة شراء للبضائع والخدمات في المحلات والمطاعم.',
    summaryEn: 'A consumption tax applied to almost all goods and retail transactions at the point of sale.',
    citizenMeaningAr: 'المبلغ الإضافي الذي تراه في أسفل فاتورة السوبرماركت والمطعم؛ يدفعها الجميع مباشرة عند الشراء.',
    citizenMeaningEn: 'The added percentage at the bottom of your grocery or restaurant receipt, paid instantly by everyone.',
    impactAr: 'ميزتها أنها سريعة الحصيلة وتدخل الخزينة فوراً، لكن عيبها أنها ترفع الأسعار فوراً وتثقل كاهل الأسر الضعيفة لأنها تقتطع نسبة من كل مشترياتهم.',
    impactEn: 'Highly efficient revenue generator, but regressive as it hits low-income earners hardest.',
    tipAr: 'أعفِ المواد الغذائية الأساسية وأدوية الأطفال من ضريبة القيمة المضافة لحماية الفقراء.',
    tipEn: 'Exempt staple foods and medical supplies to shield vulnerable households.'
  },
  educationSpending: {
    key: 'educationSpending',
    titleAr: 'مخصصات التعليم والتدريب',
    titleEn: 'Education Budget Allocation',
    category: 'policy',
    icon: '🎓',
    summaryAr: 'ما تخصصه الموازنة لبناء المدارس، رواتب المعلمين، تجهيز المختبرات، والجامعات والبحث العلمي.',
    summaryEn: 'Budget dedicated to building schools, teacher salaries, university research, and vocational training.',
    citizenMeaningAr: 'مستقبل أبنائك؛ هل سيحصلون على تعليم مجاني ذي جودة يؤهلهم لوظائف المستقبل ذات الرواتب العالية؟',
    citizenMeaningEn: 'Your children future: determines whether schools provide modern digital skills and pathways to high-paying jobs.',
    impactAr: 'أعظم استثمار طويل المدى؛ لا تظهر ثماره في شهر واحد، بل تثمر بعد سنوات عندما يدخل شباب متعلمون سوق العمل فيرفعون إنتاجية الوطن.',
    impactEn: 'The highest-return long-term investment; boosts national workforce productivity over multi-year horizons.',
    tipAr: 'اربط مناهج التعليم باحتياجات الثورة الرقمية والصناعة المحلية لضمان عدم تخريج عاطلين عن العمل.',
    tipEn: 'Align curricula with modern technology and industrial needs to minimize graduate unemployment.'
  },
  healthcareSpending: {
    key: 'healthcareSpending',
    titleAr: 'مخصصات الرعاية الصحية',
    titleEn: 'Healthcare Budget Allocation',
    category: 'policy',
    icon: '🏥',
    summaryAr: 'المبالغ الموجهة لبناء وتشغيل المستشفيات، توفير الأدوية، وتطعيم الأطفال وتأهيل الأطباء والممرضين.',
    summaryEn: 'Funding for public hospitals, medical supplies, doctor training, and preventive healthcare programs.',
    citizenMeaningAr: 'الأمان الصحي: عندما يمرض أحد أفراد أسرتك، هل سيجد سريراً ودواءً ورعاية كريمة دون أن يضطر لبيع ممتلكاته؟',
    citizenMeaningEn: 'Health safety: ensures your family gets proper medical care and medication without catastrophic personal expenses.',
    impactAr: 'شعب صحي يعني عمالاً أكثر نشاطاً وغياباً أقل وإنتاجية أعلى، فضلاً عن حماية الأسر من الإفلاس بسبب تكاليف المرض.',
    impactEn: 'A healthy populace reduces absenteeism, boosts worker output, and shields families from medical bankruptcy.',
    tipAr: 'ركز على الوقاية والرعاية الصحية الأولية في القرى والمدن؛ فالوقاية أرخص بعشرات المرات من علاج الأمراض المزمنة.',
    tipEn: 'Invest heavily in primary and preventive care to prevent costly chronic disease burdens.'
  },
  infrastructureSpending: {
    key: 'infrastructureSpending',
    titleAr: 'مخصصات البنية التحتية والمرافق',
    titleEn: 'Infrastructure & Capital Spending',
    category: 'policy',
    icon: '🛣️',
    summaryAr: 'الإنفاق على الطرق السريعة، شبكات القطارات والموانئ، وتمديدات المياه والكهرباء والاتصالات.',
    summaryEn: 'Capital expenditure on roads, ports, transit, water grids, electricity, and telecommunications.',
    citizenMeaningAr: 'الشرايين التي تسير عليها حياتنا: طرق ممهدة تقلل الحوادث، مياه نقية لا تنقطع، وكهرباء موثوقة لمنازلنا ومزارعنا.',
    citizenMeaningEn: 'The physical backbone of daily life: smooth roads, clean continuous tap water, and reliable electrical grids.',
    impactAr: 'يخفض تكلفة النقل على المصانع والمزارع، يجذب الاستثمارات الأجنبية، ويخلق مئات آلاف الوظائف فوراً في قطاع البناء.',
    impactEn: 'Lowers logistics costs for businesses, attracts factory investments, and creates immediate construction jobs.',
    tipAr: 'أعطِ الأولوية لصيانة البنية التحتية القائمة وشبكات الشحن التجاري قبل بناء المشاريع الاستعراضية.',
    tipEn: 'Prioritize logistics corridors and maintenance over prestige projects.'
  },
  socialProtectionSpending: {
    key: 'socialProtectionSpending',
    titleAr: 'مخصصات الحماية الاجتماعية والدعم',
    titleEn: 'Social Safety Net Spending',
    category: 'policy',
    icon: '🛡️',
    summaryAr: 'الإعانات النقدية للأسر الفقيرة، معاشات كبار السن والأرامل، وبرامج دعم رغيف الخبز والسلع الأساسية.',
    summaryEn: 'Direct cash transfers to impoverished families, elderly pensions, and essential commodity subsidies.',
    citizenMeaningAr: 'شبكة النجاة للطبقات الهشة؛ تضمن ألا يبيت أي مواطن جائعاً أو محروماً من الكرامة الإنسانية في أوقات الشدة.',
    citizenMeaningEn: 'The ultimate safety net; ensures no citizen is pushed into starvation or indignity during hard times.',
    impactAr: 'يمنع الاحتقان والاضطرابات الاجتماعية ويحمي الفقراء من صدمات الغلاء، لكن التوسع فيه دون موارد قد يضغط على الميزانية.',
    impactEn: 'Deters social unrest and protects the vulnerable, but requires sustainable revenue backing.',
    tipAr: 'وجه الدعم للمستحقين الحقيقيين عبر قواعد بيانات رقمية دقيقة لمنع الهدر وتسريب الدعم لغير المحتاجين.',
    tipEn: 'Target subsidies through accurate digital registries to prevent leakage to wealthier households.'
  },
  publicWageGrowth: {
    key: 'publicWageGrowth',
    titleAr: 'نسبة الزيادة السنوية في أجور الدولة',
    titleEn: 'Public Sector Wage Growth',
    category: 'policy',
    icon: '💵',
    summaryAr: 'نسبة الزيادة السنوية في رواتب المعلمين والأطباء ورجال الشرطة والموظفين الحكوميين.',
    summaryEn: 'Annual rate of wage adjustments for government staff, teachers, nurses, and civil servants.',
    citizenMeaningAr: 'الزيادة على الراتب التي ينتظرها الموظف الحكومي لتعويض غلاء المعيشة وتحسين مستوى أسرته.',
    citizenMeaningEn: 'The salary raise awaited by civil workers to offset living costs and reward service.',
    impactAr: 'تحسن معيشة ملايين الأسر وتزيد الطلب في الأسواق، لكن الزيادة غير المدروسة تفاقم عجز الميزانية وتغذي التضخم.',
    impactEn: 'Bolsters family budgets but large hikes expand wage bills and can trigger wage-price inflation spirals.',
    tipAr: 'اربط الزيادات بتحسن الإنتاجية ووفورات الميزانية لتفادي طبع النقود وتآكل الزيادة بالتضخم.',
    tipEn: 'Tie wage raises to productivity gains and fiscal room to prevent inflationary erosion.'
  },
  policyInterestRate: {
    key: 'policyInterestRate',
    titleAr: 'سعر الفائدة للبنك المركزي',
    titleEn: 'Central Bank Policy Rate',
    category: 'policy',
    icon: '🏦',
    summaryAr: 'الفائدة المرجعية التي يحددها البنك المركزي للبنوك التجارية للاقتراض والإيداع.',
    summaryEn: 'The benchmark interest rate set by the central bank determining borrowing and savings costs across banks.',
    citizenMeaningAr: 'ميزان حرارة الاقتصاد: إذا رُفعت الفائدة تصبح قروض شراء الشقق والسيارات أغلى وتصبح فوائد الودائع أعلى لتشجيع الادخار.',
    citizenMeaningEn: 'The economy thermostat: higher rates make home mortgages and car loans costlier while rewarding savings.',
    impactAr: 'رفعها يكبح التضخم ويثبت سعر العملة لكنه يهدئ وتيرة الاقتصاد والتوظيف؛ وخفضها ينعش القروض لكنه قد يرفع الأسعار.',
    impactEn: 'Raising rates cools inflation and defends the currency but slows borrowing; cutting rates spurs credit.',
    tipAr: 'استخدم سعر الفائدة بحذر كفرامل للسيطرة على التضخم، ولا تضغط بشدة حتى لا تسبب ركوداً للشركات.',
    tipEn: 'Use rates judiciously to cool price spikes without crushing business credit.'
  },
  tariffsImportTax: {
    key: 'tariffsImportTax',
    titleAr: 'الرسوم الجمركية على الواردات',
    titleEn: 'Import Tariffs',
    category: 'policy',
    icon: '🚢',
    summaryAr: 'ضرائب تفرض على المنتجات الأجنبية القادمة عبر الموانئ والحدود قبل دخولها الأسواق المحلية.',
    summaryEn: 'Taxes levied on foreign imported products at borders and ports before reaching domestic consumers.',
    citizenMeaningAr: 'حماية لصانعك وفلاحك المحلي: تجعل المستورد أغلى حتى يشتري الناس المنتج الوطني وتبقى أموالنا داخل البلد.',
    citizenMeaningEn: 'Protection for domestic workers and farmers: makes foreign goods pricier to foster local shopping.',
    impactAr: 'تحمي الصناعة الوطنية وتوفر إيرادات جمركية، لكنها ترفع أسعار البضائع الأجنبية على المستهلك وتثير خلافات تجارية.',
    impactEn: 'Protects domestic jobs and generates revenues, but raises consumer prices and risks retaliation.',
    tipAr: 'افرض الجمارك تدريجياً على السلع التي نملك قدرة تصنيع بدائل محلية لها، وأعفِ مستلزمات الإنتاج والآلات.',
    tipEn: 'Apply tariffs selectively where domestic alternatives exist, exempting capital machinery.'
  },
  carbonTax: {
    key: 'carbonTax',
    titleAr: 'ضريبة الكربون وحماية البيئة',
    titleEn: 'Carbon & Environmental Tax',
    category: 'policy',
    icon: '🌱',
    summaryAr: 'رسوم مالية تفرض على المصانع والشركات بقدر ما تطلقه من أدخنة ملوثة وغازات ضارة بالهواء.',
    summaryEn: 'Levy on industrial emissions and fossil pollution to incentivize green and clean energy adoption.',
    citizenMeaningAr: 'ضريبة لحماية صحة أطفالنا وهوائنا؛ تجبر المصانع على تنظيف مداخنها واستخدام الطاقة الشمسية بدلاً من الفحم.',
    citizenMeaningEn: 'A fee to protect public health and clean air; pushes polluters to adopt clean solar and filtration systems.',
    impactAr: 'توفر أموالاً خضراء للدولة وتخفض أمراض الصدر والتلوث، لكنها قد ترفع تكلفة الإنتاج على بعض المصانع مؤقتاً.',
    impactEn: 'Generates green revenues and cuts health costs, though may raise production costs in heavy industry.',
    tipAr: 'أعد تدوير أموال ضريبة الكربون لدعم تركيب الألواح الشمسية ومساعدة المصانع على التحول الأخضر.',
    tipEn: 'Reinvest carbon revenues into subsidies for renewable installations.'
  },
  energySubsidyRate: {
    key: 'energySubsidyRate',
    titleAr: 'نسبة دعم المحروقات والكهرباء',
    titleEn: 'Energy & Fuel Subsidy',
    category: 'policy',
    icon: '⚡',
    summaryAr: 'المبالغ التي تتحملها الدولة لبيع الكهرباء والبنزين للمواطنين بسعر أرخص من تكلفتها العالمية.',
    summaryEn: 'Share of energy, fuel, and utility costs absorbed by the state to keep domestic tariffs affordable.',
    citizenMeaningAr: 'تخفيض مباشر على فاتورة الكهرباء ومحطة البنزين؛ يجعل تنقلاتك وتشغيل مكيفك ومطبخك أقل تكلفة.',
    citizenMeaningEn: 'A direct discount on gas pump prices and electric bills, easing commuting and household utility expenses.',
    impactAr: 'يخفف العبء المالي اليومي عن المواطن، لكنه يستنزف مليارات من الميزانية وقد يشجع على الإسراف وتهريب الوقود.',
    impactEn: 'Relieves immediate consumer burden but drains national reserves and encourages wasteful consumption.',
    tipAr: 'تحول تدريجياً من الدعم العيني للوقود إلى دعم نقدي مباشر للأسر المحتاجة وترشيد الاستهلاك.',
    tipEn: 'Transition gradually from untargeted fuel subsidies to targeted household energy vouchers.'
  },
  // ====================== المرحلة الخامسة: التخطيط والأزمات والإنذار المبكر ======================
  strategicPlan: {
    key: 'strategicPlan',
    titleAr: 'التخطيط الاستراتيجي الوطني والأهداف التنموية',
    titleEn: 'National Strategic Planning & Objectives',
    category: 'concept',
    icon: '🎯',
    summaryAr: 'خارطة طريق ملزمة تحدد مستهدفات الدولة المستقبلية ومواعيد تحقيقها والميزانيات المرصودة لها والجهات المسؤولة.',
    summaryEn: 'A binding roadmap setting long-term national targets, completion deadlines, funded budgets, and responsible agencies.',
    citizenMeaningAr: 'تضمن ألا تضيع أموال الدولة في قرارات عشوائية، وتوضح للمواطن إلى أين يتجه بلده وماذا سيتحقق لأبنائه خلال 5 أو 10 سنوات.',
    citizenMeaningEn: 'Ensures public funds are allocated coherently, clarifying the nation\'s trajectory and milestones for citizens over the next decade.',
    impactAr: 'وجود خطة محكمة يعطي ثقة للمستثمرين ويوجه جهود الوزارات نحو هدف واحد واضح.',
    impactEn: 'A coherent strategic plan anchors investor confidence and aligns ministries around unified national benchmarks.',
    tipAr: 'لا تضع أهدافاً تفوق الميزانية المتاحة؛ الواقعية والتدرج سر النجاح.',
    tipEn: 'Do not set targets that exceed fiscal or administrative bandwidth; realism is paramount.'
  },
  feasibilityAnalysis: {
    key: 'feasibilityAnalysis',
    titleAr: 'فحص الجدوى وكشف التناقضات الهيكلية',
    titleEn: 'Feasibility Evaluation & Contradiction Detection',
    category: 'concept',
    icon: '⚖️',
    summaryAr: 'اختبار علمي صارم يفحص ما إذا كانت الخطة قابلة للتحقيق فعلاً بالنظر للمال والكوادر والوقت المتاح، أم مجرد وعود غير ممولة.',
    summaryEn: 'A rigorous test checking whether a plan is truly deliverable given budget, staffing, and time, or merely unfunded promises.',
    citizenMeaningAr: 'مثل أن يقرر شخص بناء قصر كبير ولكن راتبه لا يكفي حتى لشراء الطوب؛ هذا الفحص يكشف الحقيقة ويمنع التورط.',
    citizenMeaningEn: 'Like planning a palace on an apprentice wage; this check exposes bottlenecks before costly commitments are made.',
    impactAr: 'يمنع هدر المال العام في مشاريع تبدأ ثم تتوقف لسنوات بسبب نفاد الميزانية أو تعقد الإجراءات.',
    impactEn: 'Prevents white elephants and half-finished projects stalled by budget exhaustion or institutional overload.',
    tipAr: 'إذا أظهر الفحص تناقضاً، قم بمد الفترة الزمنية أو زيادة الضرائب أو تقليص عدد الأهداف في وقت واحد.',
    tipEn: 'If contradictions arise, stretch delivery timelines, mobilize revenue, or prioritize core milestones.'
  },
  monitoringEvaluation: {
    key: 'monitoringEvaluation',
    titleAr: 'المتابعة والتقييم (M&E) ورصد التقدم الفعلي',
    titleEn: 'Monitoring & Evaluation (M&E)',
    category: 'concept',
    icon: '📊',
    summaryAr: 'لوحة قياس دقيقة تقارن بين ما تم التخطيط له ورقياً وما تم إنجازه فعلياً على أرض الواقع بالدولار والنسبة المئوية.',
    summaryEn: 'A precision scorecard comparing planned targets against simulated actual delivery, expenditures, and timelines.',
    citizenMeaningAr: 'كشف حساب شفاف لمعرفة هل تم تسليم المدارس والمستشفيات في موعدها وهل صُرفت الميزانية بنزاهة أم هناك تأخير وهدر.',
    citizenMeaningEn: 'Transparent accountability tracking whether schools and hospitals were delivered on schedule and within budget.',
    impactAr: 'التنبيه المبكر لأي مشروع متعثر قبل فوات الأوان لتصحيح المسار.',
    impactEn: 'Provides early intervention warnings for off-track initiatives before failure becomes irreversible.',
    tipAr: 'ميز دائماً بين التقدم المقاس على أرض الواقع وتوقعات النماذج الرياضية.',
    tipEn: 'Always distinguish empirical field observations from model simulation forecasts.'
  },
  policyAlternatives: {
    key: 'policyAlternatives',
    titleAr: 'مصفوفة البدائل الاستراتيجية للسياسات',
    titleEn: 'Policy Alternatives & Trade-Off Matrix',
    category: 'concept',
    icon: '🔀',
    summaryAr: 'مقارنة حيادية وموضوعية بين 4 خيارات رئيسية (الوضع الراهن، التحول المتوازن، التقشف الحذر، والدفعة الاستثمارية الكبرى بالاستدانة).',
    summaryEn: 'Objective comparison across 4 pathways: Status Quo, Balanced Reform, Austerity, and Debt-Financed Big Push.',
    citizenMeaningAr: 'توضح للمواطن أنه لا يوجد حل سحري في الاقتصاد؛ كل خيار له مكاسب وتكاليف وتضحيات يجب على المجتمع فهمها.',
    citizenMeaningEn: 'Demonstrates to citizens that economic policy entails unavoidable trade-offs: every gain comes with costs.',
    impactAr: 'تمنع تبسيط الأمور إلى "جيد وسيء" وتكشف الفائزين والخاسرين من كل قرار.',
    impactEn: 'Avoids simplistic binary labeling and transparently reveals distributional winners and losers.',
    tipAr: 'وازن بين طموح النمو السريع والمحافظة على استقرار الأسعار والدين العام.',
    tipEn: 'Balance the thirst for rapid headline growth with price stability and sovereign solvency.'
  },
  earlyWarningSystem: {
    key: 'earlyWarningSystem',
    titleAr: 'نظام الإنذار المبكر السيادي (EWS)',
    titleEn: 'Sovereign Early-Warning System (EWS)',
    category: 'concept',
    icon: '🚨',
    summaryAr: 'أجهزة استشعار مالية واجتماعية ترصد 10 مؤشرات حيوية وتطلق صافرة إنذار ملونة فور اقتراب الدولة من منطقة الخطر.',
    summaryEn: 'Sovereign radar monitoring 10 critical structural indices, triggering alert thresholds before crises erupt.',
    citizenMeaningAr: 'مثل ضوء فحص المحرك في السيارة؛ يخبر صانع القرار أن هناك خطراً وشيكاً (كارتفاع الديون أو انقطاع المياه) قبل وقوع الكارثة.',
    citizenMeaningEn: 'Like an engine check light, notifying leaders of impending systemic vulnerabilities before crisis breaks out.',
    impactAr: 'يتيح للحكومة اتخاذ إجراءات وقائية رخيصة بدلاً من دفع تكاليف إنقاذ باهظة بعد فوات الأوان.',
    impactEn: 'Enables proactive, low-cost preventative adjustments rather than catastrophic post-crisis emergency bailouts.',
    tipAr: 'لا تتجاهل المؤشرات البرتقالية أو الحمراء؛ راجع الإجراءات التصحيحية المقترحة فوراً.',
    tipEn: 'Never ignore amber or red signals; consult the recommended policy responses immediately.'
  },
  crisisCommodity: {
    key: 'crisisCommodity',
    titleAr: 'صدمة قفزة أسعار السلع والمحروقات',
    titleEn: 'Commodity & Fuel Price Shock',
    category: 'concept',
    icon: '⛽',
    summaryAr: 'ارتفاع حاد في أسعار النفط والقمح المستوردين مما يرفع كلفة المعيشة وعجز الموازنة فوراً.',
    summaryEn: 'Sharp surge in imported petroleum and grain prices, elevating living costs and fiscal deficit.',
    citizenMeaningAr: 'غلاء في محطات الوقود وسعر الخبز والسلع الأساسية مما يقلص ما يتبقى من راتبك في نهاية الشهر.',
    citizenMeaningEn: 'Higher pump and grocery prices, shrinking the residual monthly disposable income in your wallet.',
    impactAr: 'يفرض على الدولة إما رفع أسعار الوقود على المواطنين أو دفع مليارات كدعم إضافي.',
    impactEn: 'Forces governments to either pass hikes onto consumers or absorb massive budget deficits.',
    tipAr: 'ابنِ احتياطيات استراتيجية وطور مصادر الطاقة المحلية النظيفة لتقليل التبعية الخارجية.',
    tipEn: 'Build strategic food reserves and accelerate domestic renewable energy adoption.'
  },
  crisisDrought: {
    key: 'crisisDrought',
    titleAr: 'موجة الجفاف الحاد والشح المائي',
    titleEn: 'Severe Drought & Hydrological Stress',
    category: 'concept',
    icon: '☀️',
    summaryAr: 'انحباس الأمطار مما يدمر المحاصيل الزراعية ويخفض توليد السدود للكهرباء ويشعل أسعار الخضار.',
    summaryEn: 'Precipitation collapse curtailing crop yields, drying reservoirs, and inflating fresh food prices.',
    citizenMeaningAr: 'نقص في المياه العذبة وغلاء كبير في أسعار الخضراوات والفواكه المحلية وتضرر المزارعين.',
    citizenMeaningEn: 'Fresh water rationing and spike in fresh produce prices, directly threatening agricultural livelihoods.',
    impactAr: 'يهدد الأمن الغذائي ويدفع الفلاحين للهجرة إلى المدن مما يزيد البطالة الحضرية.',
    impactEn: 'Threatens food security and induces rural exodus into crowded metropolitan slums.',
    tipAr: 'تحول فوراً للري الحديث بالتنقيط وأوقف زراعة المحاصيل الشرهة للمياه.',
    tipEn: 'Mandate drip irrigation immediately and phase out water-intensive export crops.'
  },
  auditTrail: {
    key: 'auditTrail',
    titleAr: 'سجل التدقيق والمساءلة والشفافية',
    titleEn: 'Audit Trail & Accountability Ledger',
    category: 'concept',
    icon: '📜',
    summaryAr: 'سجل زمني غير قابل للتعديل يوثق كل قرار وقانون وسياسة وصدمة تم تطبيقها مع تاريخها والأثر المترتب عليها.',
    summaryEn: 'An immutable chronological ledger tracking every policy tweak, crisis injected, and parameter adjusted.',
    citizenMeaningAr: 'دفتر شفافية كامل يتيح لأي مواطن أو برلماني معرفة: "من قرر ماذا؟ ومتى؟ ولماذا اختلف سيناريو الإصلاح عن سيناريو التقشف؟".',
    citizenMeaningEn: 'A public record allowing citizens and auditors to trace who enacted what policy and why outcomes diverged.',
    impactAr: 'يحقق مبدأ المساءلة الديمقراطية ويمنع التهرب من مسؤولية القرارات الاقتصادية الخاطئة.',
    impactEn: 'Enforces democratic accountability, preventing policymakers from deflecting responsibility.',
    tipAr: 'استخدم ميزة مفسر التباين لمعرفة الأسباب الرياضية الدقيقة لأي تفاوت بين النتائج.',
    tipEn: 'Leverage the divergence explainer to decompose mathematical drivers of scenario differences.'
  }
};

/**
 * Helper to fetch plain explanation with fallback
 */
export function getPlainExplainer(key: string): PlainExplainer {
  if (EXPLAINER_DICTIONARY[key]) {
    return EXPLAINER_DICTIONARY[key];
  }

  // Fallback generic explainer
  return {
    key,
    titleAr: key,
    titleEn: key,
    category: 'concept',
    icon: '💡',
    summaryAr: 'مؤشر أو متغير في منظومة المحاكاة الوطنية يؤثر ويتأثر بالسياسات الاقتصادية والاجتماعية.',
    summaryEn: 'A variable in the national simulation model reflecting economic and social interactions.',
    citizenMeaningAr: 'يؤثر هذا المتغير بصورة مباشرة أو غير مباشرة على استقرار الأسواق ومستوى المعيشة والخدمات العامة.',
    citizenMeaningEn: 'Directly or indirectly impacts market stability, living standards, and public service quality.',
    impactAr: 'تغير قيمته ينعكس على التوازنات المالية ومسارات التنمية عبر شبكة العلاقات السببية.',
    impactEn: 'Changes propagate across fiscal balances and strategic goals via causal pathways.',
    tipAr: 'راقب اتجاه هذا المؤشر مقارنة بخط الأساس واختبر تأثير السياسات البديلة عليه.',
    tipEn: 'Track this metric relative to baseline and observe responses under varied policy decks.'
  };
}
