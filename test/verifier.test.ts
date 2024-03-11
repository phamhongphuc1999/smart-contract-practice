import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { ethers } from 'hardhat';
import { Verifier__factory } from '../typechain';
import { expect } from 'chai';

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
          '0x117e92179fbb5507dc68393072d91d007a5874568aeafc193b72ca593b3df358',
          '0x2bd3856a7d4b3730fbefc1497533d91b724ae6b1d2e66cba4636ffe321a867ff',
        ],
        [
          [
            '0x1f1f9f29419b0ee4279f817ed5e0777963b1ee037e40e06707541b7b23e33df1',
            '0x0860a1fbeaad5e0598cb578967e1cd513e6523b287facd88217abcd4e6dd1136',
          ],
          [
            '0x1e97b41c7e38a04327cc4579ff5a84c954dcabbca1ae05c863dd3bf4c525633b',
            '0x127745082e033c46700941843a526bd8a8d847675a7353b92cbfa96d0ac6c52f',
          ],
        ],
        [
          '0x04e5f5c1974ab5953df33b2f5b54de014b1e6c5849785abf990d70fa877a0aee',
          '0x0cf1dc3d1613f39abf53684dc428a7d49bfad7dae195fcfafcf02f179f2f182b',
        ],
        ['0x000000000000000000000000000000000000000000000000000000000000001e']
      );
      console.log('🚀 ~ isVerify:', isVerify);
      expect(isVerify).to.equal(true);
    });
  });
});
