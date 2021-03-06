function createMessage(things, prefixForLink) {
    const messages = [];

    things.forEach(thing => {
        let allMessage = ''
        Object.entries(thing).forEach(val => {
            const nameOfProp = val[0];
            const values = val[1];
            if (nameOfProp === 'link' && prefixForLink) {
                allMessage += `${nameOfProp}: ${prefixForLink}${values}\n`;
                return;
            } else if (nameOfProp === 'link') {
                allMessage += `${nameOfProp}: ${values}\n`;
                return;
            }
            allMessage += `${nameOfProp}: ${values.join('|')}\n`;
        });
        messages.push(allMessage);
    });

    return messages.join('\n\n\n');
}

export default createMessage;