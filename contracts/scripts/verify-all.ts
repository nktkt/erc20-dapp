import { ethers } from "hardhat";

const TOKEN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

async function main() {
  const [owner, addr1] = await ethers.getSigners();
  const token = await ethers.getContractAt("MyToken", TOKEN_ADDRESS);

  console.log("=== 1. Token Info ===");
  console.log("Name:        ", await token.name());
  console.log("Symbol:      ", await token.symbol());
  console.log("Decimals:    ", await token.decimals());
  console.log("Total Supply:", ethers.formatEther(await token.totalSupply()));
  console.log("Max Supply:  ", ethers.formatEther(await token.maxSupply()));
  console.log("Owner:       ", await token.owner());
  console.log("Paused:      ", await token.paused());
  console.log("Owner balance:", ethers.formatEther(await token.balanceOf(owner.address)));
  console.log();

  console.log("=== 2. Transfer ===");
  const transferAmount = ethers.parseEther("500");
  const txTransfer = await token.transfer(addr1.address, transferAmount);
  await txTransfer.wait();
  console.log(`Transferred 500 MTK to ${addr1.address}`);
  console.log("Owner balance:", ethers.formatEther(await token.balanceOf(owner.address)));
  console.log("Addr1 balance:", ethers.formatEther(await token.balanceOf(addr1.address)));
  console.log();

  console.log("=== 3. Mint (owner only) ===");
  const mintAmount = ethers.parseEther("1000");
  const txMint = await token.mint(addr1.address, mintAmount);
  await txMint.wait();
  console.log("Minted 1000 MTK to addr1");
  console.log("Addr1 balance:", ethers.formatEther(await token.balanceOf(addr1.address)));
  console.log("Total Supply: ", ethers.formatEther(await token.totalSupply()));

  // Non-owner mint should fail
  try {
    await token.connect(addr1).mint(addr1.address, mintAmount);
    console.log("ERROR: non-owner mint should have failed!");
  } catch {
    console.log("Non-owner mint correctly rejected");
  }

  // Mint exceeding maxSupply should fail
  try {
    const excess = (await token.maxSupply()) - (await token.totalSupply()) + 1n;
    await token.mint(addr1.address, excess);
    console.log("ERROR: mint exceeding maxSupply should have failed!");
  } catch {
    console.log("Mint exceeding maxSupply correctly rejected");
  }
  console.log();

  console.log("=== 4. Burn ===");
  const burnAmount = ethers.parseEther("200");
  const txBurn = await token.connect(addr1).burn(burnAmount);
  await txBurn.wait();
  console.log("Addr1 burned 200 MTK");
  console.log("Addr1 balance:", ethers.formatEther(await token.balanceOf(addr1.address)));
  console.log("Total Supply: ", ethers.formatEther(await token.totalSupply()));
  console.log();

  console.log("=== 5. Pause / Unpause ===");
  const txPause = await token.pause();
  await txPause.wait();
  console.log("Paused:      ", await token.paused());

  // Transfer should fail while paused
  try {
    await token.transfer(addr1.address, ethers.parseEther("1"));
    console.log("ERROR: transfer while paused should have failed!");
  } catch {
    console.log("Transfer while paused correctly rejected");
  }

  // Non-owner unpause should fail
  try {
    await token.connect(addr1).unpause();
    console.log("ERROR: non-owner unpause should have failed!");
  } catch {
    console.log("Non-owner unpause correctly rejected");
  }

  const txUnpause = await token.unpause();
  await txUnpause.wait();
  console.log("Paused:      ", await token.paused());

  // Transfer should work again
  const txAfter = await token.transfer(addr1.address, ethers.parseEther("10"));
  await txAfter.wait();
  console.log("Transfer after unpause succeeded");
  console.log();

  console.log("=== 6. Ownable2Step ===");
  await token.transferOwnership(addr1.address);
  console.log("Pending owner:", await token.pendingOwner());
  console.log("Current owner:", await token.owner());
  await token.connect(addr1).acceptOwnership();
  console.log("Owner after accept:", await token.owner());
  console.log();

  console.log("=== All checks passed! ===");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
