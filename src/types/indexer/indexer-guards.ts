/**
 * Type Guards for Mail Box Indexer API Responses
 * @description Runtime type checking functions for all indexer API response types
 */

import type {
  IndexerAddressValidationResponse,
  IndexerEmailAccountsResponse,
  IndexerRewardsResponse,
  IndexerDelegatedToResponse,
  IndexerDelegatedFromResponse,
  IndexerNonceResponse,
  IndexerEntitlementResponse,
  IndexerSignInMessageResponse,
  IndexerPointsResponse,
  IndexerLeaderboardResponse,
  IndexerSiteStatsResponse,
  IndexerReferralCodeResponse,
  IndexerReferralStatsResponse,
  IndexerAuthenticationStatusResponse,
  IndexerBlockStatusResponse,
  IndexerNameServiceResponse,
  IndexerNameResolutionResponse,
  IndexerTemplateResponse,
  IndexerTemplateListResponse,
  IndexerTemplateDeleteResponse,
  IndexerWebhookResponse,
  IndexerWebhookListResponse,
  IndexerWebhookDeleteResponse,
} from './indexer-responses';

// Basic type guards for indexer responses
export function isIndexerErrorResponse(
  response: unknown
): response is { success: false; error: string } {
  return !!(
    response &&
    typeof response === 'object' &&
    'error' in response &&
    'success' in response &&
    !(response as { success: boolean }).success
  );
}

export function isIndexerSuccessResponse(
  response: unknown
): response is { success: true; data: unknown } {
  return !!(
    response &&
    typeof response === 'object' &&
    'success' in response &&
    response.success === true &&
    'data' in response
  );
}

// Specific response type guards
export function isAddressValidationResponse(
  response: unknown
): response is IndexerAddressValidationResponse {
  return !!(
    response &&
    typeof response === 'object' &&
    'success' in response &&
    'data' in response &&
    response.data &&
    typeof response.data === 'object' &&
    ('name' in response.data || 'wallet' in response.data)
  );
}

export function isEmailAccountsResponse(
  response: unknown
): response is IndexerEmailAccountsResponse {
  return !!(
    response &&
    typeof response === 'object' &&
    'success' in response &&
    'data' in response &&
    response.data &&
    typeof response.data === 'object' &&
    'accounts' in response.data &&
    Array.isArray(response.data.accounts)
  );
}

export function isRewardsResponse(
  response: unknown
): response is IndexerRewardsResponse {
  return !!(
    response &&
    typeof response === 'object' &&
    'success' in response &&
    'data' in response &&
    response.data &&
    typeof response.data === 'object' &&
    'rewards' in response.data &&
    'records' in response.data &&
    'points' in response.data
  );
}

export function isDelegatedToResponse(
  response: unknown
): response is IndexerDelegatedToResponse {
  return !!(
    response &&
    typeof response === 'object' &&
    'success' in response &&
    'data' in response &&
    response.data &&
    typeof response.data === 'object' &&
    'walletAddress' in response.data &&
    'chainType' in response.data
  );
}

export function isDelegatedFromResponse(
  response: unknown
): response is IndexerDelegatedFromResponse {
  return !!(
    response &&
    typeof response === 'object' &&
    'success' in response &&
    'data' in response &&
    response.data &&
    typeof response.data === 'object' &&
    'from' in response.data &&
    Array.isArray(response.data.from)
  );
}

export function isNonceResponse(response: unknown): response is IndexerNonceResponse {
  return !!(
    response &&
    typeof response === 'object' &&
    'success' in response &&
    'data' in response &&
    response.data &&
    typeof response.data === 'object' &&
    'nonce' in response.data
  );
}

export function isEntitlementResponse(
  response: unknown
): response is IndexerEntitlementResponse {
  return !!(
    response &&
    typeof response === 'object' &&
    'success' in response &&
    'data' in response &&
    response.data &&
    typeof response.data === 'object' &&
    'entitlement' in response.data &&
    'verified' in response.data
  );
}

export function isSignInMessageResponse(
  response: unknown
): response is IndexerSignInMessageResponse {
  return !!(
    response &&
    typeof response === 'object' &&
    'success' in response &&
    'data' in response &&
    response.data &&
    typeof response.data === 'object' &&
    'message' in response.data &&
    'walletAddress' in response.data
  );
}

export function isPointsResponse(
  response: unknown
): response is IndexerPointsResponse {
  return !!(
    response &&
    typeof response === 'object' &&
    'success' in response &&
    'data' in response &&
    response.data &&
    typeof response.data === 'object' &&
    'pointsEarned' in response.data &&
    'walletAddress' in response.data
  );
}

// Points API response type guards
export function isLeaderboardResponse(
  response: unknown
): response is IndexerLeaderboardResponse {
  return !!(
    response &&
    typeof response === 'object' &&
    'success' in response &&
    'data' in response &&
    response.data &&
    typeof response.data === 'object' &&
    'leaderboard' in response.data
  );
}

