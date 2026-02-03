import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPathFromFile = path.join(__dirname, "../../.env");
const envPathFromCwd = path.join(process.cwd(), ".env");

const envPath = fs.existsSync(envPathFromFile) ? envPathFromFile : envPathFromCwd;

dotenv.config({ path: envPath });
