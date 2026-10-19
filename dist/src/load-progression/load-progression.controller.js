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
exports.LoadProgressionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const roles_decorator_1 = require("../auth/roles.decorator");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const load_progression_service_1 = require("./load-progression.service");
const respond_suggestion_dto_1 = require("./dto/respond-suggestion.dto");
let LoadProgressionController = class LoadProgressionController {
    service;
    constructor(service) {
        this.service = service;
    }
    getSuggestions(user, studentId) {
        return this.service.getSuggestions(user, studentId);
    }
    respondSuggestion(id, dto, user) {
        return this.service.respondSuggestion(id, dto.isAccepted, user);
    }
};
exports.LoadProgressionController = LoadProgressionController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Listar sugestões de progressão pendentes' }),
    (0, roles_decorator_1.Roles)(client_1.Role.ALUNO, client_1.Role.PERSONAL),
    (0, common_1.Get)('suggestions'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], LoadProgressionController.prototype, "getSuggestions", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Aceitar ou rejeitar sugestão de progressão' }),
    (0, roles_decorator_1.Roles)(client_1.Role.ALUNO, client_1.Role.PERSONAL),
    (0, common_1.Put)('suggestions/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, respond_suggestion_dto_1.RespondSuggestionDto, Object]),
    __metadata("design:returntype", void 0)
], LoadProgressionController.prototype, "respondSuggestion", null);
exports.LoadProgressionController = LoadProgressionController = __decorate([
    (0, swagger_1.ApiTags)('load-progression'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('load-progression'),
    __metadata("design:paramtypes", [load_progression_service_1.LoadProgressionService])
], LoadProgressionController);
//# sourceMappingURL=load-progression.controller.js.map