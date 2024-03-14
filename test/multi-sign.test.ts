import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { MultiSignWallet, MultiSignWallet__factory } from '../typechain';

describe('Multi Sign Wallet', function () {
  async function deployMultiSignWallet() {
    const etherSigner = ethers.provider.getSigner();
    const [owner1, owner2, owner3, addr1, addr2] = await ethers.getSigners();
    const multiSignWallet = await new MultiSignWallet__factory(etherSigner).deploy(
      [owner1.address, owner2.address, owner3.address],
      2
    );
    return { owner1, owner2, owner3, addr1, addr2, multiSignWallet };
  }

  it('Should deploy a coin', async function () {
    const { owner1, owner2, owner3, multiSignWallet } = await loadFixture(deployMultiSignWallet);
    const realOwner1 = await multiSignWallet.owners(0);
    expect(owner1.address).to.equal(realOwner1);
    const realOwner2 = await multiSignWallet.owners(1);
    expect(owner2.address).to.equal(realOwner2);
    const realOwner3 = await multiSignWallet.owners(2);
    expect(owner3.address).to.equal(realOwner3);
  });

  describe('Transaction', function () {
    let owner1: SignerWithAddress;
    let owner2: SignerWithAddress;
    let owner3: SignerWithAddress;
    let addr1: SignerWithAddress;
    let addr2: SignerWithAddress;
    let multiSignWallet: MultiSignWallet;

    before(async function () {
      const result = await loadFixture(deployMultiSignWallet);
      owner1 = result.owner1;
      owner2 = result.owner2;
      owner3 = result.owner3;
      addr1 = result.addr1;
      addr2 = result.addr2;
      multiSignWallet = result.multiSignWallet;
    });
    it('Should submit a transaction', async function () {
      await expect(multiSignWallet.connect(owner1).submitTransaction(addr1.address, 0, '0x00'))
        .to.emit(multiSignWallet, 'SubmitTransaction')
        .withArgs(owner1.address, 0, addr1.address, 0, '0x00');
      await expect(multiSignWallet.connect(owner2).submitTransaction(addr2.address, 0, '0x00'))
        .to.emit(multiSignWallet, 'SubmitTransaction')
        .withArgs(owner2.address, 1, addr2.address, 0, '0x00');
      const transactionCount = await multiSignWallet.getTransactionCount();
      expect(transactionCount).to.equal(2);
    });
    it('Should confirm transaction', async function () {
      await expect(multiSignWallet.connect(owner1).confirmTransaction(0))
        .to.emit(multiSignWallet, 'ConfirmTransaction')
        .withArgs(owner1.address, 0);
      await expect(multiSignWallet.connect(owner1).confirmTransaction(1))
        .to.emit(multiSignWallet, 'ConfirmTransaction')
        .withArgs(owner1.address, 1);
    });
    it('Should reject transaction without enough confirmation', async function () {
      await expect(multiSignWallet.connect(owner3).executeTransaction(0)).to.revertedWith(
        'cannot execute tx'
      );
      await expect(multiSignWallet.connect(owner2).executeTransaction(1)).to.revertedWith(
        'cannot execute tx'
      );
    });
    it('Should execute transaction', async function () {
      await expect(multiSignWallet.connect(owner1).confirmTransaction(0)).to.revertedWith(
        'tx already confirmed'
      );
      await expect(multiSignWallet.connect(owner2).confirmTransaction(0))
        .to.emit(multiSignWallet, 'ConfirmTransaction')
        .withArgs(owner2.address, 0);
      await expect(multiSignWallet.connect(owner3).executeTransaction(0))
        .to.emit(multiSignWallet, 'ExecuteTransaction')
        .withArgs(owner3.address, 0);
    });
    it('Should revoke transaction', async function () {
      await expect(multiSignWallet.connect(owner2).confirmTransaction(1))
        .to.emit(multiSignWallet, 'ConfirmTransaction')
        .withArgs(owner2.address, 1);
      await expect(multiSignWallet.connect(owner3).confirmTransaction(1))
        .to.emit(multiSignWallet, 'ConfirmTransaction')
        .withArgs(owner3.address, 1);
      await expect(multiSignWallet.connect(owner2).revokeConfirmation(1))
        .to.emit(multiSignWallet, 'RevokeConfirmation')
        .withArgs(owner2.address, 1);
      await expect(multiSignWallet.connect(owner1).revokeConfirmation(0)).to.revertedWith(
        'tx already executed'
      );
    });
  });
});
