import React, { useState, useContext, useEffect }  from "react";
import { Menu, Dropdown } from 'semantic-ui-react'
import { useNavigate, useLocation } from "react-router-dom";
import {WalletContext} from "../contextProviders/WalletProvider";



export default function MainMenu({ children }){
    const location = useLocation();
    const [activeItem, setActiveItem] = useState("vidBid")
    const {isWalletConnected, connectWallet,balances} = useContext(WalletContext)
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
                />
                <Menu.Item
                    name='myvidbid'
                    active={activeItem === 'myvidbid'}
                    onClick={onMenuClick}
                />
                <Menu.Item
                    name='faq'
                    active={activeItem === 'faq'}
                    onClick={onMenuClick}
                />
                <Menu.Item
                    name='team'
                    active={activeItem === 'team'}
                    onClick={onMenuClick}
                />
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