// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract Bep20Token is ERC20 {
  address payable public owner;

  constructor(uint256 initialSupply) ERC20('Bep20Test', 'PHP') {
    _mint(msg.sender, initialSupply);
    owner = payable(msg.sender);
  }

  function getOwner() public view returns (address) {
    return owner;
  }
}
