import React, {useEffect, useState} from "react";
import { useTranslation } from "react-i18next";
import styled, { keyframes } from 'styled-components'

import BackendService from "../../services/backendService";
import {Header, Table} from "semantic-ui-react";

const backendService = new BackendService();

const breatheAnimation = keyframes`
  0% { height: 100px; width: 100px; }
  30% { height: 400px; width: 400px; opacity: 1 }
  40% { height: 405px; width: 405px; opacity: 0.3; }
  100% { height: 100px; width: 100px; opacity: 0.6; }
`
const Circle = styled.div`
 height: 500px;
 width: 500px;
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
const TableWrapper = styled.div`
  margin-left: 20%;
  margin-right: 20%;
  margin-top: 2%;
`

export default function Demo() {
    const { t } = useTranslation();

    const [demoObjects, setDemoObjects] =  useState([])

    useEffect(()=>{
        const fetchVids = async () => {
            try{
                const resp = await backendService.getDemo();
                console.log(resp)
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
                    return (
                        <TableWrapper>
                        <Table celled striped>
                            <Table.Header>
                                <Table.Row textAlign='center'>
                                    <Table.HeaderCell colSpan='3'>{demoObject.name}</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {demoObject.subObjects.map(subObject => {
                                    return(
                                        <Table.Row>
                                            <Table.Cell collapsing textAlign='center'>
                                                {subObject.name}
                                            </Table.Cell>
                                            <Table.Cell collapsing textAlign='center'>
                                                {subObject.title}
                                            </Table.Cell>
                                        </Table.Row>
                                    )
                                })}
                            </Table.Body>
                        </Table>
                        </TableWrapper>
                    )})}
        {/*    </Circle>*/}
        {/*</Container>*/}
        </div>
    );
}