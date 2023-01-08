import { walletReturnType, reduceWasmMultiasset, addressesFromCborIfNeeded, hexToBytes,} from '../utils/cardanoUtils';
import * as CardanoWasm from "@emurgo/cardano-serialization-lib-asmjs";

export default class VidbidContractService {
    constructor(cardanoService) {
        this.cardanoService = cardanoService;
    }

    async mintToken(){
        console.log("Mint token")
        const utxo = await this.cardanoService.getUtxos();
        const randomUtxo = await this.cardanoService.getRandomUtxo()

        console.log(utxo)
        console.log(randomUtxo)
    }

}