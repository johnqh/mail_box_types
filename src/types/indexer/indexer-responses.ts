/**
 * API Response Type Definitions for Mail Box Indexer
 * @description Comprehensive type definitions for all indexer API endpoints
 */

import { Optional, WalletData, ApiResponse } from '../common';

// Name service account
export interface IndexerNameServiceAccount {
  name: string;
  entitled: boolean;
}

// Email address aggregation types
export interface IndexerWalletAccount extends WalletData {
  names: IndexerNameServiceAccount[];
}

export interface IndexerEmailAccountsResult {
  accounts: IndexerWalletAccount[];
}

export type IndexerEmailAccountsResponse =
  ApiResponse<IndexerEmailAccountsResult>;

// Rewards history record
export interface IndexerRewardData {
  walletAddress: string;
  action: string;
  points: number;
  earningTime: string;
}

export interface IndexerRewardHistoryData {
  rewards: IndexerRewardData[];
  records: number;
  points: number;
}

export type IndexerRewardsResponse = ApiResponse<IndexerRewardHistoryData>;

// Address validation types
export interface IndexerAddressValidationData extends WalletData {
  name?: Optional<string>;
}

export type IndexerAddressValidationResponse =
  ApiResponse<IndexerAddressValidationData>;

// Delegation types
export interface IndexerDelegateData extends WalletData {
  chainId?: Optional<number>;
  txHash?: Optional<string>;
}

export type IndexerDelegatedToResponse = ApiResponse<IndexerDelegateData>;

export interface IndexerDelegatedFromData {
  from: IndexerDelegateData[];
}

export type IndexerDelegatedFromResponse =
  ApiResponse<IndexerDelegatedFromData>;

// Nonce types
export interface IndexerNonceData {
  nonce: string;
}

export type IndexerNonceResponse = ApiResponse<IndexerNonceData>;

// Entitlement types
export interface IndexerEntitlementInfo {
  type: 'nameservice';
  hasEntitlement: boolean;
  isActive: boolean;
  productIdentifier?: Optional<string>;
  expiresDate?: Optional<string>;
  store?: Optional<string>;
}

export interface IndexerEntitlementData extends WalletData {
  entitlement: IndexerEntitlementInfo;
  message: string;
  verified: boolean;
}

export type IndexerEntitlementResponse = ApiResponse<IndexerEntitlementData>;

// Message generation types
export interface IndexerSignInMessageData extends WalletData {
  message: string;
  chainId?: Optional<number>;
}

export type IndexerSignInMessageResponse =
  ApiResponse<IndexerSignInMessageData>;

// Points types - consolidated user points data
export interface IndexerPointsData extends WalletData {
  pointsEarned: string;
  totalActivities: number;
  leaderboardRank: number | null;
  lastActivityDate?: Optional<string>;
  createdAt?: Optional<string>;
  updatedAt?: Optional<string>;
}

export type IndexerPointsResponse = ApiResponse<IndexerPointsData>;

// Points API response types
export interface IndexerLeaderboardData {
  leaderboard: IndexerPointsData[];
}

export type IndexerLeaderboardResponse = ApiResponse<IndexerLeaderboardData>;

export interface IndexerSiteStatsData {
  totalPoints: string;
  totalUsers: number;
  lastUpdated?: Optional<string>;
}

export type IndexerSiteStatsResponse = ApiResponse<IndexerSiteStatsData>;

// Referral code types
export interface IndexerReferralCodeData {
  /** Wallet address (EVM 0x format or Solana Base58) */
  walletAddress: string;
  referralCode: string;
  createdAt: string;
}

export type IndexerReferralCodeResponse = ApiResponse<IndexerReferralCodeData>;

export interface IndexerReferralConsumptionData {
  /** Wallet address (EVM 0x format or Solana Base58) */
  walletAddress: string;
  /** Can be "" if no referral code is used */
  referralCode: string;
  createdAt: string;
}

export interface IndexerReferralStatsData {
  total: number;
  consumptions: IndexerReferralConsumptionData[];
}

export type IndexerReferralStatsResponse =
  ApiResponse<IndexerReferralStatsData>;

// Authentication status types
export interface IndexerAuthenticationStatusData {
  authenticated: boolean;
  datetime?: Optional<string>;
}

