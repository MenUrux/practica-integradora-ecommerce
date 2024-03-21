
document.addEventListener('DOMContentLoaded', () => {
    const cartButton = document.getElementById('cart-button');
    const cartContainer = document.getElementById('cart-container');
    const overlay = document.getElementById('overlay');
    const closeButton = document.getElementById('close-cart-button');

    // Función para abrir el carrito
    function openCart() {
        cartContainer.classList.remove('translate-x-full');
        cartContainer.classList.add('translate-x-0');
        overlay.classList.remove('invisible');
        overlay.classList.add('visible');
    }

    // Función para cerrar el carrito
    function closeCart() {
        cartContainer.classList.add('translate-x-full');
        cartContainer.classList.remove('translate-x-0');
        overlay.classList.add('invisible');
        overlay.classList.remove('visible');
    }

    cartButton.addEventListener('click', openCart);
    closeButton.addEventListener('click', closeCart);

    // Cierra el carrito si se hace clic en el overlay
    overlay.addEventListener('click', closeCart);

    // Cierra el carrito si se hace clic fuera de él
    window.addEventListener('click', (event) => {
        if (event.target === overlay) {
            closeCart();
        }
    });
});



/* async function loadCart() {
    const response = await fetch(`api/carts/${cartId}`);
    const cart = await response.json();
    let totalQuantity = 0;
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = ''; // Limpiar el contenedor

    cart.products.forEach(item => {
        let thumbnail = item.product.thumbnail ? item.product.thumbnail : '/assets/image/no-image.jpg';

        const productElement = document.createElement('div');
        productElement.classList.add('product')
        productElement.innerHTML = `
        <div class="product-info">
            <img src="${thumbnail}"/>
            <span>${item.product.title}</span> Cantidad: ${item.quantity}
        </div>
        <button onclick="deleteProductFromCart('${item.product._id}')">Eliminar</button>
        <hr>
        `;
        cartItemsContainer.appendChild(productElement);
        totalQuantity += item.quantity;

        console.log(totalQuantity)
    });




    // Actualizar total
    const total = cart.products.reduce((acc, item) => acc + (item.quantity * item.product.price), 0);
    document.getElementById('cart-total').innerText = `Total: $${total}`;
    document.getElementById('cart-total-items').innerText = `${totalQuantity}`;
}

loadCart(); */



async function addProductToCart(productId) {
    try {
        const response = await fetch('/api/carts/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId })
        });

        if (!response.ok) {
            throw new Error('Error al agregar el producto al carrito');
        }

        console.log('Producto agregado al carrito');
    } catch (error) {
        console.error('Error:', error);
    }
}

async function deleteProductFromCart(productId) {
    try {
        const response = await fetch(`api/carts/${cartId}/products/${productId}`, {
            method: 'DELETE'
        });

        const responseData = await response.json();

        if (response.ok) {
            loadCart();
        } else {
            alert('Error al eliminar producto: ' + responseData.message);
        }
    } catch (error) {
        console.error('Hubo un problema con la solicitud fetch:', error);
    }
}



