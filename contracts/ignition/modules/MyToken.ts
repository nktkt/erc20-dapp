import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "ethers";

const MyTokenModule = buildModule("MyTokenModule", (m) => {
  const name = m.getParameter("name", "MyToken");
  const symbol = m.getParameter("symbol", "MTK");
  const initialSupply = m.getParameter("initialSupply", parseEther("1000000"));
  const maxSupply = m.getParameter("maxSupply", parseEther("10000000"));
  const initialOwner = m.getParameter(
    "initialOwner",
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" // Hardhat account #0
  );

  const token = m.contract("MyToken", [
    name,
    symbol,
    initialSupply,
    maxSupply,
    initialOwner,
  ]);

  return { token };
});

export default MyTokenModule;
