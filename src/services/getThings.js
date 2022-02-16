// function shielding(text) {
//     const regexpCharacters = ['\\', '[', ']', '^', '$', '.', '|', '?', '*', '+', '(', ')', '=', ';', ':'];
//     return regexpCharacters.reduce((all, sym) => all.split(sym).join('\\' + sym), text)
// }
function getCosts(arrayOfDOM, anchors) {
    if (!anchors.length) return 'Free';
    return arrayOfDOM.findIndex(elem => {
        console.log(elem.textContent)
        return elem.textContent.match(new RegExp(anchors, 'gim'))
    });
}
async function getThings(dom, regexp, tag, tagOfThingName, advertisingContent, whereIsAdvertisingTag, specialWordsRegexp) {
    const linkTags = dom.window.document.querySelectorAll(tag);
    const blockOfThings = Array.from(linkTags).filter(elem => elem.getAttribute('href').match(new RegExp(regexp, 'gim')));
    const things = [];

    blockOfThings.forEach(thing => {
        let thingContainsSpecialWord = false;
        if (specialWordsRegexp) {
            Array.from(thing.querySelectorAll(tagOfThingName)).forEach(elem => {
                if (elem.textContent) {
                    if (elem.textContent.match(specialWordsRegexp) && !thingContainsSpecialWord) thingContainsSpecialWord = true;
                }
            })
        }
        let thingContainsAd = false;
        if (advertisingContent) {
            Array.from(thing.querySelectorAll(whereIsAdvertisingTag)).forEach(elem => {
                if (elem.tagName) {
                    if (elem.src.match(advertisingContent) && !thingContainsAd) thingContainsAd = true;
                }
            })
        }
        if (!thingContainsSpecialWord && specialWordsRegexp) return;
        if (thingContainsAd && advertisingContent) return;

        things.push({
            link: thing.getAttribute('href'),
        });
    });
    return things;
}

export default getThings;