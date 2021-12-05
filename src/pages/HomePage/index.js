import React, {useState} from "react";
import { useTranslation } from "react-i18next";
import VideoList from "../../common/video/VideoList";

export default function PublicSite() {
    const { t } = useTranslation();


    return (
        <div>
            <VideoList/>
        </div>
    );
}