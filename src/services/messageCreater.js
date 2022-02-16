function createMessage(flats) {
    const messages = [];

    flats.forEach(flat => {
        messages.push(
            `Ссылка: ${flat.link}
             Цена: ${flat.cost}`
        );
    });

    return messages.join('\n\n\n');
}

export default createMessage;