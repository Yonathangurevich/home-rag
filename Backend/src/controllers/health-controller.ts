import express, { Request, Response, Router } from "express";

class HealthController {

    public route: Router = express.Router();

    public constructor() {
        this.route.get("/health", this.healthCheck);
    }

    private async healthCheck(_request: Request, response: Response): Promise<void> {
        response.json({ "status": "ok" });
    }

}

export const healthController = new HealthController();