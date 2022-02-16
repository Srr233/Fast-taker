// function shielding(text) {
//     const regexpCharacters = ['\\', '[', ']', '^', '$', '.', '|', '?', '*', '+', '(', ')', '=', ';', ':'];
//     return regexpCharacters.reduce((all, sym) => all.split(sym).join('\\' + sym), text)
// }

function putTogetherAllProperties(arrayOfObjects, link) {
    const result = {};
    arrayOfObjects.forEach(val => {
        const nameOfProp = Object.entries(val)[0][0];
        if (result[nameOfProp]) {
            result[nameOfProp].push(val[nameOfProp]);
        } else {
            result[nameOfProp] = [val[nameOfProp]];
        }
    });
    result.link = [link];
    return result;
}

function parseFields(things, properties) {
    const allParsedProperties = [];
    // Сделать так, чтобы наименование пропертисов было в цикле и пушилось
    things.forEach(thing => {
        const allProperties = [];
        properties.forEach(property => {
            const allSelectorThingElements = Array.from(thing.querySelectorAll(property.selector));
            allSelectorThingElements.forEach(elem => {
                if (elem[property.propertyOfElement]) {
                    if (elem[property.propertyOfElement].match(property.contentRegExp)) {
                        allProperties.push({ [property.nameOfProperty]: elem[property.propertyOfElement] });
                    }
                }
                // console.error(`Element "${elem.tagName}" doesn't have the content of "${property.propertyOfElement}" by regexp "${property.contentRegExp}"`);
            });
        });
        const link = thing.getAttribute('href'); // Can be bad because it can use other things
        allParsedProperties.push(putTogetherAllProperties(allProperties, link));
    });
    return allParsedProperties;
}

async function getThings(dom, options) {
    const { tagOfWholeThing, catchThings, avoidThings, regexp, properties } = options;

    const linkTags = dom.window.document.querySelectorAll(tagOfWholeThing);
    let blockOfThings = Array.from(linkTags).filter(elem => elem.getAttribute('href').match(new RegExp(regexp, 'gim')));

    if (catchThings.length) {
        catchThings.forEach(catchThing => {
            blockOfThings = blockOfThings.filter(thing => {
                const selectedElements = Array.from(thing.querySelectorAll(catchThing.selector));
                const filteredByContent = selectedElements
                    .filter(elem => elem[catchThing.propertyOfElement]
                        .match(new RegExp(catchThing.contentRegExp, 'gim')));
                if (!filteredByContent.length) {
                    console.log('Didn\'t catch');
                    return false;
                }
                return true;
            });
        });
    }

    if (avoidThings.length) {
        avoidThings.forEach(avoidThing => {
            blockOfThings = blockOfThings.filter(thing => {
                const selectedElements = Array.from(thing.querySelectorAll(avoidThing.selector));
                const filteredByContent = selectedElements
                    .filter(elem => elem[avoidThing.propertyOfElement]
                        .match(new RegExp(avoidThing.contentRegExp, 'gim')));
                if (filteredByContent.length) return true;
                console.log('Didn\'t avoid');
                return false;
            });
        });
    }
    return parseFields(blockOfThings, properties);
}

export default getThings;