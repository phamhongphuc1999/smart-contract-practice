import { ethers } from 'hardhat';
import { Coin__factory } from '../typechain';

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account: ', deployer.address);
  console.log('Account balance: ', (await deployer.getBalance()).toString());
  const ethersSigner = ethers.provider.getSigner();
  const token = await new Coin__factory(ethersSigner).deploy();
  console.log('Token address: ', token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error: any) => {
    console.error(error);
    process.exit(1);
  });
