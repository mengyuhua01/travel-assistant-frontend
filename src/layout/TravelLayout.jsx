import React from 'react';
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Layout, Menu, theme, Button, Space, Dropdown } from 'antd';
import { HomeOutlined, UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const { Header, Content, Footer } = Layout;

const items = [
    { label: (<NavLink to="/">首页</NavLink>), key: 'home', icon: <HomeOutlined /> },
];

export function TravelLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/start');
    };

    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: '个人资料',
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: '设置',
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: '退出登录',
            onClick: handleLogout,
        },
    ];

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout>
            <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <div className="demo-logo" style={{
                        color: 'white',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        marginRight: '20px'
                    }}>
                        ✈️ 智能旅行助手
                    </div>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        selectedKeys={['home']}
                        items={items}
                        style={{ flex: 1, minWidth: 0, border: 'none' }}
                    />
                </div>
                
                {/* 用户信息区域 */}
                <div style={{ marginLeft: '20px' }}>
                    <Space size="medium">
                        <span style={{ marginRight:'16px' , color: 'rgba(255,255,255,0.8)' }}>
                            欢迎回来，{user?.username || user?.email || '旅行者'}
                        </span>
                        <Dropdown
                            menu={{ items: userMenuItems }}
                            placement="bottomRight"
                            trigger={['click']}
                        >
                            <Button 
                                type="text"
                                icon={<UserOutlined />}
                                style={{
                                    color: 'white',
                                    borderColor: 'rgba(255,255,255,0.3)',
                                    background: 'rgba(255,255,255,0.1)',
                                }}
                            >
                                {user?.username || user?.email?.split('@')[0] || '用户'}
                            </Button>
                        </Dropdown>
                    </Space>
                </div>
            </Header>
            <Content style={{ padding: '0 48px' }}>
                <div
                    style={{
                        background: colorBgContainer,
                        minHeight: 280,
                        padding: 24,
                        borderRadius: borderRadiusLG,
                    }}
                >
                   <Outlet></Outlet>
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                
            </Footer>
        </Layout>
    );
}

export default TravelLayout;
