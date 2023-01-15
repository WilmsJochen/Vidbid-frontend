import {
    getScriptAddressFromScriptCborHex,
    initTransactionBuilder,
    appendTxBuilderWithAdaOutput,
    appendTxBuilderWithAdaInput,
    appendTxBuilderWithFee,
    convertAdaAmountToLovelaceString,
    generatePlutusDatumFromJson,
    appendTxBuilderWithScriptOutput, appendTxBuilderWithScriptInput, generateRedeemers,
} from '../utils/cardanoUtils';
import ApiService from "./ApiService";


const scriptAddresses = {
    firstMint: {
        addr: "addr_test1wzwga8d8lq0re2gysheja0hunqfhezkzvzs89gqvf2h3gtgtsq54j",
        hexAddr: "wzwga8d8lq0re2gysheja0hunqfhezkzvzs89gqvf2h3gtgtsq54j",
        cborHex: "5907655907620100003232323232323232323232323232332232323232322232325335320193333573466e1cd55cea80124000466442466002006004646464646464646464646464646666ae68cdc39aab9d500c480008cccccccccccc88888888888848cccccccccccc00403403002c02802402001c01801401000c008cd4050054d5d0a80619a80a00a9aba1500b33501401635742a014666aa030eb9405cd5d0a804999aa80c3ae501735742a01066a02803e6ae85401cccd54060081d69aba150063232323333573466e1cd55cea801240004664424660020060046464646666ae68cdc39aab9d5002480008cc8848cc00400c008cd40a9d69aba15002302b357426ae8940088c98c80b4cd5ce01701681589aab9e5001137540026ae854008c8c8c8cccd5cd19b8735573aa004900011991091980080180119a8153ad35742a00460566ae84d5d1280111931901699ab9c02e02d02b135573ca00226ea8004d5d09aba2500223263202933573805405204e26aae7940044dd50009aba1500533501475c6ae854010ccd540600708004d5d0a801999aa80c3ae200135742a004603c6ae84d5d1280111931901299ab9c026025023135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d55cf280089baa00135742a004601c6ae84d5d1280111931900b99ab9c018017015101613263201633573892010350543500016135573ca00226ea800448c88c008dd6000990009aa80a911999aab9f0012500a233500930043574200460066ae880080508c8c8cccd5cd19b8735573aa004900011991091980080180118061aba150023005357426ae8940088c98c8050cd5ce00a80a00909aab9e5001137540024646464646666ae68cdc39aab9d5004480008cccc888848cccc00401401000c008c8c8c8cccd5cd19b8735573aa0049000119910919800801801180a9aba1500233500f014357426ae8940088c98c8064cd5ce00d00c80b89aab9e5001137540026ae854010ccd54021d728039aba150033232323333573466e1d4005200423212223002004357426aae79400c8cccd5cd19b875002480088c84888c004010dd71aba135573ca00846666ae68cdc3a801a400042444006464c6403666ae7007006c06406005c4d55cea80089baa00135742a00466a016eb8d5d09aba2500223263201533573802c02a02626ae8940044d5d1280089aab9e500113754002266aa002eb9d6889119118011bab00132001355012223233335573e0044a010466a00e66442466002006004600c6aae754008c014d55cf280118021aba200301213574200222440042442446600200800624464646666ae68cdc3a800a40004642446004006600a6ae84d55cf280191999ab9a3370ea0049001109100091931900819ab9c01101000e00d135573aa00226ea80048c8c8cccd5cd19b875001480188c848888c010014c01cd5d09aab9e500323333573466e1d400920042321222230020053009357426aae7940108cccd5cd19b875003480088c848888c004014c01cd5d09aab9e500523333573466e1d40112000232122223003005375c6ae84d55cf280311931900819ab9c01101000e00d00c00b135573aa00226ea80048c8c8cccd5cd19b8735573aa004900011991091980080180118029aba15002375a6ae84d5d1280111931900619ab9c00d00c00a135573ca00226ea80048c8cccd5cd19b8735573aa002900011bae357426aae7940088c98c8028cd5ce00580500409baa001232323232323333573466e1d4005200c21222222200323333573466e1d4009200a21222222200423333573466e1d400d2008233221222222233001009008375c6ae854014dd69aba135744a00a46666ae68cdc3a8022400c4664424444444660040120106eb8d5d0a8039bae357426ae89401c8cccd5cd19b875005480108cc8848888888cc018024020c030d5d0a8049bae357426ae8940248cccd5cd19b875006480088c848888888c01c020c034d5d09aab9e500b23333573466e1d401d2000232122222223005008300e357426aae7940308c98c804ccd5ce00a00980880800780700680600589aab9d5004135573ca00626aae7940084d55cf280089baa0012323232323333573466e1d400520022333222122333001005004003375a6ae854010dd69aba15003375a6ae84d5d1280191999ab9a3370ea0049000119091180100198041aba135573ca00c464c6401866ae700340300280244d55cea80189aba25001135573ca00226ea80048c8c8cccd5cd19b875001480088c8488c00400cdd71aba135573ca00646666ae68cdc3a8012400046424460040066eb8d5d09aab9e500423263200933573801401200e00c26aae7540044dd500089119191999ab9a3370ea00290021091100091999ab9a3370ea00490011190911180180218031aba135573ca00846666ae68cdc3a801a400042444004464c6401466ae7002c02802001c0184d55cea80089baa0012323333573466e1d40052002200723333573466e1d40092000212200123263200633573800e00c00800626aae74dd5000a4c2400292010350543100122002112323001001223300330020020011"
    },
    alwaysTrue:{
        addr: "todo",
        cborHex: "59079559079201000033232323232323232323232323232332232323232323232222232325335333006300800530070043333573466e1cd55cea80124000466442466002006004646464646464646464646464646666ae68cdc39aab9d500c480008cccccccccccc88888888888848cccccccccccc00403403002c02802402001c01801401000c008cd4060064d5d0a80619a80c00c9aba1500b33501801a35742a014666aa038eb9406cd5d0a804999aa80e3ae501b35742a01066a0300466ae85401cccd54070091d69aba150063232323333573466e1cd55cea801240004664424660020060046464646666ae68cdc39aab9d5002480008cc8848cc00400c008cd40b9d69aba15002302f357426ae8940088c98c80c8cd5ce01981901809aab9e5001137540026ae854008c8c8c8cccd5cd19b8735573aa004900011991091980080180119a8173ad35742a004605e6ae84d5d1280111931901919ab9c033032030135573ca00226ea8004d5d09aba2500223263202e33573805e05c05826aae7940044dd50009aba1500533501875c6ae854010ccd540700808004d5d0a801999aa80e3ae200135742a00460446ae84d5d1280111931901519ab9c02b02a028135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d55cf280089baa00135742a00460246ae84d5d1280111931900e19ab9c01d01c01a101b13263201b3357389201035054350001b135573ca00226ea80054049404448c88c008dd6000990009aa80a911999aab9f0012500a233500930043574200460066ae880080548c8c8cccd5cd19b8735573aa004900011991091980080180118061aba150023005357426ae8940088c98c8054cd5ce00b00a80989aab9e5001137540024646464646666ae68cdc39aab9d5004480008cccc888848cccc00401401000c008c8c8c8cccd5cd19b8735573aa0049000119910919800801801180a9aba1500233500f014357426ae8940088c98c8068cd5ce00d80d00c09aab9e5001137540026ae854010ccd54021d728039aba150033232323333573466e1d4005200423212223002004357426aae79400c8cccd5cd19b875002480088c84888c004010dd71aba135573ca00846666ae68cdc3a801a400042444006464c6403866ae700740700680640604d55cea80089baa00135742a00466a016eb8d5d09aba2500223263201633573802e02c02826ae8940044d5d1280089aab9e500113754002266aa002eb9d6889119118011bab00132001355012223233335573e0044a010466a00e66442466002006004600c6aae754008c014d55cf280118021aba200301313574200222440042442446600200800624464646666ae68cdc3a800a40004642446004006600a6ae84d55cf280191999ab9a3370ea0049001109100091931900899ab9c01201100f00e135573aa00226ea80048c8c8cccd5cd19b875001480188c848888c010014c01cd5d09aab9e500323333573466e1d400920042321222230020053009357426aae7940108cccd5cd19b875003480088c848888c004014c01cd5d09aab9e500523333573466e1d40112000232122223003005375c6ae84d55cf280311931900899ab9c01201100f00e00d00c135573aa00226ea80048c8c8cccd5cd19b8735573aa004900011991091980080180118029aba15002375a6ae84d5d1280111931900699ab9c00e00d00b135573ca00226ea80048c8cccd5cd19b8735573aa002900011bae357426aae7940088c98c802ccd5ce00600580489baa001232323232323333573466e1d4005200c21222222200323333573466e1d4009200a21222222200423333573466e1d400d2008233221222222233001009008375c6ae854014dd69aba135744a00a46666ae68cdc3a8022400c4664424444444660040120106eb8d5d0a8039bae357426ae89401c8cccd5cd19b875005480108cc8848888888cc018024020c030d5d0a8049bae357426ae8940248cccd5cd19b875006480088c848888888c01c020c034d5d09aab9e500b23333573466e1d401d2000232122222223005008300e357426aae7940308c98c8050cd5ce00a80a00900880800780700680609aab9d5004135573ca00626aae7940084d55cf280089baa0012323232323333573466e1d400520022333222122333001005004003375a6ae854010dd69aba15003375a6ae84d5d1280191999ab9a3370ea0049000119091180100198041aba135573ca00c464c6401a66ae7003803402c0284d55cea80189aba25001135573ca00226ea80048c8c8cccd5cd19b875001480088c8488c00400cdd71aba135573ca00646666ae68cdc3a8012400046424460040066eb8d5d09aab9e500423263200a33573801601401000e26aae7540044dd500089119191999ab9a3370ea00290021091100091999ab9a3370ea00490011190911180180218031aba135573ca00846666ae68cdc3a801a400042444004464c6401666ae7003002c02402001c4d55cea80089baa0012323333573466e1d40052002212200223333573466e1d40092000212200123263200733573801000e00a00826aae74dd5000891999ab9a3370e6aae74dd5000a40004008464c6400866ae700140100092612001490103505431001123230010012233003300200200122212200201"
    }
}

