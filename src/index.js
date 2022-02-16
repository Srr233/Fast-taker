import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';
import getFlats from './services/getFlats.js';
import createMessage from './services/messageCreater.js';
import path from 'path';
import sound from 'sound-play';
import { ReadWriter } from './classes/ReadWriteConfig.js';
import sendMessage from './services/sendMessage.js';

const __dirname = path.resolve();
const notification = path.join(__dirname, "src", "sound", "notification.mp3");
const error_sound = path.join(__dirname, "src", "sound", "error_sound.mp3");

const lastFlatLink = {};
const readWriterConfig = new ReadWriter('/src/configs/main.config.json');
async function main() {
    try {
        const configData = await readWriterConfig.readJSON();
        for (const dataOrigin of configData) {
            const response = await fetch(dataOrigin.link);
            const stringHTML = await response.text();
            const dom = new JSDOM(stringHTML);
            const flats = await getFlats(dom, dataOrigin.regexp, dataOrigin.tag, dataOrigin.tagForCost);

            if (lastFlatLink[dataOrigin.link] && flats[0].link !== lastFlatLink[dataOrigin.link]) {
                const index = flats.findIndex(flat => flat.link === lastFlatLink[dataOrigin.link]);
                const newFlats = flats.slice(0, index);
                if (newFlats.length) {
                    console.log('--------------------------------------------');
                    sendMessage(createMessage(flats.slice(0, index)));
                    console.log('--------------------------------------------');
                    lastFlatLink[dataOrigin.link] = newFlats[0].link;
                    sound.play(notification);
                }
            } else if (!lastFlatLink[dataOrigin.link]) {
                lastFlatLink[dataOrigin.link] = flats[0].link;
                console.log('--------------------------------------------');
                sendMessage(createMessage(flats.slice(0, 1)));
                console.log('--------------------------------------------');
                sound.play(notification);
            }
        }
        setTimeout(main, 60000);
    } catch (e) {
        console.log(e);
        sound.play(error_sound);
    }
}
main();
