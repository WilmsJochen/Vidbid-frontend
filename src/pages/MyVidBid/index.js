import React, {useContext} from "react";
import { Header } from 'semantic-ui-react'
import VideoList from "../../common/video/VideoList";
import {FavoriteVidsContext} from "../../contextProviders/FavoriteVidsProvider";
import {OwnedVidsContext} from "../../contextProviders/OwnedVidsProvider";
import styled from "styled-components";


const HeaderWrapper = styled.div`
  margin-left: 2%;
  margin-top: 2%;
  margin-bottom: 1%;
`

export default function MyVidBidPage() {
    const [favoriteVids]= useContext(FavoriteVidsContext)
    const ownedVidsList = useContext(OwnedVidsContext)

    return (
        <div>
            <HeaderWrapper>
                <Header as='h2'>
                    MyVids
                    <Header.Subheader>
                        Video's that i own.
                    </Header.Subheader>
                </Header>
            </HeaderWrapper>
            <VideoList vidList={ownedVidsList}/>
            <HeaderWrapper>
                <Header as='h2'>
                    Favorites
                    <Header.Subheader>
                        My favorite videos
                    </Header.Subheader>
                </Header>
            </HeaderWrapper>
            <VideoList vidList={favoriteVids}/>
        </div>
    );
}