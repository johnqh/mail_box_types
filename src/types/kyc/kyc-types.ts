/**
 * KYC (Know Your Customer) Verification Types
 *
 * Types for KYC verification services which integrate
 * with Sumsub for identity verification at three levels:
 * - Basic: Age and identity verification (18+)
 * - Enhanced: Basic + country verification + AML screening
 * - Accredited: Enhanced + financial verification for accredited investors
 */

import type { ChainType } from '@sudobility/types';

// ============================================
// Verification Levels
// ============================================

/**
 * Available KYC verification levels.
 *
 * Each level builds on the previous one, requiring progressively more
 * documentation and verification steps. The level determines which
 * Sumsub workflow is initiated.
 */
export enum KYCVerificationLevel {
  /** Age and identity verification (18+). Requires government-issued ID. */
  Basic = 'basic',
  /** Basic + country verification + AML screening. Adds proof of address. */
  Enhanced = 'enhanced',
  /** Enhanced + financial verification for accredited investors. Adds income/asset proof. */
  Accredited = 'accredited',
}

/**
 * Status of a KYC application throughout its lifecycle.
 *
 * Applications progress linearly from Pending through to Completed or
 * Rejected. The status is updated by both user actions (submitting
 * documents) and Sumsub webhooks (review results).
 */
export enum KYCApplicationStatus {
  /** User created application but hasn't started the Sumsub flow. */
  Pending = 'PENDING',
  /** Sumsub applicant has been created and access token generated. */
  Initiated = 'INITIATED',
  /** User is actively uploading documents in the Sumsub SDK. */
  InProgress = 'IN_PROGRESS',
  /** User has submitted all documents and is awaiting review. */
  Submitted = 'SUBMITTED',
  /** Verification completed with a result (GREEN, RED, or YELLOW). */
  Completed = 'COMPLETED',
  /** Final rejection after maximum retry attempts exhausted. */
  Rejected = 'REJECTED',
}

/**
 * Sumsub review status values.
 *
 * These map directly to Sumsub's internal review status field
 * returned in webhook payloads and status queries.
 */
export enum SumsubReviewStatus {
  /** Review has been initialized but not yet started. */
  Init = 'init',
  /** Review is pending, awaiting moderator action. */
  Pending = 'pending',
  /** Automated prechecks have been completed. */
  Prechecked = 'prechecked',
  /** Review is fully completed with a final answer. */
  Completed = 'completed',
}

/**
 * Sumsub review answer (verification result).
 *
 * The final outcome of a Sumsub review. GREEN means approved, RED means
 * rejected, and YELLOW means manual review is needed.
 */
export enum SumsubReviewAnswer {
  /** Verification approved. All checks passed. */
  Green = 'GREEN',
  /** Verification rejected. One or more checks failed. */
  Red = 'RED',
  /** Needs manual review. Automated checks were inconclusive. */
  Yellow = 'YELLOW',
}

/**
 * Applicant type for Sumsub verification.
 *
 * Determines which Sumsub workflow and document requirements apply.
 */
export enum ApplicantType {
  /** Individual person verification. Requires personal ID documents. */
  Individual = 'individual',
  /** Company/organization verification. Requires corporate documents. */
  Company = 'company',
}

/**
 * Review rejection type from Sumsub.
 *
 * When a review results in RED, this type indicates whether the user
 * can retry or if the rejection is permanent.
 */
export enum ReviewRejectType {
  /** Final rejection, no more retries allowed. Application is permanently denied. */
  Final = 'FINAL',
  /** User can retry the verification with corrected documents. */
  Retry = 'RETRY',
  /** External review needed. Escalated to compliance team. */
  External = 'EXTERNAL',
}

// ============================================
// Database Models
// ============================================

/**
 * KYC Application record.
 *
 * Main database model tracking a user's KYC verification application.
 * Each wallet address can have one application per verification level.
 * The application links to the Sumsub applicant via `sumsubApplicantId`.
 */
