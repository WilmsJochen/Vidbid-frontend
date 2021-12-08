import React, {useEffect, useState} from "react";
import { useTranslation } from "react-i18next";
import VideoList from "../../common/video/VideoList";
import { Header, Icon } from 'semantic-ui-react'
import BackendService from "../../services/backendService";

const backendService = new BackendService();

export default function PublicSite() {
    const { t } = useTranslation();

    const [allVidsList, setAllVidsList] =  useState([])
    const [top5VidsList, setTop5VidsList] =  useState()

    useEffect(()=>{
        const fetchVids = async () => {
            const allVids = await backendService.getAllVids();
            const top5Vids = await backendService.getAllVids();
            setAllVidsList(allVids)
            setTop5VidsList(top5Vids)
        }
        fetchVids().catch( e => console.log(e));
    },[setAllVidsList, setTop5VidsList]);

    return (
        <div>
            <Header as='h2'>
                Top 5
                <Header.Subheader>
                    Best performing video's of this platform
                </Header.Subheader>
            </Header>
            <VideoList vidList={top5VidsList}/>
            <Header as='h2'>
                All video's
                <Header.Subheader>
                    All available video's
                </Header.Subheader>
            </Header>
            <VideoList vidList={allVidsList}/>
        </div>
    );
}