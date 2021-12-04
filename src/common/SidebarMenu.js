import React from 'react'
import { Header, Icon, Image, Menu, Segment, Sidebar } from 'semantic-ui-react'
import { useTranslation } from "react-i18next";


const SidebarMenu = ({ children }) => {
    const { t } = useTranslation();
    return (
        <Sidebar.Pushable as={Segment}>
            <Sidebar
                as={Menu}
                animation='push'
                icon='labeled'
                inverted
                vertical
                visible
                width='thin'
            >
                <Menu.Item as='a'>
                    <Icon name='home' />
                    {t("sidebar.home")}
                </Menu.Item>
                <Menu.Item as='a'>
                    <Icon name='paper plane' />
                    {t("sidebar.steps")}
                </Menu.Item>
                <Menu.Item as='a'>
                    <Icon name='book' />
                    {t("sidebar.school")}
                </Menu.Item>
            </Sidebar>

            <Sidebar.Pusher>
                <Segment basic>
                    {children}
                </Segment>
            </Sidebar.Pusher>
        </Sidebar.Pushable>
    );

}



export default SidebarMenu