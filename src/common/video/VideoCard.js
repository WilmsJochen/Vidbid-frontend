import React, { useState }  from "react";
import { Card, Icon } from 'semantic-ui-react'
import styled from 'styled-components'

const VideoFrameWrapper = styled.div`
  overflow: hidden;
  padding-bottom: 56.25%;
  position: relative;
  height: 0;
`

const VideoFrame = styled.iframe`
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  position: absolute;
`

export default function VideoCard({youtubeId, adaPrice, title, description }){

    return (
        <Card>
            <VideoFrameWrapper>
                <VideoFrame
                    width="853"
                    height="480"
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Embedded youtube"
                />
            </VideoFrameWrapper>
            <Card.Content>
                <Card.Header>{title}</Card.Header>
                <Card.Description>
                    {description}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                {adaPrice} ₳
            </Card.Content>
        </Card>
    );
}