const manualFee = 900000;

const secondWallet = {
    nami: "addr_test1qzfje6pa0a5jfwfdd7ns4sskpkrmh03c04nxf0dgqqa8s7t0ar7j04mgg9s0g5v4nqcrzm0fspekjx6m4xqscxm9xawsydhj9m",
    yoroi: "addr_test1qz39gvxc9dquhs654fv9ckh0zrpm6y9nneq5zly38z7hvucz3f0w0tuz2tusdfgeqmhf45lkllpsulxunavvxtgpgyxqaxtn79"
}

export default class VidbidContractService {
    constructor(cardanoService) {
        this.apiService = new ApiService();
        this.cardanoService = cardanoService;
    }

    async sendAda(adaAmount){
        const lovelaceAmount = convertAdaAmountToLovelaceString(adaAmount);
        let txBuilder = await initTransactionBuilder();
        txBuilder = appendTxBuilderWithAdaOutput(txBuilder,secondWallet.yoroi, lovelaceAmount);
        let utxos = await this.cardanoService.getUtxos();
        utxos = utxos.filter(utxo => Number(utxo.amount) > 99748981)
        txBuilder = appendTxBuilderWithAdaInput(txBuilder, utxos)
        const changeAddress = await this.cardanoService.getChangeAddress();
        txBuilder = appendTxBuilderWithFee(txBuilder, {changeAddress})

        const signedTx = await this.cardanoService.signTx(txBuilder)
        console.log("Tx signed", signedTx)
        // const txId = await this.cardanoService.submitTx(signedTx)
        // console.log(txId)
    }

