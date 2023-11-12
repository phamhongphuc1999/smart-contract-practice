import { ContractFactory } from 'ethers';
import { ethers } from 'hardhat';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import CoinAbi from '../artifacts/contracts/Coin.sol/Coin.json';

async function localDeploy() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account: ', deployer.address);
  console.log('Account balance: ', (await deployer.getBalance()).toString());
  const factory = new ContractFactory(CoinAbi.abi, CoinAbi.bytecode);
  const etherSigner = ethers.provider.getSigner();
  const contract = await factory.connect(etherSigner).deploy({ gasLimit: 1000000 });
  const fileName = `ignore_${Date.now()}_coinEther_addresses`;
  const deployedAddresses = {
    address: contract.address,
  };
  writeFileSync(resolve(`./scripts/${fileName}`), JSON.stringify(deployedAddresses), 'utf-8');
  const tx = await contract.deployTransaction.wait();
  console.log('🚀 ~ file: coin-ether-deploy.ts:20 ~ localDeploy ~ tx:', tx);
}

async function main() {
  await localDeploy();
}

main()
  .then(() => process.exit(0))
  .catch((error: any) => {
    console.error(error);
    process.exit(1);
  });
