import {NavLink, Outlet, useLocation} from "react-router-dom";
import {Layout, Menu, theme } from 'antd';
import {HomeOutlined} from '@ant-design/icons';

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
            <Header style={{ display: 'flex', alignItems: 'center' }}>
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
                    style={{ flex: 1, minWidth: 0 }}
                />
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
