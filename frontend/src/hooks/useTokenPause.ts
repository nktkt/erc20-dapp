import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { TOKEN_ABI, TOKEN_ADDRESS } from "../config/contract";

function useTokenWrite(functionName: "pause" | "unpause") {
  const queryClient = useQueryClient();
  const { data: hash, writeContract, isPending, error, reset } =
    useWriteContract();

  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isSuccess) queryClient.invalidateQueries();
  }, [isSuccess, queryClient]);

  function execute() {
    reset();
    writeContract({
      address: TOKEN_ADDRESS,
      abi: TOKEN_ABI,
      functionName,
    });
  }

  return { execute, hash, isPending, isConfirming, isSuccess, error };
}

export function useTokenPause() {
  return useTokenWrite("pause");
}

export function useTokenUnpause() {
  return useTokenWrite("unpause");
}
