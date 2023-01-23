import React from "react";
import styled from "styled-components";

const StyledFrame = styled.iframe`
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  position: absolute;
`

export default function VideoFrame({video}){
    return (
        <></>
        // <StyledFrame
        //     width="853"
        //     height="480"
        //     src={`https://www.youtube.com/embed/${video.id}`}
        //     frameBorder="0"
        //     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        //     allowFullScreen
        //     title="Embedded youtube"
        // />
    )
}
