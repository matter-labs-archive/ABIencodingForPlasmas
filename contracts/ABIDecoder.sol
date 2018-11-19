pragma solidity >=0.4.25 <0.6.0;
pragma experimental ABIEncoderV2;

contract ABIDecoder {
    constructor() public {

    }

    function testSimple1(bytes memory data)
    public
    pure
    returns (uint256 a) {
        a = abi.decode(data, (uint256));
    }

    function testSimple2(bytes memory data)
    public
    pure
    returns (uint256 a, bytes memory rest) {
        (a, rest) = abi.decode(data, (uint256, bytes));
    }

    struct TestStruct {
        uint256 u;
        bytes32 v;
        address z;
    }

    function testTuple(bytes memory data)
    public
    pure
    returns (uint256 a, TestStruct memory rest) {
        (a, rest) = abi.decode(data, (uint256, TestStruct));
    }

    function testRecursive(bytes memory data)
    public
    pure
    returns (uint256 a, TestStruct memory rest) {
        bytes memory tmp;
        (a, tmp) = abi.decode(data, (uint256, bytes));
        rest = abi.decode(tmp, (TestStruct));
    }
}