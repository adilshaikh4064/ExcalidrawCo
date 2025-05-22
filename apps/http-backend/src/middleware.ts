import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "@repo/backend-common/config";
import { CustomRequest } from "./types";

const jwt_secret = config.JWT_SECRET;

export default function middleware(
    req: CustomRequest,
    res: Response,
    next: NextFunction
) {
    // const token=req.cookies.token;
    const authorization = req.headers.authorization;
    if (
        !authorization ||
        authorization.trim() === "" ||
        !authorization.includes(" ")
    ) {
        res.status(401).json({
            message: "Bad request, unauthorised",
            error: "auth header is not valid or missing",
        });
        return;
    }
    const [scheme, token] = authorization.split(" ");
    if (scheme !== "Bearer" || !token) {
        res.status(401).json({
            message: "Bad request, unauthorised!",
            error: "jwt token is missing or scheme('Bearer') is not valid.",
        });
        return;
    }

    try {
        const payload = jwt.verify(token as string, jwt_secret);

        if (!payload || typeof payload !== "object" || !("email" in payload)) {
            res.status(401).json({
                message: "Bad request, unauthorised!",
                error: "jwt token is invalid or missing required fields in payload.",
            });
            return;
        }

        req.email = payload.email;
        next();
    } catch (err) {
        res.status(401).json({
            message: "Bad request, unauthorised!",
            error:
                err instanceof Error
                    ? err.message
                    : "Token varification failed",
        });
    }
}
