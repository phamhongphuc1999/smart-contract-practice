// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Coin {
  address public minter;
  mapping(address => uint) public balances;

  event Sent(address from, address to, uint amount);

  constructor() {
    minter = msg.sender;
  }

  function mint(address receiver, uint amount) public {
    require(msg.sender == minter);
    balances[receiver] += amount;
  }

  error InsufficientBalance(uint requested, uint available);

  function send(address receiver, uint amount) public {
    if (amount > balances[msg.sender]) {
      revert InsufficientBalance({
        requested: amount,
        available: balances[msg.sender]
      });
    }
    balances[msg.sender] -= amount;
    balances[receiver] += amount;
    emit Sent(msg.sender, receiver, amount);
  }

  function balanceOf(address account) external view returns (uint) {
    return balances[account];
  }
}
