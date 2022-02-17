function putTogetherAllProperties(arrayOfObjects, link) {
    const result = {};
    arrayOfObjects.forEach(val => {
        const nameOfProp = Object.entries(val)[0][0];
        if (nameOfProp === 'link' && !link && !result[nameOfProp]) {
            result[nameOfProp] = val[nameOfProp];
            return;
        } else if (nameOfProp === 'link') {
            return;
        }

        if (result[nameOfProp]) {
            result[nameOfProp].push(val[nameOfProp]);
        } else {
            result[nameOfProp] = [val[nameOfProp]];
        }
    });
    if (link) result.link = link;
    return result;
}

function parseFields(things, properties, property) {
    const allParsedProperties = [];
    things.forEach(thing => {
        const allProperties = [];
        properties.forEach(property => {
            const allSelectorThingElements = Array.from(thing.querySelectorAll(property.selector));
            allSelectorThingElements.forEach(elem => {
                if (elem[property.propertyOfElement]) {
                    if (elem[property.propertyOfElement].match(new RegExp(property.content, 'gim'))) {
                        allProperties.push({ [property.nameOfProperty]: elem[property.propertyOfElement] });
                    }
                }
            });
        });
        const link = thing[property];
        allParsedProperties.push(putTogetherAllProperties(allProperties, link));
    });
    return allParsedProperties;
}

async function getThings(dom, options) {
    const {
        tagOfWholeThing, regexp,
        property, catchThings,
        avoidThings, propertiesOfElement } = options;

    const linkTags = dom.window.document.querySelectorAll(tagOfWholeThing);
    let blockOfThings;
    if (regexp && property) {
        blockOfThings = Array.from(linkTags).filter(elem => elem[property].match(new RegExp(regexp, 'gim')));
    } else {
        blockOfThings = Array.from(linkTags);
    }

    if (catchThings.length) {
        catchThings.forEach(catchThing => {
            blockOfThings = blockOfThings.filter(thing => {
                const selectedElements = Array.from(thing.querySelectorAll(catchThing.selector));
                const filteredByContent = selectedElements
                    .filter(elem => {
                        let result = false;
                        if (catchThing.isFunction && catchThing.argumentForFunction) {
                            result = elem[catchThing.propertyOfElement](catchThing.argumentForFunction)
                                .match(new RegExp(catchThing.content, 'gim'))
                        } else if (!catchThing.isFunction && !catchThing.argumentForFunction) {
                            result = elem[catchThing.propertyOfElement]
                                .match(new RegExp(catchThing.content, 'gim'))
                        } else {
                            throw new Error(`function in configuration doesn't exist or argument didn't provide!`);
                        }
                        return result;
                    });
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
                    .filter(elem => {
                        let result = '';
                        if (avoidThing.isFunction && avoidThing.argumentForFunction) {
                            result = elem[avoidThing.propertyOfElement](avoidThing.argumentForFunction)
                                .match(new RegExp(catchThing.content, 'gim'))
                        } else if (!avoidThing.isFunction && !avoidThing.argumentForFunction) {
                            result = elem[avoidThing.propertyOfElement]
                                .match(new RegExp(avoidThing.content, 'gim'))
                        } else {
                            throw new Error(`function in configuration doesn't exist or argument didn't provide!`);
                        }
                        return result;
                    });
                if (filteredByContent.length) return false;
                return true;
            });
        });
    }
    return parseFields(blockOfThings, propertiesOfElement, property);
}

export default getThings;