import React from "react";
import styled  from 'styled-components'
import {Card, Image, Icon} from "semantic-ui-react";

import jochenImg from "./images/jochen.jpeg"
const BadgeWrapper = styled.div`
  margin: 1%;
`

export default function TeamPage() {
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