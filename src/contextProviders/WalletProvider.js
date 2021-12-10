import React,{ createContext, useState, useEffect} from 'react';
import cbor from 'cbor'

export const WalletContext = createContext();

function parseHexString(str) {
    return Buffer.from(str, "hex")
}


export function WalletProvider({children}) {

    const walletProvider = window.cardano

    const [isWalletConnected, setIsWalletConnected] =  useState(false)
    const [walletAddress, setWalletAddress] =  useState("")
    const [balances, setBalances] =  useState({})
    const [walletNetwork, setWalletNetwork] =  useState("testnet")

    const connectWallet = () =>{
        walletProvider.enable();
    }
    const disconnectWallet = () =>{
        //TODO
        console.log("TODO")
    }

    useEffect(()=>{
        const fetchItems = async () => {
            walletProvider.isEnabled().then(isConnected => setIsWalletConnected(isConnected))
            walletProvider.getChangeAddress().then(hexAddress => {
                setWalletAddress(hexAddress)
            });
            walletProvider.getBalance().then( balanceCBOR =>{
                cbor.decodeFirst(balanceCBOR, (error, balanceObj) => {
                    setBalances(balanceObj)
                })
            });
            walletProvider.getNetworkId().then(network => network === 1 ? setWalletNetwork("mainnet"): setWalletNetwork("testnet") )
        }
        fetchItems().catch( e => console.log(e));
    },[setIsWalletConnected,setWalletAddress, setBalances, setWalletNetwork]);

    return (
        <WalletContext.Provider value={{isWalletConnected, connectWallet, disconnectWallet, walletAddress, balances, walletNetwork}}>
            {children}
        </WalletContext.Provider>
    );
}