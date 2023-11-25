// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import './SimpleContract.sol';

contract CreateTwo {
  function deploy(bytes memory bytecode, uint _salt) external {
    address addr;
    assembly {
      addr := create2(0, add(bytecode, 0x20), mload(bytecode), _salt)
      if iszero(extcodesize(addr)) {
        revert(0, 0)
      }
    }
  }

  function computeAddress(bytes memory bytecode, bytes32 salt) external view returns (address) {
    bytes32 bytecodeHash = keccak256(bytecode);
    bytes32 _data = keccak256(abi.encodePacked(bytes1(0xff), address(this), salt, bytecodeHash));
    return address(bytes20(_data << 96));
  }

  function isDeploy(bytes memory bytecode, bytes32 salt) external view returns (bool) {
    address addr = this.computeAddress(bytecode, salt);
    return addr.code.length > 0;
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

  function staticExecute(address target, bytes memory data) external view returns (bytes memory) {
    (bool success, bytes memory result) = target.staticcall(data);
    if (!success) {
      assembly {
        revert(add(result, 32), mload(result))
      }
    }
    return result;
  }
}
