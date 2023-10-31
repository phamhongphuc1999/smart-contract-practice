import { parseEther } from 'ethers/lib/utils';
import { ethers } from 'hardhat';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;

  const lockedAmount = parseEther('0.001').toString();
  const Lock = await ethers.getContractFactory('Lock');
  const lock = await Lock.deploy(unlockTime, { value: lockedAmount });
  await lock.deployed();
  const deployedAddresses = {
    lock: lock.address,
  };
  writeFileSync(
    resolve('./scripts/addresses.ts'),
    'export const deployedAddresses = ' + JSON.stringify(deployedAddresses),
    'utf-8'
  );
  console.log(`lock address: ${lock.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error: any) => {
    console.error(error);
    process.exit(1);
  });
