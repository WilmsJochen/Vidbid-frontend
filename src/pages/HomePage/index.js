import React, {useEffect, useState} from "react";
import VideoList from "../../common/video/VideoList";
import {Header, Modal} from 'semantic-ui-react'
import BackendService from "../../services/backendService";
import RoadMapPage from "../RoadMap";
import styled from "styled-components";

const backendService = new BackendService();
const RoadMapPageWrapper = styled.div`
  margin: 4%;
`
const HeaderWrapper = styled.div`
  margin-left: 2%;
  margin-top: 2%;
  margin-bottom: 1%;
`

export default function PublicSite({showRoadmap= false}) {

    const [allVidsList, setAllVidsList] =  useState([])
    const [top5VidsList, setTop5VidsList] =  useState()
    const [showRoadMapModal, setShowRoadMapModal] =  useState(showRoadmap)


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
            <Modal
                basic
                onClose={() => setShowRoadMapModal(false)}
                onOpen={() => setShowRoadMapModal(true)}
                open={showRoadMapModal}>
                <RoadMapPageWrapper>
                    <RoadMapPage/>
                </RoadMapPageWrapper>
            </Modal>
            <HeaderWrapper>
                <Header as='h2' >
                    Top 5
                    <Header.Subheader>
                        Best performing video's of this platform
                    </Header.Subheader>
                </Header>
            </HeaderWrapper>
            <VideoList vidList={top5VidsList}/>
            <HeaderWrapper>
                <Header as='h2'>
                    All video's
                    <Header.Subheader>
                        All available video's
                    </Header.Subheader>
                </Header>
            </HeaderWrapper>
            <VideoList vidList={allVidsList}/>
        </div>
    );
}