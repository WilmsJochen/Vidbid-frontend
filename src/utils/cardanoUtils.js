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

export const cost_model_vals = [
    205665, 812, 1, 1, 1000, 571, 0, 1, 1000, 24177, 4, 1, 1000, 32, 117366,
    10475, 4, 23000, 100, 23000, 100, 23000, 100, 23000, 100, 23000, 100, 23000,
    100, 100, 100, 23000, 100, 19537, 32, 175354, 32, 46417, 4, 221973, 511, 0, 1,
    89141, 32, 497525, 14068, 4, 2, 196500, 453240, 220, 0, 1, 1, 1000, 28662, 4,
    2, 245000, 216773, 62, 1, 1060367, 12586, 1, 208512, 421, 1, 187000, 1000,
    52998, 1, 80436, 32, 43249, 32, 1000, 32, 80556, 1, 57667, 4, 1000, 10,
    197145, 156, 1, 197145, 156, 1, 204924, 473, 1, 208896, 511, 1, 52467, 32,
    64832, 32, 65493, 32, 22558, 32, 16563, 32, 76511, 32, 196500, 453240, 220, 0,
    1, 1, 69522, 11687, 0, 1, 60091, 32, 196500, 453240, 220, 0, 1, 1, 196500,
    453240, 220, 0, 1, 1, 806990, 30482, 4, 1927926, 82523, 4, 265318, 0, 4, 0,
    85931, 32, 205665, 812, 1, 1, 41182, 32, 212342, 32, 31220, 32, 32696, 32,
    43357, 32, 32247, 32, 38314, 32, 9462713, 1021, 10,
];

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


