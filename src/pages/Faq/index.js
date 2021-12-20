import React, {useState} from "react";
import {Accordion, Header, Icon, List} from "semantic-ui-react";
import styled from "styled-components";

const ContentWrapper = styled.div`
  margin-left: 2%;
`
const PageWrapper = styled.div`
margin-left: 2%;
margin-top: 2%;
margin-bottom: 1%;
`

export default function FaqPage() {
    const [activeIndex, setActiveIndex] =  useState(-1)
    const handleClick = (e, titleProps) => {
        const { index } = titleProps
        const newIndex = activeIndex === index ? -1 : index
        setActiveIndex(newIndex)
    }
    return (
        <PageWrapper>
            <Header as={"h2"}>Frequently asked questions</Header>
            <Accordion fluid>
                <Accordion.Title
                    active={activeIndex === 1}
                    index={1}
                    onClick={handleClick}
                >
                    <Icon name='dropdown' />
                    What is Payday ?
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 1}>
                    <ContentWrapper>
                        <p>
                            On payday all youtube revenues are fairly divided over all running smart contracts instances depending on the amount of views.
                        </p>
                        <p>
                            This event will stop all open auctions and provide the Highest bidder with the NFT and the bid will be transferred to the previous owner of the NFT.
                        </p>
                        <p>
                            When the minimal price of the auction was not exceeded with a bid, the NFT will stay at the Owner.
                        </p>
                    </ContentWrapper>
                </Accordion.Content>
                <Accordion.Title
                    active={activeIndex === 100}
                    index={100}
                    onClick={handleClick}
                >
                    <Icon name='dropdown' />
                    Why should i post my video through VidBid?
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 100}>
                    <ContentWrapper>
                        <List as='ul'>
                            <List.Item as='li'>
                                VidBid will enable you to take quick profits out of your video, which will enable you to invest in the next video and grow as content creator.
                            </List.Item>
                            <List.Item as='li'>
                                Your video will end up in the VidBid Youtube channel that contains a more subscribers and will attract more viewers to your content.
                            </List.Item>
                            <List.Item as='li'>
                                On top of that will you be paid out in Cardano (Ada). A very promising crypto currency, the perfect investment for your future.
                            </List.Item>
                        </List>
                    </ContentWrapper>
                </Accordion.Content>

                <Accordion.Title
                    active={activeIndex === 101}
                    index={101}
                    onClick={handleClick}
                >
                    <Icon name='dropdown' />
                    When is my video sold ?
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 101}>
                    <ContentWrapper>
                        <p>
                            First you need to manually open the auction to sell your NFT. In this process you set the minimum price where bidders can start from.
                        </p>
                        <p>
                            When a bid exceeds the minimum price, your video is sold and there is no way back. The auction stays open until payday to allow other bidders to raise the price of your video.
                        </p>
                        <p>
                            This means that when your minimum price is exceeded by a bid, you will be paid out on payday. If your minimal price is not exceeded, you will still be the owner of your video and will be able to grab the video revenues.
                        </p>
                    </ContentWrapper>
                </Accordion.Content>
                <Accordion.Title
                    active={activeIndex === 200}
                    index={200}
                    onClick={handleClick}
                >
                    <Icon name='dropdown' />
                    How do I get the youtube revenues on my wallet?
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 200}>
                    <ContentWrapper>
                        <p>
                            After payday, the wallet that contains the NFT token can grab the funds out of the contract.
                        </p>
                        <p>
                            By opening a new auction on your Video/NFT, you also take out the Youtube funds from payday and start from a new line.
                        </p>
                        <p>
                            When your wallet is connected to VidBid, you will find all your videos in the MyVidBid Page. On this page you can either Grab the funds or Open the auction.
                        </p>
                    </ContentWrapper>
                </Accordion.Content>
                <Accordion.Title
                    active={activeIndex === 201}
                    index={201}
                    onClick={handleClick}
                >
                    <Icon name='dropdown' />
                    How does VidBid earn money to cover platform expenses?
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 201}>
                    <ContentWrapper>
                        <p>
                            On all transactions through the platform, a fee will be taken.
                        </p>
                        <List as='ul'>
                            <List.Item as='li'>
                                5% on youtube revenues
                            </List.Item>
                            <List.Item as='li'>
                                10% on bid prices
                            </List.Item>
                        </List>
                    </ContentWrapper>
                </Accordion.Content>
            </Accordion>
        </PageWrapper>
    );
}