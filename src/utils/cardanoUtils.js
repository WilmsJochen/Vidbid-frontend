// @flow
import {Buffer} from "buffer";
import * as CardanoWasm from "@emurgo/cardano-serialization-lib-asmjs";

export const walletReturnType = "cbor";

const Bech32Prefix = {
    ADDRESS: "addr",
    PAYMENT_KEY_HASH: "addr_vkh"
};

const protocolParams = {
    linearFee: {
        minFeeA: "44",
        minFeeB: "155381",
    },
    minUtxo: "34482",
    poolDeposit: "500000000",
    keyDeposit: "2000000",
    maxValSize: 5000,
    maxTxSize: 16384,
    priceMem: 0.0577,
    priceStep: 0.0000721,
    coinsPerUtxoWord: "34482",
}

export function isCBOR() {
    return walletReturnType === "cbor";
}

export function bytesToHex(bytes) {
    return Buffer.from(bytes).toString('hex');
}

export function hexToBytes(hex) {
    return Buffer.from(hex, 'hex');
}



export function addressesFromCborIfNeeded(addresses) {
    return isCBOR()
        ? addresses.map(
            (a) =>
                CardanoWasm.Address.from_bytes(hexToBytes(a)).to_bech32()
        )
        : addresses;
}

export function addressToCbor(address) {
    return bytesToHex(CardanoWasm.Address.from_bech32(address).to_bytes());
}

export function mapCborUtxos(cborUtxos) {
    return cborUtxos.map((hex) => {
        const u = CardanoWasm.TransactionUnspentOutput.from_bytes(hexToBytes(hex));
        const input = u.input();
        const output = u.output();
        const txHash = bytesToHex(input.transaction_id().to_bytes());
        const txIndex = input.index();
        const value = output.amount();
        return {
            utxo_id: `${txHash}${txIndex}`,
            transactionUnspentOutput: u,
            tx_hash: txHash,
            tx_index: txIndex,
            receiver: output.address().to_bech32(),
            amount: value.coin().to_str(),
            assets: reduceWasmMultiasset(
                value.multiasset(),
                (res, asset) => {
                    res.push(asset);
                    return res;
                },
                []
            ),
        };
    });
}
export function reduceWasmMultiasset(multiasset, reducer, initValue) {
    let result = initValue;
    if (multiasset) {
        const policyIds = multiasset.keys();
        for (let i = 0; i < policyIds.len(); i++) {
            const policyId = policyIds.get(i);
            const assets = multiasset.get(policyId);
            const assetNames = assets.keys();
            for (let j = 0; j < assetNames.len(); j++) {
                const name = assetNames.get(j);
                const amount = assets.get(name);
                const policyIdHex = bytesToHex(policyId.to_bytes());
                const encodedName = bytesToHex(name.name());
                result = reducer(result, {
                    policyId: policyIdHex,
                    name: encodedName,
                    amount: amount.to_str(),
                    assetId: `${policyIdHex}.${encodedName}`,
                });
            }
        }
    }
    return result;
}

export function getTxBuilder() {
    return CardanoWasm.TransactionBuilder.new(
        CardanoWasm.TransactionBuilderConfigBuilder.new()
            // all of these are taken from the mainnet genesis settings
            // linear fee parameters (a*size + b)
            .fee_algo(
                CardanoWasm.LinearFee.new(
                    CardanoWasm.BigNum.from_str("44"),
                    CardanoWasm.BigNum.from_str("155381")
                )
            )
            .coins_per_utxo_word(CardanoWasm.BigNum.from_str('34482'))
            .pool_deposit(CardanoWasm.BigNum.from_str('500000000'))
            .key_deposit(CardanoWasm.BigNum.from_str('2000000'))
            .ex_unit_prices(CardanoWasm.ExUnitPrices.new(
                CardanoWasm.UnitInterval.new(CardanoWasm.BigNum.from_str("577"), CardanoWasm.BigNum.from_str("10000")),
                CardanoWasm.UnitInterval.new(CardanoWasm.BigNum.from_str("721"), CardanoWasm.BigNum.from_str("10000000"))
            ))
            .max_value_size(5000)
            .max_tx_size(16384)
            .build()
    );
}

