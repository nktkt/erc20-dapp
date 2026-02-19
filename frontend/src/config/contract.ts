import { type Abi } from "viem";
import abiJson from "../abi/MyToken.json";

export const TOKEN_ABI = abiJson as Abi;
export const TOKEN_ADDRESS = import.meta.env
  .VITE_TOKEN_ADDRESS as `0x${string}`;
