import React,{ createContext, useState, useEffect} from 'react';

export const FavoriteVidsContext = createContext();

export function FavoriteVidsProvider({children}) {
    const [favoriteVids, setFavoriteVids] =  useState([])

    const addFavoriteVid = (vid) =>{
        const newList = [...favoriteVids];
        newList.push(vid);
        localStorage.setItem('favoriteVids', JSON.stringify(newList));
        setFavoriteVids(newList);
    }
    const deleteFavoriteVid = (vidId) =>{
        const newList = favoriteVids.filter(favoriteVid => favoriteVid.id !== vidId );
        localStorage.setItem('favoriteVids', JSON.stringify(newList));
        setFavoriteVids(newList);
    }

    useEffect(()=>{
        const vids = localStorage.getItem('favoriteVids');
        if(vids != null){
            setFavoriteVids(JSON.parse(vids));
        }
    },[setFavoriteVids]);

    return (
        <FavoriteVidsContext.Provider value={[favoriteVids, setFavoriteVids, addFavoriteVid,deleteFavoriteVid]}>
            {children}
        </FavoriteVidsContext.Provider>
    );
}