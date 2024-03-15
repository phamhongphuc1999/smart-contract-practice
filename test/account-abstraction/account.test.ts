import { Wallet } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { ethers } from 'hardhat';
import { ETH_1, createAccount, createAccountOwner } from '../utils';

describe('Account test', function () {
  const entryPoint = '0x'.padEnd(42, '2');
  let accounts: string[];
  let accountOwner: Wallet;
  const ethersSigner = ethers.provider.getSigner();

  before(async function () {
    accounts = await ethers.provider.listAccounts();
    if (accounts.length < 2) this.skip();
    accountOwner = createAccountOwner(0);
  });

  it('Owner should be able to call transfer', async function () {
    const { proxy: account } = await createAccount(ethersSigner, accounts[0], entryPoint);
    await ethersSigner.sendTransaction({
      from: accounts[0],
      to: account.address,
      value: parseEther('2'),
    });
    await account.execute(accounts[2], ETH_1, '0x');
  });
  // it('Other account should not be able to call transfer', async () => {
  //   const { proxy: account } = await createAccount(
  //     ethers.provider.getSigner(),
  //     accounts[0],
  //     entryPoint
  //   );
  //   await expect(
  //     account.connect(ethers.provider.getSigner(1)).execute(accounts[2], ETH_1, '0x')
  //   ).to.be.revertedWith('account: not Owner or EntryPoint');
  // });
  // describe('#validateUserOp', async () => {
  //   let account: Account;
  //   let userOp: UserOperation;
  //   let userOpHash: string;
  //   let preBalance: number;
  //   let expectedPay: number;

  //   const actualGasPrice = 1e9;

  //   before(async () => {
  //     const entryPoint = accounts[2];
  //     ({ proxy: account } = await createAccount(
  //       await ethers.getSigner(entryPoint),
  //       accountOwner.address,
  //       entryPoint
  //     ));
  //     await ethersSigner.sendTransaction({
  //       from: accounts[0],
  //       to: account.address,
  //       value: parseEther('2'),
  //     });
  //     const callGasLimit = 200000;
  //     const verificationGasLimit = 100000;
  //     const maxFeePerGas = 3e9;
  //     const chainId = await ethers.provider.getNetwork().then((net) => net.chainId);

  //     userOp = signUserOp(
  //       fillUserOpDefault({
  //         sender: account.address,
  //         callGasLimit,
  //         verificationGasLimit,
  //         maxFeePerGas,
  //       }),
  //       accountOwner,
  //       entryPoint,
  //       chainId
  //     );
  //     userOpHash = getUserOpHash(userOp, entryPoint, chainId);
  //     expectedPay = actualGasPrice * (callGasLimit + verificationGasLimit);
  //     preBalance = await getBalance(account.address);
  //     const ret = await account.validateUserOp(userOp, userOpHash, expectedPay, {
  //       gasPrice: actualGasPrice,
  //     });
  //     await ret.wait();
  //   });
  //   it('Should pay', async () => {
  //     const postBalance = await getBalance(account.address);
  //     expect(preBalance - postBalance).to.eq(expectedPay);
  //   });
  //   it('Should increment nonce', async () => {
  //     console.log('12333', await account.getNonce());
  //     expect(await account.getNonce()).to.eq(1);
  //   });
  //   it('Should reject same tx on nonce error', async () => {
  //     await expect(account.validateUserOp(userOp, userOpHash, 0)).to.revertedWith('invalid nonce');
  //   });
  //   it('Should return NO_SIG_VALIDATION on wrong signature', async () => {
  //     const userOpHash = HashZero;
  //     const deadline = await account.callStatic.validateUserOp(
  //       { ...userOp, nonce: 1 },
  //       userOpHash,
  //       0
  //     );
  //     expect(deadline).to.eq(1);
  //   });
  // });
  // describe('Execution', function () {
  //   it('Call a view function', async function () {
  //     const { proxy: account } = await createAccount(ethersSigner, accounts[0], entryPoint);
  //     const accountInter = new Interface(Account__factory.abi);
  //     let callData = accountInter.encodeFunctionData('nonce', []);
  //     let result = await account.staticExecute(account.address, callData);
  //     let decodedResult = accountInter.decodeFunctionResult('nonce', result);
  //     expect(decodedResult[0]).to.equal(0);

  //     callData = accountInter.encodeFunctionData('guardianManager', []);
  //     result = await account.staticExecute(account.address, callData);
  //     decodedResult = accountInter.decodeFunctionResult('guardianManager', result);
  //     expect(decodedResult[0]).to.equal(AddressZero);
  //   });
  // });
});
