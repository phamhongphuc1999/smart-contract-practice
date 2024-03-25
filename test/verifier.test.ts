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
          '0x055e75f0ff4307e382b98c17fb3ff5a43ca6a2098c8b13c8d8b3a27faa9b9ff4',
          '0x15049e5c3bf7d9630c5b46f681be429f43ec8e187e0247ee71fa19cce05199e8',
        ],
        [
          [
            '0x0efc8983e86a7a8386df96a8b7c4913aad4e94f330a9abc6cfc9091f7276b347',
            '0x0e1e4ef5987dcdd1293be187956496c8d92b22c546d187e91981c6fb60c074df',
          ],
          [
            '0x03615c93044180901f4ee68c9b4e8fe3ba28e29d530b44b762fa25d18123283b',
            '0x2976a556f3b0f2329408ea5eebe2693b859a05387261f034336d21aa23b45719',
          ],
        ],
        [
          '0x0437bfdd8502f924dee4c2cec76c51788eaec48bf339d91491ddd9357a059030',
          '0x0b78a12522a7fcbee0dd0c4dd505305794e6e0704ad9795c03d52e481960848f',
        ],
        ['0x1f37b6d5094b9a3370f4f3945562c9439ce417c702a16a8d534de17405ed182f']
      );
      expect(isVerify).to.equal(true);
    });
  });
});
