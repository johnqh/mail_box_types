# CLAUDE.md - AI Development Guide

This file provides context for AI assistants working with this codebase.

## Project Overview

`@sudobility/mail_box_types` is a TypeScript types library providing comprehensive type definitions for Mail Box services:

- **Indexer API types**: API responses and type guards for the Mail Box Indexer service
- **WildDuck types**: Mail server API types including REST and WebSocket interfaces
- **KYC types**: Know Your Customer verification types for Sumsub integration
- **Mailer types**: Mailbox contract response types for multi-chain messaging (EVM and Solana)

## Dependencies

This package depends on `@sudobility/types` for common utility types. Common types like `Optional`, `ChainType`, `BaseResponse`, etc. are re-exported from `@sudobility/types`.

## Project Structure

```
src/
├── index.ts                    # Main entry point, re-exports all types
└── types/
    ├── index.ts                # Aggregates all type modules
    ├── indexer/
    │   ├── index.ts            # Exports all indexer types and guards
    │   ├── indexer-responses.ts # API response type definitions
    │   └── indexer-guards.ts   # Runtime type guard functions
    ├── wildduck/
    │   ├── index.ts            # Exports all WildDuck types
    │   ├── wildduck-types.ts   # REST API types (users, mailboxes, messages, etc.)
    │   └── wildduck-websocket-types.ts # WebSocket API types
    ├── kyc/
    │   ├── index.ts            # Exports all KYC types
    │   └── kyc-types.ts        # KYC verification types (Sumsub integration)
    └── mailer/
        ├── index.ts            # Exports all mailer types
        └── mail-types.ts       # Mailbox contract response types
```

## Key Commands

```bash
npm run build        # Build ESM and CJS outputs
npm run typecheck    # Run TypeScript compiler (no emit)
npm run lint         # Run ESLint
npm run lint:fix     # Run ESLint with auto-fix
npm run format       # Format code with Prettier
npm run format:check # Check formatting
npm run test         # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run clean        # Remove dist folder
```

## Development Guidelines

### Export Conventions

**All types must be exported as named exports.** No default exports.

```typescript
// Correct
export interface MyType { ... }
export type MyAlias = ...;
export enum MyEnum { ... }
export function myGuard(x: unknown): x is MyType { ... }

// Incorrect - DO NOT USE
export default interface MyType { ... }
```

### Import from @sudobility/types

For common types, import directly from `@sudobility/types`:

```typescript
import type { Optional, BaseResponse, MessageBase } from '@sudobility/types';
import { ChainType } from '@sudobility/types';
```

### Type Organization

1. **Interfaces/Types**: Define data structures
2. **Enums**: Define fixed sets of values
3. **Type Guards**: Runtime type checking functions (prefix with `is`)
4. **Helper Functions**: Factory functions (prefix with `create`)

### File Naming

- `*-types.ts` - Type definitions
- `*-guards.ts` - Type guard functions
- `index.ts` - Re-exports for the module

### Common Patterns

**API Response Pattern**:
```typescript
export interface MyDataResult {
  // actual data fields
}
export type MyResponse = ApiResponse<MyDataResult>;
```

**Type Guard Pattern**:
```typescript
export function isMyResponse(response: unknown): response is MyResponse {
  return !!(
    response &&
    typeof response === 'object' &&
    'success' in response &&
    // ... additional checks
  );
}
```

## Build Output

The project builds to:
- `dist/index.js` - ESM module
- `dist/index.cjs` - CommonJS module
- `dist/index.d.ts` - TypeScript declarations

Package.json exports configuration supports both ESM and CJS consumers.

## Type Categories

### Common Types (from `@sudobility/types`)
Import directly from `@sudobility/types`:
- `Optional<T>` - Nullable utility type
- `ChainType` - Blockchain type enum (EVM, Solana)
- `WalletData` - Base wallet interface
- `ApiResponse<T>` - Standard API response wrapper
- `BaseResponse<T>` - Base response with required timestamp
- `PaginatedResponse<T>` - Paginated response structure
- `MessageBase` - Base message structure
- `UnifiedError` - Unified error structure

### Indexer Types (`types/indexer/`)
- Email account types
- Rewards/points types
- Delegation types
- Name service types
- Template and webhook types
- Type guards for all response types

### WildDuck Types (`types/wildduck/`)
- Authentication types
- User management types
- Mailbox types
- Message types (list, detail, search)
- Filter types
- WebSocket channel types and events

### KYC Types (`types/kyc/`)
- Verification level enums
- Application status enums
- Sumsub integration types
- Third-party DApp API types

### Mailer Types (`types/mailer/`)
Mailbox contract response types for multi-chain messaging:
- **Enums**: `ConfirmationStatus`, `ClaimType`, `FeeType`
- **Transaction Types**: `BaseTransactionResponse`, `TransactionReceipt`
- **Message Operations**: `MessageSendResponse`, `PreparedMessageSendResponse`
- **Revenue & Claims**: `ClaimableInfo`, `ClaimRevenueResponse`, `ClaimableAmountResponse`
- **Domain & Delegation**: `DomainRegistrationResponse`, `MailboxDelegationResponse`
- **Fee Management**: `FeeInfo`, `FeeUpdateResponse`
- **Contract State**: `PauseInfo`, `PauseResponse`, `EmergencyDistributionResponse`
- **Chain-Specific**: `EVMTransactionResponse`, `SolanaTransactionResponse`
- **Client Types**: `UnifiedClientResponse`, `BatchOperationResponse`
- **Query Types**: `MessageHistoryItem`, `MessageHistoryResponse`, `DelegationStatusResponse`
- **Type Guards**: `isEVMResponse`, `isSolanaResponse`, `isMailboxErrorResponse`, etc.

## Testing

Tests are written using Vitest and located alongside source files with `.test.ts` extension.

```bash
npm run test         # Run all tests once
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

### Test Files

- `src/types/indexer/indexer-guards.test.ts` - Indexer type guard tests
- `src/types/wildduck/wildduck-types.test.ts` - WildDuck type guards and helpers
- `src/types/wildduck/wildduck-websocket-types.test.ts` - WebSocket type guards and helpers
- `src/types/kyc/kyc-types.test.ts` - KYC enum and type tests
- `src/types/mailer/mail-types.test.ts` - Mailer type guards and enum tests

### What to Test

1. **Type Guards**: Test that they correctly identify valid/invalid data
2. **Helper Functions**: Test factory functions produce correct structures
3. **Enums**: Verify enum values match expected strings
4. **Type Compatibility**: Ensure interfaces can be instantiated correctly

## Adding New Types

1. Create or edit the appropriate file in `src/types/<module>/`
2. Export all types as named exports
3. Import common types from `@sudobility/types`
4. Ensure the module's `index.ts` re-exports the new types
5. Add tests for type guards and helper functions in a corresponding `.test.ts` file
6. Run `npm run typecheck`, `npm run lint`, and `npm run test` to verify
7. Run `npm run build` to generate outputs
