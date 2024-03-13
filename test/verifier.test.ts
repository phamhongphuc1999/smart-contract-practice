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
          '0x240d93248cdf13f86c41bd51157a218cdd480a5665a97adb686b848a05f50ce5',
          '0x13a18df3388a51e07fb1af422a928d15b20ba471ff1c4f8624e66efaff71a6e1',
        ],
        [
          [
            '0x004ff263ab5b09c076c841cad47aabd36973a71c7554f6d1f2dd1d59c33b2710',
            '0x2489ae0695995ac22266b4bf260cdf00ed5570b37f2762b46363faf7e4d7da7e',
          ],
          [
            '0x05fbb551eae9447b34ff8a3bab00ed2196d1cafcccaad85cdb8059bc158a9497',
            '0x305e35dae166a9b34318da2e52344b2310ce241332c80db7ed3f886026100a2e',
          ],
        ],
        [
          '0x01985a5772e99285cc28973e049d6e4596d38604de2f5d0800c5b953137f33b5',
          '0x27a707709948ccc52fc9f3ce0a6c2b410646d7bde6e66dd55b94269eb9c807f5',
        ],
        ['0x0000000000000000000000000000000000000000000000000000000000000028']
      );
      expect(isVerify).to.equal(true);
    });
  });
});
