# SchoolScope - School District Evaluator

A web application that helps parents and educators evaluate school districts across the United States using publicly available data from the National Center for Education Statistics (NCES).

## Features

- **Search & Browse** - Find school districts by name, city, or state with real-time filtering
- **District Details** - View comprehensive metrics including enrollment, graduation rates, student-teacher ratios, and per-pupil spending
- **Compare Districts** - Side-by-side comparison of up to 5 districts with radar charts and detailed tables
- **Data Visualization** - Interactive charts powered by Recharts for graduation rates and financial data
- **Responsive Design** - Mobile-first UI built with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Data Source**: Urban Institute Education Data API (NCES)
- **Testing**: Vitest + React Testing Library (99%+ coverage)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
  app/                    # Next.js App Router pages and API routes
    api/districts/        # REST API endpoints (search, detail, compare)
    compare/              # Compare districts page
    district/[id]/        # District detail page
  components/             # Reusable React components
    Charts/               # Recharts visualization components
    ui/                   # Shared UI primitives
  lib/                    # Data models, API client, utilities
```

## Data Attribution

All education data is sourced from the [National Center for Education Statistics (NCES)](https://nces.ed.gov/) via the [Urban Institute Education Data API](https://educationdata.urban.org/).
