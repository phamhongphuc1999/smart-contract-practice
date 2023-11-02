import { BigNumber } from 'ethers';
import { ethers as hEthers } from 'hardhat';

async function get() {
  const accounts = await hEthers.getSigners();
  const signer = accounts[0];
  const factory = await hEthers.getContractFactory('Lock');
  const connection = factory.connect(signer);
  const contract = connection.attach('0x8C297868b804E49605F768EEA2892F1E39Ed99Eb');

  const owner = await contract.owner();
  console.log('owner: ', owner);

  const tx = await contract.withdraw();
  const receipt = await tx.wait();
  console.log('receipt', receipt);
  const _balance = await signer.getBalance();
  console.log(BigNumber.from(_balance).div(BigNumber.from('10').pow(18)));
}

async function main() {
  await get();
}

main();
