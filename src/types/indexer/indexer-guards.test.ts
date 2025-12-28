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
  });

  describe('isAddressValidationResponse', () => {
    it('returns true for valid address validation response with name', () => {
      const response = {
        success: true,
        data: { name: 'test.eth', walletAddress: '0x123', chainType: 'evm' },
      };
      expect(isAddressValidationResponse(response)).toBe(true);
    });

    it('returns true for valid address validation response with wallet', () => {
      const response = {
        success: true,
        data: { wallet: '0x123', walletAddress: '0x123', chainType: 'evm' },
      };
      expect(isAddressValidationResponse(response)).toBe(true);
    });

    it('returns false for invalid response', () => {
      const response = { success: true, data: {} };
      expect(isAddressValidationResponse(response)).toBe(false);
    });
  });

  describe('isEmailAccountsResponse', () => {
    it('returns true for valid email accounts response', () => {
      const response = {
        success: true,
        data: { accounts: [{ walletAddress: '0x123', chainType: 'evm', names: [] }] },
      };
      expect(isEmailAccountsResponse(response)).toBe(true);
    });

    it('returns false for missing accounts array', () => {
      const response = { success: true, data: {} };
      expect(isEmailAccountsResponse(response)).toBe(false);
    });

    it('returns false for non-array accounts', () => {
      const response = { success: true, data: { accounts: 'not-an-array' } };
      expect(isEmailAccountsResponse(response)).toBe(false);
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
      const response = { success: true, data: { walletAddress: '0x123' } };
      expect(isDelegatedToResponse(response)).toBe(false);
    });
  });

  describe('isDelegatedFromResponse', () => {
    it('returns true for valid delegated from response', () => {
      const response = {
        success: true,
        data: { from: [{ walletAddress: '0x123', chainType: 'evm' }] },
      };
      expect(isDelegatedFromResponse(response)).toBe(true);
    });

    it('returns false for non-array from field', () => {
      const response = { success: true, data: { from: 'not-an-array' } };
      expect(isDelegatedFromResponse(response)).toBe(false);
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
  });

  describe('isEntitlementResponse', () => {
    it('returns true for valid entitlement response', () => {
      const response = {
        success: true,
        data: {
          entitlement: { type: 'nameservice', hasEntitlement: true, isActive: true },
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
  });

  describe('isSignInMessageResponse', () => {
    it('returns true for valid sign-in message response', () => {
      const response = {
        success: true,
        data: { message: 'Sign this message', walletAddress: '0x123', chainType: 'evm' },
      };
      expect(isSignInMessageResponse(response)).toBe(true);
    });

    it('returns false for missing message', () => {
      const response = { success: true, data: { walletAddress: '0x123' } };
      expect(isSignInMessageResponse(response)).toBe(false);
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
      const response = { success: true, data: { walletAddress: '0x123' } };
      expect(isPointsResponse(response)).toBe(false);
    });
  });

  describe('isLeaderboardResponse', () => {
    it('returns true for valid leaderboard response', () => {
      const response = { success: true, data: { leaderboard: [] } };
      expect(isLeaderboardResponse(response)).toBe(true);
    });

    it('returns false for missing leaderboard', () => {
      const response = { success: true, data: {} };
      expect(isLeaderboardResponse(response)).toBe(false);
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
      const response = { success: true, data: { totalUsers: 5000 } };
      expect(isSiteStatsResponse(response)).toBe(false);
    });
  });

  describe('isReferralCodeResponse', () => {
    it('returns true for valid referral code response', () => {
      const response = {
        success: true,
        data: { walletAddress: '0x123', referralCode: 'ABC123', createdAt: '2024-01-01' },
      };
      expect(isReferralCodeResponse(response)).toBe(true);
    });

    it('returns false for missing referralCode', () => {
      const response = { success: true, data: { walletAddress: '0x123' } };
      expect(isReferralCodeResponse(response)).toBe(false);
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
      const response = { success: true, data: { total: 10, consumptions: 'not-array' } };
      expect(isReferralStatsResponse(response)).toBe(false);
    });
  });

  describe('isAuthenticationStatusResponse', () => {
    it('returns true for valid authentication status response', () => {
      const response = { success: true, data: { authenticated: true } };
      expect(isAuthenticationStatusResponse(response)).toBe(true);
    });

    it('returns false for non-boolean authenticated', () => {
      const response = { success: true, data: { authenticated: 'yes' } };
      expect(isAuthenticationStatusResponse(response)).toBe(false);
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
        data: { chains: 'not-array', totalChains: 5, activeChains: 4, timestamp: '2024-01-01' },
      };
      expect(isBlockStatusResponse(response)).toBe(false);
    });
  });

  describe('isNameServiceResponse', () => {
    it('returns true for valid name service response', () => {
      const response = { success: true, data: { names: ['name1.eth', 'name2.eth'] } };
      expect(isNameServiceResponse(response)).toBe(true);
    });

    it('returns false for non-array names', () => {
      const response = { success: true, data: { names: 'not-array' } };
      expect(isNameServiceResponse(response)).toBe(false);
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
      const response = { success: true, data: { walletAddress: '0x123' } };
      expect(isNameResolutionResponse(response)).toBe(false);
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
  });

  describe('isTemplateListResponse', () => {
    it('returns true for valid template list response', () => {
      const response = {
        success: true,
        data: { templates: [], total: 0, hasMore: false, verified: true },
      };
      expect(isTemplateListResponse(response)).toBe(true);
    });

    it('returns false for non-array templates', () => {
      const response = {
        success: true,
        data: { templates: 'not-array', total: 0, hasMore: false, verified: true },
      };
      expect(isTemplateListResponse(response)).toBe(false);
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
      const response = { success: true, data: { message: 'Deleted' } };
      expect(isTemplateDeleteResponse(response)).toBe(false);
    });
  });

  describe('isWebhookResponse', () => {
    it('returns true for valid webhook response', () => {
      const response = {
        success: true,
        data: {
          webhook: { id: '1', webhookUrl: 'https://example.com/hook' },
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
  });

  describe('isWebhookListResponse', () => {
    it('returns true for valid webhook list response', () => {
      const response = {
        success: true,
        data: { webhooks: [], total: 0, hasMore: false, verified: true },
      };
      expect(isWebhookListResponse(response)).toBe(true);
    });

    it('returns false for non-array webhooks', () => {
      const response = {
        success: true,
        data: { webhooks: 'not-array', total: 0, hasMore: false, verified: true },
      };
      expect(isWebhookListResponse(response)).toBe(false);
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
      const response = { success: true, data: { verified: true } };
      expect(isWebhookDeleteResponse(response)).toBe(false);
    });
  });
});
