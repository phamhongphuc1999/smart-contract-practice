import { ethers } from 'hardhat';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Coin__factory } from '../typechain';

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account: ', deployer.address);
  console.log('Account balance: ', (await deployer.getBalance()).toString());
  const ethersSigner = ethers.provider.getSigner();
  const token = await new Coin__factory(ethersSigner).deploy();
  console.log('token address: ', token.address);
  const fileName = `ignore_${Date.now()}_addresses`;
  const deployedAddresses = {
    lock: token.address,
  };
  writeFileSync(resolve(`./scripts/${fileName}`), JSON.stringify(deployedAddresses), 'utf-8');
}

main()
  .then(() => process.exit(0))
  .catch((error: any) => {
    console.error(error);
    process.exit(1);
  });
