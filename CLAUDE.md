# mail_box_types - AI Development Guide

## Overview

`@sudobility/mail_box_types` is a TypeScript types-only library that provides comprehensive type definitions, enums, type guards, and helper functions for the Mail Box protocol. It covers four domains: the blockchain Indexer API, the WildDuck mail server (REST and WebSocket), KYC/Sumsub identity verification, and multi-chain mailbox smart contract interactions (EVM and Solana). All runtime values (enums, type guards, factory functions) are shipped alongside pure type definitions.

- **Package**: `@sudobility/mail_box_types`
- **Version**: 1.0.10
- **License**: BUSL-1.1
- **Package Manager**: Bun (always use `bun` commands, never `npm`)
- **Module Format**: Dual ESM (`dist/index.js`) + CommonJS (`dist/index.cjs`) with TypeScript declarations (`dist/index.d.ts`)

## Project Structure

```
src/
├── index.ts                                 # Root entry point, re-exports ./types
└── types/
    ├── index.ts                             # Aggregates and re-exports all 4 modules
    ├── indexer/
    │   ├── index.ts                         # Named re-exports of all indexer types & guards
    │   ├── indexer-responses.ts             # ~50 interfaces/types for Indexer API responses
    │   ├── indexer-guards.ts                # 22 runtime type guard functions
    │   └── indexer-guards.test.ts           # Tests for indexer type guards
    ├── wildduck/
    │   ├── index.ts                         # Re-exports REST + WebSocket types
    │   ├── wildduck-types.ts               # ~80 interfaces for WildDuck REST API
    │   ├── wildduck-websocket-types.ts     # ~50 interfaces for WildDuck WebSocket API
    │   ├── wildduck-types.test.ts           # Tests for REST type guards & helpers
    │   └── wildduck-websocket-types.test.ts # Tests for WebSocket type guards & helpers
    ├── kyc/
    │   ├── index.ts                         # Re-exports KYC types
    │   ├── kyc-types.ts                     # ~25 interfaces + 6 enums for KYC/Sumsub
    │   └── kyc-types.test.ts               # Tests for KYC enums & types
    └── mailer/
        ├── index.ts                         # Re-exports mailer types
        ├── mail-types.ts                    # ~25 interfaces + 3 enums for contract responses
        └── mail-types.test.ts              # Tests for mailer type guards & enums
```

## Key Type Categories

### Indexer Types (`types/indexer/`)

API response types for the Mail Box Indexer service. Every response wraps data via `ApiResponse<T>` from `@sudobility/types`.

| Category | Key Types |
|----------|-----------|
| Email Accounts | `IndexerNameServiceAccount`, `IndexerWalletAccount`, `IndexerEmailAccountsResponse` |
| Rewards / Points | `IndexerRewardData`, `IndexerRewardsResponse`, `IndexerPointsData`, `IndexerPointsResponse`, `IndexerLeaderboardResponse` |
| Delegation | `IndexerDelegateData`, `IndexerDelegatedToResponse`, `IndexerDelegatedFromResponse` |
| Name Service | `IndexerNameServiceData`, `IndexerNameResolutionData` |
| Address Validation | `IndexerAddressValidationData`, `IndexerAddressValidationResponse` |
| Entitlement | `IndexerEntitlementInfo`, `IndexerEntitlementResponse` |
| Authentication | `IndexerAuthenticationStatusData`, `IndexerSignInMessageData`, `IndexerNonceData` |
| Referrals | `IndexerReferralCodeData`, `IndexerReferralStatsData` |
| Block Status | `IndexerChainBlockInfo`, `IndexerBlockStatusData` |
| Site Stats | `IndexerSiteStatsData`, `IndexerSiteStatsResponse` |
| Templates | `IndexerTemplateData`, `IndexerTemplateCreateRequest`, `IndexerTemplateUpdateRequest` |
| Webhooks | `IndexerWebhookData`, `IndexerWebhookCreateRequest` |
| Error | `IndexerErrorResponse` |
| Union | `IndexerApiResponse` (union of all response types) |

**Type guards** (22 functions): `isEmailAccountsResponse`, `isRewardsResponse`, `isDelegatedToResponse`, `isIndexerErrorResponse`, `isIndexerSuccessResponse`, etc.

### WildDuck REST Types (`types/wildduck/wildduck-types.ts`)

