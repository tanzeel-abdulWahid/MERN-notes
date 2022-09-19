import { format } from 'date-fns'
import { v4 as uuidv4 } from 'uuid';
import fs  from 'fs';
import { default as fsWithCallbacks } from 'fs'
const fsPromises = fsWithCallbacks.promises
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const logEvents = async (message, logFileName) => {
        const dateTime = format(new Date(), 'yyyy-MM-dd\tHH:mm:ss');
        const logItem = `${dateTime}\t${uuidv4()}\t${message}\n`;

        try {
                if(!fs.existsSync(path.join(__dirname, '..', 'logs'))){
                        await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
                }
                await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName),logItem)
        } catch (error) {
                console.log(error);
        }
}

export const logger = (req,res,next) => {
        logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`,'reqLog.Log')
        console.log(`${req.method} ${req.path}`)
        next();
}
