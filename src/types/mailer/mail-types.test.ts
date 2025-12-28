import { describe, it, expect } from 'vitest';
import { ChainType } from '@sudobility/types';
import {
  ConfirmationStatus,
  ClaimType,
  FeeType,
  isEVMResponse,
  isSolanaResponse,
  isMailboxErrorResponse,
  isConfirmationStatus,
  isClaimType,
  isFeeType,
  isBaseTransactionResponse,
  isMessageSendResponse,
  isClaimableInfo,
} from './mail-types';
import type {
  TransactionReceipt,
  EVMTransactionResponse,
  SolanaTransactionResponse,
  UnifiedClientResponse,
  BaseTransactionResponse,
  MessageSendResponse,
  ClaimableInfo,
} from './mail-types';

describe('Mailer Types', () => {
  describe('ConfirmationStatus Enum', () => {
    it('has Processed value', () => {
      expect(ConfirmationStatus.Processed).toBe('processed');
    });

    it('has Confirmed value', () => {
      expect(ConfirmationStatus.Confirmed).toBe('confirmed');
    });

    it('has Finalized value', () => {
      expect(ConfirmationStatus.Finalized).toBe('finalized');
    });

    it('has exactly 3 values', () => {
      const values = Object.values(ConfirmationStatus);
      expect(values).toHaveLength(3);
    });
  });

  describe('ClaimType Enum', () => {
    it('has Recipient value', () => {
      expect(ClaimType.Recipient).toBe('recipient');
    });

    it('has Owner value', () => {
      expect(ClaimType.Owner).toBe('owner');
    });

    it('has Expired value', () => {
      expect(ClaimType.Expired).toBe('expired');
    });

    it('has exactly 3 values', () => {
      const values = Object.values(ClaimType);
      expect(values).toHaveLength(3);
    });
  });

  describe('FeeType Enum', () => {
    it('has Send value', () => {
      expect(FeeType.Send).toBe('send');
    });

    it('has Delegation value', () => {
      expect(FeeType.Delegation).toBe('delegation');
    });

    it('has Registration value', () => {
      expect(FeeType.Registration).toBe('registration');
    });

    it('has exactly 3 values', () => {
      const values = Object.values(FeeType);
      expect(values).toHaveLength(3);
    });
  });
});

