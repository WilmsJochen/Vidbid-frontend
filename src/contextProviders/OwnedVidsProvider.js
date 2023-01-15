import React,{ createContext, useState, useEffect} from 'react';
import BackendService from "../services/ApiService";

export const OwnedVidsContext = createContext();
const backendService = new BackendService();

export function OwnedVidsProvider({children}) {
    const [ownedVidsList, setOwnedVidsList] =  useState()

    useEffect(()=>{
        const fetchItems = async () => {
            const ownedVids = await backendService.getOwnedVids();
            setOwnedVidsList(ownedVids);
        }
        fetchItems().catch( e => console.log(e));
    },[setOwnedVidsList]);

    return (
        <OwnedVidsContext.Provider value={ownedVidsList}>
            {children}
        </OwnedVidsContext.Provider>
    );
}