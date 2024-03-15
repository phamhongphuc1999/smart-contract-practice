import { BigNumber, Signer, Wallet } from 'ethers';
import { arrayify, keccak256 } from 'ethers/lib/utils';
import { ethers } from 'hardhat';
import {
  Account,
  AccountFactory,
  AccountFactory__factory,
  Account__factory,
} from '../../typechain';

export const AddressZero = ethers.constants.AddressZero;
export const HashZero = ethers.constants.HashZero;
export const ETH_1 = ethers.utils.parseEther('1');

export function createAccountOwner(salt: number): Wallet {
  const privateKey = keccak256(Buffer.from(arrayify(BigNumber.from(salt))));
  return new ethers.Wallet(privateKey, ethers.provider);
}

export async function createAccount(
  etherSigner: Signer,
  accountOwner: string,
  entrypoint: string,
  _factory?: AccountFactory
): Promise<{ proxy: Account; accountFactory: AccountFactory; implementation: string }> {
  const accountFactory =
    _factory ?? (await new AccountFactory__factory(etherSigner).deploy(entrypoint));
  const implementation = await accountFactory.accountImplementation();
  await accountFactory.createAccount(accountOwner, 0);
  const accountAddress = await accountFactory.getAddress(accountOwner, 0);
  const proxy = Account__factory.connect(accountAddress, etherSigner);
  return { implementation, accountFactory, proxy };
}

export function callDataCost(data: string): number {
  return ethers.utils
    .arrayify(data)
    .map((x) => (x === 0 ? 4 : 16))
    .reduce((sum, x) => x + sum);
}

export async function getBalance(address: string): Promise<number> {
  const balance = await ethers.provider.getBalance(address);
  return parseInt(balance.toString());
}
