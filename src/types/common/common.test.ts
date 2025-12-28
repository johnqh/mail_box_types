import { describe, it, expect } from 'vitest';
import { ChainType } from './index';
import type { Optional, WalletData, ApiResponse } from './index';

describe('Common Types', () => {
  describe('ChainType Enum', () => {
    it('has EVM value', () => {
      expect(ChainType.EVM).toBe('evm');
    });

    it('has SOLANA value', () => {
      expect(ChainType.SOLANA).toBe('solana');
    });

    it('has exactly 2 values', () => {
      const values = Object.values(ChainType);
      expect(values).toHaveLength(2);
      expect(values).toContain('evm');
      expect(values).toContain('solana');
    });
  });

  describe('Type Compatibility', () => {
    it('Optional type allows value, undefined, and null', () => {
      const value1: Optional<string> = 'hello';
      const value2: Optional<string> = undefined;
      const value3: Optional<string> = null;

      expect(value1).toBe('hello');
      expect(value2).toBeUndefined();
      expect(value3).toBeNull();
    });

    it('WalletData interface has required fields', () => {
      const wallet: WalletData = {
        walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
        chainType: ChainType.EVM,
      };

      expect(wallet.walletAddress).toBe('0x1234567890abcdef1234567890abcdef12345678');
      expect(wallet.chainType).toBe(ChainType.EVM);
    });

    it('WalletData works with Solana chain type', () => {
      const wallet: WalletData = {
        walletAddress: 'DRpbCBMxVnDK7maPMBfMRzrtfvGGHCfLVL2k4a2V8TbQ',
        chainType: ChainType.SOLANA,
      };

      expect(wallet.chainType).toBe(ChainType.SOLANA);
    });

    it('ApiResponse interface wraps data correctly', () => {
      const successResponse: ApiResponse<{ name: string }> = {
        success: true,
        data: { name: 'test' },
        timestamp: '2024-01-01T00:00:00Z',
      };

      expect(successResponse.success).toBe(true);
      expect(successResponse.data?.name).toBe('test');
      expect(successResponse.timestamp).toBe('2024-01-01T00:00:00Z');
    });

    it('ApiResponse interface handles error', () => {
      const errorResponse: ApiResponse<never> = {
        success: false,
        error: 'Something went wrong',
      };

      expect(errorResponse.success).toBe(false);
      expect(errorResponse.error).toBe('Something went wrong');
      expect(errorResponse.data).toBeUndefined();
    });

    it('ApiResponse with optional fields', () => {
      const minimalResponse: ApiResponse = {
        success: true,
      };

      expect(minimalResponse.success).toBe(true);
      expect(minimalResponse.data).toBeUndefined();
      expect(minimalResponse.error).toBeUndefined();
      expect(minimalResponse.timestamp).toBeUndefined();
    });
  });
});
