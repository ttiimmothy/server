"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
// only require for form submission, parses URL-encoded bodies
app.use(express_1.default.urlencoded({ extended: true }));
// require for json
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ["http://localhost:8081"]
}));
app.listen("8080", () => {
    console.log("listening http://localhost:8080");
});
