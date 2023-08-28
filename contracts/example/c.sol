// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.10 <0.9.0;

contract C {
  uint b;

  // Assigns a new selector and address to the return variable @fun
  function combineToFunctionPointer(
    address newAddress,
    uint newSelector
  ) public pure returns (function() external fun) {
    assembly {
      fun.selector := newSelector
      fun.address := newAddress
    }
  }

  function f(uint x) public view returns (uint r) {
    assembly {
      // We ignore the storage slot offset, we know it is zero
      // in this special case.
      r := mul(x, sload(b.slot))
    }
  }
}
