import "dotenv/config"
import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import { config } from "./config/app.config";
import connectDatabase from "./database/database";
import { errorHandler } from "./middlewares/errorHandler";
import { HTTPSTATUS } from "./config/http.config";
import { asyncHandler } from "./middlewares/asyncHandler";
import passport from "./middlewares/passport";
import authRoutes from "./modules/auth/auth.routes";
import { authenticateJWT } from "./common/strategies/jwt.strategy";
import sessionRoutes from "./modules/session/session.routes";
import mfaRoutes from "./modules/mfa/mfa.routes";


const app=express();
const BASE_PATH=config.BASE_PATH;
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin:config.APP_ORIGIN,
    credentials: true,
}));

app.use(cookieParser());
app.use(passport.initialize());

app.post(
    "/",
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        res.status(HTTPSTATUS.OK).json({
            message: "Hello Subscribers!!!",
        });
    })
);

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/session`, authenticateJWT, sessionRoutes);
app.use(`${BASE_PATH}/mfa`, authenticateJWT, mfaRoutes);

app.use(errorHandler);
app.listen(config.PORT, async () => {
    console.log(`Server listening on port ${config.PORT} in ${config.NODE_ENV}`);
    await connectDatabase();
});