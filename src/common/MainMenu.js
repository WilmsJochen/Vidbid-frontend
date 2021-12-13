import React, { useState, useContext }  from "react";
import { Menu, Dropdown } from 'semantic-ui-react'
import { useNavigate } from "react-router-dom";
import {FavoriteVidsContext, WalletContext} from "../contextProviders/WalletProvider";



export default function MainMenu({ children }){
    const [activeItem, setActiveItem] = useState("VidBid")
    const {isWalletConnected, connectWallet,balances, walletNetwork} = useContext(WalletContext)
    const navigate = useNavigate();

    const onMenuClick = (e, {name}) => {
        setActiveItem(name)
        navigate("/"+name.toLowerCase());
    }

    return (
        <>
            <Menu inverted >
                <Menu.Item
                    name='VidBid'
                    active={activeItem === 'VidBid'}
                    onClick={onMenuClick}
                />
                <Menu.Item
                    name='MyVidBid'
                    active={activeItem === 'MyVidBid'}
                    onClick={onMenuClick}
                />
                <Menu.Item
                    name='FAQ'
                    active={activeItem === 'FAQ'}
                    onClick={onMenuClick}
                />
                <Menu.Item
                    name='Team'
                    active={activeItem === 'Team'}
                    onClick={onMenuClick}
                />
                {/*<Menu.Item*/}
                {/*    name='Demo'*/}
                {/*    active={activeItem === 'Demo'}*/}
                {/*    onClick={onMenuClick}*/}
                {/*/>*/}
                <Menu.Menu position='right'>
                    {
                        isWalletConnected ?
                            <Dropdown item text='Wallet details'

                            >
                                <Dropdown.Menu>
                                    <Dropdown.Item>ADA: {balances[0]/1000000} </Dropdown.Item>
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