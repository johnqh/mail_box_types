import { describe, it, expect } from 'vitest';
import {
  KYCVerificationLevel,
  KYCApplicationStatus,
  SumsubReviewStatus,
  SumsubReviewAnswer,
  ApplicantType,
  ReviewRejectType,
} from './kyc-types';
import type {
  KYCApplication,
  VerificationResult,
  UserConsent,
  InitiateKYCRequest,
  InitiateKYCResponse,
  GetKYCStatusResponse,
  VerifyUserRequest,
  VerifyUserResponse,
} from './kyc-types';
import { ChainType } from '../common';

describe('KYC Types', () => {
  describe('KYCVerificationLevel Enum', () => {
    it('has Basic value', () => {
      expect(KYCVerificationLevel.Basic).toBe('basic');
    });

    it('has Enhanced value', () => {
      expect(KYCVerificationLevel.Enhanced).toBe('enhanced');
    });

    it('has Accredited value', () => {
      expect(KYCVerificationLevel.Accredited).toBe('accredited');
    });

    it('has exactly 3 values', () => {
      const values = Object.values(KYCVerificationLevel);
      expect(values).toHaveLength(3);
    });
  });

  describe('KYCApplicationStatus Enum', () => {
    it('has all status values', () => {
      expect(KYCApplicationStatus.Pending).toBe('PENDING');
      expect(KYCApplicationStatus.Initiated).toBe('INITIATED');
      expect(KYCApplicationStatus.InProgress).toBe('IN_PROGRESS');
      expect(KYCApplicationStatus.Submitted).toBe('SUBMITTED');
      expect(KYCApplicationStatus.Completed).toBe('COMPLETED');
      expect(KYCApplicationStatus.Rejected).toBe('REJECTED');
    });

    it('has exactly 6 values', () => {
      const values = Object.values(KYCApplicationStatus);
      expect(values).toHaveLength(6);
    });
  });

  describe('SumsubReviewStatus Enum', () => {
    it('has all status values', () => {
      expect(SumsubReviewStatus.Init).toBe('init');
      expect(SumsubReviewStatus.Pending).toBe('pending');
      expect(SumsubReviewStatus.Prechecked).toBe('prechecked');
      expect(SumsubReviewStatus.Completed).toBe('completed');
    });

    it('has exactly 4 values', () => {
      const values = Object.values(SumsubReviewStatus);
      expect(values).toHaveLength(4);
    });
  });

  describe('SumsubReviewAnswer Enum', () => {
    it('has all answer values', () => {
      expect(SumsubReviewAnswer.Green).toBe('GREEN');
      expect(SumsubReviewAnswer.Red).toBe('RED');
      expect(SumsubReviewAnswer.Yellow).toBe('YELLOW');
    });

    it('has exactly 3 values', () => {
      const values = Object.values(SumsubReviewAnswer);
      expect(values).toHaveLength(3);
    });
  });

  describe('ApplicantType Enum', () => {
    it('has Individual value', () => {
      expect(ApplicantType.Individual).toBe('individual');
    });

    it('has Company value', () => {
      expect(ApplicantType.Company).toBe('company');
    });

    it('has exactly 2 values', () => {
      const values = Object.values(ApplicantType);
      expect(values).toHaveLength(2);
    });
  });

  describe('ReviewRejectType Enum', () => {
    it('has all reject types', () => {
      expect(ReviewRejectType.Final).toBe('FINAL');
      expect(ReviewRejectType.Retry).toBe('RETRY');
      expect(ReviewRejectType.External).toBe('EXTERNAL');
    });

    it('has exactly 3 values', () => {
      const values = Object.values(ReviewRejectType);
      expect(values).toHaveLength(3);
    });
  });

  describe('Type Compatibility', () => {
    it('KYCApplication interface has all required fields', () => {
      const application: KYCApplication = {
        id: 'app123',
        walletAddress: '0x1234',
        email: 'test@example.com',
        chainType: ChainType.EVM,
        sumsubApplicantId: 'sumsub123',
        metadata: { source: 'web' },
        verificationLevel: KYCVerificationLevel.Basic,
        status: KYCApplicationStatus.Pending,
        retryCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(application.id).toBe('app123');
      expect(application.verificationLevel).toBe(KYCVerificationLevel.Basic);
      expect(application.status).toBe(KYCApplicationStatus.Pending);
    });

    it('VerificationResult interface works correctly', () => {
      const result: VerificationResult = {
        id: 'result123',
        kycApplicationId: 'app123',
        verificationLevel: KYCVerificationLevel.Enhanced,
        status: SumsubReviewAnswer.Green,
        reviewStatus: SumsubReviewStatus.Completed,
        countryCode: 'US',
        ageVerified: true,
        accreditedInvestor: false,
        verificationDate: new Date(),
        subscriptionExpiresAt: null,
        sumsubReviewId: 'review123',
        sumsubInspectionId: 'insp123',
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(result.status).toBe(SumsubReviewAnswer.Green);
      expect(result.ageVerified).toBe(true);
    });

    it('UserConsent interface works correctly', () => {
      const consent: UserConsent = {
        id: 'consent123',
        walletAddress: '0x1234',
        dappIdentifier: 'example.com',
        signedMessage: 'I consent...',
        signature: '0xsig...',
        consentScope: {
          levels: [KYCVerificationLevel.Basic],
          fields: ['age', 'country'],
        },
        grantedAt: new Date(),
        expiresAt: null,
        revoked: false,
        revokedAt: null,
      };

      expect(consent.consentScope.levels).toContain(KYCVerificationLevel.Basic);
      expect(consent.revoked).toBe(false);
    });

    it('InitiateKYCRequest interface works correctly', () => {
      const request: InitiateKYCRequest = {
        walletAddress: '0x1234',
        chainType: ChainType.SOLANA,
        verificationLevel: KYCVerificationLevel.Accredited,
      };

      expect(request.chainType).toBe(ChainType.SOLANA);
      expect(request.verificationLevel).toBe(KYCVerificationLevel.Accredited);
    });

    it('InitiateKYCResponse interface works correctly', () => {
      const response: InitiateKYCResponse = {
        applicationId: 'app123',
        sumsubAccessToken: 'token456',
        status: KYCApplicationStatus.Initiated,
        verificationLevel: KYCVerificationLevel.Basic,
      };

      expect(response.status).toBe(KYCApplicationStatus.Initiated);
    });

    it('GetKYCStatusResponse interface works correctly', () => {
      const response: GetKYCStatusResponse = {
        applicationId: 'app123',
        walletAddress: '0x1234',
        verificationLevel: KYCVerificationLevel.Enhanced,
        status: KYCApplicationStatus.Completed,
        results: {
          basic: {
            verified: true,
            status: SumsubReviewAnswer.Green,
            ageVerified: true,
          },
          enhanced: {
            verified: true,
            status: SumsubReviewAnswer.Green,
            countryAllowed: true,
            countryCode: 'US',
          },
        },
        canRetry: false,
        retriesRemaining: 0,
      };

      expect(response.results.basic?.verified).toBe(true);
      expect(response.results.enhanced?.countryCode).toBe('US');
    });

    it('VerifyUserRequest interface works correctly', () => {
      const request: VerifyUserRequest = {
        walletAddress: '0x1234',
        signedConsent: '0xsignature...',
        consentMessage: 'I consent to share...',
        dappIdentifier: 'myapp.com',
        requestedLevel: KYCVerificationLevel.Basic,
      };

      expect(request.requestedLevel).toBe(KYCVerificationLevel.Basic);
    });

    it('VerifyUserResponse interface works correctly', () => {
      const response: VerifyUserResponse = {
        verified: true,
        level: KYCVerificationLevel.Enhanced,
        ageVerified: true,
        countryAllowed: true,
        accreditedInvestor: false,
        verifiedAt: new Date(),
        subscriptionExpiresAt: new Date(),
      };

      expect(response.verified).toBe(true);
      expect(response.level).toBe(KYCVerificationLevel.Enhanced);
    });
  });
});
