// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import './Caller.sol';

// https://solidity-by-example.org/app/create2/
contract CreateTwo is Caller {
  event Deployed(address addr, uint salt);

  function deploy(bytes memory bytecode, uint _salt) external {
    address addr;
    assembly {
      addr := create2(0, add(bytecode, 0x20), mload(bytecode), _salt)
      if iszero(extcodesize(addr)) {
        revert(0, 0)
      }
    }
    emit Deployed(addr, _salt);
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
}
