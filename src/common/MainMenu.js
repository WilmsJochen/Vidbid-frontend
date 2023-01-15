import React, { useState, useContext, useEffect }  from "react";
import { Menu, Dropdown } from 'semantic-ui-react'
import { useNavigate, useLocation } from "react-router-dom";
import {WalletContext} from "../contextProviders/WalletProvider";



export default function MainMenu({ children }){
    const location = useLocation();
    const [activeItem, setActiveItem] = useState("vidBid")
    const {isWalletConnected, connectWallet, walletInfo} = useContext(WalletContext)
    const navigate = useNavigate();

    const onMenuClick = (e, {name}) => {
        setActiveItem(name)
        navigate("/"+name.toLowerCase());
    }

    useEffect(()=>{
        setActiveItem(location.pathname.split("/")[1]);
    },[setActiveItem,location]);


    return (
        <>
            <Menu inverted >
                <Menu.Item
                    name='vidbid'
                    active={activeItem === 'vidbid'}
                    onClick={onMenuClick}
                >
                    VidBid
                </Menu.Item>
                <Menu.Item
                    name='myvidbid'
                    active={activeItem === 'myvidbid'}
                    onClick={onMenuClick}
                >
                    My VidBid
                </Menu.Item>
                <Menu.Item
                    name='faq'
                    active={activeItem === 'faq'}
                    onClick={onMenuClick}
                >
                    FAQ
                </Menu.Item>
                <Menu.Item
                    name='team'
                    active={activeItem === 'team'}
                    onClick={onMenuClick}
                >
                    Team
                </Menu.Item>
                <Menu.Menu position='right'>
                    {
                        isWalletConnected ?
                            <Dropdown item text='Wallet details'

                            >
                                <Dropdown.Menu>
                                    <Dropdown.Item>Address: {walletInfo?.changeAddress} </Dropdown.Item>
                                    <Dropdown.Item>ADA: {walletInfo?.balances?.default} </Dropdown.Item>
                                    {
                                        walletInfo?.balances?.assets && Object.keys(walletInfo?.balances?.assets).map(assetId => {
                                            return <Dropdown.Item>{walletInfo?.balances?.assets[assetId].name}: {walletInfo?.balances?.assets[assetId].amount} </Dropdown.Item>
                                        })
                                    }
                                </Dropdown.Menu>
                            </Dropdown> :
                            <Menu.Item
                                name='Connect Wallet'
                                onClick={connectWallet}
                            />
                    }

                </Menu.Menu>
            </Menu>
            <div>
                {children}
            </div>
        </>
    );
}