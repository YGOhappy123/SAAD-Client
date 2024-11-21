import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { getI18n, useTranslation } from 'react-i18next'
import { Button, Carousel } from 'antd'
import { containerStyle } from '../../assets/styles/globalStyle'

const BANNER_CAROUSEL_CONTENT = [
    {
        title: {
            en: 'Ptit Milk Tea milktea shop',
            vi: 'Tiệm trà sữa Ptit Milk Tea'
        },
        description: {
            en: 'With 7 criteria as our pointer, highly trained employees and a diverse menu to select from, here at PMT we value each and every order placed to bring you the best experience.',
            vi: 'Với 7 tiêu chí đã đề ra, cùng với đội ngũ nhân viên thông qua tuyển chọn kỹ lưỡng và sự đa dạng các món trong menu, PMT luôn đặt tất cả tâm huyết vào từng đơn hàng để mang đến cho quý khách những trải nghiệm tuyệt vời nhất.'
        },
        buttonTitle: 'learn more about us',
        btnNavigation: '/about'
    },
    {
        title: {
            en: 'PMT - Where Every Sip Tells a Story !',
            vi: 'PMT - Where Every Sip Tells a Story !'
        },
        description: {
            en: 'PMT is a milk tea franchise that specializes in providing the best milk teas and refreshing beverages at reasonable prices. In order to ensure the finest experience, our staff members are meticulously selected and trained to deliver top-notch quality drinks and service.',
            vi: 'PMT được biết đến với các thức uống giải khát ngon và giá cả hợp lý. Tất cả các nhân viên trong đội ngũ của PMT đều được tuyển chọn và đào tạo kỹ lưỡng để có thể đảm bảo được chất lượng của thức uống và chất lượng phục vụ.'
        },
        buttonTitle: 'see the menu',
        btnNavigation: '/menu'
    },
    {
        title: {
            en: "PMT's signature drink",
            vi: 'Thức uống đặc trưng của PMT'
        },
        description: {
            en: 'Golden Peach Milk Tea\nThe sweet aroma of peach and milk blends with a hint of pleasant sourness to create this unique milk tea.',
            vi: 'Đào Sữa Hoàng Kim\nHương thơm ngọt ngào của đào và sữa hòa quyện cùng với một chút vị chua dễ chịu tạo nên loại trà sữa độc đáo này.'
        },
        buttonTitle: 'see details',
        btnNavigation: '/product/3'
    }
]

const Banner: FC = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const locale = getI18n().resolvedLanguage as 'vi' | 'en'

    return (
        <section className="banner">
            <img src="/hero-banner.png" className="banner-img" />
            <div className="container" style={containerStyle}>
                <Carousel className="carousel" autoplay>
                    {BANNER_CAROUSEL_CONTENT.map((item, i) => (
                        <div key={i} className="carousel-item-wrapper">
                            <div className="carousel-item">
                                <h1 className="header">{item.title[locale]}</h1>
                                {item.description[locale].split('\n').map((prg, _i) => (
                                    <span key={_i} className="description">
                                        {prg}
                                    </span>
                                ))}
                                <Button type="primary" shape="round" size="large" className="order-btn" onClick={() => navigate(item.btnNavigation)}>
                                    {t(item.buttonTitle)}
                                </Button>
                            </div>
                        </div>
                    ))}
                </Carousel>
            </div>
        </section>
    )
}

export default Banner
