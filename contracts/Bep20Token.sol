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

  function mint(uint256 _mintAmount) public {
    require(msg.sender == owner, 'invalid user');
    _mint(owner, _mintAmount);
  }

  function transferFrom(
    address from,
    address to,
    uint256 amount
  ) public virtual override returns (bool) {
    address spender = _msgSender();
    _spendAllowance(from, spender, amount);
    _transfer(from, to, amount);
    return true;
  }
}