export interface KYCApplication {
  /** Unique application identifier (UUID) */
  id: string;
  /** User's blockchain wallet address (EVM 0x format or Solana Base58) */
  walletAddress: string;
  /** User's email address for notifications */
  email: string;
  /** Blockchain type the wallet belongs to */
  chainType: ChainType;
  /** Sumsub applicant ID, null if not yet created */
  sumsubApplicantId: string | null;
  /** Arbitrary metadata attached to the application */
  metadata: Record<string, unknown>;
  /** Target verification level for this application */
  verificationLevel: KYCVerificationLevel;
  /** Current status in the application lifecycle */
  status: KYCApplicationStatus;
  /** Number of retry attempts made after rejection */
  retryCount: number;
  /** Timestamp when the application was created */
  createdAt: Date;
  /** Timestamp when the application was last updated */
  updatedAt: Date;
}

/**
 * Verification Result record.
 *
 * Stores the outcome of a Sumsub review for a specific verification level.
 * One KYC application can have multiple verification results (one per level).
 * Results include identity, country, and accreditation details.
 */
export interface VerificationResult {
  /** Unique result identifier (UUID) */
  id: string;
  /** Foreign key to the parent KYC application */
  kycApplicationId: string;
  /** Verification level this result applies to */
  verificationLevel: KYCVerificationLevel;
  /** Sumsub review answer (GREEN/RED/YELLOW) */
  status: SumsubReviewAnswer;
  /** Sumsub review processing status */
  reviewStatus: SumsubReviewStatus;
  /** ISO 3166-1 alpha-2 country code, null if not determined */
  countryCode: string | null;
  /** Whether the user's age has been verified as 18+ */
  ageVerified: boolean;
  /** Whether the user qualifies as an accredited investor */
  accreditedInvestor: boolean;
  /** Date when verification was completed, null if pending */
  verificationDate: Date | null;
  /** Expiry date for the verification subscription (12 months from verification) */
  subscriptionExpiresAt: Date | null;
  /** Sumsub review ID for audit trail */
  sumsubReviewId: string | null;
  /** Sumsub inspection ID for audit trail */
  sumsubInspectionId: string | null;
  /** Additional metadata from the verification process */
  metadata: Record<string, unknown>;
  /** Timestamp when the result record was created */
  createdAt: Date;
  /** Timestamp when the result record was last updated */
  updatedAt: Date;
}

/**
 * User Consent record.
 *
 * Tracks user consent granted to third-party DApps for accessing
 * KYC verification data. Consent is cryptographically signed by the
 * user's wallet and can be revoked at any time.
 */
export interface UserConsent {
  /** Unique consent identifier (UUID) */
  id: string;
  /** Wallet address of the user granting consent */
  walletAddress: string;
  /** Identifier for the DApp receiving consent (domain or app name) */
  dappIdentifier: string;
  /** The consent message that was presented to the user */
  signedMessage: string;
  /** Wallet signature of the consent message */
  signature: string;
  /** Scope of data the DApp is allowed to access */
  consentScope: {
    /** Verification levels the DApp can query */
    levels: KYCVerificationLevel[];
    /** Specific data fields the DApp can access */
    fields: string[];
  };
  /** Timestamp when consent was granted */
  grantedAt: Date;
  /** Timestamp when consent expires, null for indefinite */
  expiresAt: Date | null;
  /** Whether the consent has been revoked */
  revoked: boolean;
  /** Timestamp when consent was revoked, null if still active */
  revokedAt: Date | null;
}

// ============================================
// Sumsub API Types
// ============================================

/**
 * Sumsub SDK and API configuration.
 *
 * Required credentials and endpoints for communicating with the
 * Sumsub identity verification platform.
 */
export interface SumsubConfig {
  /** Sumsub application token for API authentication */
  appToken: string;
  /** Sumsub secret key for request signing */
  secretKey: string;
  /** Sumsub API base URL (e.g., "https://api.sumsub.com") */
  baseUrl: string;
  /** Secret key for verifying Sumsub webhook signatures */
  webhookSecret: string;
}

/**
 * Data required to create a Sumsub applicant.
 *
 * Sent to Sumsub when initiating a new verification flow.
 * The externalUserId links the Sumsub applicant back to the wallet.
 */
export interface SumsubApplicantData {
  /** External user ID, typically the wallet address */
  externalUserId: string;
  /** User's email address for Sumsub notifications */
  email: string;
  /** Whether this is an individual or company applicant */
  type: ApplicantType;
  /** Pre-populated applicant information */
  fixedInfo?: {
    /** ISO 3166-1 alpha-2 country code */
    country?: string;
  };
}

/**
 * Sumsub webhook payload structure.
 *
 * Received from Sumsub when a review status changes. This payload
 * is signed with the webhook secret and must be verified before processing.
 */
