type Locale = 'vi' | 'en';

const TimeLineViEn: Record<'Min' | 'Hour' | 'Day' | 'Month', Record<Locale, string>> = {
    Min: {
        vi: "phút trước",
        en: "minutes ago"
    },
    Hour: {
        vi: "giờ trước",
        en: "hours ago"
    },
    Day: {
        vi: "ngày trước",
        en: "days ago"
    },
    Month: {
        vi: "tháng trước",
        en: "months ago"
    },
};

function formatDate(dateString: string, locale:Locale ): string {

    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = (now.getTime() - date.getTime()) / 1000;
    const diffInMinutes = diffInSeconds / 60;
    const diffInHours = diffInMinutes / 60;
    const diffInDays = diffInHours / 24;

    if (diffInMinutes < 60) {
        return `${Math.floor(diffInMinutes)} ${TimeLineViEn['Min'][locale]}`;
    } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)}  ${TimeLineViEn['Hour'][locale]}`;
    } else if (diffInDays < 2) {
        return `1  ${TimeLineViEn['Day'][locale]}`;
    } else if (diffInDays < 30) {
        return `${Math.floor(diffInDays)}  ${TimeLineViEn['Day'][locale]}`;
    } else if (diffInDays < 365) {
        return `${date.getDate()} / ${date.getMonth() + 1}`;
    } else {
        return `${date.getMonth() + 1}/${date.getFullYear()}`;
    }
}
export default formatDate