Comprehensive types matching the WildDuck Mail Server API specification.

| Category | Key Types |
|----------|-----------|
| Config | `WildduckConfig`, `WildduckObjectId` |
| Authentication | `WildduckPreAuthRequest/Response`, `WildduckAuthenticateRequest`, `WildduckAuthResponse`, `WildduckUserAuth` |
| Users | `WildduckUser`, `WildduckUserResponse`, `WildduckCreateUserRequest/Response`, `WildduckUpdateUserRequest`, `WildduckUserListResponse` |
| Mailboxes | `WildduckMailbox`, `WildduckMailboxResponse`, `MailboxSpecialUse` (enum), `EmailFolder`, `EmailFolderUtils` |
| Messages | `WildduckMessageListItem`, `WildduckMessageDetail`, `WildduckMessagesResponse`, `WildduckSearchMessagesRequest/Response` |
| Message Ops | `WildduckUploadMessageRequest/Response`, `WildduckSubmitMessageRequest/Response`, `WildduckUpdateMessageRequest/Response` |
| Addresses | `WildduckAddress`, `WildduckAddressListResponse`, `WildduckCreateAddressRequest/Response`, `WildduckForwardedAddressListItem` |
| Filters | `FilterQuery`, `FilterAction`, `WildduckFilterListItem`, `WildduckCreateFilterRequest/Response` |
| Autoreply | `WildduckAutoreplyRequest`, `WildduckAutoreplyResponse` |
| ASP | `WildduckASPListItem`, `WildduckCreateASPRequest/Response` |
| Storage | `WildduckStorageUploadRequest/Response`, `WildduckStorageListItem` |
| Settings | `WildduckSettingItem`, `WildduckSettingsListResponse`, `UserInfo`, `AutoReplySettings`, `SpamSettings`, `AdvancedSettings`, `SMTPRelay` |
| DKIM | `WildduckDKIMListItem`, `WildduckCreateDKIMRequest/Response` |
| Webhooks | `WildduckWebhookListItem`, `WildduckCreateWebhookRequest/Response` |
| Audit | `WildduckCreateAuditRequest/Response`, `WildduckAuditResponse` |
| Health | `WildduckHealthResponse` |
| Common | `WildduckPaginationParams`, `WildduckSessionParams`, `WildduckLimits`, `WildduckSuccessResponse`, `WildduckDeleteResponse`, `WildduckErrorResponse` |

**Enum**: `MailboxSpecialUse` (Inbox, Sent, Trash, Drafts, Junk, Settings, Developer)

**Helper objects**: `EmailFolderUtils` (isStandardFolder, getStandardFolders, isCustomFolder, displayName)

**Factory functions**: `createPreAuthRequest()`, `createAuthenticateRequest()`

**Type guards**: `isWildduckAuthResponse()`, `isWildduckMessage()`

### WildDuck WebSocket Types (`types/wildduck/wildduck-websocket-types.ts`)

Real-time WebSocket communication types for five channels: `mailboxes`, `settings`, `filters`, `autoreply`, `messages`.

| Category | Key Types |
|----------|-----------|
| Channels | `WildduckWebSocketChannel`, `WildduckWebSocketMessageType` |
| Base | `WildduckWebSocketMessage<T>`, `WildduckWebSocketAuthData`, `WildduckWebSocketResponseData<T>` |
| Client Requests | `WildduckSubscribeRequest` (union), `WildduckUnsubscribeRequest`, `WildduckFetchMessagesRequest`, `WildduckWebSocketClientMessage` (union) |
| Data Responses | `WildduckMailboxesDataResponse`, `WildduckSettingsDataResponse`, `WildduckFiltersDataResponse`, `WildduckAutoreplyDataResponse`, `WildduckMessagesDataResponse` |
| Data Messages | `WildduckWebSocketDataMessage` (union of all channel data messages) |
| Update Events | `WildduckMailboxUpdateEvent`, `WildduckMessageUpdateEvent`, `WildduckSettingsUpdateEvent`, `WildduckFilterUpdateEvent`, `WildduckAutoreplyUpdateEvent` |
| Update Messages | `WildduckWebSocketUpdateMessage` (union) |
| Disconnect | `WildduckDisconnectMessage` |
| All Messages | `WildduckWebSocketServerMessage` (union), `WildduckAnyWebSocketMessage` (union) |

