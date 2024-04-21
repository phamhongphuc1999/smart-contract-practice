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
          '0x0adaf8465b4d7afe803afc91408298cfa7d5d0eb8d8033b5ccbd3e1b05dff43a',
          '0x1a1c7c0e37cca093b7c3839572d3cdffd24e2b490cc2b9d9f2e0a453d185d814',
        ],
        [
          [
            '0x2ed175ee57f2c0fc34dbd3bed762626d310c5939e617f3e0e9300ef708ae956f',
            '0x2b3ddf63bbd8023c9278e2bac0f679668389a48d15a6ee765224f1648d99e4d7',
          ],
          [
            '0x10263cd9a4fb78f5337500e5407352f997ec5aa7d2edae03a0d8f2b572dfb890',
            '0x1796280a60dc7929646c913f8c151eaa362f2032d8125e2f8ddfff5dceb981e8',
          ],
        ],
        [
          '0x000540489a8a26b503c050065c43a5a50c0e3e6e2b1470ad2e9da38b6fb841d0',
          '0x07940a3849b5cdbf8a2f66742118cab2eef37b08d103607ee2f7be07b8dce685',
        ],
        ['0x0000000000000000000000000000000000000000000000000000000000000001']
      );
      expect(isVerify).to.equal(true);
    });
  });
});
