// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract DataLocations {
  uint[] public arr;
  mapping(uint => address) map;

  struct MyStruct {
    uint foo;
    string text;
  }

  mapping(address => MyStruct) public myStructs;
  uint public param1;
  string public param2;

  function examples(
    uint[] calldata y,
    string calldata s
  ) external returns (uint[] memory) {
    myStructs[msg.sender] = MyStruct({foo: 123, text: 'bar'});

    MyStruct storage myStruct = myStructs[msg.sender];
    myStruct.text = 'foo';

    MyStruct memory readOnly = myStructs[msg.sender];
    readOnly.foo = 456;

    _internal(y, s);

    uint[] memory memArr = new uint[](3);
    memArr[0] = 234;
    return memArr;
  }

  function _internal(uint[] calldata y, string calldata s) private {
    param1 = y[0];
    param2 = s;
  }
}
