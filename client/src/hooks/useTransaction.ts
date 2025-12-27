/**
 * useTransaction Hook
 * 
 * Handles on-chain transaction execution with error handling and status tracking.
 * Supports sending ETH and contract interactions.
 * 
 * Design Philosophy: Robust, error-aware transaction management
 */

import { useCallback, useState } from "react";
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";

export interface TransactionState {
  isPending: boolean;
  isConfirming: boolean;
  isConfirmed: boolean;
  error: Error | null;
  hash: `0x${string}` | undefined;
}

export interface UseTransactionReturn extends TransactionState {
  sendETH: (to: `0x${string}`, amount: string) => Promise<void>;
  sendTransaction: (to: `0x${string}`, data?: `0x${string}`) => Promise<void>;
  reset: () => void;
}

/**
 * Hook to manage transaction lifecycle
 * 
 * @returns Transaction state and methods
 */
export function useTransaction(): UseTransactionReturn {
  const [error, setError] = useState<Error | null>(null);
  const { sendTransaction: wagmiSendTransaction, isPending, data: hash } =
    useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  /**
   * Send ETH to an address
   * @param to - Recipient address
   * @param amount - Amount in ETH (e.g., "0.001")
   */
  const sendETH = useCallback(
    async (to: `0x${string}`, amount: string) => {
      try {
        setError(null);
        wagmiSendTransaction({
          to,
          value: parseEther(amount),
        });
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      }
    },
    [wagmiSendTransaction]
  );

  /**
   * Send transaction with optional data (for contract interactions)
   * @param to - Recipient or contract address
   * @param data - Optional transaction data for contract calls
   */
  const sendTransaction = useCallback(
    async (to: `0x${string}`, data?: `0x${string}`) => {
      try {
        setError(null);
        wagmiSendTransaction({
          to,
          data,
        });
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      }
    },
    [wagmiSendTransaction]
  );

  /**
   * Reset transaction state
   */
  const reset = useCallback(() => {
    setError(null);
  }, []);

  return {
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash,
    sendETH,
    sendTransaction,
    reset,
  };
}
