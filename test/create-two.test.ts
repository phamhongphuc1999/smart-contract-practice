import { Interface } from '@ethersproject/abi';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Coin__factory, CreateTwo__factory } from '../typechain';

const salt = '0x'.padEnd(66, '0');

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
      const predictedAddress = await createTwo.computeAddress(Coin__factory.bytecode, salt);
      let isDeploy = await createTwo.isDeploy(Coin__factory.bytecode, salt);
      expect(isDeploy).to.equal(false);
      const tx = await createTwo.deploy(Coin__factory.bytecode, salt);
      await tx.wait();
      isDeploy = await createTwo.isDeploy(Coin__factory.bytecode, salt);
      expect(isDeploy).to.equal(true);
      const predictedAddress1 = await createTwo.computeAddress(Coin__factory.bytecode, salt);
      expect(predictedAddress).to.equal(predictedAddress1);
      const coinFactory = await ethers.getContractFactory('Coin');
      const coin = coinFactory.attach(predictedAddress).connect(owner.address);
      const miner = await coin.minter();
      expect(miner).to.equal(createTwo.address);
    });
    it('Should deploy a coin use delegate', async function () {
      const { createTwo, owner } = await loadFixture(deployCreateTwo);
      const predictedAddress = await createTwo.computeAddress(Coin__factory.bytecode, salt);
      let isDeploy = await createTwo.isDeploy(Coin__factory.bytecode, salt);
      expect(isDeploy).to.equal(false);
      const createTwoInter = await new Interface(CreateTwo__factory.abi);
      const callData = createTwoInter.encodeFunctionData('deploy', [Coin__factory.bytecode, salt]);
      const tx = await createTwo.delegateExecute(createTwo.address, callData);
      await tx.wait();
      isDeploy = await createTwo.isDeploy(Coin__factory.bytecode, salt);
      expect(isDeploy).to.equal(true);
      const coinFactory = await ethers.getContractFactory('Coin');
      const coin = coinFactory.attach(predictedAddress).connect(owner.address);
      const miner = await coin.minter();
      expect(miner).to.equal(createTwo.address);
    });
    it('Should deploy many coin', async function () {
      const { createTwo, owner } = await loadFixture(deployCreateTwo);
      const salt1 = '0x'.padEnd(66, '0');
      const salt2 = '0x'.padEnd(66, '1');
      const predictedAddress1 = await createTwo.computeAddress(Coin__factory.bytecode, salt1);
      const predictedAddress2 = await createTwo.computeAddress(Coin__factory.bytecode, salt2);
      let isDeploy1 = await createTwo.isDeploy(Coin__factory.bytecode, salt1);
      let isDeploy2 = await createTwo.isDeploy(Coin__factory.bytecode, salt2);
      expect(isDeploy1 && isDeploy2).to.equal(false);

      let tx = await createTwo.deploy(Coin__factory.bytecode, salt1);
      await tx.wait();

      const createTwoInter = await new Interface(CreateTwo__factory.abi);
      const callData = createTwoInter.encodeFunctionData('deploy', [Coin__factory.bytecode, salt2]);
      tx = await createTwo.delegateExecute(createTwo.address, callData);
      await tx.wait();

      isDeploy1 = await createTwo.isDeploy(Coin__factory.bytecode, salt1);
      isDeploy2 = await createTwo.isDeploy(Coin__factory.bytecode, salt2);
      expect(isDeploy1 && isDeploy2).to.equal(true);

      const coinFactory = await ethers.getContractFactory('Coin');
      const coin1 = coinFactory.attach(predictedAddress1).connect(owner.address);
      const coin2 = coinFactory.attach(predictedAddress2).connect(owner.address);
      const miner1 = await coin1.minter();
      const miner2 = await coin2.minter();
      expect(miner1).to.equal(createTwo.address);
      expect(miner2).to.equal(createTwo.address);
    });
  });

  describe('Execute', function () {
    it('Execute a view function', async function () {
      const { createTwo, owner } = await loadFixture(deployCreateTwo);
      const ethersSigner = ethers.provider.getSigner();
      const coin = await new Coin__factory(ethersSigner).deploy();
      const coinInter = await new Interface(Coin__factory.abi);
      const callData = coinInter.encodeFunctionData('totalSupply', []);
      let result = await createTwo.staticExecute(coin.address, callData);
      let decodedResult = coinInter.decodeFunctionResult('totalSupply', result);
      expect(decodedResult[0]).to.equal(0);

      const tx = await coin.mint(owner.address, 1000);
      await tx.wait();

      result = await createTwo.staticExecute(coin.address, callData);
      decodedResult = coinInter.decodeFunctionResult('totalSupply', result);
      expect(decodedResult[0]).to.equal(1000);
    });
    it('Execute a view function having parameters', async function () {
      const { createTwo, owner } = await loadFixture(deployCreateTwo);
      const ethersSigner = ethers.provider.getSigner();
      const coin = await new Coin__factory(ethersSigner).deploy();
      const coinInter = await new Interface(Coin__factory.abi);
      const callData = coinInter.encodeFunctionData('balanceOf', [owner.address]);
      let result = await createTwo.staticExecute(coin.address, callData);
      let decodedResult = coinInter.decodeFunctionResult('balanceOf', result);
      expect(decodedResult[0]).to.equal(0);

      const tx = await coin.mint(owner.address, 1000);
      await tx.wait();

      result = await createTwo.staticExecute(coin.address, callData);
      decodedResult = coinInter.decodeFunctionResult('balanceOf', result);
      expect(decodedResult[0]).to.equal(1000);
    });
  });
});
