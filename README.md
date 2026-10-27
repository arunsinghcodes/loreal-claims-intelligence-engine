# L'Oréal Claims Intelligence Engine

An AI-assisted full-stack prototype for evaluating whether scientific study evidence supports cosmetic product claims.

## Overview

The Claims Intelligence Engine explores how a Large Language Model (LLM) can help evaluators review scientific evidence against proposed cosmetic marketing claims.

For example, a product claim such as "Reduces wrinkles by 20% in 4 weeks" can be assessed against the study evidence submitted by an evaluator.

The system returns a structured assessment containing a verdict, estimated confidence score, reasoning, and evidence limitations. The output supports human review and does not constitute scientific or regulatory approval.

## Technology Stack

| Layer                | Technology              |
| -------------------- | ----------------------- |
| Frontend             | React, TypeScript, Vite |
| Backend              | NestJS, TypeScript      |
| Database             | PostgreSQL              |
| ORM                  | Prisma                  |
| AI provider          | Google Gemini           |
| Package management   | pnpm workspaces         |
| Local infrastructure | Docker Compose          |
| Version control      | Git                     |

## Project Structure

```text
.
├── apps/
│   ├── web/                  # React frontend
│   └── api/                  # NestJS backend
├── packages/
│   └── shared/               # Shared contracts, when needed
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── AI-ASSESSMENT.md
│   └── ROADMAP.md
├── .env.example
├── .gitignore
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

## Prerequisites

- Node.js 24.x
- pnpm
- Docker Desktop
- Git
- A Google Gemini API key for live AI assessment

Use compatible versions of these tools and follow the repository's configured package manager requirements.

## Getting Started

### 1. Clone the repository

```bash
git clone <your-github-repository-url>
cd loreal-claims-intelligence-engine
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Copy the example environment file when available:

```bash
cp .env.example .env
```

Configure the required database connection and Gemini API credentials according to the environment variable documentation.

Never commit real API keys, passwords, or other secrets.

### 4. Start the application

Development commands will be maintained in the root package scripts as the application is implemented.

The intended development workflow is:

```bash
pnpm dev
```

The complete containerized workflow will be documented after Docker Compose has been configured and tested.

## Core Workflow

1. Submit a cosmetic product claim.
2. Provide the supporting scientific study evidence.
3. Request an AI-assisted assessment.
4. Validate and persist the assessment result.
5. Review the verdict, confidence estimate, reasoning, and limitations.

## API

The planned assessment endpoint is:

`POST /api/claims/assess`

The request and response contract will be documented in `docs/API.md`.

## Testing

Automated tests will cover request validation, assessment logic, AI provider failures, persistence, and frontend behavior.

## Documentation

- [Product Requirements Document](docs/PRD.md)
- [Technical Architecture](docs/ARCHITECTURE.md)
- [AI Assessment Design](docs/AI-ASSESSMENT.md)
- [Product Roadmap](docs/ROADMAP.md)

## Important Limitations

- AI-generated assessments may be inaccurate or incomplete.
- An LLM-generated confidence score is not necessarily a calibrated probability.
- The system must identify insufficient evidence rather than inventing scientific support.
- Final scientific and regulatory decisions remain with qualified human reviewers.

## License

This repository is an interview assessment prototype. Licensing and redistribution terms can be specified separately if required.
