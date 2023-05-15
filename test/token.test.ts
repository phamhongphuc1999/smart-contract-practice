import { expect } from "chai";
import { ethers } from "hardhat";
import { Token__factory } from "../typechain";

describe("Token contract", function () {
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const ethersSigner = ethers.provider.getSigner();
    const [owner] = await ethers.getSigners();
    const token = await new Token__factory(ethersSigner).deploy();
    const ownerBalance = await token.balanceOf(owner.address);
    expect(await token.totalSupply()).to.equal(ownerBalance);
  });

  it("Should transfer tokens between accounts", async function () {
    const ethersSigner = ethers.provider.getSigner();
    const [owner, addr1, addr2] = await ethers.getSigners();
    const token = await new Token__factory(ethersSigner).deploy();
    await token.transfer(addr1.address, 50);
    expect(await token.balanceOf(addr1.address)).to.equal(50);
    await token.connect(addr1).transfer(addr2.address, 50);
    expect(await token.balanceOf(addr2.address)).to.equal(50);
  });
});
