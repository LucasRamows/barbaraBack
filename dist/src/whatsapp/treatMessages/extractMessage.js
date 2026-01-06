"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var extractMessages = function (msgs) {
    var mensagens = [];
    var extractChildren = function (node) {
        var _a;
        if (!node)
            return;
        if (node.text) {
            mensagens.push(node.text);
        }
        else if ((_a = node.content) === null || _a === void 0 ? void 0 : _a.richText) {
            node.content.richText.forEach(extractChildren);
        }
        else if (node.children) {
            node.children.forEach(extractChildren);
        }
    };
    msgs.forEach(function (msg) { return extractChildren(msg); });
    return mensagens;
};
exports.default = extractMessages;
//# sourceMappingURL=extractMessage.js.map