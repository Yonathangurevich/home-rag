import { AutoConfig, env, FeatureExtractionPipeline, pipeline } from "@huggingface/transformers";
import { appConfig } from "../utils/app-config";

export function buildQueryText(query: string): string {
    return `task: search result | query: ${query}`;
}

export function buildDocumentText(title: string, description: string, tags: string[]): string {
    return `title: ${title} | text: ${description} Tags: ${tags.join(", ")}`;
}

export class EmbeddingService {

    // save the extractor:
    private extractorPromise: Promise<FeatureExtractionPipeline> | null = null;

    private async loadExtractor(): Promise<FeatureExtractionPipeline> {
    
        // set where all cache goes:
        env.cacheDir = appConfig.modelCacheDir;
    
        // remove audio and vision from the config:
        const config: any = await AutoConfig.from_pretrained(appConfig.modelId);
        config.audio_config = null;
        config.vision_config = null;

        // start "downloading" the model:
        return pipeline(
            "feature-extraction",
            appConfig.modelId,
            {
                device: "cpu",
                dtype: "q8",
                progress_callback: (p => p.status === "progress" && console.log(`${p.file}: ${p.progress.toFixed(1)}%`)),
                config
                
            } 
        ) as Promise<FeatureExtractionPipeline>;

    }

    // get the extractor:
    private getExtractor() {
        
        if (this.extractorPromise) {
            return this.extractorPromise;
        }

        this.extractorPromise = this.loadExtractor().catch(err => {
            this.extractorPromise = null
            throw err;
         });
        return this.extractorPromise;
    }

    // embed queries:
    public embedQuery(query: string): Promise<Float32Array> {
        return this.embed(buildQueryText(query));
    }

    // embed documents:
    public embedDocument(title: string, description: string, tags: string[]): Promise<Float32Array> {
        return this.embed(buildDocumentText(title, description, tags));
    }

    // default function to embed anything:
    private async embed(text: string): Promise<Float32Array> {
        const extractor = await this.getExtractor();
        const response = await extractor(text, {
            pooling: "mean",
            normalize: true
        });
        return response.data as Float32Array;
    }

    public async warmUp(): Promise<number> {
        
        const before = new Date();

        const warm = await this.embedQuery("warm up");
        if (warm.length !== appConfig.embeddingDimensions) {
            throw new Error(`Embedding model returned ${warm.length} dims expected 768`);
        }

        const after = new Date();

        const timeItTook = +after - +before;
        
        return (timeItTook);
    }


}

export const embeddingService = new EmbeddingService();