"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function formatPhone(phone) {
    var formattedPhone;
    if (phone.includes("@")) {
        var phoneReplaced = phone.replace(/^55/, '').replace(/@c\.us$/, '');
        formattedPhone = phoneReplaced.slice(0, 2) + "9" + phoneReplaced.slice(2);
    }
    else {
        var digits = phone.replace(/\D/g, '');
        formattedPhone = "55" + digits + "@c.us";
    }
    return formattedPhone;
}
exports.default = formatPhone;
//# sourceMappingURL=formatPhone.js.map