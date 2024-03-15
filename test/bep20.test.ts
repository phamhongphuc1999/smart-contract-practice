import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Bep20Token__factory } from '../typechain';

describe('Bep20', function () {
  async function deploy() {
    const etherSigner = ethers.provider.getSigner();
    const [owner, addr1, addr2] = await ethers.getSigners();
    const token = await new Bep20Token__factory(etherSigner).deploy(1000);
    return { owner, addr1, addr2, token };
  }

  describe('Deployment', function () {
    it('Should set right owner', async function () {
      const { owner, token } = await loadFixture(deploy);
      const _owner = await token.owner();
      expect(owner.address).to.equal(_owner);
      const name = await token.name();
      expect(name).to.equal('Bep20Test');
      const symbol = await token.symbol();
      expect(symbol).to.equal('PHP');
      const ownerBalance = await token.balanceOf(owner.address);
      expect(ownerBalance).to.equal(1000);
    });
  });

  describe('Transactions', function () {
    it('Should transfer tokens between accounts', async function () {
      const { owner, addr1, addr2, token } = await loadFixture(deploy);
      await expect(token.transfer(addr1.address, 50)).to.changeTokenBalances(
        token,
        [owner, addr1],
        [-50, 50]
      );
      await expect(token.connect(addr1).transfer(addr2.address, 50)).to.changeTokenBalances(
        token,
        [addr1, addr2],
        [-50, 50]
      );
    });
    it('Should emit Transfer events', async function () {
      const { token, owner, addr1, addr2 } = await loadFixture(deploy);
      await expect(token.transfer(addr1.address, 50)).to.changeTokenBalances(
        token,
        [owner, addr1],
        [-50, 50]
      );
      await expect(token.connect(addr1).transfer(addr2.address, 50))
        .to.emit(token, 'Transfer')
        .withArgs(addr1.address, addr2.address, 50);
    });
    it('Approve', async function () {
      const { token, owner, addr1, addr2 } = await loadFixture(deploy);
      await token.approve(addr2.address, 100);
      let allowance = await token.allowance(owner.address, addr2.address);
      expect(allowance).to.equal(100);
      await token.connect(addr2).transferFrom(owner.address, addr1.address, 90);
      allowance = await token.allowance(owner.address, addr2.address);
      expect(allowance).to.equal(10);
    });
  });
});
