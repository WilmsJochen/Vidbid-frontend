import React, { useContext }  from "react";
import {Button} from 'semantic-ui-react'
import styled from 'styled-components'
import {OwnedVidsContext} from "../../../contextProviders/OwnedVidsProvider";
import OpenActionButton from "./OpenActionButton";
import BidActionButton from "./BidActionButton";

const stateActions = {
    Initialised: ()=> {return null},
    Opened: (video, ownedVids) => {
        if(!isVidOwnedByUser(video,ownedVids)){
            return "Bid"
        }
    },
    Offered: (video, ownedVids) => {
            return "Bid"
    },
    Closed: (video, ownedVids) => {
        if(isVidOwnedByUser(video,ownedVids)){
            return "Open"
        }
    },
    Destroyed: ()=> {return null}
}

const actionButtonMap ={
    Bid: (video) => <BidActionButton video={video}/> ,
    Open: (video) => <OpenActionButton video={video}/>,
    null: () => <></>
}


function isVidOwnedByUser(video, ownedVids){
    return ownedVids.map(vid => vid.id).includes(video.id);
}


export default function VideoActionButton({video}){
    const ownedVids= useContext(OwnedVidsContext)
    if(video === undefined || video === null) return null;

    const action = stateActions[video.status](video,ownedVids);
    return (actionButtonMap[action](video));
}