import React, {useEffect, useState} from "react";
import { useTranslation } from "react-i18next";
import styled, { keyframes } from 'styled-components'

import BackendService from "../../services/backendService";
import {Header} from "semantic-ui-react";

const backendService = new BackendService();

const breatheAnimation = keyframes`
  0% { height: 100px; width: 100px; }
  30% { height: 400px; width: 400px; opacity: 1 }
  40% { height: 405px; width: 405px; opacity: 0.3; }
  100% { height: 100px; width: 100px; opacity: 0.6; }
`
const Circle = styled.div`
 height: 100px;
 width: 100px;
 border-style: solid;
 border-width: 5px;
 border-color: black;
 animation-name: ${breatheAnimation};
 animation-duration: 8s;
 animation-iteration-count: infinite;
`
const Container = styled.div`
 display: flex;
 align-items: center;
 justify-content: center;
 flex-direction: column;
 height: 450px;
`

export default function Demo() {
    const { t } = useTranslation();

    const [demoObjects, setDemoObjects] =  useState([])

    useEffect(()=>{
        const fetchVids = async () => {
            try{
                const resp = await backendService.getDemo();
                setDemoObjects(resp)
            }catch (e) {
                console.log(e)
            }
        }
        fetchVids().catch( e => console.log(e));
    },[setDemoObjects]);

    return (
        <div>
        {/*<Container>*/}
        {/*    <Circle>*/}
                {demoObjects.map(demoObject => {
                    return (<div>
                        <Header>{demoObject.name}</Header>
                        <table>
                            {Object.keys(demoObject.subObjects).map(subObjectKey => {
                                console.log(demoObject)
                                console.log(subObjectKey)
                                return (
                                    <tr>
                                        <td>{subObjectKey}</td>
                                        <td>{demoObject.subObjects[subObjectKey]}</td>
                                    </tr>
                                )
                            })}
                        </table>
                    </div>
                    )})}
        {/*    </Circle>*/}
        {/*</Container>*/}
        </div>
    );
}