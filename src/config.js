import * as url from 'url';
// import path from 'path';
import { Command } from 'commander';
import dotenv from 'dotenv';

const commandLine = new Command();
commandLine
    .option('--mode <mode>')
    .option('--port <port>')
    .option('--setup <number>')
commandLine.parse();
const clOptions = commandLine.opts();

dotenv.config({ path: clOptions.mode === 'devel' ? '.env.devel' : '.env.prod' });

const config = {
    APP_NAME: 'coder_53160',
    SERVER: "atlas",
    PORT: process.env.PORT || clOptions.port || 8080,
    DIRNAME: url.fileURLToPath(new URL('.', import.meta.url)),
    // get UPLOAD_DIR() { return `${this.DIRNAME}/public/img` },
    get UPLOAD_DIR() { return `${this.DIRNAME}/uploads` },
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_ID_REGEX: /^[a-fA-F0-9]{24}$/,
    SECRET: process.env.SECRET,
    GMAIL_APP_USER: 'olariagafederico2@gmail.com',
    GMAIL_APP_PASS: process.env.GMAIL_APP_PASS,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_CALLBACK_URL : process.env.GITHUB_CALLBACK_URL,
    PERSISTENCE: process.env.PERSISTENCE || "mongo",
    MODE : clOptions.mode === 'devel' ? 'dev' : 'prod'
}

export default config;