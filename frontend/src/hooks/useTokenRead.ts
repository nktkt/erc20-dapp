import { useReadContract, useAccount } from "wagmi";
import { formatUnits } from "viem";
import { TOKEN_ABI, TOKEN_ADDRESS } from "../config/contract";

const contractBase = { address: TOKEN_ADDRESS, abi: TOKEN_ABI } as const;

export function useTokenName() {
  return useReadContract({ ...contractBase, functionName: "name" });
}

export function useTokenSymbol() {
  return useReadContract({ ...contractBase, functionName: "symbol" });
}

export function useTokenTotalSupply() {
  const result = useReadContract({
    ...contractBase,
    functionName: "totalSupply",
  });
  return {
    ...result,
    formatted:
      result.data != null
        ? formatUnits(result.data as bigint, 18)
        : undefined,
  };
}

export function useTokenBalance(address: `0x${string}` | undefined) {
  const result = useReadContract({
    ...contractBase,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
  return {
    ...result,
    formatted:
      result.data != null
        ? formatUnits(result.data as bigint, 18)
        : undefined,
  };
}

export function useTokenOwner() {
  return useReadContract({ ...contractBase, functionName: "owner" });
}

export function useTokenPaused() {
  return useReadContract({ ...contractBase, functionName: "paused" });
}

export function useIsOwner() {
  const { address } = useAccount();
  const { data: owner } = useTokenOwner();
  if (!address || !owner) return false;
  return address.toLowerCase() === (owner as string).toLowerCase();
}
