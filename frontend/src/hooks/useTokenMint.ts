import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { parseEther } from "viem";
import { useEffect } from "react";
import { TOKEN_ABI, TOKEN_ADDRESS } from "../config/contract";

export function useTokenMint() {
  const queryClient = useQueryClient();
  const { data: hash, writeContract, isPending, error, reset } =
    useWriteContract();

  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isSuccess) queryClient.invalidateQueries();
  }, [isSuccess, queryClient]);

  function mint(to: `0x${string}`, amount: string) {
    reset();
    writeContract({
      address: TOKEN_ADDRESS,
      abi: TOKEN_ABI,
      functionName: "mint",
      args: [to, parseEther(amount)],
    });
  }

  return { mint, hash, isPending, isConfirming, isSuccess, error };
}
