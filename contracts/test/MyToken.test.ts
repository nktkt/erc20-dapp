import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("MyToken", function () {
  const TOKEN_NAME = "MyToken";
  const TOKEN_SYMBOL = "MTK";
  const INITIAL_SUPPLY = ethers.parseEther("1000000");

  async function deployFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const MyToken = await ethers.getContractFactory("MyToken");
    const token = await MyToken.deploy(
      TOKEN_NAME,
      TOKEN_SYMBOL,
      INITIAL_SUPPLY,
      owner.address
    );

    return { token, owner, addr1, addr2 };
  }

  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      const { token } = await loadFixture(deployFixture);
      expect(await token.name()).to.equal(TOKEN_NAME);
      expect(await token.symbol()).to.equal(TOKEN_SYMBOL);
    });

    it("Should mint initial supply to owner", async function () {
      const { token, owner } = await loadFixture(deployFixture);
      expect(await token.totalSupply()).to.equal(INITIAL_SUPPLY);
      expect(await token.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY);
    });

    it("Should set the correct owner", async function () {
      const { token, owner } = await loadFixture(deployFixture);
      expect(await token.owner()).to.equal(owner.address);
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint", async function () {
      const { token, addr1 } = await loadFixture(deployFixture);
      const amount = ethers.parseEther("100");
      await token.mint(addr1.address, amount);
      expect(await token.balanceOf(addr1.address)).to.equal(amount);
    });

    it("Should reject mint from non-owner", async function () {
      const { token, addr1 } = await loadFixture(deployFixture);
      const amount = ethers.parseEther("100");
      await expect(
        token.connect(addr1).mint(addr1.address, amount)
      ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
    });
  });

  describe("Burning", function () {
    it("Should allow holder to burn their tokens", async function () {
      const { token, owner } = await loadFixture(deployFixture);
      const burnAmount = ethers.parseEther("100");
      await token.burn(burnAmount);
      expect(await token.balanceOf(owner.address)).to.equal(
        INITIAL_SUPPLY - burnAmount
      );
    });

    it("Should allow burning via burnFrom with allowance", async function () {
      const { token, owner, addr1 } = await loadFixture(deployFixture);
      const burnAmount = ethers.parseEther("50");
      await token.approve(addr1.address, burnAmount);
      await token.connect(addr1).burnFrom(owner.address, burnAmount);
      expect(await token.balanceOf(owner.address)).to.equal(
        INITIAL_SUPPLY - burnAmount
      );
    });
  });

  describe("Pausing", function () {
    it("Should allow owner to pause and unpause", async function () {
      const { token } = await loadFixture(deployFixture);
      await token.pause();
      expect(await token.paused()).to.be.true;
      await token.unpause();
      expect(await token.paused()).to.be.false;
    });

    it("Should reject pause from non-owner", async function () {
      const { token, addr1 } = await loadFixture(deployFixture);
      await expect(
        token.connect(addr1).pause()
      ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
    });

    it("Should block transfers when paused", async function () {
      const { token, addr1 } = await loadFixture(deployFixture);
      await token.pause();
      await expect(
        token.transfer(addr1.address, ethers.parseEther("10"))
      ).to.be.revertedWithCustomError(token, "EnforcedPause");
    });
  });

  describe("Transfers", function () {
    it("Should transfer tokens between accounts", async function () {
      const { token, owner, addr1 } = await loadFixture(deployFixture);
      const amount = ethers.parseEther("100");
      await token.transfer(addr1.address, amount);
      expect(await token.balanceOf(addr1.address)).to.equal(amount);
      expect(await token.balanceOf(owner.address)).to.equal(
        INITIAL_SUPPLY - amount
      );
    });

    it("Should fail if sender has insufficient balance", async function () {
      const { token, addr1, addr2 } = await loadFixture(deployFixture);
      await expect(
        token.connect(addr1).transfer(addr2.address, ethers.parseEther("1"))
      ).to.be.revertedWithCustomError(token, "ERC20InsufficientBalance");
    });
  });
});
