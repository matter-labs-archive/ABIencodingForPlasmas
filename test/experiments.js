const ABIDecoder  = artifacts.require('ABIDecoder');
const util = require("util");
const ethUtil = require('ethereumjs-util')
const BN = ethUtil.BN;
const crypto = require("crypto");
const abi = require('ethereumjs-abi');
const assert = require("assert");
const ethersjs = require("ethers");

const increaseTime = async function(addSeconds) {
    await web3.currentProvider.send({jsonrpc: "2.0", method: "evm_increaseTime", params: [addSeconds], id: 0})
    await web3.currentProvider.send({jsonrpc: "2.0", method: "evm_mine", params: [], id: 1})
}

contract('ABI Decoder', async (accounts) => {
    let contract;

    const operator = accounts[0];

    beforeEach(async () => {
        contract = await ABIDecoder.new({from: operator});
    })

    it('should parse simple uint256', async () => {
        const bn = new BN(1);
        const encoded = abi.rawEncode(["uint256"], [bn]);
        const decoded = await contract.testSimple1(ethUtil.bufferToHex(encoded))
        assert(decoded.eq(bn));
        console.log(decoded.toString(10));
    });

    it('should parse uint256 and more bytes', async () => {
        const bn = new BN(1);
        const randomBytes = crypto.randomBytes(50);
        const encoded = abi.rawEncode(["uint256", "bytes"], [bn, randomBytes]);
        console.log(encoded.toString("hex"));
        const decoded = await contract.testSimple2(ethUtil.bufferToHex(encoded))
        assert(decoded[0].eq(bn));
        console.log(decoded[1].toString("hex"));
    });

    it('should parse uint256 and tuple', async () => {
        const bn = crypto.randomBytes(32);
        const encoder = new ethersjs.utils.AbiCoder();
        const address = crypto.randomBytes(20);
        const bytes32 = crypto.randomBytes(32);
        // const enc = abi.rawEncode(["uint256", "tuple(uint256, bytes32, address)"], [bn, [bn, bytes32, address]]);
        const encoded = encoder.encode(["uint256", "tuple(uint256, bytes32, address)"], [ethUtil.bufferToHex(bn), [ethUtil.bufferToHex(bn), ethUtil.bufferToHex(bytes32), ethUtil.bufferToHex(address)]]);
        console.log(encoded);
        const decoded = await contract.testTuple(encoded);
        assert(decoded[0].eq(new BN(bn)));
        console.log(decoded[1][2] === ethUtil.bufferToHex(address));
    });

    it('should parse uint256 and tuple recursively', async () => {
        const bn = crypto.randomBytes(32);
        const encoder = new ethersjs.utils.AbiCoder();
        const address = crypto.randomBytes(20);
        const bytes32 = crypto.randomBytes(32);
        // const enc = abi.rawEncode(["uint256", "tuple(uint256, bytes32, address)"], [bn, [bn, bytes32, address]]);
        const encoded = encoder.encode(["uint256", "tuple(uint256, bytes32, address)"], [ethUtil.bufferToHex(bn), [ethUtil.bufferToHex(bn), ethUtil.bufferToHex(bytes32), ethUtil.bufferToHex(address)]]);
        console.log(encoded);
        const decoded = await contract.testRecursive(encoded);
        assert(decoded[0].eq(new BN(bn)));
        console.log(decoded[1][2] === ethUtil.bufferToHex(address));
    });

})