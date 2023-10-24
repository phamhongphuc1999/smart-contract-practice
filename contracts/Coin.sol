// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import './ERC20Interface.sol';
import './SafeMath.sol';

contract Coin is ERC20Interface, SafeMath {
  string public symbol;
  string public name;
  uint8 public decimals;
  uint public _totalSupply;
  address public minter;

  mapping(address => uint) public balances;
  mapping(address => mapping(address => uint)) allowed;

  event Sent(address from, address to, uint amount);

  constructor() {
    minter = msg.sender;
    symbol = 'PHP';
    name = 'PHP';
    decimals = 9;
    _totalSupply = 0;
    balances[minter] = _totalSupply;
    emit Transfer(address(0), minter, _totalSupply);
  }

  function totalSupply() public view returns (uint) {
    return _totalSupply - balances[address(0)];
  }

  function mint(address receiver, uint amount) public {
    require(msg.sender == minter);
    balances[receiver] += amount;
  }

  function transfer(address to, uint tokens) public returns (bool success) {
    balances[msg.sender] = safeSub(balances[msg.sender], tokens);
    balances[to] = safeAdd(balances[to], tokens);
    emit Transfer(msg.sender, to, tokens);
    return true;
  }

  function approve(address spender, uint tokens) public returns (bool success) {
    allowed[msg.sender][spender] = tokens;
    emit Approval(msg.sender, spender, tokens);
    return true;
  }

  function transferFrom(
    address from,
    address to,
    uint tokens
  ) public returns (bool success) {
    balances[from] = safeSub(balances[from], tokens);
    allowed[from][msg.sender] = safeSub(allowed[from][msg.sender], tokens);
    balances[to] = safeAdd(balances[to], tokens);
    emit Transfer(from, to, tokens);
    return true;
  }

  function allowance(
    address tokenOwner,
    address spender
  ) public view returns (uint remaining) {
    return allowed[tokenOwner][spender];
  }

  function balanceOf(address account) external view returns (uint) {
    return balances[account];
  }
}