export interface SumsubWebhookPayload {
  /** Sumsub applicant identifier */
  applicantId: string;
  /** Sumsub inspection identifier for this review */
  inspectionId: string;
  /** Type of applicant (individual or company) */
  applicantType: ApplicantType;
  /** Unique correlation ID for tracking this webhook event */
  correlationId: string;
  /** External user ID (wallet address) */
  externalUserId: string;
  /** Name of the Sumsub verification level/workflow */
  levelName: string;
  /** Whether this event originated from sandbox/test mode */
  sandboxMode: boolean;
  /** Current review status */
  reviewStatus: SumsubReviewStatus;
  /** Detailed review result with moderation details */
  reviewResult: {
    /** Internal moderator comment (not shown to user) */
    moderationComment: string;
    /** Comment visible to the client/user */
    clientComment: string;
    /** Final review answer (GREEN/RED/YELLOW) */
    reviewAnswer: SumsubReviewAnswer;
    /** Labels describing rejection reasons */
    rejectLabels: string[];
    /** Type of rejection (FINAL/RETRY/EXTERNAL) */
    reviewRejectType: ReviewRejectType;
  };
  /** Timestamp when the event was created (milliseconds, as string) */
  createdAtMs: string;
  /** Sumsub client identifier */
  clientId: string;
}

/**
 * Sumsub applicant status response.
 *
 * Returned when querying an applicant's current verification status
 * from the Sumsub API. Includes review results and extracted document info.
 */
export interface SumsubApplicantStatus {
  /** Sumsub applicant identifier */
  applicantId: string;
  /** Current review processing status */
  reviewStatus: SumsubReviewStatus;
  /** Review result, present only after review is completed */
  reviewResult?: {
    /** Final review answer (GREEN/RED/YELLOW) */
    reviewAnswer: SumsubReviewAnswer;
    /** Labels describing rejection reasons */
    rejectLabels: string[];
  };
  /** Extracted applicant information from submitted documents */
  info?: {
    /** Identity documents with extracted fields */
    idDocs?: Array<{
      /** ISO 3166-1 alpha-2 country code from the document */
      country?: string;
      /** Extracted fields from the identity document */
      fields?: {
        /** Date of birth (YYYY-MM-DD format) */
        dob?: string;
        /** First/given name */
        firstName?: string;
        /** Last/family name */
        lastName?: string;
      };
    }>;
    /** Address documents with country information */
    addresses?: Array<{
      /** ISO 3166-1 alpha-2 country code from address proof */
      country?: string;
    }>;
    /** Questionnaire responses for accredited investor verification */
    questionnaires?: Array<{
      /** Questionnaire sections with financial data */
      sections?: {
        /** Income information */
        income?: { /** Annual income amount */ annualIncome?: string };
        /** Wealth information */
        wealth?: { /** Net worth amount */ netWorth?: string };
        /** Professional credentials */
        professional?: { /** Professional designation */ designation?: string };
      };
    }>;
  };
}

// ============================================
// API Request/Response Types
// ============================================

/**
 * Request to initiate KYC verification.
 *
 * Sent by the client to start a new KYC verification flow. Creates a
 * Sumsub applicant and returns an access token for the Sumsub Web SDK.
 */
export interface InitiateKYCRequest {
  /** User's blockchain wallet address */
  walletAddress: string;
  /** Blockchain type the wallet belongs to */
  chainType: ChainType;
  /** Target verification level to achieve */
  verificationLevel: KYCVerificationLevel;
}

/**
 * Response from initiating KYC verification.
 *
 * Contains the Sumsub access token needed to embed the Sumsub Web SDK
 * in the client application for document upload and verification.
 */
export interface InitiateKYCResponse {
  /** Unique application identifier for tracking */
  applicationId: string;
  /** Sumsub access token for embedding the Web SDK */
  sumsubAccessToken: string;
  /** Initial application status (typically INITIATED) */
  status: KYCApplicationStatus;
  /** Verification level being processed */
  verificationLevel: KYCVerificationLevel;
}

/**
 * Response from getting KYC status.
 *
 * Provides a comprehensive view of a user's KYC verification progress
 * across all levels, including retry information.
 */
