import React,{ createContext, useState, useEffect} from 'react';
import BackendService from "../services/backendService";

export const OwnedVidsContext = createContext();
const backendService = new BackendService();

export function OwnedVidsProvider({children}) {
    const [ownedVidsList, setOwnedVidsList] =  useState()

    useEffect(()=>{
        const fetchItems = async () => {
            const ownedVids = await backendService.getOwnedVids();
            console.log("ownedVids")
            console.log(ownedVids)
            setOwnedVidsList(ownedVids);
        }
        fetchItems().catch( e => console.log(e));
    },[setOwnedVidsList]);
    console.log("ownedVidsList")
    console.log(ownedVidsList)
    return (
        <OwnedVidsContext.Provider value={ownedVidsList}>
            {children}
        </OwnedVidsContext.Provider>
    );
}