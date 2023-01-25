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
    const plutusScript = getScriptFromCborHex(scriptCbor);

    const datumHash = CardanoWasm.hash_plutus_data(datum)

    const wasmPlutusWitness = CardanoWasm.PlutusWitness.new(plutusScript, datum, redeemer);

    const txInputsBuilder = CardanoWasm.TxInputsBuilder.new()

    for(const tx of scriptTransactions){
        if(tx.data_hash !== datumHash.to_hex()){
            console.log("tx not used", tx.tx_hash)
            continue;
        }

        const txHash = CardanoWasm.TransactionHash.from_bytes(hexToBytes(tx.tx_hash));
        const txIn = CardanoWasm.TransactionInput.new(txHash,tx.tx_index)

        // inline datum Witness
        // const wasmPlutusWitness = CardanoWasm.PlutusWitness.new_with_ref(CardanoWasm.PlutusScriptSource.new(plutusScript), CardanoWasm.DatumSource.new_ref_input(txIn), redeemer);

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

        txInputsBuilder.add_plutus_script_input(wasmPlutusWitness, txIn, wasmValue)
    }

    txBuilder.set_inputs(txInputsBuilder);

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
        txBuilder.calc_script_data_hash(CardanoWasm.TxBuilderConstants.plutus_vasil_cost_models())
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