export interface GetKYCStatusResponse {
  /** Unique application identifier */
  applicationId: string;
  /** User's wallet address */
  walletAddress: string;
  /** Current target verification level */
  verificationLevel: KYCVerificationLevel;
  /** Current application status */
  status: KYCApplicationStatus;
  /** Verification results for each level (absent if not attempted) */
  results: {
    /** Basic level verification status */
    basic?: VerificationLevelStatus;
    /** Enhanced level verification status */
    enhanced?: VerificationLevelStatus;
    /** Accredited level verification status */
    accredited?: VerificationLevelStatus;
  };
  /** Whether the user can retry after a rejection */
  canRetry: boolean;
  /** Number of retry attempts remaining */
  retriesRemaining: number;
}

/**
 * Status for a specific verification level.
 *
 * Represents the outcome of verification for a single level (basic,
 * enhanced, or accredited). Included in GetKYCStatusResponse.
 */
export interface VerificationLevelStatus {
  /** Whether this level has been successfully verified */
  verified: boolean;
  /** Sumsub review answer for this level */
  status: SumsubReviewAnswer;
  /** Whether age has been verified as 18+ (basic level) */
  ageVerified?: boolean;
  /** Whether the user's country is in the allowed list (enhanced level) */
  countryAllowed?: boolean;
  /** ISO 3166-1 alpha-2 country code determined during verification */
  countryCode?: string;
  /** Whether the user qualifies as an accredited investor (accredited level) */
  accreditedInvestor?: boolean;
  /** Timestamp when this level was verified */
  verifiedAt?: Date;
  /** Expiry date for the verification (12 months from verification) */
  subscriptionExpiresAt?: Date;
}

// ============================================
// Third-Party DApp API Types
// ============================================

/**
 * Request from third-party DApp to verify a user.
 *
 * DApps send this request with a user-signed consent message to check
 * whether a wallet has passed a specific KYC verification level.
 */
export interface VerifyUserRequest {
  /** Wallet address of the user to verify */
  walletAddress: string;
  /** User's wallet signature approving DApp access to KYC data */
  signedConsent: string;
  /** Original consent message that was signed */
  consentMessage: string;
  /** DApp identifier (domain name or app name) */
  dappIdentifier: string;
  /** Minimum KYC verification level required by the DApp */
  requestedLevel: KYCVerificationLevel;
}

/**
 * Response to third-party DApp verification request.
 *
 * Returns the verification status and details for the requested level.
 * Only returns data that the user has consented to share.
 */
export interface VerifyUserResponse {
  /** Whether the user meets the requested verification level */
  verified: boolean;
  /** Highest verified KYC level for this user */
  level: KYCVerificationLevel;
  /** Whether the user's age has been verified as 18+ */
  ageVerified: boolean;
  /** Whether the user's country is in the allowed list */
  countryAllowed: boolean;
  /** Whether the user qualifies as an accredited investor */
  accreditedInvestor: boolean;
  /** Timestamp when verification was completed */
  verifiedAt: Date;
  /** Expiry date for the verification subscription */
  subscriptionExpiresAt: Date;
}

/**
 * Request to revoke consent for a DApp.
 *
 * Users can revoke previously granted consent at any time.
 * Requires a wallet signature to prove ownership.
 */
export interface RevokeConsentRequest {
  /** Wallet address of the user revoking consent */
  walletAddress: string;
  /** DApp identifier whose consent is being revoked */
  dappIdentifier: string;
  /** Wallet signature proving ownership of the wallet address */
  signature: string;
}

/**
 * Response to consent revocation.
 *
 * Confirms that the consent has been successfully revoked and
 * the DApp can no longer access the user's KYC data.
 */
export interface RevokeConsentResponse {
  /** Whether the revocation was successful */
  success: boolean;
  /** Timestamp when the consent was revoked */
  revokedAt: Date;
}

/**
 * Get user's granted consents.
 *
 * Returns all active consents that a user has granted to third-party
 * DApps, including the scope of data each DApp can access.
 */
export interface GetConsentsResponse {
  /** List of active consent grants */
  consents: Array<{
    /** DApp identifier that received consent */
    dappIdentifier: string;
    /** Timestamp when consent was granted */
    grantedAt: Date;
    /** Timestamp when consent expires, null for indefinite */
    expiresAt: Date | null;
    /** Scope of data the DApp can access */
    scope: {
      /** Verification levels the DApp can query */
      levels: KYCVerificationLevel[];
      /** Specific data fields the DApp can access */
      fields: string[];
    };
  }>;
}
