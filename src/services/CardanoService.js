import {
    addressesFromCborIfNeeded,
    cost_model_vals,
    hexToBytes,
    mapCborUtxos,
    reduceWasmMultiasset
} from '../utils/cardanoUtils';
import * as CardanoWasm from "@emurgo/cardano-serialization-lib-asmjs";

const supportedWallets = [
    "nami"
];

class CardanoService {
    constructor() {
        this.wallet = this.getFirstSupportedWallet();
    }

    async connectWallet(){
        await this.refreshWalletApi(true);
    }

    async isWalletConnected(){
        this.isWalletConnected  = await this.wallet.isEnabled();
        if(this.isWalletConnected ){
            await this.refreshWalletApi()
        }
        return this.isWalletConnected;
    }

    disconnectWallet(){
        //TODO
        console.log("TODO")
    }

    getFirstSupportedWallet(){

        for(const supportedWallet of supportedWallets){
            const cardano = window.cardano;
            console.log(cardano)
            if(cardano[supportedWallet]){
                console.log("Found available wallet, ",supportedWallet)
                return cardano[supportedWallet]
            }
        }
    }

    async refreshWalletApi(canEnableWallet = false){
        if(canEnableWallet || this.isWalletConnected){
            this.walletApi = await this.wallet.enable({ requestIdentification: true});
        }
    }

    async getWalletInfo(){
        return {
            changeAddress: await this.getChangeAddress(),
            balances: await this.getWalletBalances()
        }
    }

    async getWalletBalances () {
        const balancesCBOR = await this.walletApi?.getBalance();
        const value = CardanoWasm.Value.from_bytes(hexToBytes(balancesCBOR));
        const balances = { default: value.coin().to_str() };
        balances.assets = reduceWasmMultiasset(
            value.multiasset(),
            (res, asset) => {
                res[asset.assetId] = asset.amount;
                return res;
            },
            {}
        );
        return balances
    }

    async getCollateral () {
        let collateral = [];
        if (this.wallet.name === "Nami") {
            collateral = await this.walletApi.experimental.getCollateral();
        } else {
            collateral = await this.walletApi.getCollateral();
        }
        console.log(collateral)
        return mapCborUtxos(collateral);
    }

    async getChangeAddress(){
        try {
            const raw = await this.walletApi.getChangeAddress();
            return CardanoWasm.Address.from_bytes(Buffer.from(raw, "hex")).to_bech32()
        } catch (err) {
            console.log(err)
        }
    }

    async getUsedAddresses(){
        const usedAddressesCbor = await this.walletApi?.getUsedAddresses({ page: 0, limit: 5 });
        if (!usedAddressesCbor || usedAddressesCbor.length === 0) {
            alert("No used addresses");
            return;
        }
        return addressesFromCborIfNeeded(usedAddressesCbor);
    }

    async getUtxos(){
        let utxosCbor = await this.walletApi?.getUtxos()
        let retries = 0
        while(retries < 3 && (!utxosCbor || utxosCbor.length === 0)){
            retries ++;
            utxosCbor = await this.walletApi?.getUtxos()
        }
        return mapCborUtxos(utxosCbor)
    }

    async createUnsignedTx(txBuilder, scriptObject, requiredSigners){
        try {
            const txBody = txBuilder.build();


            // Tx witness
            const transactionWitnessSet = CardanoWasm.TransactionWitnessSet.new();
            if (scriptObject) {
                //add script
                const scripts = CardanoWasm.PlutusScripts.new();
                scripts.add(CardanoWasm.PlutusScript.from_bytes(Buffer.from(scriptObject.cborHex, "hex"))); //from cbor of plutus script
                transactionWitnessSet.set_plutus_scripts(scripts)

                // Tx witness
                transactionWitnessSet.set_plutus_scripts(scripts)
                transactionWitnessSet.set_plutus_data(scriptObject.datums)
                transactionWitnessSet.set_redeemers(scriptObject.redeemers)

                //Set script data hash
                const costModel = CardanoWasm.CostModel.new();
                cost_model_vals.forEach((x, i) => costModel.set(i, CardanoWasm.Int.new_i32(x)));
                const costModels = CardanoWasm.Costmdls.new();
                costModels.insert(CardanoWasm.Language.new_plutus_v1(), costModel);
                const scriptDataHash = CardanoWasm.hash_script_data(scriptObject.redeemers, costModels, scriptObject.datums);
                txBody.set_script_data_hash(scriptDataHash);

                // set collateral
                const collaterals = await this.getCollateral();
                const inputs = CardanoWasm.TransactionInputs.new();
                collaterals.filter(collateral => collateral.amount > 148981).forEach((collateral) => {
                    console.log(collateral)
                    inputs.add(collateral.transactionUnspentOutput.input());
                });
                txBody.set_collateral(inputs)
            }


            if (requiredSigners) {
                const requiredSignersKeyHashes = CardanoWasm.Ed25519KeyHashes.new();

                for (const requiredSigner of requiredSigners) {
                    const addr = CardanoWasm.Address.from_bech32(requiredSigner);
                    const baseAddress = CardanoWasm.BaseAddress.from_address(addr)
                    requiredSignersKeyHashes.add(baseAddress.payment_cred().to_keyhash())
                }

                txBody.set_required_signers(requiredSignersKeyHashes);
            }

            return CardanoWasm.Transaction.new(
                txBody,
                CardanoWasm.TransactionWitnessSet.from_bytes(transactionWitnessSet.to_bytes())
            ).to_hex()
        }catch(e){
            console.log("couldn't create tx")
            console.error(e);
            throw e;
        }
    }


    async signTx(rawTx){
        try{
            const unSignedTx = CardanoWasm.Transaction.from_bytes(Buffer.from(rawTx, 'hex'));
            const transactionWitnessSet = unSignedTx.witness_set();

            const vkeyWitnesses = transactionWitnessSet.vkeys() || CardanoWasm.Vkeywitnesses.new();
            console.log(vkeyWitnesses.to_json())
            const txVkeyWitnessesCbor = await this.walletApi.signTx(Buffer.from(unSignedTx.to_bytes(), "utf8").toString("hex"), true);
            console.log("signed")
            const txVkeyWitnesses = CardanoWasm.TransactionWitnessSet.from_bytes(Buffer.from(txVkeyWitnessesCbor, "hex"));
            console.log("converted")
            vkeyWitnesses.add(txVkeyWitnesses.vkeys());
            console.log(vkeyWitnesses.to_json())

            transactionWitnessSet.set_vkeys(vkeyWitnesses);

            return CardanoWasm.Transaction.new(
                unSignedTx.body(),
                transactionWitnessSet
            );

        }catch(e){
            console.log("couldn't sign tx")
            console.error(e);
            throw e;
        }
    }
    async submitTx(signedTx){
        try{
            return await this.walletApi.submitTx(Buffer.from(signedTx.to_bytes(), "utf8").toString("hex"));
        }catch(e){
            console.log("couldn't submit tx")
            console.error(e);
            throw e;
        }
    }
}

const cardanoService = new CardanoService();
export default cardanoService;