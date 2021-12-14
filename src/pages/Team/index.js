import React, {useEffect} from "react";
import styled  from 'styled-components'
import {Card, Image, Icon} from "semantic-ui-react";

import jochenImg from "./images/jochen.jpeg"
const BadgeWrapper = styled.div`
  margin: 1%;
`

export default function TeamPage() {
    useEffect(() => {
        const script = document.createElement('script');

        script.src = 'https://platform.linkedin.com/badges/js/profile.js';
        script.async = true;
        script.defer = true;

        document.getElementById("badge").appendChild(script);

        return () => {
            document.getElementById("badge").removeChild(script);
        };
    });
    return (
        <BadgeWrapper id={"badge"}>
            <Card>
                <Image src={jochenImg} wrapped ui={false} />
                <Card.Content>
                    <Card.Header>Jochen</Card.Header>
                    <Card.Meta>
                        <span className='date'>Founded in 2021</span>
                    </Card.Meta>
                    <Card.Description>
                        Jochen is the passionated founder of Vidbid.
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <a href={"https://www.linkedin.com/in/jochen-wilms/"}>
                        <Icon name='linkedin' />
                        Jochen Wilms
                    </a>
                </Card.Content>
            </Card>

        </BadgeWrapper>
    );
}