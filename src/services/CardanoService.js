import {
    addressesFromCborIfNeeded,
    hexToBytes,
    mapCborUtxos,
    reduceWasmMultiasset
} from '../utils/cardanoUtils';
import * as CardanoWasm from "@emurgo/cardano-serialization-lib-asmjs";
import {Buffer} from "buffer";

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
            return txBuilder.build_tx();
        }catch(e){
            console.log("couldn't create tx")
            console.error(e);
            throw e;
        }
    }


    async signTx(unSignedTx){
        try{
            const transactionWitnessSet = unSignedTx.witness_set();
            console.log(transactionWitnessSet)
            const vkeyWitnesses = transactionWitnessSet.vkeys() || CardanoWasm.Vkeywitnesses.new();
            console.log(vkeyWitnesses.to_json())
            const txVkeyWitnessesCbor = await this.walletApi.signTx(Buffer.from(unSignedTx.to_bytes(), "utf8").toString("hex"), true);
            console.log("signed")
            const txVkeyWitnesses = CardanoWasm.TransactionWitnessSet.from_bytes(Buffer.from(txVkeyWitnessesCbor, "hex"));

            //todo investigate multi signature witnesses.
            // vkeyWitnesses.add(txVkeyWitnesses.vkeys());
            // transactionWitnessSet.set_vkeys(vkeyWitnesses);

            return CardanoWasm.Transaction.new(
                unSignedTx.body(),
                txVkeyWitnesses,
                unSignedTx.auxiliary_data()
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