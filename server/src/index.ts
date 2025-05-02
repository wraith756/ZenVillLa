import express from "express";
import dotenv from "dotenv";
import bodyParser, { json } from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { authMiddleware } from "./middleware/authMiddleware";
import tenantRoutes from "./routes/tenantsRoutes";
import managerRoutes from "./routes/managersRoutes";
import propertyRoutes from "./routes/propertyRoutes";
import leaseRoutes from "./routes/leaseRouters";
import applicationRoutes from "./routes/applicationRoutes";
/*CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// ROUTE
app.get("/", (req, res) => {
  res.send("This is Home Route");
});
app.use("/applications", applicationRoutes);
app.use("/leases", leaseRoutes);
app.use("/properties", propertyRoutes);
app.use("/tenants", authMiddleware(["tenant"]), tenantRoutes);
app.use("/managers", authMiddleware(["tenant"]), managerRoutes);
//!SERVER

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
