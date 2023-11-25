// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/proxy/utils/Initializable.sol';

contract SimpleContract is Initializable {
  string public symbol;
  address public owner;

  function initialize(string memory _symbol) public initializer {
    symbol = _symbol;
    owner = msg.sender;
  }

  function setSymbol(string memory _symbol) public {
    require(msg.sender == owner);
    symbol = _symbol;
  }
}
