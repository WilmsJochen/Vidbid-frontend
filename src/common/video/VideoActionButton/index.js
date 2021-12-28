import React, { useContext }  from "react";
import {OwnedVidsContext} from "../../../contextProviders/OwnedVidsProvider";
import OpenActionButton from "./OpenActionButton";
import BidActionButton from "./BidActionButton";
import GrabActionButton from "./GrabActionButton";

const stateActions = {
    Initialised: ()=> [],
    Opened: (video, ownedVids) => {
        if(!isVidOwnedByUser(video,ownedVids)){
            return ["Bid"]
        }
    },
    Offered: (video, ownedVids) => {
            return ["Bid"]
    },
    Closed: (video, ownedVids) => {
        if(isVidOwnedByUser(video,ownedVids)){
            return ["Open", "Grab"]
        }
    },
    Destroyed: ()=> []
}

const actionButtonMap ={
    Bid: (video) => <BidActionButton video={video}/> ,
    Open: (video) => <OpenActionButton video={video}/>,
    Grab: (video) => <GrabActionButton video={video}/>,
    null: () => <></>
}


function isVidOwnedByUser(video, ownedVids){
    return ownedVids.map(vid => vid.id).includes(video.id);
}


export default function VideoActionButton({video}){
    const ownedVids= useContext(OwnedVidsContext)
    if(video === undefined || video === null) return null;

    const actions = stateActions[video.status](video,ownedVids);
    return (actions.map(action => {
        return <div>
            {actionButtonMap[action](video)}
        </div>
    }));
}