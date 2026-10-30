import { Request, Response, NextFunction } from "express";
import { cyber } from "../utils/cyber";
import { appConfig } from "../utils/app-config";
import { StatusCode } from "../models/enums";
import { errorMessages } from "../utils/error-messages";

class SecurityMiddleware {

    public verifyToken(request: Request, response: Response, next: NextFunction): void {
        const token = request.headers.authorization;
        if (!cyber.isValideBearer(token, appConfig.mcpToken)) {
            response.status(StatusCode.Unauthorized).json(errorMessages.error401());
            return;
        }
        next();
    }

}

export const securityMiddleware = new SecurityMiddleware();