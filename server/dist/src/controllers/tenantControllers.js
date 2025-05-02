"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTenant = exports.createTenant = exports.getTenant = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getTenant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cognitoId } = req.params;
        const tenant = yield prisma.tenant.findUnique({
            where: { cognitoId },
            include: {
                favorites: true,
            },
        });
        if (tenant) {
            res.json(tenant);
        }
        else {
            res.status(404).json({ message: "Tenant not found" });
        }
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error retrieving tenant: ${error.message}` });
    }
});
exports.getTenant = getTenant;
const createTenant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cognitoId, name, email, phoneNumber } = req.body;
        const tenant = yield prisma.tenant.create({
            data: {
                cognitoId,
                name,
                email,
                phoneNumber,
            },
        });
        res.status(201).json(tenant);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error creating tenant: ${error.message}` });
    }
});
exports.createTenant = createTenant;
const updateTenant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cognitoId } = req.params;
        const { name, email, phoneNumber } = req.body;
        const updateTenant = yield prisma.tenant.update({
            where: { cognitoId },
            data: {
                name,
                email,
                phoneNumber,
            },
        });
        res.json(updateTenant);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error updating tenant: ${error.message}` });
    }
});
exports.updateTenant = updateTenant;
// export const getCurrentResidences = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { cognitoId } = req.params;
//     const properties = await prisma.property.findMany({
//       where: { tenants: { some: { cognitoId } } },
//       include: {
//         location: true,
//       },
//     });
//     const residencesWithFormattedLocation = await Promise.all(
//       properties.map(async (property) => {
//         const coordinates: { coordinates: string }[] =
//           await prisma.$queryRaw`SELECT ST_asText(coordinates) as coordinates from "Location" where id = ${property.location.id}`;
//         const geoJSON: any = wktToGeoJSON(coordinates[0]?.coordinates || "");
//         const longitude = geoJSON.coordinates[0];
//         const latitude = geoJSON.coordinates[1];
//         return {
//           ...property,
//           location: {
//             ...property.location,
//             coordinates: {
//               longitude,
//               latitude,
//             },
//           },
//         };
//       })
//     );
//     res.json(residencesWithFormattedLocation);
//   } catch (err: any) {
//     res
//       .status(500)
//       .json({ message: `Error retrieving manager properties: ${err.message}` });
//   }
// };
// export const addFavoriteProperty = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { cognitoId, propertyId } = req.params;
//     const tenant = await prisma.tenant.findUnique({
//       where: { cognitoId },
//       include: { favorites: true },
//     });
//     if (!tenant) {
//       res.status(404).json({ message: "Tenant not found" });
//       return;
//     }
//     const propertyIdNumber = Number(propertyId);
//     const existingFavorites = tenant.favorites || [];
//     if (!existingFavorites.some((fav) => fav.id === propertyIdNumber)) {
//       const updatedTenant = await prisma.tenant.update({
//         where: { cognitoId },
//         data: {
//           favorites: {
//             connect: { id: propertyIdNumber },
//           },
//         },
//         include: { favorites: true },
//       });
//       res.json(updatedTenant);
//     } else {
//       res.status(409).json({ message: "Property already added as favorite" });
//     }
//   } catch (error: any) {
//     res
//       .status(500)
//       .json({ message: `Error adding favorite property: ${error.message}` });
//   }
// };
// export const removeFavoriteProperty = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { cognitoId, propertyId } = req.params;
//     const propertyIdNumber = Number(propertyId);
//     const updatedTenant = await prisma.tenant.update({
//       where: { cognitoId },
//       data: {
//         favorites: {
//           disconnect: { id: propertyIdNumber },
//         },
//       },
//       include: { favorites: true },
//     });
//     res.json(updatedTenant);
//   } catch (err: any) {
//     res
//       .status(500)
//       .json({ message: `Error removing favorite property: ${err.message}` });
//   }
//};
