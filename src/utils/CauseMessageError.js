export const generatorProductError = (data) => {
    return `Todos los campos son requeridos y deben ser validos.
    Lista de campos recibidos en la solicitud: 
    - title : ${data.title}
    - description: ${data.description}
    - category: ${data.category}
    - price: ${data.price}
    - code: ${data.code}
    - stock: ${data.stock}
    - thumbnail: ${data.thumbnail}`;
}

export const generatorIdError = (id) => {
    return `Debe haber un identificador valido. 
    - Valor recibido: ${id}`
}

export const generatorUserError = (data) => {
    return `Alguno de los campos es inválido.
    Lista de campos recibidos en la solicitud: 
    - first_name : ${data.first_name}
    - email: ${data.email}`
}
