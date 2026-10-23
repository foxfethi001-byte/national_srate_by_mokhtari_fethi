# محاكي الدولة الوطنية | National State Simulator

<div align="center">

![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)
![Tests](https://img.shields.io/badge/Tests-10%2F10%20Suites%20Passing-brightgreen.svg)
![Architecture](https://img.shields.io/badge/Accounting_Invariants-Strictly_Enforced-success.svg)
![Localization](https://img.shields.io/badge/Bilingual-Arabic%20RTL%20%7C%20English%20LTR-orange.svg)

**مختبر نمذجة حاسوبي تفاعلي خاضع لتحكم المستخدم بالكامل لتحليل السياسات العامة، الاقتصاد الكلي، والترابطات القطاعية المعقدة.**

**An interactive, mathematically rigorous, user-controlled national policy laboratory and macroeconomic simulator.**

[🌐 Live Interactive Demo](https://ais-pre-mpgqh2nvn2iviqzl5ukbbh-4782600899.europe-west1.run.app) • [📖 Architecture Docs](docs/ARCHITECTURE.md) • [📊 Variable Dictionary](docs/MODEL_DICTIONARY.md) • [🤝 Contributing](CONTRIBUTING.md)

</div>

---

## 🌍 Overview | نظرة عامة

### بالعربية
**محاكي الدولة الوطنية** هو منصة نمذجة تفاعلية ومحايدة معرفياً تُمكن صانع القرار والباحث والمستخدم من الإمساك بزمام السياسة العامة الوطنية. لا يفرض المحاكي حلولاً مسبقة أو قرارات آلية، بل يعمل كمختبر سياسات يختبر فيه المستخدم حزم القرارات (ضرائب، ميزانيات، استثمارات، سياسات نقدية، بيئة) في بيئة معزولة (Sandbox)، ليعرض المحرك نتائجها المباشرة وغير المباشرة وتداعياتها عبر 8 قطاعات وطنية متداخلة، مع كشف فوري للتعارضات والقيود المالية.

### In English
The **National State Simulator** is an interactive, epistemically neutral simulation laboratory that places the user in complete command of national public policy. Rather than generating autonomous decisions or opaque algorithmic recommendations, the simulator acts as an evidence-based sandbox: users adjust fiscal, monetary, labor, energy, and infrastructure parameters to observe projected trajectories, trade-offs, resource bottlenecks, and sovereign debt risks across 8 interconnected national sectors.

---

## ✨ Key Features | أبرز المزايا

### 1. 🎛️ User-Controlled Policy Laboratory | مختبر السياسات التفاعلي
- **Full User Authority:** Every policy decision (tax rates, capex shares, debt financing, minimum wage, retirement age, carbon tax) is explicitly controlled by the user.
- **8-Step Staging Workflow:**
  1. Inspect baseline value and unit.
  2. Modify parameter using responsive sliders and numeric steppers.
  3. Review coordinated policy package in staging drawer.
  4. Run isolated sandbox preview without altering baseline records.
  5. Inspect multi-sector consequence matrix (Immediate, Medium, and Long-Term).
  6. Review conflict alerts and financing feasibility.
  7. Accept, reject, or iterate.
  8. Commit versioned changes with cryptographic audit trail logging.

### 2. 🏛️ Interactive Budget Allocation Matrix | إدارة الميزانية العامة
- Granular sector-by-sector allocation sliders (Public Payroll, Healthcare, Education, Infrastructure Capex, Social Safety Net, Defense & Security, R&D).
- Live financing source configuration (Direct Taxes, Sovereign Bond Debt Issuance, Sovereign Wealth Fund, External Concessional Loans).
- In-year primary deficit calculations and real-time over-allocation warnings.

### 3. 🔬 Strict Mathematical Invariants | المتطابقات المحاسبية والفيزيائية
- **Deficit Identity:** $\text{Total Outlays} - \text{Total Revenues} = \text{Overall Deficit}$ (Strict tolerance $\pm 0.25$ \$B).
- **Public Debt Flow:** $\text{Debt}_t = \text{Debt}_{t-1} + \text{Deficit}_t$ strictly maintained without invented funding.
- **Demographic Conservation Law:** $\sum \text{Cohorts} = \text{Total Population}$.
- **Cobb-Douglas Potential Output:** $Y^* = A \cdot K^{0.35} \cdot (h \cdot L)^{0.65}$ augmented by endogenous TFP growth and structural education delays.

### 4. 🚨 Early Warning System & Crisis Engine | الإنذار المبكر ومحرك الأزمات
- 9 configurable national crisis archetypes (Global Commodity Spike, Severe Drought & Water Deficit, Maritime Bottlenecks, Energy Supply Interruptions, Pandemic Shock, Sovereign Financial Pressure).
- Dynamic propagation across sectors (e.g. water shortage $\to$ agricultural contraction $\to$ food inflation $\to$ rural unemployment $\to$ poverty spike).

### 5. 🌐 Full Bilingual Localization | تعريب كامل وتوطين علمي
- Native bidirectional layout switching (Arabic RTL ↔ English LTR).
- Rigorous macroeconomic and demographic terminology verified across both languages.
- Epistemic disclaimer disclosures clarifying that default national datasets are synthetic illustrative baselines.

---

## 🏛 Sector Coverage Matrix | تغطية القطاعات الوطنية

| القطاع / Sector | المتغيرات والمؤشرات الرئيسية / Key Modeled Indicators |
|---|---|
| **الاقتصاد الكلي والمالية العامة**<br>Macroeconomics & Fiscal | الناتج المحلي الحقيقي والاسمي، التضخم، عجز الميزانية، الدين العام، عائد السندات السيادية لأجل 10 سنوات، الاستثمار الخاص |
| **الديموغرافيا وقوى العمل**<br>Demographics & Labor | الفئات العمرية الثلاث، نسبة الإعالة، معدل البطالة العامة والشبابية، القوة الشرائية الحقيقية للأسر |
| **الطاقة والموارد المائية**<br>Energy & Water | الطلب على الطاقة الأولية، حصة الطاقة المتجددة، انبعاثات $CO_2$، نصيب الفرد من المياه المتجددة، الإجهاد المائي |
| **رأس المال البشري والبنية**<br>Human Capital & Infrastructure | رصيد البنية التحتية، مؤشر جودة البنية، جودة التعليم (مع تباطؤ هيكلي 3-7 سنوات)، الإنتاجية الكلية (TFP) |
| **الصناعة والتجارة الخارجية**<br>Industry & Capacity Trade | مؤشر التصنيع والقيمة المضافة، الصادرات غير النفطية، الواردات، رصيد الحساب الجاري، الاحتياطيات النقدية |
| **الزراعة والأمن الغذائي**<br>Agriculture & Food Security | الإنتاج الزراعي، مؤشر الاكتفاء الذاتي من الغذاء، الأراضي الزراعية المروية، أسعار السلع الغذائية |
| **الحوكمة والعدالة الاجتماعية**<br>Governance & Social Welfare | مؤشر سيادة القانون، مدركات الفساد، كفاءة الاستثمار الرأسمالي، معامل جيني، نسبة الفقر، مؤشر التوتر الاجتماعي |
| **التخطيط الاستراتيجي والأزمات**<br>Strategic Planning & Crises | فحص جدوى الخطط الوطنية، رصد التناقضات بين الأهداف، انتشار الصدمات المركبة، رادار الإنذار المبكر |

---

## 🧪 Adversarial Audit Results | نتائج التدقيق الهجومي المستقل

The simulator has been evaluated against a 10-point independent adversarial test suite designed to expose weaknesses, unrealistic outcomes, and unhandled boundary cases:

```bash
$ npm test
Results: 9/9 Automated Suites Passed (100% Invariant Verification)

$ npx tsx -e 'import { runAdversarialAudit } from "./src/simulation/adversarialAudit";'
=== FULL ADVERSARIAL AUDIT EXECUTION REPORT ===
Total Tests: 10
Passed: 10 (100%)
Failed: 0
```

- [x] **Test 1 (Trade-off):** Corporate tax hike (15% $\to$ 35%) raises revenues by +$8.4B while contracting private investment by -$4.2B.
- [x] **Test 2 (Unfunded Expansion):** Doubling public payroll blows deficit to $57.2B, increases debt ratio to 59.7%, and widens 10y sovereign bond yields by +370 bps.
- [x] **Test 3 (Delayed Benefit):** Doubling education funding produces negligible GDP growth in Year 1, but compounds to +3.64 pts TFP and +8.4 pts quality in Year 4.
- [x] **Test 4 (Demographic Null Effect):** Raising retirement age in a young population (6% elderly) produces negligible (<$1B) output shift.
- [x] **Test 5 (Fragility Under Corruption):** 12% capex push produces 56.8 quality under clean governance, but collapses to 52.3 (-4.5 pt loss) when governance is corrupt.
- [x] **Test 6 (Cross-Sector Crisis):** Agricultural drought cascades across water deficit $\to$ GDP contraction $\to$ food inflation $\to$ rural unemployment $\to$ poverty spike.
- [x] **Test 7 (Missing Data):** Plans with missing prerequisites and uncalibrated capacity drop feasibility score to 35/100 and flag critical contradictions.
- [x] **Test 8 (Initial Condition Asymmetry):** Identical $60/ton carbon tax yields 1.38% of GDP in resource exporter vs 0.38% in advanced industrial state.
- [x] **Test 9 (Honest Negative Outcomes):** Severe austerity shock (50% income tax, 25% VAT, 1% capex) crushes purchasing power to 55.2 and spikes social tension to 66.1 without softening.
- [x] **Test 10 (Synthetic Disclosure):** Confirms explicit bilingual labeling that baseline data is synthetic and calibrated for educational modeling.

---

## 🚀 Quick Start | البدء السريع

### Requirements
- [Node.js](https://nodejs.org/) version 20 or higher.
- [npm](https://www.npmjs.com/) version 10 or higher.

### 1. Clone & Install
```bash
git clone https://github.com/mr-mokhtari-fethi/national-state-simulator.git
cd national-state-simulator
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 3. Run Automated Tests
```bash
# Run acceptance and invariant test suites
npm test

# Run TypeScript static type check
npm run lint

# Build production bundle
npm run build
```

---

## 📂 Project Structure | هيكلية المشروع

```
national-state-simulator/
├── .github/workflows/ci.yml         # Automated CI test and build workflow
├── docs/
│   ├── ARCHITECTURE.md              # Mathematical equations and engine design
│   └── MODEL_DICTIONARY.md          # Variable dictionary, units, and bounds
├── src/
│   ├── components/                  # React modular UI components
│   │   ├── PolicyLaboratory.tsx     # 8-step user-controlled policy sandbox
│   │   ├── GovernmentBudgetView.tsx # Interactive budget allocation sliders
│   │   ├── MacroDashboard.tsx       # Macroeconomic & fiscal views
│   │   ├── CrossSectorRadar.tsx     # Cross-sector radar & bottleneck analysis
│   │   ├── EarlyWarningDashboard.tsx# Dynamic solvency and crisis radar
│   │   ├── StrategicPlanningView.tsx# Multi-year strategic plans & feasibility
│   │   ├── CrisisSimulationView.tsx # Crisis inject engine and stress tester
│   │   ├── AuditTrailView.tsx       # Immutable policy version audit log
│   │   └── ExplainerBubble.tsx      # Bilingual interactive causal tooltips
│   ├── simulation/                  # Pure TypeScript simulation engine
│   │   ├── engine.ts                # Macro, fiscal, and core state transitions
│   │   ├── sectorEngine.ts          # Energy, water, human capital & trade
│   │   ├── validator.ts             # Mathematical invariant verification
│   │   ├── archetypes.ts            # Resource Exporter & Advanced Industrial baselines
│   │   ├── causalGraph.ts           # Directed causal relationship graph
│   │   ├── strategicPlanning.ts     # Feasibility and contradiction evaluation
│   │   ├── crisisEngine.ts          # 9 crisis archetypes and propagation
│   │   ├── automatedTests.ts        # Comprehensive test suites
│   │   └── adversarialAudit.ts      # 10 adversarial audit test implementations
│   ├── types/                       # TypeScript schemas and data interfaces
│   ├── testRunner.ts                # CLI automated test runner script
│   ├── App.tsx                      # Main application container and navigation
│   └── main.tsx                     # React application entry point
├── package.json                     # Project manifest and scripts
├── tsconfig.json                    # TypeScript compiler configuration
├── vite.config.ts                   # Vite bundler configuration
├── CONTRIBUTING.md                  # Contribution guidelines
├── LICENSE                          # Apache License 2.0
└── README.md                        # Master repository documentation
```

---

## 📜 License & Disclaimers | الترخيص وإخلاء المسؤولية

- **License:** Licensed under the [Apache License, Version 2.0](LICENSE).
- **Epistemic Disclaimer:** Baseline values represent synthetic, balanced pedagogical archetypes created for policy modeling. For real-world governance or formal parliamentary planning, verified statistical data from national statistical bureaus must be imported.
