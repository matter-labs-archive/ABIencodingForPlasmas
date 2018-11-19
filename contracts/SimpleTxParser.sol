pragma solidity >=0.4.25 <0.6.0;
pragma experimental ABIEncoderV2;

contract SimpleTxParser {
    constructor() public {

    }

    struct RawTransactionInput {
        uint48 utxoId;
        uint256 assetId;
        uint256 value;
        uint8 signatureV;
        bytes32 signatureR;
        bytes32 signatureS;
    }

    struct ParsedTransactionInput {
        uint48 utxoId;
        uint256 assetId;
        uint256 value;
        address signer;
    }

    struct TransactionOutput {
        address recipient;
        uint256 assetId;
        uint256 value;
    }

    struct RawPlasmaTransaction {
        uint8 version;
        uint8 txType;
        uint32 goodUntilBlock;
        RawTransactionInput[] inputs;
        TransactionOutput[] outputs;
    }

    struct ParsedPlasmaTransaction {
        uint8 version;
        uint8 txType;
        uint32 goodUntilBlock;
        ParsedTransactionInput[] inputs;
        TransactionOutput[] outputs;
        uint32 txNumberInBlock;
        bool isWellFormed;
    }

    function parseTransactionInput(bytes memory data)
    public
    pure
    returns (RawTransactionInput memory a) {
        a = abi.decode(data, (RawTransactionInput));
    }

    function parseTransactionOutput(bytes memory data)
    public
    pure
    returns (TransactionOutput memory a) {
        a = abi.decode(data, (TransactionOutput));
    }

    function parseRawTransaction(bytes memory data)
    public
    pure
    returns (RawPlasmaTransaction memory a) {
        a = abi.decode(data, (RawPlasmaTransaction));
    }

    function parseTransaction(bytes memory data)
    public
    pure
    returns (ParsedPlasmaTransaction memory parsedTX) {
        RawPlasmaTransaction memory rawTX = abi.decode(data, (RawPlasmaTransaction));
        RawPlasmaTransaction memory partialTXforSignature;
        RawTransactionInput memory input;
        ParsedTransactionInput memory parsedInput;
        bytes memory tmp;
        bytes32 tmpHash;

        partialTXforSignature.version = rawTX.version;
        partialTXforSignature.txType = rawTX.txType;
        partialTXforSignature.goodUntilBlock = rawTX.goodUntilBlock;

        parsedTX.version = rawTX.version;
        parsedTX.txType = rawTX.txType;
        parsedTX.goodUntilBlock = rawTX.goodUntilBlock;

        partialTXforSignature.outputs = new TransactionOutput[](rawTX.outputs.length);
        parsedTX.outputs = new TransactionOutput[](rawTX.outputs.length);

        for (uint256 i = 0; i < rawTX.outputs.length; i++) {
            partialTXforSignature.outputs[i] = rawTX.outputs[i];
            parsedTX.outputs[i] = rawTX.outputs[i];
        }

        partialTXforSignature.inputs = new RawTransactionInput[](1);
        parsedTX.inputs = new ParsedTransactionInput[](rawTX.inputs.length);

        for (uint256 i = 0; i < rawTX.inputs.length; i++) {
            input.utxoId = rawTX.inputs[i].utxoId;
            input.assetId = rawTX.inputs[i].assetId;
            input.value = rawTX.inputs[i].value;

            parsedInput.utxoId = rawTX.inputs[i].utxoId;
            parsedInput.assetId = rawTX.inputs[i].assetId;
            parsedInput.value = rawTX.inputs[i].value;

            partialTXforSignature.inputs[0] = input;
            tmp = abi.encode(partialTXforSignature);
            tmpHash = keccak256(tmp);
            parsedInput.signer = ecrecover(tmpHash, rawTX.inputs[i].signatureV, rawTX.inputs[i].signatureR, rawTX.inputs[i].signatureS);

            parsedTX.inputs[i] = parsedInput;
        }
    }

    function convertRawToParsed(RawPlasmaTransaction memory rawTX)
    public
    pure
    returns (ParsedPlasmaTransaction memory parsedTX) {
        RawPlasmaTransaction memory partialTXforSignature;
        RawTransactionInput memory input;
        ParsedTransactionInput memory parsedInput;
        bytes memory tmp;
        bytes32 tmpHash;

        partialTXforSignature.version = rawTX.version;
        partialTXforSignature.txType = rawTX.txType;
        partialTXforSignature.goodUntilBlock = rawTX.goodUntilBlock;

        parsedTX.version = rawTX.version;
        parsedTX.txType = rawTX.txType;
        parsedTX.goodUntilBlock = rawTX.goodUntilBlock;

        partialTXforSignature.outputs = new TransactionOutput[](rawTX.outputs.length);
        parsedTX.outputs = new TransactionOutput[](rawTX.outputs.length);

        for (uint256 i = 0; i < rawTX.outputs.length; i++) {
            partialTXforSignature.outputs[i] = rawTX.outputs[i];
            parsedTX.outputs[i] = rawTX.outputs[i];
        }

        partialTXforSignature.inputs = new RawTransactionInput[](1);
        parsedTX.inputs = new ParsedTransactionInput[](rawTX.inputs.length);

        for (uint256 i = 0; i < rawTX.inputs.length; i++) {
            input.utxoId = rawTX.inputs[i].utxoId;
            input.assetId = rawTX.inputs[i].assetId;
            input.value = rawTX.inputs[i].value;

            parsedInput.utxoId = rawTX.inputs[i].utxoId;
            parsedInput.assetId = rawTX.inputs[i].assetId;
            parsedInput.value = rawTX.inputs[i].value;

            partialTXforSignature.inputs[0] = input;
            tmp = abi.encode(partialTXforSignature);
            tmpHash = keccak256(tmp);
            parsedInput.signer = ecrecover(tmpHash, rawTX.inputs[i].signatureV, rawTX.inputs[i].signatureR, rawTX.inputs[i].signatureS);

            parsedTX.inputs[i] = parsedInput;
        }
    }
}

