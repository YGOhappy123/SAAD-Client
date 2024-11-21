import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { getI18n } from 'react-i18next';
import { Button, Image } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { containerStyle } from '../../assets/styles/globalStyle';

const SALE_OFF_CONTENT = {
  delivery: {
    imgSrc: 'free-delivery.jpg',
    title: {
      en: 'Free shipping',
      vi: 'Miễn phí vận chuyển',
    },
    subTitle: {
      en: 'For orders in Thu Duc city',
      vi: 'Cho các đơn hàng ở thành phố Thủ Đức',
    },
    btnText: {
      en: 'Order now',
      vi: 'Đặt hàng ngay',
    },
    btnNavigation: {
      en: '/menu',
      vi: '/menu',
    },
  },
  promotion: {
    imgSrc: 'black-pearl.jpg',
    title: {
      en: 'A free piece of black pearl',
      vi: 'Tặng 1 phần trân châu đen',
    },
    subTitle: {
      en: 'For all Okinawa milk tea served at PMT',
      vi: 'Cho các loại trà sữa Okinawa phục vụ tại PMT',
    },
    btnText: {
      en: 'See all serving Okinawa milk tea',
      vi: 'Xem các loại trà sữa Okinawa',
    },
    btnNavigation: {
      en: '/menu?category=Okinawa',
      vi: '/menu?category=Okinawa',
    },
  },
};

const SaleOff: FC = () => {
  const locale = getI18n().resolvedLanguage as 'en' | 'vi';
  const navigate = useNavigate();

  return (
    <section className="sale-off">
      <div className="container" style={containerStyle}>
        <div className="daily-promotions">
          <div className="promotion-card">
            <div className="image">
              <Image src={SALE_OFF_CONTENT.delivery.imgSrc} height="100%" preview={false} />
            </div>
            <div className="description">
              <h5 className="title">{SALE_OFF_CONTENT.delivery.title[locale]}</h5>
              <h6 className="sale-off-tag">
                <span>{SALE_OFF_CONTENT.delivery.subTitle[locale]}</span>
              </h6>
              <Button type="primary" shape="round" size="large" className="order-btn" onClick={() => navigate('/menu')}>
                {SALE_OFF_CONTENT.delivery.btnText[locale]} <ShoppingCartOutlined style={{ fontSize: '1.4rem' }} />
              </Button>
            </div>
          </div>
          <div className="promotion-card">
            <div className="image">
              <Image src={SALE_OFF_CONTENT.promotion.imgSrc} height="100%" preview={false} />
            </div>
            <div className="description">
              <h5 className="title">{SALE_OFF_CONTENT.promotion.title[locale]}</h5>
              <h6 className="sale-off-tag">
                <span>{SALE_OFF_CONTENT.promotion.subTitle[locale]}</span>
              </h6>
              <Button
                type="primary"
                shape="round"
                size="large"
                className="order-btn"
                onClick={() => navigate(SALE_OFF_CONTENT.promotion.btnNavigation[locale])}
              >
                {SALE_OFF_CONTENT.promotion.btnText[locale]}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SaleOff;
