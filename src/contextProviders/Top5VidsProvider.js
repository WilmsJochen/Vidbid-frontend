import React,{ createContext, useState, useEffect} from 'react';
import BackendService from "../services/ApiService";

export const Top5VidsContext = createContext();
const backendService = new BackendService();

export function Top5VidsProvider({children}) {
    const [top5VidsList, setTop5VidsList] =  useState()

    useEffect(()=>{
        const fetchItems = async () => {
            return await backendService.getTop5Vids();
        }
        fetchItems().then( vids => setTop5VidsList(vids));
    });

    return (
        <Top5VidsContext.Provider value={[top5VidsList,setTop5VidsList]}>
            {children}
        </Top5VidsContext.Provider>
    );
}