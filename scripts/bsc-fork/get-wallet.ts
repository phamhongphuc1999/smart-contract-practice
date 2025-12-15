import { ethers, network } from 'hardhat';

async function main() {
  const signers = await ethers.getSigners();

  // Hardhat accounts config
  const accounts = network.config.accounts as {
    privateKey: string;
    balance: string;
  }[];

  console.log(`Found ${signers.length} default accounts:\n`);

  for (let i = 0; i < signers.length; i++) {
    const address = await signers[i].getAddress();
    const balance = await ethers.provider.getBalance(address);

    const pk = accounts?.[i]?.privateKey ?? '(not available)';

    console.log(`Account #${i}`);
    console.log(`  Address     : ${address}`);
    console.log(`  Private Key : ${pk}`);
    console.log(`  Balance     : ${ethers.utils.formatEther(balance)} BNB`);
    console.log('--------------------------------------------------');
  }
}

main()
  .then(() => process.exit(0))
  .catch((error: any) => {
    console.error(error);
    process.exit(1);
  });
