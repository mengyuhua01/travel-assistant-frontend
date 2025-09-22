import {NavLink, Outlet, useLocation} from "react-router-dom";
import {Layout, Menu, theme, Button, Space } from 'antd';
import {HomeOutlined, LoginOutlined, UserAddOutlined} from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

const items = [
    { label: (<NavLink to="/">首页</NavLink>), key: 'home', icon: <HomeOutlined /> },
];

// 根据路径获取对应的菜单key
const getSelectedKey = (pathname) => {
    if (pathname === '/') return 'home';
    return 'home'; // 默认选中home
};

export function TravelLayout() {
    const location = useLocation();
    const selectedKey = getSelectedKey(location.pathname);

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
                        selectedKeys={[selectedKey]}
                        items={items}
                        style={{ flex: 1, minWidth: 0, border: 'none' }}
                    />
                </div>
                
                {/* 登录注册按钮区域 */}
                <div style={{ marginLeft: '20px' }}>
                    <Space size="small">
                        <NavLink to="/login">
                            <Button 
                                type="ghost" 
                                icon={<LoginOutlined />}
                                style={{
                                    borderColor: '#22c55e',
                                    color: '#22c55e',
                                    fontWeight: '500',
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.borderColor = '#16a34a';
                                    e.target.style.color = '#16a34a';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.borderColor = '#22c55e';
                                    e.target.style.color = '#22c55e';
                                }}
                            >
                                登录
                            </Button>
                        </NavLink>
                        <NavLink to="/register">
                            <Button 
                                type="primary" 
                                icon={<UserAddOutlined />}
                                style={{
                                    background: 'linear-gradient(135deg, #22c55e, #10b981)',
                                    border: '0',
                                    fontWeight: '500',
                                    boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)',
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = 'linear-gradient(135deg, #16a34a, #059669)';
                                    e.target.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'linear-gradient(135deg, #22c55e, #10b981)';
                                    e.target.style.boxShadow = '0 2px 8px rgba(34, 197, 94, 0.3)';
                                }}
                            >
                                注册
                            </Button>
                        </NavLink>
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
                智能旅行助手 ©{new Date().getFullYear()} 为您的每一次出行提供贴心服务
            </Footer>
        </Layout>
    );
}

export default TravelLayout;