**Type guards**: `isWildduckSubscribeRequest()`, `isWildduckUnsubscribeRequest()`, `isWildduckFetchRequest()`, `isWildduckDataMessage()`, `isWildduckUpdateMessage()`, `isWildduckDisconnectMessage()`, `isWildduckWebSocketErrorResponse()`

**Factory functions**: `createWildduckSubscribeRequest()`, `createWildduckUnsubscribeRequest()`, `createWildduckFetchMessagesRequest()`

### KYC Types (`types/kyc/kyc-types.ts`)

Know Your Customer verification types integrating with Sumsub for three-tier identity verification (Basic, Enhanced, Accredited).

| Category | Key Types |
|----------|-----------|
| Enums | `KYCVerificationLevel`, `KYCApplicationStatus`, `SumsubReviewStatus`, `SumsubReviewAnswer`, `ApplicantType`, `ReviewRejectType` |
| DB Models | `KYCApplication`, `VerificationResult`, `UserConsent` |
| Sumsub API | `SumsubConfig`, `SumsubApplicantData`, `SumsubWebhookPayload`, `SumsubApplicantStatus` |
| API Requests | `InitiateKYCRequest`, `VerifyUserRequest`, `RevokeConsentRequest` |
| API Responses | `InitiateKYCResponse`, `GetKYCStatusResponse`, `VerificationLevelStatus`, `VerifyUserResponse`, `RevokeConsentResponse`, `GetConsentsResponse` |

### Mailer Types (`types/mailer/mail-types.ts`)

Mailbox smart contract response types for multi-chain (EVM + Solana) messaging.

| Category | Key Types |
|----------|-----------|
| Enums | `ConfirmationStatus` (Processed/Confirmed/Finalized), `ClaimType` (Recipient/Owner/Expired), `FeeType` (Send/Delegation/Registration) |
| Core Responses | `BaseTransactionResponse`, `TransactionReceipt` |
| Message Ops | `MessageSendResponse`, `PreparedMessageSendResponse` |
| Revenue & Claims | `ClaimableInfo`, `ClaimRevenueResponse`, `ClaimableAmountResponse` |
| Domain & Delegation | `DomainRegistrationResponse`, `MailboxDelegationResponse`, `DelegationRejectionResponse` |
| Fee Management | `FeeInfo`, `FeeUpdateResponse` |
| Contract State | `PauseInfo`, `PauseResponse`, `EmergencyDistributionResponse` |
| Chain-Specific | `EVMTransactionResponse`, `SolanaTransactionResponse` |
| Client Types | `UnifiedClientResponse<T>`, `BatchOperationResponse` |
| Query Types | `MessageHistoryItem`, `MessageHistoryResponse`, `DelegationStatusResponse` |
| Error | `ContractError` (alias for `UnifiedError`) |

**Type guards**: `isEVMResponse()`, `isSolanaResponse()`, `isMailboxErrorResponse()`, `isConfirmationStatus()`, `isClaimType()`, `isFeeType()`, `isBaseTransactionResponse()`, `isMessageSendResponse()`, `isClaimableInfo()`

## Development Commands

```bash
# Install dependencies
bun install

# Type checking (no emit)
bun run typecheck

# Linting
bun run lint
bun run lint:fix

# Formatting
bun run format
bun run format:check

# Testing
bun run test              # Run all tests (Vitest)
bun run test:watch        # Watch mode
bun run test:coverage     # Coverage report (v8 provider)

# Building
bun run build             # Build ESM + CJS outputs
bun run clean             # Remove dist/

# Full verification pipeline
bun run verify            # typecheck + lint + test + build

# Dev mode
bun run dev               # tsc --watch
```

## Architecture / Patterns

### Module Organization

Each type domain lives in its own subdirectory under `src/types/` with a consistent structure:
- `*-types.ts` -- Interfaces, type aliases, enums, factory functions
- `*-guards.ts` -- Runtime type guard functions (indexer only; other modules co-locate guards)
- `index.ts` -- Named re-exports for the module
- `*.test.ts` -- Vitest tests co-located alongside source

The root `src/types/index.ts` barrel-exports all four modules, and `src/index.ts` re-exports that barrel.

### Naming Conventions

