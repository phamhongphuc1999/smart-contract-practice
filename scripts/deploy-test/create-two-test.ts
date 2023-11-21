import { ethers } from 'hardhat';
import { Coin__factory, CreateTwo__factory } from '../../typechain';
import { Interface } from '@ethersproject/abi';
import { parseEther } from 'ethers/lib/utils';

async function deployCreate2() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account: ', deployer.address);
  const ethersSigner = ethers.provider.getSigner();
  const createTwo = await new CreateTwo__factory(ethersSigner).deploy();
  console.log('Create two address: ', createTwo.address);
  const salt = '0x'.padEnd(66, '0');
  const tx = await createTwo.deploy(Coin__factory.bytecode, salt);
  await tx.wait();
  const predictedAddress = await createTwo.computeAddress(Coin__factory.bytecode, salt);
  console.log('Predicted address: ', predictedAddress);
  const coinFactory = await ethers.getContractFactory('Coin');
  const predictedCoin = coinFactory.attach(predictedAddress).connect(deployer.address);
  const miner = await predictedCoin.minter();
  console.log('miner: ', miner);
}

async function testExecute() {
  const [deployer, addr1, addr2] = await ethers.getSigners();
  console.log('Deploying contracts with the account: ', deployer.address);
  console.log('address1: ', addr1.address);
  console.log('address2: ', addr2.address);
  const ethersSigner = ethers.provider.getSigner();
  const createTwo = await new CreateTwo__factory(ethersSigner).deploy();
  const coin = await new Coin__factory(ethersSigner).deploy();
  await coin.mint(deployer.address, 1000);
  console.log('Create two address: ', createTwo.address);
  const coinInter = new Interface(Coin__factory.abi);
  const beforeBalance = await coin.balanceOf(addr1.address);
  console.log('beforeBalance: ', beforeBalance);
  const callData = coinInter.encodeFunctionData('transfer', [addr1.address, 1]);
  console.log('🚀 ~ file: create-two-test.ts:38 ~ testExecute ~ callData:', callData);
  const tx = await createTwo.execute(coin.address, parseEther('1'), callData);
  const receipt = await tx.wait();
  console.log('🚀 ~ file: create-two-test.ts:37 ~ testExecute ~ receipt:', receipt);
  const afterBalance = await coin.balanceOf(addr1.address);
  console.log('afterBalance: ', afterBalance);
}

async function main() {
  await testExecute();
}

main()
  .then(() => process.exit(0))
  .catch((error: any) => {
    console.error(error);
    process.exit(1);
  });
