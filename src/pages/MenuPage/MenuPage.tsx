import { FC, useEffect } from 'react';
import Menu from '../../components/Menu';
import '../../assets/styles/pages/MenuPage.css';
import { useTranslation } from 'react-i18next';
import useTitle from '../../hooks/useTitle';

const MenuPage: FC = () => {
  const { t } = useTranslation();

  useTitle(`${t('menu')} - PMT`);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="menu-page">
      <Menu isMenuPage />
    </div>
  );
};

export default MenuPage;
