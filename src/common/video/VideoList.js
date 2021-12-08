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


export default function VideoList({vidList = []}){
    if(vidList === null || vidList.length === 0){
      return (
          <div>no vids</div>
      )
    }else {
        return (
            <Grid columns={5}>
                {
                    vidList.map( vid => {
                        return(
                            <Grid.Column>
                                <VideoCardWrapper>
                                    <VideoCard video={vid}/>
                                </VideoCardWrapper>
                            </Grid.Column>
                        )
                    } )
                }
            </Grid>
        );
    }

}