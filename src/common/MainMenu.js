import React, { useState }  from "react";
import { Menu, Dropdown } from 'semantic-ui-react'
import { useNavigate } from "react-router-dom";



export default function MainMenu({ children }){
    const [activeItem, setActiveItem] = useState("Home")
    const navigate = useNavigate();

    const onMenuClick = (e, {name}) => {
        console.log(e)
        console.log(name)
        setActiveItem(name)
        navigate("/"+name.toLowerCase());
    }

    console.log(children)

    return (
        <>
            <Menu tabular>
                <Menu.Item
                    name='Home'
                    active={activeItem === 'Home'}
                    onClick={onMenuClick}
                />
                <Menu.Item
                    name='Upload'
                    active={activeItem === 'Upload'}
                    onClick={onMenuClick}
                />
                <Menu.Menu position='right'>
                    <Dropdown item text="todo">
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