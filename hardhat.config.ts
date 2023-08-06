import '@nomicfoundation/hardhat-toolbox';
import { HardhatUserConfig } from 'hardhat/config';
import '@typechain/hardhat';
import 'hardhat-prettier';

// const INFURA_API_KEY = 'KEY';
// const SEPOLIA_PRIVATE_KEY = 'YOUR SEPOLIA PRIVATE KEY';

const config: HardhatUserConfig = {
  solidity: '0.8.18',
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v5',
  },
  // networks: {
  //   sepolia: {
  //     url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
  //     accounts: [SEPOLIA_PRIVATE_KEY],
  //   },
  // },
};

export default config;
