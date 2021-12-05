import React, { useState }  from "react";
import { Grid } from 'semantic-ui-react'
import VideoCard from "./VideoCard";

const vidListMock = [
    {
        id: "KfFRyml6Y2U",
        title: "Kevin de Vries - Planet X",
        description: "UNITED THROUGH MUSIC.",
        adaPrice: 150,
    },
    {
        id: "KfFRyml6Y2U",
        title: "Kevin de Vries - Planet X",
        description: "UNITED THROUGH MUSIC.",
        adaPrice: 150,
    },
    {
        id: "KfFRyml6Y2U",
        title: "Kevin de Vries - Planet X",
        description: "UNITED THROUGH MUSIC.",
        adaPrice: 150,
    },
    {
        id: "KfFRyml6Y2U",
        title: "Kevin de Vries - Planet X",
        description: "UNITED THROUGH MUSIC.",
        adaPrice: 150,
    },
    {
        id: "KfFRyml6Y2U",
        title: "Kevin de Vries - Planet X",
        description: "UNITED THROUGH MUSIC.",
        adaPrice: 150,
    }
]

export default function VideoList(){

    return (
        <Grid columns={3}>
            {
                vidListMock.map( vid => {
                    return(
                        <Grid.Column>
                            <VideoCard youtubeId={vid.id} title={vid.title} description={vid.description} adaPrice={vid.adaPrice}/>
                        </Grid.Column>
                    )
                } )
            }
        </Grid>
    );
}