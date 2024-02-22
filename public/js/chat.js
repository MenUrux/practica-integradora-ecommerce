(function () {
    console.log('Socket conectado')
    const NBSP = '\u00A0';
    let email = '';

    let mySocketId;


    const formMessage = document.getElementById('form-message');
    const input = document.getElementById('input-message');

    const socket = io();


    socket.on('connect', () => {
        mySocketId = socket.id;
    });


    formMessage.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!email) {
            Toastify({
                text: "No estás identificado. Por favor, identificate!",
                duration: 3000,
                destination: "/chat",
                close: true,
                gravity: "top",
                position: "center",
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(to right, #9b0000, #3d0000)",
                },
                onClick: function () { } // Callback after click
            }).showToast();
        }
        else {
            const newMessage = {
                user: email,
                body: input.value,
            };
            input.value = '';
            input.focus();
            socket.emit('new-message', newMessage);
        }
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
        scrollToBottom();
    });

    socket.on('message-received', (senderSocketId) => {
        if (mySocketId !== senderSocketId) {
            const sound = document.getElementById('notification-sound');
            sound.play();
        }
    });


    Swal.fire({
        title: 'Identificate',
        input: 'text',
        inputLabel: 'Ingresa tu email',
        html: '<a id="close-button" style="position: absolute; top: 10px; right: 10px; width: 30px; background-color: crimson; border-radius: 4px">X</a>',
        allowOutsideClick: false,
        allowEscapeKey: false,
        inputValidator: (value) => {
            if (!value) {
                return 'Necesitamos que ingreses un email para continuar.';
            }
            // Expresión regular para validar el correo electrónico
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (!emailRegex.test(value)) {
                return 'Por favor ingresa un correo electrónico válido.';
            }
        },
    })
        .then((result) => {
            email = result.value.trim();
            console.log(`Hola ${email}, bienvenido 🖐`);
        });


    function scrollToBottom() {
        const chatContainer = document.getElementById('log-messages');
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    const closeButton = document.getElementById('close-button');
    closeButton.addEventListener('click', () => {
        window.location.href = '/';
    });



    let typingTimeout;

    const typingIndicator = document.querySelector('.typing');

    input.addEventListener('input', () => {
        clearTimeout(typingTimeout);

        if (input.value) {
            socket.emit('typing', { isTyping: true });
            // No actualizar el indicador de escritura aquí
        }

        typingTimeout = setTimeout(() => {
            socket.emit('typing', { isTyping: false });
        }, 1000); // El tiempo de espera antes de emitir que el usuario ya no está escribiendo
    });

    socket.on('userTyping', (data) => {
        if (data.isTyping) {
            typingIndicator.textContent = 'Alguien está escribiendo...';
            typingIndicator.style.opacity = 1;
        } else {
            // Espera un poco antes de limpiar el texto para permitir la transición de opacidad
            typingIndicator.style.opacity = 0;
            setTimeout(() => {
                typingIndicator.textContent = '\u00A0';
            }, 500); // El timeout debería coincidir con la duración de la transición
        }
    });



})();