export function isSiteStatsResponse(
  response: unknown
): response is IndexerSiteStatsResponse {
  return !!(
    response &&
    typeof response === 'object' &&
    'success' in response &&
    'data' in response &&
    response.data &&
    typeof response.data === 'object' &&
    'totalPoints' in response.data
  );
}

// Template response type guards
export function isTemplateResponse(
  response: unknown
): response is IndexerTemplateResponse {
  return !!(
    response &&
    typeof response === 'object' &&
    'success' in response &&
    'data' in response &&
    response.data &&
    typeof response.data === 'object' &&
    'template' in response.data &&
    'verified' in response.data &&
    response.data.template &&
    typeof response.data.template === 'object' &&
    'id' in response.data.template &&
    'name' in response.data.template &&
    'subject' in response.data.template &&
    'body' in response.data.template
  );
}

export function isTemplateListResponse(
  response: unknown
): response is IndexerTemplateListResponse {
  return !!(
    response &&
    typeof response === 'object' &&
    'success' in response &&
    'data' in response &&
    response.data &&
    typeof response.data === 'object' &&
    'templates' in response.data &&
    'total' in response.data &&
    'hasMore' in response.data &&
    'verified' in response.data &&
    Array.isArray(response.data.templates)
  );
}

export function isTemplateDeleteResponse(
  response: unknown
): response is IndexerTemplateDeleteResponse {
  return !!(
    response &&
    typeof response === 'object' &&
    'success' in response &&
    'data' in response &&
    response.data &&
    typeof response.data === 'object' &&
    'message' in response.data &&
    'verified' in response.data
  );
}

// Webhook response type guards
export function isWebhookResponse(
  response: unknown
): response is IndexerWebhookResponse {
  return !!(
    response &&
    typeof response === 'object' &&
    'success' in response &&
    'data' in response &&
    response.data &&
    typeof response.data === 'object' &&
    'webhook' in response.data &&
    'verified' in response.data &&
    response.data.webhook &&
    typeof response.data.webhook === 'object' &&
    'id' in response.data.webhook &&
    'webhookUrl' in response.data.webhook
  );
}

export function isWebhookListResponse(
  response: unknown
): response is IndexerWebhookListResponse {
  return !!(
    response &&
    typeof response === 'object' &&
    'success' in response &&
    'data' in response &&
    response.data &&
    typeof response.data === 'object' &&
    'webhooks' in response.data &&
    'total' in response.data &&
    'hasMore' in response.data &&
    'verified' in response.data &&
    Array.isArray(response.data.webhooks)
  );
}

export function isWebhookDeleteResponse(
  response: unknown
): response is IndexerWebhookDeleteResponse {
  return !!(
    response &&
    typeof response === 'object' &&
    'success' in response &&
    'data' in response &&
    response.data &&
    typeof response.data === 'object' &&
    'message' in response.data &&
    'verified' in response.data
  );
}

// Referral response type guards
export function isReferralCodeResponse(
  response: unknown
): response is IndexerReferralCodeResponse {
  return !!(
    response &&
    typeof response === 'object' &&
    'success' in response &&
    'data' in response &&
    response.data &&
    typeof response.data === 'object' &&
    'walletAddress' in response.data &&
    'referralCode' in response.data &&
    'createdAt' in response.data
  );
}

export function isReferralStatsResponse(
  response: unknown
): response is IndexerReferralStatsResponse {
  return !!(
    response &&
    typeof response === 'object' &&
    'success' in response &&
    'data' in response &&
    response.data &&
    typeof response.data === 'object' &&
    'total' in response.data &&
    'consumptions' in response.data &&
    Array.isArray(response.data.consumptions)
  );
}

// Authentication status type guard
export function isAuthenticationStatusResponse(
  response: unknown
): response is IndexerAuthenticationStatusResponse {
  return !!(
    response &&
    typeof response === 'object' &&
    'success' in response &&
    'data' in response &&
    response.data &&
    typeof response.data === 'object' &&
    'authenticated' in response.data &&
    typeof response.data.authenticated === 'boolean'
  );
}

// Block status type guard
export function isBlockStatusResponse(
  response: unknown
): response is IndexerBlockStatusResponse {
  return !!(
    response &&
    typeof response === 'object' &&
    'success' in response &&
    'data' in response &&
    response.data &&
    typeof response.data === 'object' &&
    'chains' in response.data &&
    'totalChains' in response.data &&
    'activeChains' in response.data &&
    'timestamp' in response.data &&
    Array.isArray(response.data.chains)
  );
}

// Name service response type guards
export function isNameServiceResponse(
  response: unknown
): response is IndexerNameServiceResponse {
  return !!(
    response &&
    typeof response === 'object' &&
    'success' in response &&
    'data' in response &&
    response.data &&
    typeof response.data === 'object' &&
    'names' in response.data &&
    Array.isArray(response.data.names)
  );
}

export function isNameResolutionResponse(
  response: unknown
): response is IndexerNameResolutionResponse {
  return !!(
    response &&
    typeof response === 'object' &&
    'success' in response &&
    'data' in response &&
    response.data &&
    typeof response.data === 'object' &&
    'walletAddress' in response.data &&
    'chainType' in response.data
  );
}
