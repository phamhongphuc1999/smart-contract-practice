// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import 'forge-std/Script.sol';
import 'forge-std/console.sol';

contract ReadAccounts is Script {
  address[] accounts;

  constructor() {
    accounts.push(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266);
    accounts.push(0x70997970C51812dc3A010C7d01b50e0d17dc79C8);
    accounts.push(0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC);
  }

  function run() external view {
    console.log('Total accounts:', accounts.length);

    for (uint256 i = 0; i < accounts.length; i++) {
      address acc = accounts[i];

      uint256 balance = acc.balance;
      uint256 nonce = vm.getNonce(acc);
      uint256 codeSize = acc.code.length;

      console.log('----- Account', i, '-----');
      console.log('Address:', acc);
      console.log('Balance (wei):', balance);
      console.log('Balance (BNB):', balance / 1e18);
      console.log('Nonce:', nonce);
      console.log('Code size:', codeSize);

      if (codeSize > 0) {
        console.log('Type: Contract');
      } else {
        console.log('Type: EOA');
      }
    }
  }
}
