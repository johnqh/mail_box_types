/**
 * Common utility types used throughout the mail box types library
 */

/**
 * Utility type for values that can be T, undefined, or null
 */
export type Optional<T> = T | undefined | null;

/**
 * Chain type classification
 */
export enum ChainType {
  EVM = 'evm',
  SOLANA = 'solana',
}

/**
 * Base wallet data structure containing address and chain type
 */
export interface WalletData {
  /** Wallet address (EVM 0x format or Solana Base58) */
  walletAddress: string;
  /** Chain type classification (EVM or Solana) */
  chainType: ChainType;
}

/**
 * Base response structure for all API operations
 */
export interface ApiResponse<T = unknown> {
  /** Operation success status */
  success: boolean;
  /** Response data */
  data?: Optional<T>;
  /** Error message if operation failed */
  error?: Optional<string>;
  /** Response timestamp */
  timestamp?: string;
}
