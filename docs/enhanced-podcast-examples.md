# Enhanced Economics Podcast Examples

This document contains sample questions and expected enhanced responses that demonstrate the new capabilities of the economics podcast feature.

## Sample Questions to Test Enhanced Features:

### 1. GDP Growth Analysis
**Question:** "How has GDP growth changed between major economies in the last 5 years?"

**Expected Enhanced Response Features:**
- Real GDP figures for USA, China, Germany, Japan from 2020-2024
- Percentage growth calculations
- Mathematical formulas for GDP growth rate calculation: $\text{Growth Rate} = \frac{\text{GDP}_{t} - \text{GDP}_{t-1}}{\text{GDP}_{t-1}} \times 100$
- Bar chart comparing GDP values: [CHART:GDP Comparison]
- Line chart showing growth trends: [CHART:GDP Growth Trends]

### 2. Inflation Impact on Economy
**Question:** "What is the relationship between inflation and unemployment rates?"

**Expected Enhanced Response Features:**
- Phillips Curve equation: $\pi_t = \pi_e + \alpha(u_n - u_t) + \varepsilon_t$
- Real inflation data for multiple countries (2020-2024)
- Unemployment statistics with percentages
- Scatter plot showing Phillips Curve: [CHART:Phillips Curve]
- Reference to correlation coefficients and statistical significance

### 3. Economic Policy Analysis
**Question:** "How do interest rate changes affect economic growth?"

**Expected Enhanced Response Features:**
- Central bank policy rates for major economies
- Monetary policy transmission mechanism equations
- IS-LM model references: $Y = C(Y-T) + I(r) + G$
- Economic multiplier calculations
- Time series charts showing rate vs growth correlation: [CHART:Interest Rate Impact]

### 4. International Trade Analysis
**Question:** "What factors determine exchange rate fluctuations?"

**Expected Enhanced Response Features:**
- Purchasing Power Parity formula: $S = \frac{P_{\text{domestic}}}{P_{\text{foreign}}}$
- Real exchange rate data (USD vs major currencies)
- Trade balance statistics
- Economic fundamentals correlation
- Currency volatility charts: [CHART:Exchange Rate Volatility]

### 5. Economic Forecasting
**Question:** "How can we predict future economic trends using current indicators?"

**Expected Enhanced Response Features:**
- Econometric models and regression equations
- Leading economic indicators with real values
- Statistical forecasting methods
- Confidence intervals and probability distributions
- Predictive modeling charts: [CHART:Economic Forecast Model]

## Expected AI Response Format:

```json
{
  "podcastScript": [
    {
      "speaker": "Speaker1", 
      "line": "Welcome to Economics Insights! Today we're analyzing GDP growth trends. Looking at our data visualization [CHART:GDP Comparison], we can see some fascinating patterns across major economies."
    },
    {
      "speaker": "Speaker2", 
      "line": "Absolutely, Rita. The numbers tell a compelling story. The US GDP reached $28.8 trillion in 2024, representing a 2.7% growth rate. Using the formula $\\text{Growth Rate} = \\frac{\\text{GDP}_{2024} - \\text{GDP}_{2023}}{\\text{GDP}_{2023}} \\times 100$, we can see that despite global challenges, major economies showed resilience."
    }
  ]
}
```

## Testing Checklist:

- [ ] Real economic statistics are included (specific years, countries, percentages)
- [ ] Mathematical formulas are properly formatted with LaTeX notation
- [ ] Chart references are included with appropriate types
- [ ] Economic theories and models are mentioned
- [ ] Statistical analysis terminology is used
- [ ] Quantitative comparisons between countries/time periods
- [ ] Professional economic vocabulary and concepts
- [ ] References to data visualizations and graphs
