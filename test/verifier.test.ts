import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Verifier__factory } from '../typechain';

describe('Verifier', function () {
  async function deployVerifier() {
    const etherSigner = ethers.provider.getSigner();
    const [owner] = await ethers.getSigners();
    const verifier = await new Verifier__factory(etherSigner).deploy();
    return { verifier, owner };
  }
  describe('Interaction', function () {
    it('Should successfully verify', async function () {
      const { verifier } = await loadFixture(deployVerifier);
      const isVerify = await verifier.verifyProof(
        [
          '0x22795bf08965a362b9e95bf3cf408e59a3f7ff5f13052b8e55003676e1ece8e2',
          '0x10e9d89d1f0cdf053c007fde36b6975ff9161da6b16e3d628700d62ca97ed7b0',
        ],
        [
          [
            '0x2031901bd478e8cc24a5d55c819ab83511d40d3aec65d11b5f5f109225d21f52',
            '0x13ed58153c361fbd2dd845e42467506fafe72e73932279738becedaeaf53b5db',
          ],
          [
            '0x02491417e5da847eb3fe9802dfec2a2aab61d631aece5f8c0192d9dbba99f7eb',
            '0x0f28db058c85e358e4dbf3aa85d95bd0a21364ccd88d1672d211570a936eb674',
          ],
        ],
        [
          '0x2e6582aae9ffe1b21c0f0f1a7d30dafb6a244eb574f0cc00da25a1ca4e017c2e',
          '0x15b3e50b925519c0afc5eea2906bfe44f01dbc07c45c3fcf70a7db6848ab514e',
        ],
        ['0x0000000000000000000000000000000000000000000000000000000000000001']
      );
      expect(isVerify).to.equal(true);
    });
  });
});
