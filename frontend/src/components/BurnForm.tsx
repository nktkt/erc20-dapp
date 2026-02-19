import { useState, useEffect, type FormEvent } from "react";
import { useTokenBurn } from "../hooks/useTokenBurn";

export default function BurnForm() {
  const [amount, setAmount] = useState("");
  const { burn, isPending, isConfirming, isSuccess, error } = useTokenBurn();

  useEffect(() => {
    if (isSuccess) setAmount("");
  }, [isSuccess]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!amount) return;
    burn(amount);
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-4">Burn</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Amount to burn"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg text-sm placeholder-gray-400"
        />
        <button
          type="submit"
          disabled={isPending || isConfirming}
          className="w-full py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white rounded-lg text-sm transition"
        >
          {isPending
            ? "Confirm in Wallet..."
            : isConfirming
              ? "Confirming..."
              : "Burn"}
        </button>
      </form>
      {isSuccess && (
        <p className="text-green-400 text-sm mt-2">Burn successful!</p>
      )}
      {error && (
        <p className="text-red-400 text-sm mt-2">{error.message}</p>
      )}
    </div>
  );
}
