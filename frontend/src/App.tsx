import { useAccount } from "wagmi";
import ConnectWallet from "./components/ConnectWallet";
import TokenInfo from "./components/TokenInfo";
import TransferForm from "./components/TransferForm";
import MintForm from "./components/MintForm";
import BurnForm from "./components/BurnForm";
import PauseControl from "./components/PauseControl";
import { useIsOwner } from "./hooks/useTokenRead";

export default function App() {
  const { isConnected } = useAccount();
  const isOwner = useIsOwner();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">ERC-20 Token DApp</h1>
        <ConnectWallet />
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-6">
        {!isConnected ? (
          <p className="text-center text-gray-400 mt-20">
            Connect your wallet to get started.
          </p>
        ) : (
          <>
            <TokenInfo />
            <div className="grid md:grid-cols-2 gap-6">
              <TransferForm />
              <BurnForm />
            </div>
            {isOwner && (
              <div className="grid md:grid-cols-2 gap-6">
                <MintForm />
                <PauseControl />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
