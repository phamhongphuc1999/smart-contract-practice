import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig } from "hardhat/config";
import "@typechain/hardhat";

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
};

export default config;
