import dotenv from "dotenv"; // npm install dotenv
import path from "path";

// Loads .env values into: process.env object:
dotenv.config({ quiet: true });

class AppConfig {

    public readonly environment = process.env.ENVIRONMENT!;
    public readonly isDevelopment = this.environment === "development";
    public readonly isProduction = this.environment === "production";

    public readonly port = Number(process.env.PORT) || 4000;
    public readonly modelId = "onnx-community/embeddinggemma-2-ONNX";

    public readonly dataDir = path.resolve(process.env.DATA_DIR || path.join(__dirname, "../../data"));
    public readonly dbPath = `${this.dataDir}/rag.db`;
    
    public readonly modelCacheDir = `${this.dataDir}/models`;

    public readonly embeddingDimensions = 768;

    public readonly mcpToken = process.env.MCP_TOKEN || "";

    public readonly host = process.env.HOST || "127.0.0.1";

}

export const appConfig = new AppConfig();
