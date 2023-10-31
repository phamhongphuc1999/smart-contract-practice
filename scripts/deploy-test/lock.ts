import { BigNumber, Contract, ethers } from 'ethers';
import { ethers as hEthers } from 'hardhat';
import LockAbi from '../../artifacts/contracts/Lock.sol/Lock.json';

async function get(rpcUrl: string) {
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const contract = new Contract(
    '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    LockAbi.abi,
    provider
  );
  const owner = await contract.owner();
  console.log('owner: ', owner);
  const signers = await hEthers.getSigners();

  const signContract = new Contract(
    '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    LockAbi.abi,
    provider
  );

  let signer = signContract.connect(signers[1]);
  const tx = await signer.withdraw();
  const receipt = await tx.wait();
  console.log('receipt', receipt);
  const _balance = await signers[1].getBalance();
  console.log(BigNumber.from(_balance).div(BigNumber.from('10').pow(18)));
}

async function main() {
  await get('http://127.0.0.1:8545/');
}

main();