export function mapCborUtxos(cborUtxos) {
    return cborUtxos.map((hex) => {
        const utxo = CardanoWasm.TransactionUnspentOutput.from_bytes(hexToBytes(hex));
        const input = utxo.input();
        const output = utxo.output();
        const txHash = bytesToHex(input.transaction_id().to_bytes());
        const txIndex = input.index();
        const value = output.amount();
        return {
            utxo_id: `${txHash}${txIndex}`,
            utxo,
            input,
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


export function getScriptFromCborHex(cborHex){
    return CardanoWasm.PlutusScript.from_bytes_v2(hexToBytes(cborHex));
}

export function getScriptAddressFromScriptCborHex(cborHex){
    const script = getScriptFromCborHex(cborHex);
    const addr = CardanoWasm.EnterpriseAddress.new(
        0, // 0 for Testnet - 1 for Mainnet
        CardanoWasm.StakeCredential.from_scripthash(script.hash())
    );
    return addr.to_address().to_bech32('addr_test');
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
            .ex_unit_prices(CardanoWasm.ExUnitPrices.new(
                CardanoWasm.UnitInterval.new(CardanoWasm.BigNum.from_str("577"), CardanoWasm.BigNum.from_str("10000")),
                CardanoWasm.UnitInterval.new(CardanoWasm.BigNum.from_str("721"), CardanoWasm.BigNum.from_str("10000000"))
            ))
            .prefer_pure_change(true)
            .build()
    )
}

export function appendTxBuilderWithAdaOutput(txBuilder, address, lovelaceAmount){
    const addr = CardanoWasm.Address.from_bech32(address)
    txBuilder.add_output(
        CardanoWasm.TransactionOutput.new(
            addr,
            CardanoWasm.Value.new(CardanoWasm.BigNum.from_str(lovelaceAmount.toString()))
        ),
    );
    return txBuilder;
}

export function appendTxBuilderWithScriptOutput(txBuilder, ScriptAddressBech32, plutusData, lovelaceAmount){
    const scriptAddress = CardanoWasm.Address.from_bech32(ScriptAddressBech32);
    let txOutputBuilder = CardanoWasm.TransactionOutputBuilder.new();
    txOutputBuilder = txOutputBuilder.with_address(scriptAddress);
    const dataHash = CardanoWasm.hash_plutus_data(plutusData)
    txOutputBuilder = txOutputBuilder.with_data_hash(dataHash)

    txOutputBuilder = txOutputBuilder.next();

    txOutputBuilder = txOutputBuilder.with_value(CardanoWasm.Value.new(CardanoWasm.BigNum.from_str(lovelaceAmount.toString())))
    const txOutput = txOutputBuilder.build();

    txBuilder.add_output(txOutput)
    return txBuilder;
}

export function appendTxBuilderWithAdaInput(txBuilder, utxos){
    let txOutputs = CardanoWasm.TransactionUnspentOutputs.new()
    for(const utxo of utxos){
        txOutputs.add(utxo.utxo)
    }
    txBuilder.add_inputs_from(txOutputs, 1)
    return txBuilder;
}

export function appendTxBuilderWithScriptInput(txBuilder, scriptCbor, scriptTransactions, datum, redeemer){
    const plutusScript = CardanoWasm.PlutusScript.from_bytes(hexToBytes(scriptCbor));
    const wasmPlutusWitness = CardanoWasm.PlutusWitness.new(plutusScript, datum, redeemer);
    const txInputsBuilder = CardanoWasm.TxInputsBuilder.new()

    for(const tx of scriptTransactions){
        const txHash = CardanoWasm.TransactionHash.from_bytes(hexToBytes(tx.tx_hash));
        const wasmTransactionInput = CardanoWasm.TransactionInput.new(txHash)
        const assets = tx.amount
        let lovelaceAmount = 0;
        const wasmMultiasset = CardanoWasm.MultiAsset.new()
        for (const asset of assets) {
            if(asset.unit === 'lovelace'){
                lovelaceAmount += Number(asset.quantity);
                continue;
            }

            const wasmAssets = CardanoWasm.Assets.new()
            wasmAssets.insert(CardanoWasm.AssetName.new(hexToBytes(asset.unit)), CardanoWasm.BigNum.from_str(asset.quantity))
            const wasmScriptHash = CardanoWasm.ScriptHash.from_bytes(hexToBytes(asset.unit))
            wasmMultiasset.insert(wasmScriptHash, wasmAssets)
        }
        const wasmValue = CardanoWasm.Value.new_from_assets(wasmMultiasset)
        wasmValue.set_coin(CardanoWasm.BigNum.from_str(lovelaceAmount.toString()))

        txInputsBuilder.add_plutus_script_input(wasmPlutusWitness, wasmTransactionInput, wasmValue)
        continue;
    }

    txBuilder.set_inputs(txInputsBuilder);

    // add cost model
    txBuilder.calc_script_data_hash(CardanoWasm.TxBuilderConstants.plutus_default_cost_models())

    return txBuilder;
}


export function appendTxBuilderWithCollateral(txBuilder, collaterals){
    // handle collateral inputs
    const collateralTxInputsBuilder = CardanoWasm.TxInputsBuilder.new()
    for (const collateral of collaterals) {
        const wasmUtxo = collateral.utxo;
        collateralTxInputsBuilder.add_input(wasmUtxo.output().address(), wasmUtxo.input(), wasmUtxo.output().amount())
    }
    txBuilder.set_collateral(collateralTxInputsBuilder)
    return txBuilder;
}

export function appendTxBuilderWithFee(txBuilder, changeAddress, scriptInput=false){
    txBuilder.add_change_if_needed(CardanoWasm.Address.from_bech32(changeAddress))
    if(scriptInput){
        const baseAddress = CardanoWasm.BaseAddress.from_address(CardanoWasm.Address.from_bech32(changeAddress));
        txBuilder.add_required_signer(baseAddress.payment_cred().to_keyhash())
        txBuilder.calc_script_data_hash(CardanoWasm.TxBuilderConstants.plutus_default_cost_models())
    }

    return txBuilder;
}

export function convertAdaAmountToLovelaceString(adaAmount){
    return Number(adaAmount) * 1000000;
}

export function generatePlutusDatumFromJson(number){
    return CardanoWasm.PlutusData.new_integer(CardanoWasm.BigInt.from_str(number.toString()))
}

export function generateRedeemers(number){ //todo
    return CardanoWasm.Redeemer.new(
        CardanoWasm.RedeemerTag.new_spend(),
        CardanoWasm.BigNum.zero(),
        CardanoWasm.PlutusData.new_integer(CardanoWasm.BigInt.from_str(number)),
        CardanoWasm.ExUnits.new(
            CardanoWasm.BigNum.from_str('8000'),
            CardanoWasm.BigNum.from_str('9764680'),
        ),
    )
}