export function getOutputHexFromUtxo(utxo){
    return bytesToHex(
        CardanoWasm.TransactionOutput.new(
            CardanoWasm.Address.from_bech32(utxo.receiver),
            CardanoWasm.Value.new(CardanoWasm.BigNum.from_str("1000000"))
        ).to_bytes()
    );
}

export function convertAssetNameToHEX(name) {
    return bytesToHex(name);
}

export function getScriptHexFromAddress(address){
    const keyHash = CardanoWasm.BaseAddress.from_address(
        CardanoWasm.Address.from_bech32(address)
    ).payment_cred().to_keyhash();

    const keyHashBech = keyHash.to_bech32(Bech32Prefix.PAYMENT_KEY_HASH);

    const scripts = CardanoWasm.NativeScripts.new();
    scripts.add(
        CardanoWasm.NativeScript.new_script_pubkey(
            CardanoWasm.ScriptPubkey.new(keyHash)
        )
    );
    scripts.add(
        CardanoWasm.NativeScript.new_timelock_start(
            CardanoWasm.TimelockStart.new(42)
        )
    );

    const mintScript = CardanoWasm.NativeScript.new_script_all(
        CardanoWasm.ScriptAll.new(scripts)
    );
    return bytesToHex(mintScript.to_bytes());
}
export function getNewScripts(){
    return CardanoWasm.PlutusScripts.new();
}
export function getScriptFromCborHex(cborHex){
    return CardanoWasm.PlutusScript.from_bytes_v2(hexToBytes(cborHex));
}

export function getScriptAddressFromScriptCborHex(cborHex){
    const script =getScriptFromCborHex(cborHex);
    const addr = CardanoWasm.EnterpriseAddress.new(
        0, // 0 for Testnet - 1 for Mainnet
        CardanoWasm.StakeCredential.from_scripthash(script.hash())
    );
    return addr.to_address().to_bech32('addr_test');
}

export function getTransactionHex(witnessSetHex, unsignedTransactionHex){
    const witnessSet = CardanoWasm.TransactionWitnessSet.from_bytes(
        hexToBytes(witnessSetHex)
    );
    const tx = CardanoWasm.Transaction.from_bytes(
        hexToBytes(unsignedTransactionHex)
    );
    const transaction = CardanoWasm.Transaction.new(
        tx.body(),
        witnessSet,
        tx.auxiliary_data(),
    );
    return bytesToHex(transaction.to_bytes())
}

export async function initTransactionBuilder(){
    return CardanoWasm.TransactionBuilder.new(
        CardanoWasm.TransactionBuilderConfigBuilder.new()
            .fee_algo(CardanoWasm.LinearFee.new(CardanoWasm.BigNum.from_str(protocolParams.linearFee.minFeeA), CardanoWasm.BigNum.from_str(protocolParams.linearFee.minFeeB)))
            .pool_deposit(CardanoWasm.BigNum.from_str(protocolParams.poolDeposit))
            .key_deposit(CardanoWasm.BigNum.from_str(protocolParams.keyDeposit))
            .coins_per_utxo_word(CardanoWasm.BigNum.from_str(protocolParams.coinsPerUtxoWord))
            .max_value_size(protocolParams.maxValSize)
            .max_tx_size(protocolParams.maxTxSize)
            .prefer_pure_change(true)
            .build()
    )
}

export function appendTxBuilderWithOutput(txBuilder,address,adaValue){
    const addr = CardanoWasm.Address.from_bech32(address)
    // const addressCbor = addressToCbor(address);
    txBuilder.add_output(
        CardanoWasm.TransactionOutput.new(
            addr,
            CardanoWasm.Value.new(CardanoWasm.BigNum.from_str(adaValue))
        ),
    );
    return txBuilder;
}

export function appendTxBuilderWithInput(txBuilder, utxos){
    let txOutputs = CardanoWasm.TransactionUnspentOutputs.new()
    for(const utxo of utxos){
        txOutputs.add(utxo.transactionUnspentOutput)
    }
    txBuilder.add_inputs_from(txOutputs, 1)
    return txBuilder;
}

export function appendTxBuilderWithChangeAddress(txBuilder, changeAddress){
    txBuilder.add_change_if_needed(CardanoWasm.Address.from_bech32(changeAddress))
    return txBuilder;
}

export function convertAdaAmountToLovelaceString(adaAmount){
    return Number(adaAmount) * 1000000;
}