import React, {useEffect, useState} from "react";
import { useTranslation } from "react-i18next";
import _ from 'lodash'
import { Image,Header, Grid, Search } from 'semantic-ui-react'
import BackendService from "../../services/backendService";
import VideoList from "../../common/video/VideoList";


const backendService = new BackendService();
export default function MyVidBidPage() {
    const { t } = useTranslation();

    const [myVids, setMyVids] =  useState([])
    const [myFavourites, setMyFavourites] =  useState([])

    useEffect(()=>{
        const fetchVids = async () => {
            const myvids = await backendService.getMyVids();
            setMyVids(myvids);
        }
        fetchVids().catch( e => console.log(e));
        setMyFavourites([])
    },[setMyVids,setMyFavourites]);

    return (
        <div>
            <Header as='h2'>
                MyVids
                <Header.Subheader>
                    Video's that i own.
                </Header.Subheader>
            </Header>
            <VideoList vidList={myVids}/>
            <Header as='h2'>
                Favorites
                <Header.Subheader>
                    My favorite videos
                </Header.Subheader>
            </Header>
            <VideoList vidList={myVids}/>
        </div>
    );
}