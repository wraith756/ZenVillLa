"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const authMiddleware_1 = require("./middleware/authMiddleware");
const tenantsRoutes_1 = __importDefault(require("./routes/tenantsRoutes"));
const managersRoutes_1 = __importDefault(require("./routes/managersRoutes"));
const propertyRoutes_1 = __importDefault(require("./routes/propertyRoutes"));
const leaseRouters_1 = __importDefault(require("./routes/leaseRouters"));
const applicationRoutes_1 = __importDefault(require("./routes/applicationRoutes"));
/*CONFIGURATIONS */
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("common"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
// ROUTE
app.get("/", (req, res) => {
    res.send("This is Home Route");
});
app.use("/applications", applicationRoutes_1.default);
app.use("/leases", leaseRouters_1.default);
app.use("/properties", propertyRoutes_1.default);
app.use("/tenants", (0, authMiddleware_1.authMiddleware)(["tenant"]), tenantsRoutes_1.default);
app.use("/managers", (0, authMiddleware_1.authMiddleware)(["tenant"]), managersRoutes_1.default);
//!SERVER
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
