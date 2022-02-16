import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';
import getThings from './services/getThings.js';
import createMessage from './services/messageCreater.js';
import path from 'path';
import sound from 'sound-play';
import { ReadWriter } from './classes/ReadWriteConfig.js';
import sendMessage from './services/sendMessage.js';

const __dirname = path.resolve();
const notification = path.join(__dirname, "src", "sound", "notification.mp3");
const error_sound = path.join(__dirname, "src", "sound", "error_sound.mp3");

const lastThingLink = {};
const readWriterConfig = new ReadWriter('/src/configs/main.config.json');
async function main() {
    try {
        const configData = await readWriterConfig.readJSON();
        for (const dataOrigin of configData) {
            const response = await fetch(dataOrigin.link);
            const stringHTML = await response.text();
            const dom = new JSDOM(stringHTML);


            // const things = await getThings(
            //     dom, dataOrigin.regexp,
            //     dataOrigin.tagOfWholeThing, dataOrigin.tagOfSearchingSpecialWordsRegexp,
            //     dataOrigin.advertisingContent, dataOrigin.whereIsAdvertisingTag,
            //     dataOrigin.specialWordsRegexp
            // );

            const things = await getThings(dom, dataOrigin);


            if (lastThingLink[dataOrigin.link] && things[0].link !== lastThingLink[dataOrigin.link]) {
                const index = things.findIndex(flat => flat.link === lastThingLink[dataOrigin.link]);
                const newThings = things.slice(0, index);
                if (newThings.length) {
                    console.log('--------------------------------------------');
                    sendMessage(createMessage(things.slice(0, index)));
                    console.log('--------------------------------------------');
                    lastThingLink[dataOrigin.link] = newThings[0].link;
                    sound.play(notification);
                }
            } else if (!lastThingLink[dataOrigin.link]) {
                lastThingLink[dataOrigin.link] = things[0].link;
                console.log('--------------------------------------------');
                sendMessage(createMessage(things.slice(0, 1)));
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
