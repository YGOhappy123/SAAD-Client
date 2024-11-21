import { FC, useEffect } from 'react';
import AboutUs from '../../components/AboutUs';
import '../../assets/styles/pages/AboutPage.css';
import { useTranslation } from 'react-i18next';
import useTitle from '../../hooks/useTitle';

const AboutPage: FC = () => {
  const { t } = useTranslation();

  useTitle(`${t('about us')} - PMT`);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-page">
      <AboutUs isAboutPage />
    </div>
  );
};

export default AboutPage;
