// @flow
import {Buffer} from "buffer";
import * as CardanoWasm from "@emurgo/cardano-serialization-lib-asmjs";

export const walletReturnType = "cbor";

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

export function valueRequestObjectToWasmHex(requestObj) {
    const { amount, assets } = requestObj;
    const result = CardanoWasm.Value.new(
        CardanoWasm.BigNum.from_str(String(amount))
    );
    if (assets != null) {
        if (typeof assets !== "object") {
            throw "Assets is expected to be an object like `{ [policyId]: { [assetName]: amount } }`";
        }
        const wmasset = CardanoWasm.MultiAsset.new();
        for (const [policyId, assets2] of Object.entries(assets)) {
            if (typeof assets2 !== "object") {
                throw "Assets is expected to be an object like `{ [policyId]: { [assetName]: amount } }`";
            }
            const wassets = CardanoWasm.Assets.new();
            for (const [assetName, amount] of Object.entries(assets2)) {
                wassets.insert(
                    CardanoWasm.AssetName.new(hexToBytes(assetName)),
                    CardanoWasm.BigNum.from_str(String(amount))
                );
            }
            wmasset.insert(
                CardanoWasm.ScriptHash.from_bytes(hexToBytes(policyId)),
                wassets
            );
        }
        result.set_multiasset(wmasset);
    }
    return bytesToHex(result.to_bytes());
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