    async sendAdaToScript(adaAmount){
        let txBuilder = await initTransactionBuilder();
        //output
        const lovelaceAmount = convertAdaAmountToLovelaceString(adaAmount);
        const scriptAddress = getScriptAddressFromScriptCborHex(scriptAddresses.alwaysTrue.cborHex);
        const plutusData = generatePlutusDatumFromJson(42);
        txBuilder = appendTxBuilderWithScriptOutput(txBuilder, scriptAddress, plutusData, lovelaceAmount);

        //input
        let utxos = await this.cardanoService.getUtxos();
        utxos = utxos.filter(utxo => Number(utxo.amount) > 99748981)
        txBuilder = appendTxBuilderWithAdaInput(txBuilder, utxos)
        const changeAddress = await this.cardanoService.getChangeAddress();

        //fees
        txBuilder = appendTxBuilderWithFee(txBuilder, {changeAddress})

        const signedTx = await this.cardanoService.signTx(txBuilder)
        console.log("Tx signed", signedTx)
        const txId = await this.cardanoService.submitTx(signedTx)
        console.log(txId)
    }

    async mintToken(adaAmount){
        let txBuilder = await initTransactionBuilder();
        //output
        const changeAddress = await this.cardanoService.getChangeAddress();
        const lovelaceAmount = convertAdaAmountToLovelaceString(adaAmount);
        txBuilder = appendTxBuilderWithAdaOutput(txBuilder, changeAddress, Number(lovelaceAmount - manualFee))

        //input
        const scriptAddress = getScriptAddressFromScriptCborHex(scriptAddresses.alwaysTrue.cborHex);
        txBuilder = appendTxBuilderWithScriptInput(txBuilder, scriptAddress, "1eacf49c3104d6d59a73074f18518e988e2d17f75de92480da5b124f5b336606");
        console.log("add input")
        //fees
        txBuilder = appendTxBuilderWithFee(txBuilder, {manualFee})
        console.log("add fee")

        const scriptObject ={
            cborHex: scriptAddresses.alwaysTrue.cborHex,
            datums: generatePlutusDatumFromJson(42),
            redeemers: generateRedeemers(42)
        }

        const unSignedTx = await this.cardanoService.createUnsignedTx(txBuilder, scriptObject, [changeAddress])
        const apiRes = await this.apiService.upload(unSignedTx,changeAddress)
        console.log(apiRes)
        const signedTx = await this.cardanoService.signTx(apiRes.signedTx)
        console.log("Tx signed", signedTx)
        const txId = await this.cardanoService.submitTx(signedTx)
        console.log(txId)
    }
}

