import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Guardian__factory } from '../../typechain';

describe('Guradian', function () {
  async function deployGuardian() {
    const etherSigner = ethers.provider.getSigner();
    const [owner] = await ethers.getSigners();
    const guardian = await new Guardian__factory(etherSigner).deploy();
    return { guardian, owner };
  }
  describe('Interaction', function () {
    // it('Should get guardians', async function () {
    //   const { guardian } = await loadFixture(deployGuardian);
    //   const _guardian = await guardian.getGuardian(0);
    //   expect(_guardian).to.eq('0x1f37b6d5094b9a3370f4f3945562c9439ce417c702a16a8d534de17405ed182f');
    // });
    it('Should execute', async function () {
      const { guardian } = await loadFixture(deployGuardian);
      let _counter = await guardian.counter();
      expect(_counter).to.eq(0);
      await guardian.addGuardian(
        '0x1f37b6d5094b9a3370f4f3945562c9439ce417c702a16a8d534de17405ed182f'
      );
      const _guardian = await guardian.getGuardian(0);
      console.log('🚀 ~ _guardian:', _guardian);
      expect(_guardian).to.eq('0x1f37b6d5094b9a3370f4f3945562c9439ce417c702a16a8d534de17405ed182f');
      await guardian.verifyGuardian(
        [
          '0x2c42956790cea04ab012bb5fb5682e444dc09033135c2cac249e80961420e789',
          '0x2fcc3e39af68241c3800e2856f86d284f5dbae3407e495d0327286342d32d319',
        ],
        [
          [
            '0x19e50911ecd2518fac845c7d04b4818804bab0cd43914ddbb9463503b0e2d6e3',
            '0x25d495ed2b771b21e90d188de3fdfbfe06f8a7635ed1ea3d37b71a451343df00',
          ],
          [
            '0x05f50e04e0066b58d2e2748644474c3ad8b4b19b3d6e2413c1dee4513e646787',
            '0x1e6a19b8d63a1f831f7e7ca767d8b7657585a4bac7a2827ad1e38cf6e653dba0',
          ],
        ],
        [
          '0x0307d7ae53479c58ecc2003cff2dbdb0d0f1e4eaea938534f6207a2aff23a00f',
          '0x16aeb15c699aa51d4ec324d2ba454c923d69fadf9f1ab4bb13542d5bf493f4c1',
        ],
        [
          '0x0000000000000000000000000000000000000000000000000000000000000001',
          '0x1f37b6d5094b9a3370f4f3945562c9439ce417c702a16a8d534de17405ed182f',
        ]
      );
      _counter = await guardian.counter();
      expect(_counter).to.eq(1);
    });
  });
});
