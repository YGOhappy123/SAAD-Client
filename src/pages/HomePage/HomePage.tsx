import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useTitle from '../../hooks/useTitle';
import Banner from './Banner';
import SaleOff from './SaleOff';
import Feedback from './Feedback';
import Menu from '../../components/Menu';
import AboutUs from '../../components/AboutUs';
import '../../assets/styles/pages/HomePage.css';

export default function RootRoute() {
  const { t } = useTranslation();

  useTitle(`${t('home')} - PMT`);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="home-page">
      <Banner />
      <SaleOff />
      <Menu />
      <AboutUs />
      <Feedback />
    </div>
  );
}
