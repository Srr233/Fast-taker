import path from 'path';
import fs from 'fs/promises';

class ReadWriter {
    constructor(pathToConfig) {
        this._pathToConfig = path.join(process.cwd(), pathToConfig);
    }
    async readJSON() {
        const file = await fs.readFile(this._pathToConfig);
        return JSON.parse(file.toString());
    }
    async rewriteJSON(data) {
        const result = await fs.writeFile(this._pathToConfig, JSON.stringify(data));
        return result;
    }
}

export { ReadWriter }