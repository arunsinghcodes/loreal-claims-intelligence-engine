# Product Requirements Document (PRD)

## L'Oréal Claims Intelligence Engine

**Status:** Draft  
**Version:** 0.1.0  
**Product type:** Full-stack AI-assisted assessment prototype

## 1. Overview

The Claims Intelligence Engine is a prototype designed to assess whether scientific study evidence supports a proposed cosmetic product claim.

The system accepts a marketing claim and its supporting scientific evidence, uses a Large Language Model (LLM) to produce a structured assessment, persists the result, and displays the outcome to the user.

The AI output is decision support for a human evaluator. It does not constitute independent scientific verification or regulatory approval.

## 2. Business Problem

Cosmetic product claims must be supported by appropriate evidence. Reviewing scientific reports against specific marketing statements can require substantial manual effort.

The proposed system aims to help evaluators identify whether submitted evidence appears to support a claim, highlight missing information, and explain the basis of an initial assessment.

## 3. Business Workflow

1. The Business Team proposes a product and marketing claims.
2. The Claim Manager reviews applicability and feasibility.
3. The Research and Innovation (R&I) Scientist develops the product formulation.
4. The Evaluator conducts or reviews the relevant tests and submits scientific evidence.
5. The Claims Intelligence Engine assesses the evidence against the claim.
6. The system stores the assessment and returns the result for human review.

The prototype focuses on step 5 and its associated persistence and user interface.

## 4. User Roles

- **Business Team:** Proposes marketing claims.
- **Claim Manager:** Reviews claim applicability and feasibility.
- **R&I Scientist:** Develops the product formulation.
- **Evaluator:** Submits scientific evidence and reviews the assessment.

Full authentication and role-based access control are outside the initial prototype scope unless required later.

## 5. Goals

- Accept a cosmetic claim and supporting study evidence.
- Generate a structured, evidence-based AI assessment.
- Distinguish justified, not justified, and inconclusive outcomes.
- Persist claims and their assessment history.
- Display the verdict, estimated confidence, reasoning, and limitations.
- Provide a reproducible local development environment.
- Demonstrate maintainable architecture and explainable engineering decisions.

## 6. Functional Requirements

### FR-01: Claim submission

The user can enter a product name and marketing claim.

### FR-02: Evidence submission

The user can provide supporting scientific study text. PDF upload and extraction are potential extensions.

### FR-03: Assessment

The backend sends the claim and evidence to the configured LLM provider and validates the structured response.

### FR-04: Assessment outcome

The result includes:

- Verdict: JUSTIFIED, NOT_JUSTIFIED, or INCONCLUSIVE.
- Estimated confidence score.
- Reasoning linked to the supplied evidence.
- Limitations and missing information.

### FR-05: Persistence

The system stores the claim and its associated assessment, including the evidence used for that assessment.

### FR-06: Result display

The frontend displays the assessment result and communicates loading and error states.

### FR-07: Failure handling

The system handles invalid requests, provider failures, malformed model output, and database errors without exposing secrets.

## 7. Non-Functional Requirements

- **Security:** Keep API keys on the server and validate incoming data.
- **Reliability:** Handle timeouts and transient provider errors appropriately.
- **Maintainability:** Separate controllers, business services, AI integration, and persistence.
- **Traceability:** Preserve assessment history and record relevant model metadata.
- **Testability:** Support unit and integration testing with a mock AI provider.
- **Usability:** Provide a clear, responsive interface with accessible form controls.
- **Reproducibility:** Document setup and local execution instructions.

## 8. Proposed Technology Stack

- Frontend: React, TypeScript, Vite
- Backend: NestJS, TypeScript
- Database: PostgreSQL
- ORM: Prisma
- LLM: Google Gemini API
- Package management: pnpm workspaces
- Local infrastructure: Docker Compose
- Version control: Git

These are implementation choices for the prototype, not mandatory technologies specified by the business use case.

## 9. Acceptance Criteria

- A user can submit a claim and supporting evidence.
- The backend validates the request.
- The AI integration returns a valid structured assessment or a controlled error.
- The assessment is persisted and linked to the claim.
- The frontend displays the persisted assessment.
- Insufficient evidence can produce an inconclusive result.
- Secrets are not committed to the repository or exposed to the frontend.
- Setup, test, and execution instructions are documented.

## 10. Scope and Limitations

### In scope

- Core claim assessment workflow.
- Two core database entities: Claim and Assessment.
- REST API integration.
- LLM-assisted assessment.
- Persistence, frontend display, and basic automated tests.

### Initially out of scope

- Complete enterprise authentication and authorization.
- Automatic regulatory approval.
- Automated scientific validation independent of human review.
- Production-scale document ingestion and vector search.
- Multi-region deployment and advanced infrastructure orchestration.

## 11. Risks and Assumptions

- Model output may be incomplete, inconsistent, or incorrect.
- A confidence score generated by an LLM is not necessarily a calibrated probability.
- The quality of the assessment depends on the evidence supplied.
- Long reports may require document extraction, chunking, and evidence aggregation.
- Scientific and regulatory decisions require appropriate expert review.

## 12. Success Criteria

The prototype is successful when a reviewer can run it locally, submit a representative claim and study evidence, inspect the resulting assessment, verify database persistence, and understand the architecture and its limitations.
