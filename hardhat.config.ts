import '@nomicfoundation/hardhat-toolbox';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'hardhat-prettier';
import { HardhatUserConfig } from 'hardhat/config';
import 'solidity-coverage';
import { DEPLOY_ACCOUNT } from './constants';

const config: HardhatUserConfig = {
  solidity: '0.8.18',
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v5',
  },
  gasReporter: {
    enabled: false,
  },
  defaultNetwork: 'hardhat',
  networks: {
    bscTestnet: {
      url: 'https://data-seed-prebsc-2-s2.binance.org:8545/',
      chainId: 97,
      accounts: DEPLOY_ACCOUNT ? [DEPLOY_ACCOUNT] : [],
    },
    sepolia: {
      url: 'https://rpc.sepolia.org',
      chainId: 11155111,
      accounts: DEPLOY_ACCOUNT ? [DEPLOY_ACCOUNT] : [],
    },
    hardhat: {
      accounts: {
        count: 9,
      },
      hardfork: 'london',
      forking: {
        url: 'https://bsc.api.pocket.network',
        blockNumber: 71713447,
      },
      chains: {
        56: {
          hardforkHistory: {
            shanghai: 0,
          },
        },
      },
    },
  },
  // gasReporter: {
  //   enabled: true,
  //   currency: 'BNB',
  // },
};

export default config;
