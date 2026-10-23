# System Architecture & Simulation Engine Design

## 1. Overview & Mathematical Core

The **National State Simulator** is a multi-sector discrete-time dynamic simulation framework operating at annual ($t$) and quarterly ($q$) time horizons.

```
+--------------------------------------------------------------------------+
|                     User-Controlled Policy Sandbox                       |
|   Tax Rates | Expenditure Shares | Monetary Params | Environmental Regs  |
+--------------------------------------------------------------------------+
                                     │
                                     ▼
+--------------------------------------------------------------------------+
|                       Sector Simulation Engine                           |
|                                                                          |
|  [Macro & Fiscal] <───────> [Demographics & Labor] <───────> [Energy]   |
|         ▲                              ▲                         ▲       |
|         │                              │                         │       |
|         ▼                              ▼                         ▼       |
|  [Human Capital]  <───────> [Governance & Welfare] <───────> [Water]    |
+--------------------------------------------------------------------------+
                                     │
                                     ▼
+--------------------------------------------------------------------------+
|                    Validation & Invariant Enforcement                    |
|   Outlays - Revenues = Deficit  |  Debt(t) = Debt(t-1) + Deficit(t)      |
+--------------------------------------------------------------------------+
                                     │
                                     ▼
+--------------------------------------------------------------------------+
|                 Early Warning & Conflict Detection Radar                 |
|   Solvency Warnings | Resource Bottlenecks | Social Tension Alarms       |
+--------------------------------------------------------------------------+
```

---

## 2. Structural Sector Models

### A. Macroeconomics & Aggregate Production
- **Potential GDP Formulation ($Y^*$):**
  Uses a Cobb-Douglas production function augmented with human capital:
  $$Y^* = A \cdot K^\alpha \cdot (h \cdot L)^{1 - \alpha}$$
  where $\alpha = 0.35$, $A$ represents Total Factor Productivity (TFP), $K$ is total physical and infrastructure capital stock, $h$ is the human capital quality index, and $L$ is employed labor force.
- **Dynamic Fiscal Drag & Demand Feedback:**
  Austerity shocks and sudden tax rate increases depress short-run real GDP growth via explicit fiscal contraction multipliers:
  $$\Delta g_{\text{fiscal}} = - \Big( 0.04 \cdot \Delta \tau_{\text{income}} + 0.05 \cdot \Delta \tau_{\text{VAT}} + 0.15 \cdot \max(0, 6.5\% - \text{Capex}_{\text{infra}}) \Big)$$

### B. Sovereign Debt & Risk Pricing
- **10-Year Sovereign Bond Yield:**
  $$Y_{10y} = r_{\text{CB}} + 1.20\% + \text{Spread}_{\text{debt}} + \text{Spread}_{\text{deficit}} + \text{Shock}_{\text{global}}$$
  where:
  - $\text{Spread}_{\text{debt}} = \max\Big(0, \frac{\text{Debt}}{\text{GDP}} - 60\%\Big) \times 0.04\%$
  - $\text{Spread}_{\text{deficit}} = \max\Big(0, \frac{\text{PrimaryDeficit}}{\text{GDP}} - 3\%\Big) \times 0.25\%$

### C. Household Purchasing Power & Social Tension
- **Real Net Disposable Income per Worker:**
  Reflects gross labor earnings, direct income taxes with basic exemption thresholds, targeted social transfers, and consumption deflator adjusted for VAT.
- **Dynamic Social Tension Index:**
  Evolves as a path-dependent state variable:
  $$\text{Tension}_t = \text{Tension}_{t-1} + 0.4 \cdot \text{Loss}_{\text{purchasing}} + 1.5 \cdot \Delta \pi + 2.0 \cdot \Delta \text{Poverty} - 0.3 \cdot \Delta \text{Trust}$$

---

## 3. Data Integrity & Reproducibility
- **Deterministic Trajectories:** Identical policies and initial states produce strictly identical multi-year trajectories across all runs.
- **State Serialization:** Checkpoints are stored with ISO timestamping and strict schema versioning, enabling full rollbacks without data corruption.
