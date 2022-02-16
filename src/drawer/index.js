const inClass = 'LoveDaria';

function drawer(messages) {
    const loverDaria = document.querySelector('.' + inClass);
    messages.forEach(message => {
        loverDaria.insertAdjacentHTML('beforeend', `<div><a href=${message.link}>Цена: ${message.cost}\n Расположение: ${message.place}</a></div>`);
    });
}

export default drawer;