export type IndexerAuthenticationStatusResponse =
  ApiResponse<IndexerAuthenticationStatusData>;

// Block status types
export interface IndexerChainBlockInfo {
  chain: string;
  chainId: number;
  currentBlock: string | null;
  indexedBlock: string | null;
  percentage: string | null;
  blocksBehind: string | null;
  rpcUrl: string | null;
  status: 'synced' | 'syncing' | 'error';
  error?: Optional<string>;
}

export interface IndexerBlockStatusData {
  chains: IndexerChainBlockInfo[];
  totalChains: number;
  syncedChains: number;
  overallHealth: 'healthy' | 'syncing' | 'degraded';
  summary: {
    syncedCount: number;
    syncingCount: number;
    errorCount: number;
  };
  timestamp: string;
}

export type IndexerBlockStatusResponse = ApiResponse<IndexerBlockStatusData>;

// Name service resolution types
export interface IndexerNameServiceData {
  names: string[];
}

export type IndexerNameServiceResponse = ApiResponse<IndexerNameServiceData>;

export interface IndexerNameResolutionData extends WalletData {}

export type IndexerNameResolutionResponse =
  ApiResponse<IndexerNameResolutionData>;

// Email template types
export interface IndexerTemplateData {
  id: string;
  userId: string;
  name: string;
  subject: string;
  body: string;
  isActive: boolean;
  usageCount: number;
  lastUsedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IndexerTemplateResult {
  template: IndexerTemplateData;
  verified: boolean;
}

export type IndexerTemplateResponse = ApiResponse<IndexerTemplateResult>;

export interface IndexerTemplateListResult {
  templates: IndexerTemplateData[];
  total: number;
  hasMore: boolean;
  verified: boolean;
}

export type IndexerTemplateListResponse =
  ApiResponse<IndexerTemplateListResult>;

export interface IndexerTemplateDeleteResult {
  message: string;
  verified: boolean;
}

export type IndexerTemplateDeleteResponse =
  ApiResponse<IndexerTemplateDeleteResult>;

// Template request types
export interface IndexerTemplateCreateRequest {
  name: string;
  subject: string;
  body: string;
}

export interface IndexerTemplateUpdateRequest {
  name?: string;
  subject?: string;
  body?: string;
}

// Webhook types
export interface IndexerWebhookData {
  id: string;
  userId: string;
  webhookUrl: string;
  isActive: boolean;
  lastTriggeredAt: string | null;
  triggerCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IndexerWebhookResult {
  webhook: IndexerWebhookData;
  verified: boolean;
}

export type IndexerWebhookResponse = ApiResponse<IndexerWebhookResult>;

export interface IndexerWebhookListResult {
  webhooks: IndexerWebhookData[];
  total: number;
  hasMore: boolean;
  verified: boolean;
}

export type IndexerWebhookListResponse = ApiResponse<IndexerWebhookListResult>;

export interface IndexerWebhookDeleteResult {
  message: string;
  verified: boolean;
}

export type IndexerWebhookDeleteResponse =
  ApiResponse<IndexerWebhookDeleteResult>;

// Webhook request types
export interface IndexerWebhookCreateRequest {
  webhookUrl: string;
}

// Error response type for API endpoints
export interface IndexerErrorResponse extends ApiResponse<never> {
  success: false;
  error: string;
}

// Extended union type to include all response types
export type IndexerApiResponse =
  | IndexerAddressValidationResponse
  | IndexerEmailAccountsResponse
  | IndexerDelegatedToResponse
  | IndexerDelegatedFromResponse
  | IndexerNonceResponse
  | IndexerEntitlementResponse
  | IndexerPointsResponse
  | IndexerSignInMessageResponse
  | IndexerLeaderboardResponse
  | IndexerSiteStatsResponse
  | IndexerReferralCodeResponse
  | IndexerReferralStatsResponse
  | IndexerAuthenticationStatusResponse
  | IndexerBlockStatusResponse
  | IndexerNameServiceResponse
  | IndexerNameResolutionResponse
  | IndexerTemplateResponse
  | IndexerTemplateListResponse
  | IndexerTemplateDeleteResponse
  | IndexerWebhookResponse
  | IndexerWebhookListResponse
  | IndexerWebhookDeleteResponse
  | IndexerErrorResponse;
