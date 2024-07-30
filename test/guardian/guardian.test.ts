import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Guardian__factory } from '../../typechain';
import { generateCalldata, generatePoseidonHash, generateProof, verifyProof } from './utils';

describe('Guradian', function () {
  async function deployGuardian() {
    const etherSigner = ethers.provider.getSigner();
    const [owner] = await ethers.getSigners();
    const guardian = await new Guardian__factory(etherSigner).deploy();
    return { guardian, owner };
  }
  describe('Interaction', function () {
    it('Should add guardians', async function () {
      const { guardian } = await loadFixture(deployGuardian);
      const _account1 = '0x9A85752B25Cb26a1E42f8E095588e4647859Bc36';
      const _account2 = '0xac7367fe5423f5134039b446D4B9dD9C06f57826';
      const _account3 = '0x0E043E83C116546737b49d0887d6CCe29f7bFD4d';

      const _hash1 = await generatePoseidonHash(_account1, 'hex');
      const _hash2 = await generatePoseidonHash(_account2, 'hex');
      const _hash3 = await generatePoseidonHash(_account3, 'hex');

      await guardian.addGuardian(_hash1);
      await guardian.addGuardian(_hash2);
      await guardian.addGuardian(_hash3);
      const _guardian1 = await guardian.getGuardian(0);
      expect(_guardian1).to.be.eq(_hash1);
      const _guardian3 = await guardian.getGuardian(2);
      expect(_guardian3).to.be.eq(_hash3);
    });
    it('Should execute', async function () {
      const { guardian } = await loadFixture(deployGuardian);
      const _account1 = '0x9A85752B25Cb26a1E42f8E095588e4647859Bc36';
      const _account2 = '0xac7367fe5423f5134039b446D4B9dD9C06f57826';
      const _account3 = '0x0E043E83C116546737b49d0887d6CCe29f7bFD4d';

      const _hash1 = await generatePoseidonHash(_account1, 'hex');
      const _hash2 = await generatePoseidonHash(_account2, 'hex');
      const _hash3 = await generatePoseidonHash(_account3, 'hex');

      await guardian.addGuardian(_hash1);
      await guardian.addGuardian(_hash2);
      await guardian.addGuardian(_hash3);
      const _guardian1 = await guardian.getGuardian(0);
      expect(_guardian1).to.be.eq(_hash1);
      const _guardian3 = await guardian.getGuardian(2);
      expect(_guardian3).to.be.eq(_hash3);

      let _counter = await guardian.counter();
      expect(_counter).to.eq(0);
      let _proof = await generateProof(_account1);
      let _verify = await verifyProof(_proof.proof, _proof.publicSignals);
      expect(_verify).to.be.true;
      if (_verify) {
        const { pA, pB, pC, pubSignals } = await generateCalldata(
          _proof.proof,
          _proof.publicSignals
        );
        await guardian.verifyGuardian(pA, pB, pC, pubSignals);
        _counter = await guardian.counter();
        expect(_counter).to.eq(1);
      }

      _proof = await generateProof(_account1);
      _verify = await verifyProof(_proof.proof, _proof.publicSignals);
      expect(_verify).to.be.true;
      if (_verify) {
        const { pA, pB, pC, pubSignals } = await generateCalldata(
          _proof.proof,
          _proof.publicSignals
        );
        await guardian.verifyGuardian(pA, pB, pC, pubSignals);
        _counter = await guardian.counter();
        expect(_counter).to.eq(2);
      }
    });
  });
});
