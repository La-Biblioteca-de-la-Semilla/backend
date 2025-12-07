export interface ConfigService {
    get(key: string): string | undefined;
    getRequired(key: string): string;
}