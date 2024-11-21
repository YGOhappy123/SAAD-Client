import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import { layoutStyle } from '../../assets/styles/globalStyle';
import AppBar from '../components/AppBar';
import Footer from '../components/Footer';

const MainLayout: FC = () => {
  return (
    <Layout style={layoutStyle}>
      <AppBar />

      <Layout.Content>
        <Outlet />
      </Layout.Content>

      <Footer />
    </Layout>
  );
};

export default MainLayout;
