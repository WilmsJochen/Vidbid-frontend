import React from "react";
import {Header, List} from "semantic-ui-react";


export default function RoadMapPage() {
    return (
        <>
            <Header as='h1'>VidBid Roadmap</Header>
            <List divided verticalAlign='middle' celled size={"huge"}>
                <List.Item>
                    <List.Content> Issue and sell VidBid DAO tokens </List.Content>
                    <List.List>
                        <List.Item><List.Content> Create 10 Million VidBid tokens on cardano mainnet </List.Content></List.Item>
                        <List.Item><List.Content> Start liquidity pool on <a href={"https://sundaeswap.finance/"}> SundeaSwap</a> to sell tokens </List.Content></List.Item>
                    </List.List>
                </List.Item>
                <List.Item><List.Content> Open up VidBid Youtube channel </List.Content></List.Item>
                <List.Item>
                    <List.Content> Create MVP on cardano testnet with Youtube mock. The MVP will contain these features </List.Content>
                    <List.List>
                        <List.Item><List.Content>Upload video to platform and post on VidBid youtube channel</List.Content></List.Item>
                        <List.Item><List.Content>Create NFT for Youtube video after approval</List.Content></List.Item>
                        <List.Item><List.Content>Starting an auction on your video</List.Content></List.Item>
                        <List.Item><List.Content>Monthly payday where Youtube revenues will be divided over NFT holders </List.Content></List.Item>
                    </List.List>
                </List.Item>
                <List.Item><List.Content> Deploy MVP on cardano mainnet </List.Content></List.Item>
                <List.Item><List.Content> Improve UI/UX design </List.Content></List.Item>
                <List.Item><List.Content> Launch marketing campaigns with DAO tokens funding </List.Content> </List.Item>
                <List.Item><List.Content> Add multiple VidBid youtube channels per category e.g. Funny, History, Financial news,... </List.Content></List.Item>
                <List.Item><List.Content> Improve platform integration, look into personalised channels </List.Content></List.Item>
                <List.Item><List.Content> Expand service to other platforms e.g. tiktok, instagram, ...  </List.Content></List.Item>
                <List.Item><List.Content> Implement voting system for DAO holders to further improve VidBid </List.Content></List.Item>
            </List>
        </>
    );
}