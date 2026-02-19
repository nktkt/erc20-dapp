import { useAccount } from "wagmi";
import {
  useTokenName,
  useTokenSymbol,
  useTokenTotalSupply,
  useTokenBalance,
  useTokenOwner,
  useTokenPaused,
} from "../hooks/useTokenRead";

export default function TokenInfo() {
  const { address } = useAccount();
  const { data: name } = useTokenName();
  const { data: symbol } = useTokenSymbol();
  const { formatted: totalSupply } = useTokenTotalSupply();
  const { formatted: balance } = useTokenBalance(address);
  const { data: owner } = useTokenOwner();
  const { data: paused } = useTokenPaused();

  return (
    <div className="bg-gray-800 rounded-xl p-6 space-y-3">
      <h2 className="text-xl font-bold text-white">Token Info</h2>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <span className="text-gray-400">Name</span>
        <span className="text-white">{(name as string) ?? "—"}</span>
        <span className="text-gray-400">Symbol</span>
        <span className="text-white">{(symbol as string) ?? "—"}</span>
        <span className="text-gray-400">Total Supply</span>
        <span className="text-white">
          {totalSupply ?? "—"} {(symbol as string) ?? ""}
        </span>
        <span className="text-gray-400">Your Balance</span>
        <span className="text-white">
          {balance ?? "—"} {(symbol as string) ?? ""}
        </span>
        <span className="text-gray-400">Owner</span>
        <span className="text-white font-mono text-xs break-all">
          {(owner as string) ?? "—"}
        </span>
        <span className="text-gray-400">Status</span>
        <span className={paused ? "text-red-400" : "text-green-400"}>
          {paused == null ? "—" : paused ? "Paused" : "Active"}
        </span>
      </div>
    </div>
  );
}
