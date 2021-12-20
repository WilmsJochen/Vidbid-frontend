import React  from "react";
import { Grid } from 'semantic-ui-react'
import styled from "styled-components";

import VideoCard from "./VideoCard";

const VideoCardWrapper = styled.div`
  margin-left : 10%;
  margin-right : 10%;
`

const NoVidsWrapper = styled.div`
  margin-left : 2%;
`

export default function VideoList({vidList = []}){
    if(vidList === null || vidList.length === 0){
      return (
          <NoVidsWrapper>no vids</NoVidsWrapper>
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