import React, {useState} from "react";
import { useTranslation } from "react-i18next";
import VideoList from "../../common/video/VideoList";
import { Header, Icon } from 'semantic-ui-react'

export default function PublicSite() {
    const { t } = useTranslation();


    return (
        <div>
            <Header as='h2'>
                Top 5
                <Header.Subheader>
                    Best performing video's of this platform
                </Header.Subheader>
            </Header>
            <VideoList isForTop5={true}/>
            <Header as='h2'>
                All video's
                <Header.Subheader>
                    All available video's
                </Header.Subheader>
            </Header>
            <VideoList/>
        </div>
    );
}