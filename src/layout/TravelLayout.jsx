// import { HomeOutlined, LogoutOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, theme } from "antd";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
import { Outlet } from "react-router-dom";
import Navigation from "../components/Navigation";

const { Header, Content, Footer } = Layout;

// const items = [
//   {
//     label: <NavLink to="/">首页</NavLink>,
//     key: "home",
//     icon: <HomeOutlined />,
//   },
// ];

export function TravelLayout() {
  // const { user, logout } = useAuth();
  // const {logout} = useAuth();
  // const navigate = useNavigate();

  // const handleLogout = () => {
  //   logout();
  //   navigate("/start");
  // };

  // const userMenuItems = [
  //   {
  //     key: "profile",
  //     icon: <UserOutlined />,
  //     label: "个人资料",
  //   },
  //   {
  //     key: "settings",
  //     icon: <SettingOutlined />,
  //     label: "设置",
  //   },
  //   {
  //     type: "divider",
  //   },
  //   {
  //     key: "logout",
  //     icon: <LogoutOutlined />,
  //     label: "退出登录",
  //     onClick: handleLogout,
  //   },
  // ];

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Header style={{ padding: 0 }}>
        <Navigation />
      </Header>
      <Content
        style={{ padding: "0 0", minHeight: "calc(100vh - 64px - 70px)" }}
      >
        <div
          style={{
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: 280,
          }}
        >
          <Outlet />
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        智能旅行助手 ©{new Date().getFullYear()} 为您的每一次出行提供贴心服务
      </Footer>
    </Layout>
  );
}

export default TravelLayout;
