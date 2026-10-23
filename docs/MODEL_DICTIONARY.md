# Simulation Model Variable Dictionary & Calibration Guide

This dictionary documents the core state variables and policy controls implemented across the National State Simulator.

---

## 1. Macroeconomics & Fiscal Accounts

| Key | Variable Name (Ar / En) | Unit | Bounds | Formula / Accounting Identity |
|---|---|---|---|---|
| `realGdp` | الناتج المحلي الإجمالي الحقيقي / Real GDP | $B USD | $[10, 50000]$ | $Y_t = Y_{t-1} \times (1 + g_t)$ |
| `realGdpGrowthRate` | معدل نمو الناتج الحقيقي / Real GDP Growth Rate | % | $[-8.0, 12.0]$ | $g = \text{Potential} + \text{Shock} - \text{FiscalDrag} + \epsilon$ |
| `nominalGdp` | الناتج المحلي الاسمي / Nominal GDP | $B USD | $[10, 75000]$ | $Y_{\text{real}} \times (\text{Deflator} / 100)$ |
| `totalRevenue` | إجمالي الإيرادات العامة / Total Fiscal Revenues | $B USD | $[1, 25000]$ | Direct Taxes + Indirect Taxes + Resource Rents + Tariffs + Carbon Tax |
| `totalExpenditure` | إجمالي المصروفات العامة / Total Outlays | $B USD | $[1, 30000]$ | Wages + Capex + Health + Edu + Social + Defense + Debt Interest |
| `overallDeficit` | عجز/فائض الموازنة العامة / Overall Budget Deficit | $B USD | $[-5000, 5000]$ | $\text{TotalExpenditure} - \text{TotalRevenue}$ |
| `publicDebtStock` | رصيد الدين العام الإجمالي / Public Debt Stock | $B USD | $[0, 50000]$ | $\text{Debt}_{t-1} + \text{Deficit}_t$ |
| `debtToGdpRatio` | نسبة الدين العام للناتج / Debt-to-GDP Ratio | % | $[0, 300]$ | $(\text{PublicDebtStock} / \text{NominalGdp}) \times 100$ |
| `sovereignBondYield10y` | عائد السندات السيادية لأجل 10 سنوات / 10y Bond Yield | % | $[1.0, 25.0]$ | $r_{\text{CB}} + 1.2\% + \text{Spread}_{\text{debt}} + \text{Spread}_{\text{deficit}}$ |

---

## 2. Demographics, Labor & Social Welfare

| Key | Variable Name (Ar / En) | Unit | Bounds | Formula / Accounting Identity |
|---|---|---|---|---|
| `totalPopulation` | إجمالي عدد السكان / Total Population | Millions | $[0.1, 1500]$ | $\text{Youth} + \text{WorkingAge} + \text{Elderly}$ |
| `unemploymentRate` | معدل البطالة العامة / Unemployment Rate | % | $[1.0, 45.0]$ | $(\text{UnemployedTotal} / \text{LaborForceTotal}) \times 100$ |
| `purchasingPowerIndex` | مؤشر القوة الشرائية للأسر / Purchasing Power Index | Index (100 = base) | $[20.0, 200.0]$ | $\frac{\text{DisposableIncomeReal}_t}{\text{DisposableIncomeReal}_{\text{base}}} / \text{VATPriceAdjustment}$ |
| `povertyRatePct` | نسبة الفقر الوطني / National Poverty Rate | % | $[0.5, 75.0]$ | Sensitive to food inflation, social safety net spending, and minimum wage |
| `socialTensionIndex` | مؤشر التوتر الاجتماعي / Social Tension Index | Index (0-100) | $[5.0, 98.0]$ | Path-dependent: $\text{Tension}_{t-1} + \Delta\text{Losses} - \Delta\text{Trust}$ |

---

## 3. Human Capital, Infrastructure & Innovation

| Key | Variable Name (Ar / En) | Unit | Bounds | Notes |
|---|---|---|---|---|
| `totalFactorProductivity` | الإنتاجية الكلية لعوامل الإنتاج (TFP) | Index (100 = base) | $[60, 250]$ | Shifts with R&D intensity, education quality, and trade integration |
| `educationQualityIndex` | مؤشر جودة التعليم / Education Quality | Score (0-100) | $[10, 100]$ | 3-to-7 year structural delay from education budget allocations |
| `infrastructureQualityIndex` | مؤشر جودة البنية التحتية / Infrastructure Quality | Score (0-100) | $[10, 100]$ | Driven by capex spending and governance efficiency coefficient |
