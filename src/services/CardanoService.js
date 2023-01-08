import {
    addressesFromCborIfNeeded,
    getOutputHexFromUtxo,
    hexToBytes,
    reduceWasmMultiasset,
    mapCborUtxos,
    walletReturnType, getTransactionHex
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

    async getChangeAddress () {
        const changeAddressCbor = await this.walletApi?.getChangeAddress()
        return addressesFromCborIfNeeded([changeAddressCbor]);

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
        return await this.walletApi?.getUtxos()
    }

    async getRandomUtxo(){
        const utxosCbor = await this.getUtxos()
        const utxos = mapCborUtxos(utxosCbor);
        const utxo = utxos[Math.floor(Math.random() * utxos.length)];
        console.log(utxo)
        const outputHex = getOutputHexFromUtxo(utxo)
        return {utxo, outputHex}
    }

    async createTx(txReq){
        try{
            return await this.walletApi.experimental.createTx(txReq, true)
        }catch(e){
            console.log("couldn't build tx")
            console.error(e);
            throw e;
        }
    }

    async signTx(unsignedTx){
        try{
            const witnessSetHex = await this.walletApi.signTx(unsignedTx)
            return getTransactionHex(witnessSetHex, unsignedTx)
        }catch(e){
            console.log("couldn't sign tx")
            console.error(e);
            throw e;
        }
    }
    async submitTx(signedTx){
        try{
            return await this.walletApi.submitTx(signedTx)
        }catch(e){
            console.log("couldn't submit tx")
            console.error(e);
            throw e;
        }
    }
}

const cardanoService = new CardanoService();
export default cardanoService;