- **Interfaces**: PascalCase, prefixed by domain (`Indexer*`, `Wildduck*`, `KYC*`)
- **Enums**: PascalCase with PascalCase members (e.g., `MailboxSpecialUse.Inbox`, `ConfirmationStatus.Finalized`)
- **Type guards**: camelCase, prefixed with `is` (e.g., `isEVMResponse`, `isIndexerErrorResponse`)
- **Factory/helper functions**: camelCase, prefixed with `create` (e.g., `createPreAuthRequest`, `createWildduckSubscribeRequest`)
- **Request types**: `*Request` suffix
- **Response types**: `*Response` suffix
- **List items**: `*ListItem` suffix for paginated result entries

### Export Conventions

All exports are **named exports only** -- no default exports. Types are exported with `export type` or `export interface`; runtime values use `export function`, `export enum`, or `export const`.

### API Response Pattern

Indexer responses use the generic `ApiResponse<T>` wrapper from `@sudobility/types`:
```typescript
export interface IndexerPointsData extends WalletData { ... }
export type IndexerPointsResponse = ApiResponse<IndexerPointsData>;
```

WildDuck responses use a simpler `{ success: boolean; ... }` pattern.

Mailer responses extend `TransactionReceipt` (which extends `BaseTransactionResponse`) for blockchain operations, and `BaseResponse<T>` / `PaginatedResponse<T>` from `@sudobility/types` for client-facing queries.

### Type Guard Pattern

```typescript
export function isMyResponse(response: unknown): response is MyResponse {
  return !!(
    response &&
    typeof response === 'object' &&
    'requiredField' in response &&
    // ...additional discriminant checks
  );
}
```

### TypeScript Configuration

- **Target**: ES2020
- **Strict mode**: Enabled
- **Module resolution**: `bundler` (base), `ESNext` (ESM build), `CommonJS`/`node` (CJS build)
- **Declarations**: Generated for ESM build only (with source maps and declaration maps)
- Tests (`*.test.ts`, `*.spec.ts`) are excluded from compilation

### Code Style

Configured via Prettier (`.prettierrc`): single quotes, semicolons, trailing commas `es5`, 80-char print width, 2-space indentation. ESLint uses `@typescript-eslint` with `no-explicit-any` as warning, `no-unused-vars` ignoring `_`-prefixed args.

## Common Tasks

### Adding a New Type to an Existing Module

1. Edit the appropriate `*-types.ts` file in `src/types/<module>/`
2. Define interfaces/types/enums as named exports
3. Import shared types from `@sudobility/types` (e.g., `Optional`, `ChainType`, `ApiResponse`, `WalletData`)
4. Add re-exports to the module's `index.ts`
5. If adding type guards, follow the `is*` prefix convention
6. Write tests in the corresponding `*.test.ts` file
7. Verify: `bun run typecheck && bun run lint && bun run test`
8. Build: `bun run build`

### Adding a New Type Module

1. Create a new directory under `src/types/` (e.g., `src/types/newmodule/`)
2. Create `newmodule-types.ts` with interfaces, enums, and type guards
3. Create `index.ts` that re-exports everything from `newmodule-types.ts`
4. Add `export * from './newmodule';` to `src/types/index.ts`
5. Create `newmodule-types.test.ts` with tests for enums, type guards, and helpers
6. Run `bun run verify`

### Testing Guidelines

Tests use Vitest with global test functions (`describe`, `it`, `expect`) and are co-located with source. Coverage excludes `index.ts` barrel files. Focus areas:
1. **Type guards** -- valid and invalid inputs
2. **Factory functions** -- correct default values and overrides
3. **Enums** -- verify string values match expected constants
4. **Type compatibility** -- ensure interfaces can be instantiated correctly

## Peer / Key Dependencies

| Dependency | Role |
|-----------|------|
| `@sudobility/types` (peer, ^1.9.51) | Shared utility types: `Optional`, `ChainType`, `WalletData`, `ApiResponse`, `BaseResponse`, `PaginatedResponse`, `MessageBase`, `UnifiedError` |
| `typescript` (dev, ^5.9.3) | TypeScript compiler |
| `vitest` (dev, ^4.0.16) | Test runner |
| `@vitest/coverage-v8` (dev) | Coverage provider |
| `eslint` + `@typescript-eslint/*` (dev) | Linting |
| `prettier` (dev) | Code formatting |
| `rimraf` (dev) | Clean script |
