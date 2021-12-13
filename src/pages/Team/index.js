import React, {useEffect, useState} from "react";
import { useTranslation } from "react-i18next";
import styled, { keyframes } from 'styled-components'


export default function TeamPage() {
    useEffect(() => {
        const script = document.createElement('script');

        script.src = 'https://platform.linkedin.com/badges/js/profile.js';
        script.async = true;
        script.defer = true;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    });
    return (
        <div>
            <div
                className="badge-base LI-profile-badge"
                data-locale="en_US"
                data-size="large"
                data-theme="dark"
                data-type="VERTICAL"
                data-vanity="jochen-wilms"
                data-version="v1"
            >
                <a
                    className="badge-base__link LI-simple-link"
                    href="https://au.linkedin.com/in/jochen-wilms?trk=profile-badge"
                />
            </div>
        </div>
    );
}