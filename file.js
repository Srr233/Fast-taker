import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

async function main() {
    const response = await fetch('https://re.kufar.by/l/brest/snyat/kvartiru-dolgosrochno?cur=USD&prc=r%3A120%2C185&size=30');
    const stringHTML = await response.text();
    const dom = new JSDOM(stringHTML);
    dom.window.document.querySelectorAll('span').forEach(span => console.log(span.textContent))
}
main();