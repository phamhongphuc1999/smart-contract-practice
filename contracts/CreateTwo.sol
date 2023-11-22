// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import 'hardhat/console.sol';

contract CreateTwo {
  function deploy(bytes memory bytecode, uint _salt) external {
    console.log('sender: ', msg.sender);
    address addr;
    assembly {
      addr := create2(0, add(bytecode, 0x20), mload(bytecode), _salt)
      if iszero(extcodesize(addr)) {
        revert(0, 0)
      }
    }
    console.log('deployed address: ', addr);
  }

  function computeAddress(bytes memory bytecode, bytes32 salt) external view returns (address) {
    bytes32 bytecodeHash = keccak256(bytecode);
    bytes32 _data = keccak256(abi.encodePacked(bytes1(0xff), address(this), salt, bytecodeHash));
    return address(bytes20(_data << 96));
  }

  function _call(address target, uint256 value, bytes memory data) internal {
    (bool success, bytes memory result) = target.call{value: value}(data);
    if (!success) {
      assembly {
        revert(add(result, 32), mload(result))
      }
    }
  }

  function execute(address dest, uint256 value, bytes calldata func) external {
    _call(dest, value, func);
  }

  function delegateExecute(address target, bytes memory data) public payable {
    (bool success, bytes memory result) = target.delegatecall(data);
    if (!success) {
      assembly {
        revert(add(result, 32), mload(result))
      }
    }
  }
}
