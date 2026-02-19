import { useTokenPause, useTokenUnpause } from "../hooks/useTokenPause";
import { useTokenPaused } from "../hooks/useTokenRead";

export default function PauseControl() {
  const { data: paused } = useTokenPaused();
  const {
    execute: pause,
    isPending: pausePending,
    isConfirming: pauseConfirming,
    isSuccess: pauseSuccess,
    error: pauseError,
  } = useTokenPause();
  const {
    execute: unpause,
    isPending: unpausePending,
    isConfirming: unpauseConfirming,
    isSuccess: unpauseSuccess,
    error: unpauseError,
  } = useTokenUnpause();

  const busy = pausePending || pauseConfirming || unpausePending || unpauseConfirming;

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-4">
        Pause Control (Owner)
      </h2>
      <p className="text-sm text-gray-400 mb-3">
        Status:{" "}
        <span className={paused ? "text-red-400" : "text-green-400"}>
          {paused == null ? "—" : paused ? "Paused" : "Active"}
        </span>
      </p>
      <div className="flex gap-3">
        <button
          onClick={pause}
          disabled={busy || paused === true}
          className="flex-1 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg text-sm transition"
        >
          {pausePending
            ? "Confirm in Wallet..."
            : pauseConfirming
              ? "Confirming..."
              : "Pause"}
        </button>
        <button
          onClick={unpause}
          disabled={busy || paused === false}
          className="flex-1 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg text-sm transition"
        >
          {unpausePending
            ? "Confirm in Wallet..."
            : unpauseConfirming
              ? "Confirming..."
              : "Unpause"}
        </button>
      </div>
      {(pauseSuccess || unpauseSuccess) && (
        <p className="text-green-400 text-sm mt-2">Transaction confirmed!</p>
      )}
      {(pauseError || unpauseError) && (
        <p className="text-red-400 text-sm mt-2">
          {(pauseError ?? unpauseError)!.message}
        </p>
      )}
    </div>
  );
}
