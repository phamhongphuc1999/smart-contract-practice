import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Coin__factory } from '../typechain';

describe('Coin contract', function () {
  async function deployToken() {
    const etherSigner = ethers.provider.getSigner();
    const [owner, addr1, addr2] = await ethers.getSigners();
    const coin = await new Coin__factory(etherSigner).deploy();
    await coin.mint(owner.address, 1000);
    return { coin, owner, addr1, addr2 };
  }

  describe('Deployment', function () {
    it('Should set right owner', async function () {
      const { owner, coin } = await loadFixture(deployToken);
      const minter = await coin.minter();
      expect(minter).to.equal(owner.address);
      const ownerBalance = await coin.balanceOf(owner.address);
      expect(ownerBalance).to.equal(1000);
    });
  });

  describe('Transactions', function () {
    it('Should transfer tokens between accounts', async function () {
      const { owner, addr1, addr2, coin } = await loadFixture(deployToken);
      await expect(coin.send(addr1.address, 50)).to.changeTokenBalances(
        coin,
        [owner, addr1],
        [-50, 50]
      );
      await expect(
        coin.connect(addr1).send(addr2.address, 50)
      ).to.changeTokenBalances(coin, [addr1, addr2], [-50, 50]);
    });
    it('Should emit Transfer events', async function () {
      const { coin, owner, addr1, addr2 } = await loadFixture(deployToken);
      await expect(coin.send(addr1.address, 50)).to.changeTokenBalances(
        coin,
        [owner, addr1],
        [-50, 50]
      );
      await expect(coin.connect(addr1).send(addr2.address, 50))
        .to.emit(coin, 'Sent')
        .withArgs(addr1.address, addr2.address, 50);
    });
    it("Should fail if sender doesn't have enough tokens", async function () {
      const { owner, coin, addr1 } = await loadFixture(deployToken);
      const ownerBalance = await coin.balanceOf(owner.address);
      await expect(coin.connect(addr1).send(owner.address, 1))
        .to.be.revertedWithCustomError(coin, 'InsufficientBalance')
        .withArgs(1, 0);
      expect(await coin.balanceOf(owner.address)).to.equal(ownerBalance);
    });
  });
});
