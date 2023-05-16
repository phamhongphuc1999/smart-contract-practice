import { expect } from "chai";
import { ethers } from "hardhat";
import { Token__factory } from "../typechain";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("Token contract", function () {
  async function deployToken() {
    const ethersSigner = ethers.provider.getSigner();
    const [owner, addr1, addr2] = await ethers.getSigners();
    const token = await new Token__factory(ethersSigner).deploy();
    return { token, owner, addr1, addr2 };
  }

  describe("Deployment", function () {
    it("Should set right owner", async function () {
      const { owner, token } = await loadFixture(deployToken);
      expect(await token.owner()).to.equal(owner.address);
    });
    it("Should assign the total supply of tokens to the owner", async function () {
      const { owner, token } = await loadFixture(deployToken);
      const ownerBalance = await token.balanceOf(owner.address);
      expect(await token.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      const { owner, addr1, addr2, token } = await loadFixture(deployToken);
      await expect(token.transfer(addr1.address, 50)).to.changeTokenBalances(token, [owner, addr1], [-50, 50]);
      await expect(token.connect(addr1).transfer(addr2.address, 50)).to.changeTokenBalances(token, [addr1, addr2], [-50, 50]);
    });
    it("Should emit Transfer events", async function () {
      const { token, owner, addr1, addr2 } = await loadFixture(deployToken);
      await expect(token.transfer(addr1.address, 50)).to.changeTokenBalances(token, [owner, addr1], [-50, 50]);
      await expect(token.connect(addr1).transfer(addr2.address, 50)).to.emit(token, "Transfer").withArgs(addr1.address, addr2.address, 50);
    });
    it("Should fail if sender doesn't have enough tokens", async function () {
      const { owner, token, addr1 } = await loadFixture(deployToken);
      const initialOwnerBalance = await token.balanceOf(owner.address);
      await expect(token.connect(addr1).transfer(owner.address, 1)).to.be.revertedWith("Not enough tokens");
      expect(await token.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });
  });
});
