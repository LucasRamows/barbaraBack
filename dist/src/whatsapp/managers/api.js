"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var api = axios_1.default.create({ baseURL: "https://viewer.attosgreen.com.br/api/v1" });
exports.default = api;
//# sourceMappingURL=api.js.map