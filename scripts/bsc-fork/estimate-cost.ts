import { ethers, network } from 'hardhat';
import ABI from './FourmemeTokenManagerHelper3.json';
import BigNumber from 'bignumber.js';

const TOKEN_ADDRESS = '0x48fc55854700cc7aa055eb4be583769c779d4444';
// const TOKEN_ADDRESS = '0x5ecff415738b43fb97dbde26df9f45dfbb0f4444';
const FOURMEME_TOKEN_MANAGER_HELPER_3_ADDRESS = '0xf251f83e40a78868fcfa3fa4599dad6494e46034';
const DECIMAL = 18;

async function main() {
  const decimal = BigNumber('10').pow(DECIMAL);
  const provider = ethers.provider;
  const fourMemeContract = new ethers.Contract(
    FOURMEME_TOKEN_MANAGER_HELPER_3_ADDRESS,
    ABI,
    provider
  );
  const token = await fourMemeContract.getTokenInfo(TOKEN_ADDRESS);
  const offers = BigNumber(token[7].toString()).div(decimal).toNumber();
  const maxOffers = BigNumber(token[8].toString()).div(decimal).toNumber();
  const funds = BigNumber(token[9].toString()).div(decimal).toNumber();
  const maxFunds = BigNumber(token[10].toString()).div(decimal).toNumber();
  const liquidityAdded = token[11] as boolean;
  const quote = token[2] as string;
  console.log('🚀 ~ main ~ token:', offers, maxOffers, funds, maxFunds, liquidityAdded, quote);
  console.log(
    'Current progress:',
    Number(((maxOffers - offers) * 100000) / maxOffers) / 1000,
    ' % '
  );
}

main()
  .then(() => process.exit(0))
  .catch((error: any) => {
    console.error(error);
    process.exit(1);
  });
