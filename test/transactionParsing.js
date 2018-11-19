const SimpleTxParser  = artifacts.require('SimpleTxParser');
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

contract('Simple TX parser', async (accounts) => {
    let contract;

    const operator = accounts[0];

    beforeEach(async () => {
        contract = await SimpleTxParser.new({from: operator});
    })

    it('should parse the raw input', async () => {
        // struct RawTransactionInput {
        //     uint48 utxoId;
        //     uint256 assetId;
        //     uint256 value;
        //     uint8 signatureV;
        //     bytes32 signatureR;
        //     bytes32 signatureS;
        // }

        const abiString = "tuple(uint48, uint256, uint256, uint8, bytes32, bytes32)"
        const elements = [];
        elements.push(ethUtil.bufferToHex(crypto.randomBytes(6)));
        elements.push(ethUtil.bufferToHex(crypto.randomBytes(32)));
        elements.push(ethUtil.bufferToHex(crypto.randomBytes(32)));
        elements.push(ethUtil.bufferToHex(crypto.randomBytes(1)));
        elements.push(ethUtil.bufferToHex(crypto.randomBytes(32)));
        elements.push(ethUtil.bufferToHex(crypto.randomBytes(32)));
        const encoder = new ethersjs.utils.AbiCoder();
        
        const encoded = encoder.encode([abiString], [elements]);

        console.log(encoded);
        const decoded = await contract.parseTransactionInput(encoded);
        console.log(decoded);
    });

    it('should parse the output', async () => {
        // struct TransactionOutput {
        //     address recipient;
        //     uint256 assetId;
        //     uint256 value;
        // }

        const abiString = "tuple(address, uint256, uint256)"
        const elements = [];
        elements.push(ethUtil.bufferToHex(crypto.randomBytes(20)));
        elements.push(ethUtil.bufferToHex(crypto.randomBytes(32)));
        elements.push(ethUtil.bufferToHex(crypto.randomBytes(32)));
        const encoder = new ethersjs.utils.AbiCoder();
        
        const encoded = encoder.encode([abiString], [elements]);

        console.log(encoded);
        const decoded = await contract.parseTransactionOutput(encoded);
        console.log(decoded);
    });

    it('should parse raw transaction', async () => {
        // struct RawTransactionInput {
        //     uint48 utxoId;
        //     uint256 assetId;
        //     uint256 value;
        //     uint8 signatureV;
        //     bytes32 signatureR;
        //     bytes32 signatureS;
        // }
        // struct TransactionOutput {
        //     address recipient;
        //     uint256 assetId;
        //     uint256 value;
        // }
        // struct RawPlasmaTransaction {
        //     uint8 version;
        //     uint8 txType;
        //     uint32 goodUntilBlock;
        //     RawTransactionInput[] inputs;
        //     TransactionOutput[] outputs;
        // }

        const inputABIstring = "tuple(uint48, uint256, uint256, uint8, bytes32, bytes32)"
        const outputABIstring = "tuple(address, uint256, uint256)"
        const transactionABIstring = "tuple(uint8, uint8, uint32, " + inputABIstring + "[]" + "," + outputABIstring + "[]" + ")";
        const inputElements = [];
        inputElements.push(ethUtil.bufferToHex(crypto.randomBytes(6)));
        inputElements.push(ethUtil.bufferToHex(crypto.randomBytes(32)));
        inputElements.push(ethUtil.bufferToHex(crypto.randomBytes(32)));
        inputElements.push(ethUtil.bufferToHex(crypto.randomBytes(1)));
        inputElements.push(ethUtil.bufferToHex(crypto.randomBytes(32)));
        inputElements.push(ethUtil.bufferToHex(crypto.randomBytes(32)));
        
        const outputElements = [];
        outputElements.push(ethUtil.bufferToHex(crypto.randomBytes(20)));
        outputElements.push(ethUtil.bufferToHex(crypto.randomBytes(32)));
        outputElements.push(ethUtil.bufferToHex(crypto.randomBytes(32)));

        const transactionElements = [];
        transactionElements.push(ethUtil.bufferToHex(crypto.randomBytes(1)));
        transactionElements.push(ethUtil.bufferToHex(crypto.randomBytes(1)));
        transactionElements.push(ethUtil.bufferToHex(crypto.randomBytes(4)));
        transactionElements.push([inputElements]);
        transactionElements.push([outputElements]);

        const encoder = new ethersjs.utils.AbiCoder();
        
        const encoded = encoder.encode([transactionABIstring], [transactionElements]);

        console.log(encoded);
        const decoded = await contract.parseRawTransaction(encoded);
        console.log(decoded);
        const gas = await contract.parseRawTransaction.estimateGas(encoded);
        console.log("ABI parsing a simple transaction takes gas : " + gas);
    });

    it('should parse full transaction', async () => {
        // struct RawTransactionInput {
        //     uint48 utxoId;
        //     uint256 assetId;
        //     uint256 value;
        //     uint8 signatureV;
        //     bytes32 signatureR;
        //     bytes32 signatureS;
        // }
        // struct TransactionOutput {
        //     address recipient;
        //     uint256 assetId;
        //     uint256 value;
        // }
        // struct RawPlasmaTransaction {
        //     uint8 version;
        //     uint8 txType;
        //     uint32 goodUntilBlock;
        //     RawTransactionInput[] inputs;
        //     TransactionOutput[] outputs;
        // }

        const inputABIstring = "tuple(uint48, uint256, uint256, uint8, bytes32, bytes32)"
        const outputABIstring = "tuple(address, uint256, uint256)"
        const transactionABIstring = "tuple(uint8, uint8, uint32, " + inputABIstring + "[]" + "," + outputABIstring + "[]" + ")";
        const inputElements = [];
        inputElements.push(ethUtil.bufferToHex(crypto.randomBytes(6)));
        inputElements.push(ethUtil.bufferToHex(crypto.randomBytes(32)));
        inputElements.push(ethUtil.bufferToHex(crypto.randomBytes(32)));
        inputElements.push("0x1b");
        inputElements.push(ethUtil.bufferToHex(crypto.randomBytes(32)));
        inputElements.push(ethUtil.bufferToHex(crypto.randomBytes(32)));
        
        const outputElements = [];
        outputElements.push(ethUtil.bufferToHex(crypto.randomBytes(20)));
        outputElements.push(ethUtil.bufferToHex(crypto.randomBytes(32)));
        outputElements.push(ethUtil.bufferToHex(crypto.randomBytes(32)));

        const transactionElements = [];
        transactionElements.push(ethUtil.bufferToHex(crypto.randomBytes(1)));
        transactionElements.push(ethUtil.bufferToHex(crypto.randomBytes(1)));
        transactionElements.push(ethUtil.bufferToHex(crypto.randomBytes(4)));
        transactionElements.push([inputElements]);
        transactionElements.push([outputElements]);

        const encoder = new ethersjs.utils.AbiCoder();
        
        const encoded = encoder.encode([transactionABIstring], [transactionElements]);

        console.log(encoded);
        const decoded = await contract.parseTransaction(encoded);
        console.log(decoded);
        const gas = await contract.parseTransaction.estimateGas(encoded);
        console.log("ABI parsing a transaction with signatures takes gas : " + gas);
    });



})