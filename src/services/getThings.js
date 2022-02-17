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
    result.link = link;
    return result;
}

function parseFields(things, properties) {
    const allParsedProperties = [];
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
            });
        });
        const link = thing.getAttribute('href');
        allParsedProperties.push(putTogetherAllProperties(allProperties, link));
    });
    return allParsedProperties;
}

async function getThings(dom, options) {
    const { tagOfWholeThing, catchThings, avoidThings, regexp, propertiesOfElement } = options;

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
                if (filteredByContent.length) return false;
                return true;
            });
        });
    }
    return parseFields(blockOfThings, propertiesOfElement);
}

export default getThings;