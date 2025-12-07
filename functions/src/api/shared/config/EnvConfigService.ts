import { ConfigService } from "./ConfigService";
import * as dotenv from "dotenv";
import * as functions from "firebase-functions";

// Load environment variables from the appropriate .env file
const environment = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${environment}` });

export class EnvConfigService implements ConfigService {

    /**
     * Get a configuration value from Firebase config or environment variables
     * @param key The configuration key to retrieve
     * @returns The configuration value or undefined if not found
     */
    get(key: string): string | undefined {
        // Try to get the value from Firebase config first
        const firebaseValue = this.fromFirebase(key);
        if (firebaseValue !== undefined) {
            return firebaseValue;
        }

        // Fall back to environment variables
        return process.env[key];
    }

    /**
     * Get a required configuration value
     * @param key The configuration key to retrieve
     * @returns The configuration value
     * @throws Error if the configuration value is not found
     */
    getRequired(key: string): string {
        const value = this.get(key);

        if (value === undefined) {
            throw new Error(`Required config key "${key}" not found`);
        }

        return value;
    }

    /**
     * Try to get a configuration value from Firebase config
     * @param key The configuration key to retrieve (format: SECTION_KEY)
     * @returns The configuration value or undefined if not found
     */
    private fromFirebase(key: string): string | undefined {
        try {
            const parts = key.split("_");

            // Firebase config keys are expected to be in the format SECTION_KEY
            if (parts.length <= 1) {
                return undefined;
            }

            const section = parts[0].toLowerCase();
            const subKey = parts.slice(1).join("_").toLowerCase();
            const functionConfig = functions.config();

            // Check if the section and key exist in the Firebase config
            if (functionConfig[section] && functionConfig[section][subKey]) {
                return functionConfig[section][subKey];
            }

            return undefined;
        } catch (error) {
            // Log the error for debugging purposes
            console.error(`Error retrieving Firebase config for key ${key}:`, error);
            return undefined;
        }
    }
}
