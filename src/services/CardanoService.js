import {
    addressesFromCborIfNeeded,
    getOutputHexFromUtxo,
    getTransactionHex,
    hexToBytes,
    mapCborUtxos,
    reduceWasmMultiasset,
    walletReturnType
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
        return this.walletApi.getCollateral();
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


    async signTx(txBuilder){
        try{
            const txBody = txBuilder.build();
            // Tx witness
            const transactionWitnessSet = CardanoWasm.TransactionWitnessSet.new();
            const unsignedTx = CardanoWasm.Transaction.new(
                txBody,
                CardanoWasm.TransactionWitnessSet.from_bytes(transactionWitnessSet.to_bytes())
            )
            let txVkeyWitnesses = await this.walletApi.signTx(Buffer.from(unsignedTx.to_bytes(), "utf8").toString("hex"), true);
            txVkeyWitnesses = CardanoWasm.TransactionWitnessSet.from_bytes(Buffer.from(txVkeyWitnesses, "hex"));
            transactionWitnessSet.set_vkeys(txVkeyWitnesses.vkeys());

            return CardanoWasm.Transaction.new(
                unsignedTx.body(),
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