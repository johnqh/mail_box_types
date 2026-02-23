import { describe, it, expect } from 'vitest';
import {
  isIndexerErrorResponse,
  isIndexerSuccessResponse,
  isAddressValidationResponse,
  isEmailAccountsResponse,
  isRewardsResponse,
  isDelegatedToResponse,
  isDelegatedFromResponse,
  isNonceResponse,
  isEntitlementResponse,
  isSignInMessageResponse,
  isPointsResponse,
  isLeaderboardResponse,
  isSiteStatsResponse,
  isReferralCodeResponse,
  isReferralStatsResponse,
  isAuthenticationStatusResponse,
  isBlockStatusResponse,
  isNameServiceResponse,
  isNameResolutionResponse,
  isTemplateResponse,
  isTemplateListResponse,
  isTemplateDeleteResponse,
  isWebhookResponse,
  isWebhookListResponse,
  isWebhookDeleteResponse,
} from './indexer-guards';

describe('Indexer Type Guards', () => {
  describe('isIndexerErrorResponse', () => {
    it('returns true for valid error response', () => {
      const errorResponse = { success: false, error: 'Something went wrong' };
      expect(isIndexerErrorResponse(errorResponse)).toBe(true);
    });

    it('returns false for success response', () => {
      const successResponse = { success: true, data: {} };
      expect(isIndexerErrorResponse(successResponse)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isIndexerErrorResponse(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isIndexerErrorResponse(undefined)).toBe(false);
    });

    it('returns false for primitive values', () => {
      expect(isIndexerErrorResponse('string')).toBe(false);
      expect(isIndexerErrorResponse(123)).toBe(false);
      expect(isIndexerErrorResponse(true)).toBe(false);
    });

    it('returns false for empty object', () => {
      expect(isIndexerErrorResponse({})).toBe(false);
    });

    it('returns false for object with error but missing success', () => {
      expect(isIndexerErrorResponse({ error: 'oops' })).toBe(false);
    });

    it('returns false for object with success true and error', () => {
      expect(
        isIndexerErrorResponse({ success: true, error: 'oops' })
      ).toBe(false);
    });
  });

  describe('isIndexerSuccessResponse', () => {
    it('returns true for valid success response', () => {
      const successResponse = { success: true, data: { foo: 'bar' } };
      expect(isIndexerSuccessResponse(successResponse)).toBe(true);
    });

    it('returns false for error response', () => {
      const errorResponse = { success: false, error: 'Error' };
      expect(isIndexerSuccessResponse(errorResponse)).toBe(false);
    });

    it('returns false for missing data field', () => {
      const response = { success: true };
      expect(isIndexerSuccessResponse(response)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isIndexerSuccessResponse(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isIndexerSuccessResponse(undefined)).toBe(false);
    });

    it('returns false for primitive values', () => {
      expect(isIndexerSuccessResponse('string')).toBe(false);
      expect(isIndexerSuccessResponse(123)).toBe(false);
      expect(isIndexerSuccessResponse(false)).toBe(false);
    });

    it('returns false for empty object', () => {
      expect(isIndexerSuccessResponse({})).toBe(false);
    });

    it('returns false for success as string "true"', () => {
      expect(
        isIndexerSuccessResponse({ success: 'true', data: {} })
      ).toBe(false);
    });
  });

  describe('isAddressValidationResponse', () => {
    it('returns true for valid address validation response with name', () => {
      const response = {
        success: true,
        data: {
          name: 'test.eth',
          walletAddress: '0x123',
          chainType: 'evm',
        },
      };
      expect(isAddressValidationResponse(response)).toBe(true);
    });

    it('returns true for valid address validation response with wallet', () => {
      const response = {
        success: true,
        data: {
          wallet: '0x123',
          walletAddress: '0x123',
          chainType: 'evm',
        },
      };
      expect(isAddressValidationResponse(response)).toBe(true);
    });

    it('returns false for invalid response', () => {
      const response = { success: true, data: {} };
      expect(isAddressValidationResponse(response)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isAddressValidationResponse(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isAddressValidationResponse(undefined)).toBe(false);
    });

    it('returns false for null data', () => {
      expect(
        isAddressValidationResponse({ success: true, data: null })
      ).toBe(false);
    });

    it('returns false for non-object data', () => {
      expect(
        isAddressValidationResponse({ success: true, data: 'string' })
      ).toBe(false);
    });

    it('returns false for missing success field', () => {
      expect(
        isAddressValidationResponse({
          data: { name: 'test.eth' },
        })
      ).toBe(false);
    });
  });

  describe('isEmailAccountsResponse', () => {
    it('returns true for valid email accounts response', () => {
      const response = {
        success: true,
        data: {
          accounts: [
            { walletAddress: '0x123', chainType: 'evm', names: [] },
          ],
        },
      };
      expect(isEmailAccountsResponse(response)).toBe(true);
    });

    it('returns false for missing accounts array', () => {
      const response = { success: true, data: {} };
      expect(isEmailAccountsResponse(response)).toBe(false);
    });

    it('returns false for non-array accounts', () => {
      const response = {
        success: true,
        data: { accounts: 'not-an-array' },
      };
      expect(isEmailAccountsResponse(response)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isEmailAccountsResponse(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isEmailAccountsResponse(undefined)).toBe(false);
    });

    it('returns false for null data', () => {
      expect(
        isEmailAccountsResponse({ success: true, data: null })
      ).toBe(false);
    });

    it('returns false for accounts as object instead of array', () => {
      expect(
        isEmailAccountsResponse({
          success: true,
          data: { accounts: {} },
        })
      ).toBe(false);
    });
  });

  describe('isRewardsResponse', () => {
    it('returns true for valid rewards response', () => {
      const response = {
        success: true,
        data: { rewards: [], records: 0, points: 100 },
      };
      expect(isRewardsResponse(response)).toBe(true);
    });

    it('returns false for missing required fields', () => {
      const response = { success: true, data: { rewards: [] } };
      expect(isRewardsResponse(response)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isRewardsResponse(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isRewardsResponse(undefined)).toBe(false);
    });

    it('returns false for partial data missing records', () => {
      expect(
        isRewardsResponse({
          success: true,
          data: { rewards: [], points: 100 },
        })
      ).toBe(false);
    });

    it('returns false for partial data missing points', () => {
      expect(
        isRewardsResponse({
          success: true,
          data: { rewards: [], records: 0 },
        })
      ).toBe(false);
    });
  });

  describe('isDelegatedToResponse', () => {
    it('returns true for valid delegated to response', () => {
      const response = {
        success: true,
        data: { walletAddress: '0x123', chainType: 'evm' },
      };
      expect(isDelegatedToResponse(response)).toBe(true);
    });

    it('returns false for missing chainType', () => {
      const response = {
        success: true,
        data: { walletAddress: '0x123' },
      };
      expect(isDelegatedToResponse(response)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isDelegatedToResponse(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isDelegatedToResponse(undefined)).toBe(false);
    });

    it('returns false for missing walletAddress', () => {
      expect(
        isDelegatedToResponse({
          success: true,
          data: { chainType: 'evm' },
        })
      ).toBe(false);
    });
  });

  describe('isDelegatedFromResponse', () => {
    it('returns true for valid delegated from response', () => {
      const response = {
        success: true,
        data: {
          from: [{ walletAddress: '0x123', chainType: 'evm' }],
        },
      };
      expect(isDelegatedFromResponse(response)).toBe(true);
    });

    it('returns false for non-array from field', () => {
      const response = {
        success: true,
        data: { from: 'not-an-array' },
      };
      expect(isDelegatedFromResponse(response)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isDelegatedFromResponse(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isDelegatedFromResponse(undefined)).toBe(false);
    });

    it('returns false for missing from field', () => {
      expect(
        isDelegatedFromResponse({ success: true, data: {} })
      ).toBe(false);
    });
  });

  describe('isNonceResponse', () => {
    it('returns true for valid nonce response', () => {
      const response = { success: true, data: { nonce: 'abc123' } };
      expect(isNonceResponse(response)).toBe(true);
    });

    it('returns false for missing nonce', () => {
      const response = { success: true, data: {} };
      expect(isNonceResponse(response)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isNonceResponse(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isNonceResponse(undefined)).toBe(false);
    });

    it('returns false for null data', () => {
      expect(isNonceResponse({ success: true, data: null })).toBe(
        false
      );
    });
  });

  describe('isEntitlementResponse', () => {
    it('returns true for valid entitlement response', () => {
      const response = {
        success: true,
        data: {
          entitlement: {
            type: 'nameservice',
            hasEntitlement: true,
            isActive: true,
          },
          verified: true,
          walletAddress: '0x123',
          chainType: 'evm',
          message: 'OK',
        },
      };
      expect(isEntitlementResponse(response)).toBe(true);
    });

    it('returns false for missing entitlement', () => {
      const response = { success: true, data: { verified: true } };
      expect(isEntitlementResponse(response)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isEntitlementResponse(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isEntitlementResponse(undefined)).toBe(false);
    });

    it('returns false for missing verified', () => {
      expect(
        isEntitlementResponse({
          success: true,
          data: {
            entitlement: {
              type: 'nameservice',
              hasEntitlement: true,
            },
          },
        })
      ).toBe(false);
    });
  });

  describe('isSignInMessageResponse', () => {
    it('returns true for valid sign-in message response', () => {
      const response = {
        success: true,
        data: {
          message: 'Sign this message',
          walletAddress: '0x123',
          chainType: 'evm',
        },
      };
      expect(isSignInMessageResponse(response)).toBe(true);
    });

    it('returns false for missing message', () => {
      const response = {
        success: true,
        data: { walletAddress: '0x123' },
      };
      expect(isSignInMessageResponse(response)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isSignInMessageResponse(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isSignInMessageResponse(undefined)).toBe(false);
    });

    it('returns false for missing walletAddress', () => {
      expect(
        isSignInMessageResponse({
          success: true,
          data: { message: 'msg' },
        })
      ).toBe(false);
    });
  });

  describe('isPointsResponse', () => {
    it('returns true for valid points response', () => {
      const response = {
        success: true,
        data: {
          pointsEarned: '100',
          walletAddress: '0x123',
          chainType: 'evm',
          totalActivities: 5,
          leaderboardRank: 10,
        },
      };
      expect(isPointsResponse(response)).toBe(true);
    });

    it('returns false for missing pointsEarned', () => {
      const response = {
        success: true,
        data: { walletAddress: '0x123' },
      };
      expect(isPointsResponse(response)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isPointsResponse(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isPointsResponse(undefined)).toBe(false);
    });

    it('returns false for missing walletAddress', () => {
      expect(
        isPointsResponse({
          success: true,
          data: { pointsEarned: '100' },
        })
      ).toBe(false);
    });
  });

  describe('isLeaderboardResponse', () => {
    it('returns true for valid leaderboard response', () => {
      const response = {
        success: true,
        data: { leaderboard: [] },
      };
      expect(isLeaderboardResponse(response)).toBe(true);
    });

    it('returns false for missing leaderboard', () => {
      const response = { success: true, data: {} };
      expect(isLeaderboardResponse(response)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isLeaderboardResponse(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isLeaderboardResponse(undefined)).toBe(false);
    });

    it('returns false for null data', () => {
      expect(
        isLeaderboardResponse({ success: true, data: null })
      ).toBe(false);
    });
  });

  describe('isSiteStatsResponse', () => {
    it('returns true for valid site stats response', () => {
      const response = {
        success: true,
        data: { totalPoints: '1000000', totalUsers: 5000 },
      };
      expect(isSiteStatsResponse(response)).toBe(true);
    });

    it('returns false for missing totalPoints', () => {
      const response = {
        success: true,
        data: { totalUsers: 5000 },
      };
      expect(isSiteStatsResponse(response)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isSiteStatsResponse(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isSiteStatsResponse(undefined)).toBe(false);
    });
  });

  describe('isReferralCodeResponse', () => {
    it('returns true for valid referral code response', () => {
      const response = {
        success: true,
        data: {
          walletAddress: '0x123',
          referralCode: 'ABC123',
          createdAt: '2024-01-01',
        },
      };
      expect(isReferralCodeResponse(response)).toBe(true);
    });

    it('returns false for missing referralCode', () => {
      const response = {
        success: true,
        data: { walletAddress: '0x123' },
      };
      expect(isReferralCodeResponse(response)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isReferralCodeResponse(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isReferralCodeResponse(undefined)).toBe(false);
    });

    it('returns false for missing createdAt', () => {
      expect(
        isReferralCodeResponse({
          success: true,
          data: { walletAddress: '0x123', referralCode: 'ABC' },
        })
      ).toBe(false);
    });
  });

  describe('isReferralStatsResponse', () => {
    it('returns true for valid referral stats response', () => {
      const response = {
        success: true,
        data: { total: 10, consumptions: [] },
      };
      expect(isReferralStatsResponse(response)).toBe(true);
    });

    it('returns false for non-array consumptions', () => {
      const response = {
        success: true,
        data: { total: 10, consumptions: 'not-array' },
      };
      expect(isReferralStatsResponse(response)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isReferralStatsResponse(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isReferralStatsResponse(undefined)).toBe(false);
    });

    it('returns false for missing total', () => {
      expect(
        isReferralStatsResponse({
          success: true,
          data: { consumptions: [] },
        })
      ).toBe(false);
    });
  });

  describe('isAuthenticationStatusResponse', () => {
    it('returns true for valid authentication status response', () => {
      const response = {
        success: true,
        data: { authenticated: true },
      };
      expect(isAuthenticationStatusResponse(response)).toBe(true);
    });

    it('returns true for authenticated false', () => {
      const response = {
        success: true,
        data: { authenticated: false },
      };
      expect(isAuthenticationStatusResponse(response)).toBe(true);
    });

    it('returns false for non-boolean authenticated', () => {
      const response = {
        success: true,
        data: { authenticated: 'yes' },
      };
      expect(isAuthenticationStatusResponse(response)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isAuthenticationStatusResponse(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isAuthenticationStatusResponse(undefined)).toBe(false);
    });

    it('returns false for authenticated as number', () => {
      expect(
        isAuthenticationStatusResponse({
          success: true,
          data: { authenticated: 1 },
        })
      ).toBe(false);
    });
  });

  describe('isBlockStatusResponse', () => {
    it('returns true for valid block status response', () => {
      const response = {
        success: true,
        data: {
          chains: [],
          totalChains: 5,
          activeChains: 4,
          timestamp: '2024-01-01T00:00:00Z',
        },
      };
      expect(isBlockStatusResponse(response)).toBe(true);
    });

    it('returns false for non-array chains', () => {
      const response = {
        success: true,
        data: {
          chains: 'not-array',
          totalChains: 5,
          activeChains: 4,
          timestamp: '2024-01-01',
        },
      };
      expect(isBlockStatusResponse(response)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isBlockStatusResponse(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isBlockStatusResponse(undefined)).toBe(false);
    });

    it('returns false for missing totalChains', () => {
      expect(
        isBlockStatusResponse({
          success: true,
          data: {
            chains: [],
            activeChains: 4,
            timestamp: '2024-01-01',
          },
        })
      ).toBe(false);
    });

    it('returns false for missing timestamp', () => {
      expect(
        isBlockStatusResponse({
          success: true,
          data: { chains: [], totalChains: 5, activeChains: 4 },
        })
      ).toBe(false);
    });
  });

  describe('isNameServiceResponse', () => {
    it('returns true for valid name service response', () => {
      const response = {
        success: true,
        data: { names: ['name1.eth', 'name2.eth'] },
      };
      expect(isNameServiceResponse(response)).toBe(true);
    });

    it('returns false for non-array names', () => {
      const response = {
        success: true,
        data: { names: 'not-array' },
      };
      expect(isNameServiceResponse(response)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isNameServiceResponse(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isNameServiceResponse(undefined)).toBe(false);
    });

    it('returns false for missing names field', () => {
      expect(
        isNameServiceResponse({ success: true, data: {} })
      ).toBe(false);
    });
  });

  describe('isNameResolutionResponse', () => {
    it('returns true for valid name resolution response', () => {
      const response = {
        success: true,
        data: { walletAddress: '0x123', chainType: 'evm' },
      };
      expect(isNameResolutionResponse(response)).toBe(true);
    });

    it('returns false for missing chainType', () => {
      const response = {
        success: true,
        data: { walletAddress: '0x123' },
      };
      expect(isNameResolutionResponse(response)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isNameResolutionResponse(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isNameResolutionResponse(undefined)).toBe(false);
    });

    it('returns false for missing walletAddress', () => {
      expect(
        isNameResolutionResponse({
          success: true,
          data: { chainType: 'evm' },
        })
      ).toBe(false);
    });
  });

  describe('isTemplateResponse', () => {
    it('returns true for valid template response', () => {
      const response = {
        success: true,
        data: {
          template: {
            id: '1',
            name: 'Test Template',
            subject: 'Subject',
            body: 'Body',
          },
          verified: true,
        },
      };
      expect(isTemplateResponse(response)).toBe(true);
    });

    it('returns false for missing template fields', () => {
      const response = {
        success: true,
        data: { template: { id: '1' }, verified: true },
      };
      expect(isTemplateResponse(response)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isTemplateResponse(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isTemplateResponse(undefined)).toBe(false);
    });

    it('returns false for null template', () => {
      expect(
        isTemplateResponse({
          success: true,
          data: { template: null, verified: true },
        })
      ).toBe(false);
    });

    it('returns false for missing verified', () => {
      expect(
        isTemplateResponse({
          success: true,
          data: {
            template: {
              id: '1',
              name: 'T',
              subject: 'S',
              body: 'B',
            },
          },
        })
      ).toBe(false);
    });
  });

  describe('isTemplateListResponse', () => {
    it('returns true for valid template list response', () => {
      const response = {
        success: true,
        data: {
          templates: [],
          total: 0,
          hasMore: false,
          verified: true,
        },
      };
      expect(isTemplateListResponse(response)).toBe(true);
    });

    it('returns false for non-array templates', () => {
      const response = {
        success: true,
        data: {
          templates: 'not-array',
          total: 0,
          hasMore: false,
          verified: true,
        },
      };
      expect(isTemplateListResponse(response)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isTemplateListResponse(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isTemplateListResponse(undefined)).toBe(false);
    });

    it('returns false for missing total', () => {
      expect(
        isTemplateListResponse({
          success: true,
          data: {
            templates: [],
            hasMore: false,
            verified: true,
          },
        })
      ).toBe(false);
    });
  });

  describe('isTemplateDeleteResponse', () => {
    it('returns true for valid template delete response', () => {
      const response = {
        success: true,
        data: { message: 'Deleted', verified: true },
      };
      expect(isTemplateDeleteResponse(response)).toBe(true);
    });

    it('returns false for missing verified', () => {
      const response = {
        success: true,
        data: { message: 'Deleted' },
      };
      expect(isTemplateDeleteResponse(response)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isTemplateDeleteResponse(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isTemplateDeleteResponse(undefined)).toBe(false);
    });

    it('returns false for missing message', () => {
      expect(
        isTemplateDeleteResponse({
          success: true,
          data: { verified: true },
        })
      ).toBe(false);
    });
  });

  describe('isWebhookResponse', () => {
    it('returns true for valid webhook response', () => {
      const response = {
        success: true,
        data: {
          webhook: {
            id: '1',
            webhookUrl: 'https://example.com/hook',
          },
          verified: true,
        },
      };
      expect(isWebhookResponse(response)).toBe(true);
    });

    it('returns false for missing webhookUrl', () => {
      const response = {
        success: true,
        data: { webhook: { id: '1' }, verified: true },
      };
      expect(isWebhookResponse(response)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isWebhookResponse(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isWebhookResponse(undefined)).toBe(false);
    });

    it('returns false for null webhook', () => {
      expect(
        isWebhookResponse({
          success: true,
          data: { webhook: null, verified: true },
        })
      ).toBe(false);
    });

    it('returns false for missing verified', () => {
      expect(
        isWebhookResponse({
          success: true,
          data: {
            webhook: {
              id: '1',
              webhookUrl: 'https://example.com',
            },
          },
        })
      ).toBe(false);
    });
  });

  describe('isWebhookListResponse', () => {
    it('returns true for valid webhook list response', () => {
      const response = {
        success: true,
        data: {
          webhooks: [],
          total: 0,
          hasMore: false,
          verified: true,
        },
      };
      expect(isWebhookListResponse(response)).toBe(true);
    });

    it('returns false for non-array webhooks', () => {
      const response = {
        success: true,
        data: {
          webhooks: 'not-array',
          total: 0,
          hasMore: false,
          verified: true,
        },
      };
      expect(isWebhookListResponse(response)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isWebhookListResponse(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isWebhookListResponse(undefined)).toBe(false);
    });

    it('returns false for missing hasMore', () => {
      expect(
        isWebhookListResponse({
          success: true,
          data: { webhooks: [], total: 0, verified: true },
        })
      ).toBe(false);
    });
  });

  describe('isWebhookDeleteResponse', () => {
    it('returns true for valid webhook delete response', () => {
      const response = {
        success: true,
        data: { message: 'Deleted', verified: true },
      };
      expect(isWebhookDeleteResponse(response)).toBe(true);
    });

    it('returns false for missing message', () => {
      const response = {
        success: true,
        data: { verified: true },
      };
      expect(isWebhookDeleteResponse(response)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isWebhookDeleteResponse(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isWebhookDeleteResponse(undefined)).toBe(false);
    });

    it('returns false for missing verified', () => {
      expect(
        isWebhookDeleteResponse({
          success: true,
          data: { message: 'Deleted' },
        })
      ).toBe(false);
    });
  });
});
