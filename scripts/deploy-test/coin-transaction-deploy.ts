import { Interface, concat, hexlify } from 'ethers/lib/utils';
import { ethers } from 'hardhat';
import { Coin__factory } from '../../typechain';

async function deployByTransaction() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account: ', deployer.address);
  const coinInter = new Interface(Coin__factory.abi);
  const constructorEncodedData = coinInter.encodeDeploy([]);
  const callData = hexlify(concat([Coin__factory.bytecode, constructorEncodedData]));
  const tx = await deployer.sendTransaction({ value: '0x00', data: callData });
  const receipt = await tx.wait();
  console.log('Real address: ', receipt.contractAddress);
  const nonce = tx.nonce;
  const predictedAddress = ethers.utils.getContractAddress({
    from: deployer.address,
    nonce,
  });
  console.log('Predicted address: ', predictedAddress);
  const coinFactory = await ethers.getContractFactory('Coin');
  const coin = coinFactory.attach(predictedAddress).connect(deployer.address);
  const miner = await coin.minter();
  console.log('miner: ', miner);
}

async function deploy() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account: ', deployer.address);
  const nonce = await ethers.provider.getTransactionCount(deployer.address);
  const ethersSigner = ethers.provider.getSigner();
  const token = await new Coin__factory(ethersSigner).deploy();
  console.log('Real address: ', token.address);
  const predictedAddress = ethers.utils.getContractAddress({
    from: deployer.address,
    nonce,
  });
  console.log('Predicted address: ', predictedAddress);
  const miner = await token.minter();
  console.log('miner: ', miner);
}

async function main() {
  await deploy();
}

main()
  .then(() => process.exit(0))
  .catch((error: any) => {
    console.error(error);
    process.exit(1);
  });
