# Improvement Plans for @sudobility/mail_box_types

## Priority 1 - High Impact

### 1. Increase Type Guard Test Coverage
- The indexer module has a dedicated `indexer-guards.ts` with 22 type guards and a separate test file, but the other three modules (wildduck, kyc, mailer) co-locate their type guards within their main type files. Coverage of edge cases and invalid inputs for these co-located guards should be audited and expanded, particularly for `isWildduckAuthResponse`, `isEVMResponse`, `isSolanaResponse`, and `isMailboxErrorResponse`.
- Add negative test cases that exercise partial objects, wrong field types, and null/undefined inputs for every type guard across all modules.

### 2. Add JSDoc Documentation to KYC and Mailer Modules
- The CLAUDE.md lists approximately 25 KYC interfaces and 6 enums, plus 25 mailer interfaces and 3 enums, but these modules appear to have minimal inline JSDoc. Every exported interface, enum, enum member, and type guard should have JSDoc comments explaining the purpose, expected values, and usage context.
- The indexer and wildduck modules have better documentation patterns that should be replicated across kyc and mailer modules.

## Priority 2 - Medium Impact

### 3. Validate Enum String Values Against Backend Contracts
- Enums like `ConfirmationStatus`, `ClaimType`, `FeeType`, `KYCVerificationLevel`, `KYCApplicationStatus`, and `MailboxSpecialUse` have string values that must match both the backend API and smart contract event fields. There are tests verifying these values exist, but there is no mechanism to catch drift if the backend changes. Consider adding a test helper or validation script that compares enum values against known API response samples.

### 4. Add Discriminated Union Types for API Responses
- The `IndexerApiResponse` is described as a union of all response types, but discriminated unions with explicit discriminant fields (e.g., a `type` or `kind` field) would enable exhaustive switch matching and better compiler-assisted error detection. This would be particularly valuable for the indexer module where responses vary significantly.

## Priority 3 - Nice to Have

### 5. Consolidate Type Guard Location Pattern
- The indexer module uses a separate `indexer-guards.ts` file, while wildduck, kyc, and mailer co-locate guards in their `*-types.ts` files. Standardizing on one approach (preferably separate guard files like the indexer) would improve consistency and make guards easier to find and maintain.

### 6. Add Runtime Validation for Factory Functions
- Factory functions like `createPreAuthRequest`, `createAuthenticateRequest`, and `createWildduckSubscribeRequest` create objects with default values, but they do not validate their inputs at runtime. Adding basic input validation (e.g., non-empty strings, valid enum values) would catch usage errors earlier.

### 7. Export CHAIN_INFO_MAP from Root Index
- The `CHAIN_INFO_MAP` from `chain-info-map.ts` is used internally but not re-exported. While this is by design for the configs package, some consumers of `mail_box_types` may benefit from having access to chain metadata directly through the types package for type-narrowing purposes.
