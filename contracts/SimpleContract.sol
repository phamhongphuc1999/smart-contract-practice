// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/proxy/utils/Initializable.sol';

contract SimpleContract is Initializable {
  string public symbol;
  address public owner;
  uint public i;

  function initialize(string calldata _symbol) public initializer {
    symbol = _symbol;
    owner = msg.sender;
  }

  function setSymbol(string calldata _symbol) public {
    require(msg.sender == owner);
    symbol = _symbol;
  }

  function callMe(uint j) public {
    i += j;
  }

  function getData(uint j) public pure returns (bytes memory) {
    return abi.encodeWithSignature('callMe(uint256)', j);
  }
}
