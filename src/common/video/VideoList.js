import React, { useContext, useState, useEffect }  from "react";
import { Grid, Dimmer, Loader } from 'semantic-ui-react'
import styled from "styled-components";

import VideoCard from "./VideoCard";
import {Top5VidsContext}  from "../../contextProviders/Top5VidsProvider";
import {AllVidsContext}  from "../../contextProviders/AllVidsProvider";

const VideoCardWrapper = styled.div`
  margin-left : 10%;
  margin-right : 10%;
`

const LoaderWrapper = styled.div`
  margin : 1px;
`

export default function VideoList({isForTop5 = false}){
    const [top5VidsList, setTop5VidsList] =  useContext(Top5VidsContext);
    // const [allVidsList, setAllVidsList] =  useContext(AllVidsContext);

    if(!(isForTop5 ? top5VidsList : top5VidsList)) return (
        <LoaderWrapper>
            <Dimmer active>
                <Loader>Loading</Loader>
            </Dimmer>
        </LoaderWrapper>

    );

    return (
        <Grid columns={5}>
            {
                (isForTop5 ? top5VidsList : top5VidsList).map( vid => {
                    return(
                        <Grid.Column>
                            <VideoCardWrapper>
                                <VideoCard youtubeId={vid.id} title={vid.title} description={vid.description} adaPrice={vid.adaPrice}/>
                            </VideoCardWrapper>
                        </Grid.Column>
                    )
                } )
            }
        </Grid>
    );
}