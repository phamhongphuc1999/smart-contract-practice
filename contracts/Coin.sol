// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import 'hardhat/console.sol';

contract SafeMath {
  function safeAdd(uint a, uint b) public pure returns (uint c) {
    c = a + b;
    require(c >= a);
  }

  function safeSub(uint a, uint b) public pure returns (uint c) {
    require(b <= a);
    c = a - b;
  }

  function safeMul(uint a, uint b) public pure returns (uint c) {
    c = a * b;
    require(a == 0 || c / a == b);
  }

  function safeDiv(uint a, uint b) public pure returns (uint c) {
    require(b > 0);
    c = a / b;
  }
}

interface ERC20Interface {
  function totalSupply() external returns (uint);

  function balanceOf(address tokenOwner) external returns (uint balance);

  function allowance(address tokenOwner, address spender) external returns (uint remaining);

  function transfer(address to, uint tokens) external returns (bool success);

  function approve(address spender, uint tokens) external returns (bool success);

  function transferFrom(address from, address to, uint tokens) external returns (bool success);

  event Transfer(address indexed from, address indexed to, uint tokens);
  event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
}

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

  function transferFrom(address from, address to, uint tokens) public returns (bool success) {
    balances[from] = safeSub(balances[from], tokens);
    allowed[from][msg.sender] = safeSub(allowed[from][msg.sender], tokens);
    balances[to] = safeAdd(balances[to], tokens);
    emit Transfer(from, to, tokens);
    return true;
  }

  function allowance(address tokenOwner, address spender) public view returns (uint remaining) {
    return allowed[tokenOwner][spender];
  }

  function balanceOf(address account) external view returns (uint) {
    return balances[account];
  }

  function deploy(bytes memory bytecode, uint _salt) external {
    address addr;
    assembly {
      addr := create2(0, add(bytecode, 0x20), mload(bytecode), _salt)
      if iszero(extcodesize(addr)) {
        revert(0, 0)
      }
    }
    console.log('addr', addr);
  }

  function computeAddress(bytes32 salt, bytes memory bytecode) external view returns (address) {
    bytes32 bytecodeHash = keccak256(bytecode);
    bytes32 _data = keccak256(abi.encodePacked(bytes1(0xff), address(this), salt, bytecodeHash));
    return address(bytes20(_data << 96));
  }
}
