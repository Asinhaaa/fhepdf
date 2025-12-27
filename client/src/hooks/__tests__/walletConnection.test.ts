/**
 * Wallet Connection Configuration Tests
 * 
 * Validates that Web3 environment variables are properly configured
 * and that the Sepolia RPC endpoint is accessible.
 */

import { describe, it, expect, beforeAll } from "vitest";

describe("Web3 Configuration", () => {
  let rpcUrl: string;
  let walletConnectId: string;

  beforeAll(() => {
    rpcUrl = import.meta.env.VITE_SEPOLIA_RPC_URL || "";
    walletConnectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "";
  });

  it("should have Sepolia RPC URL configured", () => {
    expect(rpcUrl).toBeTruthy();
    expect(rpcUrl).toMatch(/^https?:\/\//);
  });

  it("should have WalletConnect Project ID configured", () => {
    expect(walletConnectId).toBeTruthy();
    expect(walletConnectId.length).toBeGreaterThan(0);
  });

  it("should be able to reach Sepolia RPC endpoint", async () => {
    if (!rpcUrl) {
      console.warn("Skipping RPC test: VITE_SEPOLIA_RPC_URL not configured");
      return;
    }

    try {
      const response = await fetch(rpcUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_chainId",
          params: [],
          id: 1,
        }),
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      
      // Check that we got a valid JSON-RPC response
      expect(data.jsonrpc).toBe("2.0");
      
      // Check that we're on Sepolia (chain ID 0xaa36a7 = 11155111)
      expect(data.result).toBe("0xaa36a7");
    } catch (error) {
      console.error("RPC endpoint test failed:", error);
      throw new Error(
        `Failed to connect to Sepolia RPC: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  });

  it("should format Sepolia chain ID correctly", () => {
    const sepoliaChainId = 11155111;
    const hexChainId = "0x" + sepoliaChainId.toString(16);
    expect(hexChainId).toBe("0xaa36a7");
  });
});
