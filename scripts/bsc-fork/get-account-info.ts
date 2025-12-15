import { ethers, network } from 'hardhat';

async function main() {
  const address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

  const provider = ethers.provider;

  const balance = await provider.getBalance(address);
  const nonce = await provider.getTransactionCount(address);
  const code = await provider.getCode(address);

  console.log('Account information');
  console.log('-------------------');
  console.log('Address :', address);
  console.log('Balance :', ethers.utils.formatEther(balance), 'BNB');
  console.log('Nonce   :', nonce);
  console.log('Type    :', code === '0x' ? 'EOA (wallet)' : 'Contract');
  console.log('Code size:', code === '0x' ? 0 : (code.length - 2) / 2, 'bytes');
}

main()
  .then(() => process.exit(0))
  .catch((error: any) => {
    console.error(error);
    process.exit(1);
  });
