function shielding(text) {
    const regexpCharacters = ['\\', '[', ']', '^', '$', '.', '|', '?', '*', '+', '(', ')', '=', ';', ':'];
    return regexpCharacters.reduce((all, sym) => all.split(sym).join('\\' + sym), text)
}
function getCosts(arrayOfDOM, anchors) {
    return arrayOfDOM.findIndex(elem => elem.textContent.match(new RegExp(shielding(anchors), 'gim')));
}
async function getFlats(dom, regexp, tag, tagForCost) {
    const linkTags = dom.window.document.querySelectorAll(tag);
    const blockOfFlats = Array.from(linkTags).filter(elem => elem.getAttribute('href').match(new RegExp(regexp, 'gim')));
    const flats = [];

    blockOfFlats.forEach(flat => {
        const spans = Array.from(flat.querySelectorAll('span'));
        flats.push({
            link: flat.getAttribute('href'),
            cost: spans[getCosts(spans, '$')].textContent
        });
    });
    return flats;
}

export default getFlats;