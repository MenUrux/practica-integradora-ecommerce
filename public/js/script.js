(function () {
    console.log('Socket utilizado')

    let email = '';

    const formMessage = document.getElementById('form-message');
    const socket = io();

    formMessage.addEventListener('submit', (event) => {
        event.preventDefault();
        const input = document.getElementById('input-message')
        const newMessage = {
            user: email,
            body: input.value,
        };
        input.value = '';
        input.focus();
        socket.emit('new-message', newMessage);
    })

    socket.on('update-messages', (messages) => {
        console.log('messages', messages);
        const logMessages = document.getElementById('log-messages');
        logMessages.innerText = '';
        messages.forEach((message) => {
            const p = document.createElement('p');
            p.innerText = `${message.user}: ${message.body}`;
            logMessages.appendChild(p);
        });
    });

    Swal.fire({
        title: 'Identificate',
        input: 'text',
        inputLabel: 'Ingresa tu email',
        allowOutsideClick: false,
        inputValidator: (value) => {
            if (!value) {
                return 'Necesitamos que ingreses un email para continuar.';
            }
        },
    })
        .then((result) => {
            email = result.value.trim();
            console.log(`Hola ${email}, bienvenido 🖐`);
        });

})();
/* Recordar escribir el function con () o no me va a funcionar lo de socket */

