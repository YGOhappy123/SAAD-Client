import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import { layoutStyle } from '../../assets/styles/globalStyle';

const FragmentLayout: FC = () => {
  return (
    <Layout style={layoutStyle}>
      <Layout.Content>
        <Outlet />
      </Layout.Content>
    </Layout>
  );
};

export default FragmentLayout;
