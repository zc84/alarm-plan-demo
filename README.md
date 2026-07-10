# Alarm Plan Demo (Client-Side React)

This repository contains a **fully client-side React + TypeScript demo** that represents the alarm plan RFP workflows without backend/API dependencies.

## What this demo includes

- Mock login, role selection, and scope switching
- Permission-aware navigation shell
- Alarm plans overview + alarm plan wizard steps
- Approval center with confirm/reject simulation and comments
- Operational zones/geoviewer-like status panel
- Alarm devices matrix
- Deployment order views
- Vehicle modification task center
- Integration preview (staging YES/NO simulation)
- Security & architecture explanation page
- Print/export center
- Audit log timeline
- Additional module cards (phone list, checklists, POI, documents, etc.)

## Tech stack

- React
- TypeScript
- Vite
- React Router
- Local mock data (`src/data/mockData.ts`)
- Local in-memory state via React context

## Run locally

```bash
npm install
npm run dev
```

Build check:

```bash
npm run build
```

## Demo limitations

- No real Keycloak/OIDC integration
- No backend, no database, no external APIs
- No persistent server-side workflow/audit storage
- Security controls are explanatory/demo only (not production hardening)

## Deployment

A Render static blueprint is included in `render.yaml`.
