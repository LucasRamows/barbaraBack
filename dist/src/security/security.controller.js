"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityController = void 0;
const common_1 = require("@nestjs/common");
const security_service_1 = require("./security.service");
const auth_guard_1 = require("../auth/auth.guard");
let SecurityController = class SecurityController {
    securityService;
    constructor(securityService) {
        this.securityService = securityService;
    }
    async createCredential(body, req) {
        return this.securityService.createCredential(body, req.user.id);
    }
    async updatePublicKey(body, req) {
        return this.securityService.updatePublicKey(body.key, req.user.id);
    }
    async getPublicKey(req) {
        return this.securityService.getPublicKey(req.user.id);
    }
    async getCredentials(req) {
        return this.securityService.getCredentials(req.user.id);
    }
    async updateCredential(id, body, req) {
        return this.securityService.updateCredential(id, body, req.user.id);
    }
    async deleteCredential(id, req) {
        return this.securityService.deleteCredential(id, req.user.id);
    }
    async getStats(req) {
        return this.securityService.getStats(req.user.id);
    }
};
exports.SecurityController = SecurityController;
__decorate([
    (0, common_1.Post)('credentials'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "createCredential", null);
__decorate([
    (0, common_1.Put)('publickey'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "updatePublicKey", null);
__decorate([
    (0, common_1.Get)('publickey'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "getPublicKey", null);
__decorate([
    (0, common_1.Get)('credentials'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "getCredentials", null);
__decorate([
    (0, common_1.Put)('credentials/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "updateCredential", null);
__decorate([
    (0, common_1.Delete)('credentials/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "deleteCredential", null);
__decorate([
    (0, common_1.Get)('security/stats'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "getStats", null);
exports.SecurityController = SecurityController = __decorate([
    (0, common_1.Controller)('private'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [security_service_1.SecurityService])
], SecurityController);
//# sourceMappingURL=security.controller.js.map