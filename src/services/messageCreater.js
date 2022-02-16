function createMessage(flats) {
    const messages = [];

    flats.forEach(flat => {
        messages.push(
            `Link: ${flat.link}`
        );
    });

    return messages.join('\n\n\n');
}

export default createMessage;