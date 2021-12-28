import React, { useContext }  from "react";
import {Card, Grid, Icon} from 'semantic-ui-react'
import styled from 'styled-components'

import {FavoriteVidsContext}  from "../../contextProviders/FavoriteVidsProvider";
import VideoActionButton  from "./VideoActionButton";
import VideoFrame  from "./VideoFrame";

const VideoFrameWrapper = styled.div`
  overflow: hidden;
  padding-bottom: 56.25%;
  position: relative;
  height: 0;
`

const ActionButtonWrapper = styled.div`
  margin-left: 0;
`
const StarWrapper = styled.div`
  margin-left: 0;
`

export default function VideoCard({video}){
    // eslint-disable-next-line no-unused-vars
    const [favoriteVids, setFavoriteVids, addFavoriteVid,deleteFavoriteVid]= useContext(FavoriteVidsContext)
    const isFavoriteVid = favoriteVids.map(vid => vid.id).includes(video.id);
    const removeFromFavorites = () => {
        deleteFavoriteVid(video.id);
    }
    const addToFavorites = () => {
        addFavoriteVid(video);
    }
    return (
        <Card>
            <VideoFrameWrapper>
                <VideoFrame video={video} />
            </VideoFrameWrapper>
            <Card.Content>
                <Card.Header>{video.title}</Card.Header>
                <Grid>
                    <Grid.Row columns={14}>
                        <Grid.Column width={13}>
                            <Card.Description>
                                {video.description}
                            </Card.Description>
                        </Grid.Column>
                        <Grid.Column width={1}>
                            <StarWrapper>
                                {isFavoriteVid ? <div onClick={removeFromFavorites}> <Icon name='star' color='yellow'/></div> : <div onClick={addToFavorites}><Icon name='star outline' /></div>}
                            </StarWrapper>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Card.Content>
            <Card.Content extra>
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            <div>
                                {video.adaPrice} ₳
                            </div>
                            <div>
                                <Icon name='user' />
                                {video.views} Views
                            </div>
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <ActionButtonWrapper>
                                <VideoActionButton video={video}/>
                            </ActionButtonWrapper>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

            </Card.Content>
        </Card>
    );
}