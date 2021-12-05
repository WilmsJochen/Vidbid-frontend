import React, { useState }  from "react";
import { Menu, Dropdown } from 'semantic-ui-react'
import { useNavigate } from "react-router-dom";



export default function MainMenu({ children }){
    const [activeItem, setActiveItem] = useState("VidBid")
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
                    name='Upload'
                    active={activeItem === 'Upload'}
                    onClick={onMenuClick}
                />
                <Menu.Menu position='right'>
                    <Dropdown item text="login">
                        <Dropdown.Menu>
                            <Dropdown.Item>login</Dropdown.Item>
                            <Dropdown.Item>logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Menu>
            </Menu>
            <div>
                {children}
            </div>
        </>
    );
}