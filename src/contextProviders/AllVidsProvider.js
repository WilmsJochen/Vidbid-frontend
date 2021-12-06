import React,{ createContext, useState, useEffect} from 'react';
import BackendService from "../services/backendService";

export const AllVidsContext = createContext();
const backendService = new BackendService();

export function AllVidsProvider({children}) {
    const [allVidsList, setAllVidsList] =  useState()

    useEffect(()=>{
        const fetchItems = async () => {
            return await backendService.getAllVids();
        }
        fetchItems().then( vids => setAllVidsList(vids));
    });

    return (
        <AllVidsContext.Provider value={[allVidsList, setAllVidsList]}>
            {children}
        </AllVidsContext.Provider>
    );
}