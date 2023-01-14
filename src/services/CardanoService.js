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
    "yoroi"
];

class CardanoService {
    constructor() {
        this.wallet = this.getFirstSupportedWallet();
    }

    async connectWallet(){
        await this.getWalletApi(true);
    }

    async isWalletConnected(){
        const isConnected = await this.wallet.isEnabled();
        this.isWalletConnected = isConnected;
        if(isConnected){
            await this.getWalletApi()
        }
        return isConnected;
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

    async getWalletApi(canEnableWallet = false){
        if(canEnableWallet || this.isWalletConnected){
            this.walletApi = await this.wallet.enable({ requestIdentification: true});
            this.walletApi?.experimental?.setReturnType(walletReturnType);

            this.walletAuth = this.walletApi?.experimental?.auth();
            this.walletAuthEnabled = this.walletAuth?.isEnabled();
        }
    }

    async getWalletInfo(){
        if(!this.walletAuthEnabled){
            this.getWalletApi()
        }
        return {
            walletId: this.walletAuth.getWalletId(),
            pubKey: this.walletAuth.getWalletPubkey(),
            changeAddress: await this.getChangeAddress(),
            balances: await this.getWalletBalances()
        }
    }

    async getWalletBalances () {
        const tokenId = "*";
        const balancesCBOR = await this.walletApi?.getBalance(tokenId);
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
            console.log(utxosCbor)
            console.log(retries)
            retries ++;
            utxosCbor = await this.walletApi?.getUtxos()
        }
        return mapCborUtxos(utxosCbor)
    }

    async getRandomUtxo(){
        const utxos = await this.getUtxos();
        const utxo = utxos.filter(utxo => Number(utxo.amount) > 100000)[Math.floor(Math.random() * utxos.length)];
        const outputHex = getOutputHexFromUtxo(utxo)
        return {utxo, outputHex}
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