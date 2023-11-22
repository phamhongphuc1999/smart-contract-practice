import { Interface } from '@ethersproject/abi';
import { ethers } from 'hardhat';
import { Coin__factory, CreateTwo__factory } from '../../typechain';

const salt = '0x'.padEnd(66, '0');

async function deployCreate2() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account: ', deployer.address);
  const ethersSigner = ethers.provider.getSigner();
  const createTwo = await new CreateTwo__factory(ethersSigner).deploy();
  console.log('Create two address: ', createTwo.address);
  const tx = await createTwo.deploy(Coin__factory.bytecode, salt);
  await tx.wait();
  const predictedAddress = await createTwo.computeAddress(Coin__factory.bytecode, salt);
  console.log('Predicted address: ', predictedAddress);
  const coinFactory = await ethers.getContractFactory('Coin');
  const predictedCoin = coinFactory.attach(predictedAddress).connect(deployer.address);
  const miner = await predictedCoin.minter();
  console.log('miner: ', miner);
}

async function deployByExecute() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account: ', deployer.address);
  const ethersSigner = ethers.provider.getSigner();
  const createTwo = await new CreateTwo__factory(ethersSigner).deploy();
  const createTwoInter = await new Interface(CreateTwo__factory.abi);
  const callData = createTwoInter.encodeFunctionData('deploy', [Coin__factory.bytecode, salt]);
  const tx = await createTwo.delegateExecute(createTwo.address, callData);
  await tx.wait();
  const predictedAddress = await createTwo.computeAddress(Coin__factory.bytecode, salt);
  console.log('Predicted address: ', predictedAddress);
  const coinFactory = await ethers.getContractFactory('Coin');
  const predictedCoin = coinFactory.attach(predictedAddress).connect(deployer.address);
  const miner = await predictedCoin.minter();
  console.log('miner: ', miner);
}

async function callDelegate() {
  // It certainly wrong because delegate use storage of createTwo and then it can not read balances in coin contract
  const [deployer, addr1] = await ethers.getSigners();
  console.log('Deploying contracts with the account: ', deployer.address);
  const ethersSigner = ethers.provider.getSigner();
  const createTwo = await new CreateTwo__factory(ethersSigner).deploy();
  const coin = await new Coin__factory(ethersSigner).deploy();
  const tx = await coin.mint(deployer.address, 1000);
  await tx.wait();
  console.log('Create two address: ', createTwo.address);
  console.log('Coin address: ', coin.address);
  const coinInter = await new Interface(Coin__factory.abi);
  const callData = coinInter.encodeFunctionData('transfer', [addr1.address, 50]);
  const tx1 = await createTwo.delegateExecute(coin.address, callData);
  await tx1.wait();
}

async function main() {
  await callDelegate();
}

main()
  .then(() => process.exit(0))
  .catch((error: any) => {
    console.error(error);
    process.exit(1);
  });
