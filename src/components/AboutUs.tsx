import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { getI18n, useTranslation } from 'react-i18next'
import { Button } from 'antd'
import { containerStyle } from '../assets/styles/globalStyle'
import '../assets/styles/components/AboutUs.css'

interface IProps {
    isAboutPage?: boolean
}

const STORY = {
    brief: {
        en: 'Started as a startup project aiming to bring the best milk tea drinking experience to everyone, creating a brand with validity, quality, good service, fast delivery with our exquisite, safe and affordable drinks, PMT (short for Ptit Milk Tea) is a milk tea franchise that specialize in providing milk teas and other popular refreshing drinks...',
        vi: 'PMT là viết tắt của Ptit Milk Tea, cái tên được bắt nguồn từ một nhóm khởi nghiệp với 7 tiêu chí là: Uy tín, chất lượng, phục vụ tận tình, giao hàng nhanh chóng, hương vị ngon, đạt chuẩn an toàn vệ sinh thực phẩm và giá cả hợp lý. PMT bán chủ yếu là các loại trà sữa và thức uống giải nhiệt phổ biến khác...'
    },
    fullPart01: {
        en: 'Started as a startup project aiming to bring the best milk tea drinking experience to everyone, creating a brand with validity, quality, good service, fast delivery with our exquisite, safe and affordable drinks, PMT (short for Ptit Milk Tea) is a milk tea franchise that specialize in providing milk teas and other popular refreshing drinks.\nWe are aiming to broaden our reach from the Linh Trung, Thủ Đức District, Hồ Chí Minh City HQ and so far, have successfully opened 7 branch shops in near by districts and wards, serving more than 1 thousand customers everyday.',
        vi: 'PMT là viết tắt của Ptit Milk Tea, cái tên được bắt nguồn từ một nhóm khởi nghiệp với 7 tiêu chí là: Uy tín, chất lượng, phục vụ tận tình, giao hàng nhanh chóng, hương vị ngon, đạt chuẩn an toàn vệ sinh thực phẩm và giá cả hợp lý. PMT bán chủ yếu là các loại trà sữa và thức uống giải nhiệt phổ biến khác.\nHiện tại, trụ sở chính của PMT ở Linh Trung, Thủ Đức, Thành phố Hồ Chí Minh. Cùng với đó là 7 chi nhánh có mặt ở các quận huyện lân cận, với tổng hơn 1000 đơn được phục vụ mỗi ngày.'
    },
    fullPart02: {
        en: '"PMT - Where Every Sip Tells A Story !"\nIn order to bring you the best experience, our staff members all have been carefully selected and trained to provide the premium quality drinks and service in our shop.\nWe are always aware of customers’ evolving tastes. That’s why on top of ensuring only the best quality drinks are being serve to our customers, our refreshment selection always changing and constantly bringing new flavor to the menu, satisfying all your needs.',
        vi: '"PMT - Mỗi hớp là một câu chuyện !"\nNhằm đem đến trải nghiệm tốt nhất cho khách hàng, tất cả nhân viên trong đội ngũ của PMT đều được tuyển chọn và đào tạo kỹ lưỡng để có thể đảm bảo được chất lượng của thức uống và chất lượng phục vụ.\nNgoài việc chú trọng hương vị, PMT còn hướng đến cho khách hàng nhiều sự lựa chọn, với mong muốn đáp ứng các nhu cầu giải khát của khách hàng. Thay đổi, bức phá, đáp ứng thị hiếu của khách hàng luôn là mục tiêu mà PMT hướng tới.'
    },
    fullPart03: {
        en: "“Don’t worry about failure, you only have to be right once” - Drew Houston\nPMT is a milk tea franchise begin its life as four students' startup project. Our journey initiated as a small kiot selling drinks with no reputation for ourself, with the amount of orders and customers just barely enough to get by.\nWithout proper funding as well as zero experience in operating a business, couple with inept customer service and a limited menu, we soon found ourself in a crisis with what seems like no way out. But with our perseverance to make PMT’s vision a reality, we overcome all those hardship to become a citywide successful milk tea brand.",
        vi: 'PMT là thương hiệu do một nhóm sinh viên lập nghiệp gồm 4 thành viên xây dựng nên. Xuất phát điểm của PMT là một cửa hàng trà sữa nhỏ, chưa nhận được sự quan tâm của khách hàng. Số lượng khách hàng và đơn hàng mỗi ngày đều ở mức rất thấp. Thậm chí đã có thời điểm doanh thu chỉ đủ đáp ứng cho vật liệu và các chi phí phát sinh.\nKhi mới thành lập, PMT gặp phải rất nhiều khó khăn như thiếu vốn đầu tư, kinh nghiệm vận hành, chất lượng dịch vụ và thực đơn còn hạn chế. Với những khó khăn trên PMT đã phải trải qua một giai đoạn khủng hoảng. Bằng sự kiên trì, học hỏi và nghiên cứu và tích cực đổi mới, PMT đã vượt qua giai đoạn khó khăn và hiện trở thành một trong những thương hiệu trà sữa phổ biến nhất.'
    }
}

const AboutUs: FC<IProps> = ({ isAboutPage }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const locale = getI18n().resolvedLanguage as 'vi' | 'en'

    return (
        <section className="about-us">
            {isAboutPage ? (
                <>
                    <div className="container" style={containerStyle}>
                        <div className="image-wrapper">
                            <img src="/about-img.png" />
                        </div>
                        <div className="story-wrapper">
                            <h2 className="heading">{t('we are PMT')}</h2>
                            {STORY.fullPart01[locale].split('\n').map((prg: string, i: number) => (
                                <p className="story" key={i}>
                                    {prg}
                                </p>
                            ))}
                        </div>
                    </div>
                    <div className="container" style={{ ...containerStyle, marginTop: -20 }}>
                        <div className="story-wrapper">
                            <h2 className="heading">{t('just a message from PMT')} ...</h2>
                            {STORY.fullPart02[locale].split('\n').map((prg: string, i: number) => (
                                <p className="story" key={i}>
                                    {prg}
                                </p>
                            ))}
                        </div>
                        <div className="image-wrapper">
                            <img src="/about-img-2.png" style={{ width: 420 }} />
                        </div>
                    </div>
                    <div className="container" style={{ ...containerStyle, marginTop: -24 }}>
                        <div className="image-wrapper">
                            <img src="/about-img-3.png" />
                        </div>
                        <div className="story-wrapper">
                            <h2 className="heading">{t('start-up story of PMT')}</h2>
                            {STORY.fullPart03[locale].split('\n').map((prg: string, i: number) => (
                                <p className="story" key={i}>
                                    {prg}
                                </p>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <div className="container" style={containerStyle}>
                    <div className="image-wrapper">
                        <img src="/about-img.png" />
                    </div>
                    <div className="story-wrapper">
                        <h2 className="heading">{t('we are PMT')}</h2>
                        <p className="story">{STORY.brief[locale]}</p>
                        <Button type="primary" shape="round" size="large" className="read-more-btn" onClick={() => navigate('/about')}>
                            {t('read more')}
                        </Button>
                    </div>
                </div>
            )}
        </section>
    )
}

export default AboutUs
