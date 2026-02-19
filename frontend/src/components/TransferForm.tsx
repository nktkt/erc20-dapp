import { useState, useEffect, type FormEvent } from "react";
import { isAddress } from "viem";
import { useTokenTransfer } from "../hooks/useTokenTransfer";

export default function TransferForm() {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [validationError, setValidationError] = useState("");
  const { transfer, isPending, isConfirming, isSuccess, error } =
    useTokenTransfer();

  useEffect(() => {
    if (isSuccess) {
      setTo("");
      setAmount("");
    }
  }, [isSuccess]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setValidationError("");

    if (!isAddress(to)) {
      setValidationError("Invalid address.");
      return;
    }
    const n = Number(amount);
    if (!amount || isNaN(n) || n <= 0) {
      setValidationError("Amount must be a positive number.");
      return;
    }

    transfer(to, amount);
  }

  const displayError = validationError || (error ? error.message.slice(0, 200) : "");

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-4">Transfer</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Recipient address (0x...)"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg text-sm placeholder-gray-400"
        />
        <input
          type="text"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg text-sm placeholder-gray-400"
        />
        <button
          type="submit"
          disabled={isPending || isConfirming}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg text-sm transition"
        >
          {isPending
            ? "Confirm in Wallet..."
            : isConfirming
              ? "Confirming..."
              : "Transfer"}
        </button>
      </form>
      {isSuccess && (
        <p className="text-green-400 text-sm mt-2">Transfer successful!</p>
      )}
      {displayError && (
        <p className="text-red-400 text-sm mt-2">{displayError}</p>
      )}
    </div>
  );
}