//"transaction submit error ShelleyTxValidationError ShelleyBasedEraBabbage (ApplyTxError [UtxowFailure (FromAlonzoUtxowFail (WrappedShelleyEraFailure (ExtraneousScriptWitnessesUTXOW (fromList [ScriptHash \"835c21cabfe3e91e478b5a49b13ad9f114d849c073f500c795421a06\"])))),UtxowFailure (FromAlonzoUtxowFail (WrappedShelleyEraFailure (MissingScriptWitnessesUTXOW (fromList [ScriptHash \"0faaa12ca80ba73aa7dcfe92ee032299767705adc5fdc0b6d2adb708\"])))),UtxowFailure (FromAlonzoUtxowFail (NonOutputSupplimentaryDatums (fromList [SafeHash \"9e1199a988ba72ffd6e9c269cadb3b53b5f360ff99f112d9b2ee30c4d74ad88b\"]) (fromList []))),UtxowFailure (FromAlonzoUtxowFail (ExtraRedeemers [RdmrPtr Spend 0])),UtxowFailure (FromAlonzoUtxowFail (PPViewHashesDontMatch (SJust (SafeHash \"11766e6b4edc19e5efd2f85b69118711a46de4d1bf32896aaf8fced63fc4b1a0\")) (SJust (SafeHash \"503440c63d4402dd244286c0d2eb18d022407dab59e64e347f0b878f2d692713\"))))])"