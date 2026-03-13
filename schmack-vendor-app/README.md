# SCHMACK Vendor Tracking App

An internal application to replace SCHMACK's Google Sheet for managing software vendors, spend, seat counts, employee access, renewals, and reporting.

## Core capabilities
- Vendor tracking
- Per-seat and fixed-cost billing models
- Monthly and annual billing support
- Native vendor currency storage
- Dashboard normalization into a selected reporting currency
- Employee directory with team and country metadata
- Bi-directional access management
- Renewal tracking
- Seat visibility and over-assignment detection

## Stack
- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- React Hook Form + Zod
- TanStack Table
- Recharts

## Setup
1. Create a Postgres database
2. Copy `.env.example` to `.env`
3. Run `npm install`
4. Run `npx prisma generate`
5. Run `npx prisma migrate dev --name init`
6. Run `npm run prisma:seed`
7. Run `npm run dev`
