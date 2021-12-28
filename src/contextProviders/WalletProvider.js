import React,{ createContext, useState, useEffect} from 'react';
import cbor from 'cbor'

export const WalletContext = createContext();

export function WalletProvider({children}) {

    const wallet = window.cardano

    const [isWalletConnected, setIsWalletConnected] =  useState(false)
    const [walletAddress, setWalletAddress] =  useState("")
    const [balances, setBalances] =  useState({})
    const [walletNetwork, setWalletNetwork] =  useState("testnet")
    const [walletId, setWalletId] =  useState("testnet")

    const connectWallet = () =>{
        wallet.enable();
    }
    const disconnectWallet = () =>{
        //TODO
        console.log("TODO")
    }

    const getWalletId = async () =>{
        const walletUsedAddresses = await wallet.getUsedAddresses();
        const walletUnusedAddresses = await wallet.getUnusedAddresses();
        const addresses = walletUnusedAddresses.concat(walletUsedAddresses)
        return require('blake2b')(20)
            .update(Buffer.from(addresses.map(a => a.to_bech32).join('')))
            .digest('hex')
    }


    // const logYoroiKeys = async () =>{
    //     const api = await wallet.yoroi.enable();
    //     const walletUnusedAddresses = await api.getUnusedAddresses();
    //
    //     walletUnusedAddresses.forEach(addr =>{
    //         cbor.decodeFirst(addr, (error, balanceObj) => {
    //             if(balanceObj) console.log(balanceObj.toString());
    //         })
    //     })
    //
    //
    // }

    useEffect(()=>{
        const fetchItems = async () => {
            const S = await import('@emurgo/cardano-serialization-lib-asmjs')

            const isConnected = await wallet.isEnabled();
            setIsWalletConnected(isConnected);
            const hexAddress = await wallet.getChangeAddress()
            const address = S.Address.from_bytes(
                Buffer.from(
                    hexAddress,
                    'hex'
                )
            ).to_bech32()
            setWalletAddress(address)

            const balanceCBOR = await wallet.getBalance();
            cbor.decodeFirst(balanceCBOR, (error, balanceObj) => {
                console.log(balanceObj.toString())
                setBalances(balanceObj)
            })
            const networkId = await wallet.getNetworkId()
            networkId === 1 ? setWalletNetwork("mainnet"): setWalletNetwork("testnet")

            const walletId = await getWalletId();
            setWalletId(walletId)
            // await logYoroiKeys();
        }
        fetchItems().catch( e => console.log(e));
    },[wallet, setWalletId, setIsWalletConnected, setWalletAddress, setBalances, setWalletNetwork, getWalletId]);

    return (
        <WalletContext.Provider value={{isWalletConnected, connectWallet, disconnectWallet, walletAddress, balances, walletNetwork, walletId}}>
            {children}
        </WalletContext.Provider>
    );
}