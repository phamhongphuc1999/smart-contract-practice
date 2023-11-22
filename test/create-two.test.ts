import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Coin__factory, CreateTwo__factory } from '../typechain';

describe('Create two', function () {
  async function deployCreateTwo() {
    const etherSigner = ethers.provider.getSigner();
    const [owner] = await ethers.getSigners();
    const createTwo = await new CreateTwo__factory(etherSigner).deploy();
    return { createTwo, owner };
  }

  describe('Deployment', function () {
    it('Should deploy a coin', async function () {
      const { createTwo, owner } = await loadFixture(deployCreateTwo);
      const salt = '0x'.padEnd(66, '0');
      const tx = await createTwo.deploy(Coin__factory.bytecode, salt);
      await tx.wait();
      const predictedAddress = await createTwo.computeAddress(Coin__factory.bytecode, salt);
      const coinFactory = await ethers.getContractFactory('Coin');
      const coin = coinFactory.attach(predictedAddress).connect(owner.address);
      const miner = await coin.minter();
      expect(miner).to.equal(owner.address);
    });
  });
});
