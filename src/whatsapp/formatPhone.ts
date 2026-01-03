function formatPhone(phone: string) {
    let formattedPhone: string;

    if (phone.includes("@")) {
        const phoneReplaced = phone.replace(/^55/, '').replace(/@c\.us$/, '');
        formattedPhone = phoneReplaced.slice(0, 2) + "9" + phoneReplaced.slice(2);
    } else {
        const digits = phone.replace(/\D/g, '');
        formattedPhone = "55" + digits + "@c.us";
    }

    return formattedPhone;
}

export default formatPhone;