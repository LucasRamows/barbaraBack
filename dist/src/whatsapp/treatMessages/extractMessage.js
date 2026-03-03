"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var extractMessages = function (msgs) {
    var messages = [];
    var extractChildren = function (node, buffer) {
        var _a;
        if (!node)
            return;
        if (typeof node.text === "string") {
            buffer.push(node.text);
        }
        if ((_a = node.content) === null || _a === void 0 ? void 0 : _a.richText) {
            node.content.richText.forEach(function (child) {
                return extractChildren(child, buffer);
            });
        }
        if (node.children) {
            node.children.forEach(function (child) {
                return extractChildren(child, buffer);
            });
        }
    };
    for (var _i = 0, msgs_1 = msgs; _i < msgs_1.length; _i++) {
        var msg = msgs_1[_i];
        var buffer = [];
        extractChildren(msg, buffer);
        // junta sem adicionar espaços extras
        var finalText = buffer.join("\n");
        messages.push(finalText);
    }
    return messages;
};
exports.default = extractMessages;
//# sourceMappingURL=extractMessage.js.map