describe('Mailer Type Guards', () => {
  describe('isEVMResponse', () => {
    it('returns true for EVM response', () => {
      const response: EVMTransactionResponse = {
        transactionHash: '0x123',
        chainType: ChainType.EVM,
        success: true,
        blockNumber: 12345,
        gasUsed: BigInt(21000),
      };
      expect(isEVMResponse(response)).toBe(true);
    });

    it('returns false for Solana response', () => {
      const response: SolanaTransactionResponse = {
        transactionHash: 'sig123',
        chainType: ChainType.SOLANA,
        success: true,
        slot: 12345,
      };
      expect(isEVMResponse(response)).toBe(false);
    });
  });

  describe('isSolanaResponse', () => {
    it('returns true for Solana response', () => {
      const response: SolanaTransactionResponse = {
        transactionHash: 'sig123',
        chainType: ChainType.SOLANA,
        success: true,
        slot: 12345,
      };
      expect(isSolanaResponse(response)).toBe(true);
    });

    it('returns false for EVM response', () => {
      const response: EVMTransactionResponse = {
        transactionHash: '0x123',
        chainType: ChainType.EVM,
        success: true,
        blockNumber: 12345,
        gasUsed: BigInt(21000),
      };
      expect(isSolanaResponse(response)).toBe(false);
    });
  });

  describe('isMailboxErrorResponse', () => {
    it('returns true for error response', () => {
      const response: UnifiedClientResponse = {
        success: false,
        error: 'Something went wrong',
        timestamp: '2024-01-01T00:00:00Z',
        chainType: ChainType.EVM,
      };
      expect(isMailboxErrorResponse(response)).toBe(true);
    });

    it('returns false for success response', () => {
      const response: UnifiedClientResponse = {
        success: true,
        data: { foo: 'bar' },
        timestamp: '2024-01-01T00:00:00Z',
        chainType: ChainType.EVM,
      };
      expect(isMailboxErrorResponse(response)).toBe(false);
    });

    it('returns false for success=false without error', () => {
      const response: UnifiedClientResponse = {
        success: false,
        timestamp: '2024-01-01T00:00:00Z',
        chainType: ChainType.EVM,
      };
      expect(isMailboxErrorResponse(response)).toBe(false);
    });
  });

  describe('isConfirmationStatus', () => {
    it('returns true for valid confirmation status', () => {
      expect(isConfirmationStatus('processed')).toBe(true);
      expect(isConfirmationStatus('confirmed')).toBe(true);
      expect(isConfirmationStatus('finalized')).toBe(true);
    });

    it('returns false for invalid values', () => {
      expect(isConfirmationStatus('invalid')).toBe(false);
      expect(isConfirmationStatus('')).toBe(false);
      expect(isConfirmationStatus(null)).toBe(false);
      expect(isConfirmationStatus(undefined)).toBe(false);
      expect(isConfirmationStatus(123)).toBe(false);
    });
  });

  describe('isClaimType', () => {
    it('returns true for valid claim types', () => {
      expect(isClaimType('recipient')).toBe(true);
      expect(isClaimType('owner')).toBe(true);
      expect(isClaimType('expired')).toBe(true);
    });

    it('returns false for invalid values', () => {
      expect(isClaimType('invalid')).toBe(false);
      expect(isClaimType('')).toBe(false);
      expect(isClaimType(null)).toBe(false);
      expect(isClaimType(undefined)).toBe(false);
    });
  });

  describe('isFeeType', () => {
    it('returns true for valid fee types', () => {
      expect(isFeeType('send')).toBe(true);
      expect(isFeeType('delegation')).toBe(true);
      expect(isFeeType('registration')).toBe(true);
    });

    it('returns false for invalid values', () => {
      expect(isFeeType('invalid')).toBe(false);
      expect(isFeeType('')).toBe(false);
      expect(isFeeType(null)).toBe(false);
      expect(isFeeType(undefined)).toBe(false);
    });
  });

  describe('isBaseTransactionResponse', () => {
    it('returns true for valid transaction response', () => {
      const response: BaseTransactionResponse = {
        transactionHash: '0x123abc',
        chainType: ChainType.EVM,
        success: true,
      };
      expect(isBaseTransactionResponse(response)).toBe(true);
    });

    it('returns true for Solana transaction response', () => {
      const response: BaseTransactionResponse = {
        transactionHash: 'SolanaSignature123',
        chainType: ChainType.SOLANA,
        success: false,
        error: 'Transaction failed',
      };
      expect(isBaseTransactionResponse(response)).toBe(true);
    });

    it('returns false for null', () => {
      expect(isBaseTransactionResponse(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isBaseTransactionResponse(undefined)).toBe(false);
    });

    it('returns false for missing transactionHash', () => {
      const response = { chainType: ChainType.EVM, success: true };
      expect(isBaseTransactionResponse(response)).toBe(false);
    });

    it('returns false for missing chainType', () => {
      const response = { transactionHash: '0x123', success: true };
      expect(isBaseTransactionResponse(response)).toBe(false);
    });

    it('returns false for missing success', () => {
      const response = { transactionHash: '0x123', chainType: ChainType.EVM };
      expect(isBaseTransactionResponse(response)).toBe(false);
    });

    it('returns false for non-string transactionHash', () => {
      const response = {
        transactionHash: 123,
        chainType: ChainType.EVM,
        success: true,
      };
      expect(isBaseTransactionResponse(response)).toBe(false);
    });

    it('returns false for non-boolean success', () => {
      const response = {
        transactionHash: '0x123',
        chainType: ChainType.EVM,
        success: 'true',
      };
      expect(isBaseTransactionResponse(response)).toBe(false);
    });
  });

  describe('isMessageSendResponse', () => {
    it('returns true for valid message send response', () => {
      const response: MessageSendResponse = {
        transactionHash: '0x123',
        chainType: ChainType.EVM,
        success: true,
        fee: BigInt(100),
        isPriority: true,
      };
      expect(isMessageSendResponse(response)).toBe(true);
    });

    it('returns true for non-priority message', () => {
      const response: MessageSendResponse = {
        transactionHash: '0x123',
        chainType: ChainType.EVM,
        success: true,
        fee: 100,
        isPriority: false,
        recipient: '0xrecipient',
        subject: 'Test',
        body: 'Hello',
      };
      expect(isMessageSendResponse(response)).toBe(true);
    });

    it('returns false for missing isPriority', () => {
      const response = {
        transactionHash: '0x123',
        chainType: ChainType.EVM,
        success: true,
        fee: 100,
      };
      expect(isMessageSendResponse(response)).toBe(false);
    });

    it('returns false for missing fee', () => {
      const response = {
        transactionHash: '0x123',
        chainType: ChainType.EVM,
        success: true,
        isPriority: true,
      };
      expect(isMessageSendResponse(response)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isMessageSendResponse(null)).toBe(false);
    });
  });

  describe('isClaimableInfo', () => {
    it('returns true for valid claimable info', () => {
      const info: ClaimableInfo = {
        amount: BigInt(1000),
        expiryTimestamp: Date.now() + 86400000,
        isExpired: false,
        isClaimable: true,
      };
      expect(isClaimableInfo(info)).toBe(true);
    });

    it('returns true for expired claim', () => {
      const info: ClaimableInfo = {
        amount: 1000,
        expiryTimestamp: Date.now() - 86400000,
        isExpired: true,
        isClaimable: false,
      };
      expect(isClaimableInfo(info)).toBe(true);
    });

    it('returns false for missing amount', () => {
      const info = {
        expiryTimestamp: Date.now(),
        isExpired: false,
        isClaimable: true,
      };
      expect(isClaimableInfo(info)).toBe(false);
    });

    it('returns false for missing expiryTimestamp', () => {
      const info = {
        amount: 1000,
        isExpired: false,
        isClaimable: true,
      };
      expect(isClaimableInfo(info)).toBe(false);
    });

    it('returns false for non-number expiryTimestamp', () => {
      const info = {
        amount: 1000,
        expiryTimestamp: '2024-01-01',
        isExpired: false,
        isClaimable: true,
      };
      expect(isClaimableInfo(info)).toBe(false);
    });

    it('returns false for non-boolean isExpired', () => {
      const info = {
        amount: 1000,
        expiryTimestamp: Date.now(),
        isExpired: 'false',
        isClaimable: true,
      };
      expect(isClaimableInfo(info)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isClaimableInfo(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isClaimableInfo(undefined)).toBe(false);
    });
  });
});

describe('Type Compatibility', () => {
  it('TransactionReceipt extends BaseTransactionResponse', () => {
    const receipt: TransactionReceipt = {
      transactionHash: '0x123',
      chainType: ChainType.EVM,
      success: true,
      blockNumber: 12345,
      gasUsed: BigInt(21000),
      confirmationStatus: ConfirmationStatus.Finalized,
    };
    expect(receipt.transactionHash).toBe('0x123');
    expect(receipt.confirmationStatus).toBe(ConfirmationStatus.Finalized);
  });

  it('EVMTransactionResponse has EVM-specific fields', () => {
    const response: EVMTransactionResponse = {
      transactionHash: '0x123',
      chainType: ChainType.EVM,
      success: true,
      blockNumber: 12345,
      gasUsed: BigInt(21000),
      gasPrice: BigInt(20000000000),
      contractAddress: '0xcontract',
    };
    expect(response.blockNumber).toBe(12345);
    expect(response.gasPrice).toBe(BigInt(20000000000));
  });

  it('SolanaTransactionResponse has Solana-specific fields', () => {
    const response: SolanaTransactionResponse = {
      transactionHash: 'sig123',
      chainType: ChainType.SOLANA,
      success: true,
      slot: 12345,
      computeUnitsConsumed: 5000,
      transactionFee: 5000,
    };
    expect(response.slot).toBe(12345);
    expect(response.computeUnitsConsumed).toBe(5000);
  });
});
