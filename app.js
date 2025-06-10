// Clase base que representa cada ítem (libro, año, disponibilidad) de la biblioteca
class ItemBiblioteca {
    constructor(titulo, aPublicacion) {
        this.titulo = titulo;
        this.aPublicacion = aPublicacion;
        this.disponible = true;  // Propiedad que sirve para saber si el ítem está disponible o no cuando se realice un préstamo
    }
    obtenerInfo() {  
        return `Titulo: ${this.titulo}, Año: ${this.aPublicacion}`;
    }
}

// Clase Libro que hereda de la clase ppal. ItemBiblioteca con el agregado de autor
class Libro extends ItemBiblioteca {
    constructor(titulo, aPublicacion, autor){
        super(titulo, aPublicacion);
        this.autor = autor;
    }
    obtenerInfo() {
        return `Libro: ${this.titulo}, Autor: ${this.autor}, Año: ${this.aPublicacion}`;
    }
}

// Clase Revista que hereda de ItemBiblioteca y agrega numero de edición
class Revista extends ItemBiblioteca {
    constructor(titulo, aPublicacion, numeroEdicion) {
        super(titulo, aPublicacion);
        this.numeroEdicion = numeroEdicion;
    }
    obtenerInfo() {
        return `Revista: ${this.titulo}, Edición: ${this.numeroEdicion}, Año: ${this.aPublicacion}`;
    }
}

let catalogoBiblioteca = []; // array que permitirá almacenar cada ítem agregado simulando almacenamiento
// Referenciamos los elementos del DOM
const itemTypeSelect = document.getElementById('itemType');
const tituloInput = document.getElementById('titulo');
const aPublicacionInput = document.getElementById("aPublicacion");
const autorInput = document.getElementById('autor');
const numeroEdicionInput = document.getElementById('numeroEdicion');
const authorGroup = document.getElementById('authorGroup');
const editionGroup = document.getElementById('editionGroup');
const addItemBtn = document.getElementById('addItemBtn');
const addMessageDiv = document.getElementById('addMessage');
const outputDiv = document.getElementById('output');
const actionMessageDiv = document.getElementById('actionMessage');
const listItemsBtn = document.getElementById('listItemsBtn');
const lendItemBtn = document.getElementById('lendItemBtn');
const returnItemBtn = document.getElementById('returnItemBtn');

// función para el manejo de los mensajes
function displayMessage(divElement, message, isError = false){
    divElement.textContent = message;  // pasa el mensaje al elemento div que lo va a mostrar addMessage o actionMessage
    divElement.style.display = 'block'; // Muestra el div con el mensaje
    divElement.className = `message ${isError ? 'error-message' : ''}`;  // message es la cadena de texto que se incluye directamente sin importar la condición, es el que define el estilo base de los mensajes.
    // Luego si la condición es verdadera, es decir hay error aplica el estilo error-message, sino queda con el actual
    setTimeout( () => {
        divElement.style.display = 'none';
    }, 5000);  // Función de JS que realiza una acción según un tiempo establecido, en este caso se aplica 5 segundos para que el div con el mensaje se oculte
}

// Evento change del select, si hace clic en libro o revista
itemTypeSelect.addEventListener('change', () => {
    if (itemTypeSelect.value === 'libro') {
        authorGroup.style.display = 'block';  // Muestra el input autor
        editionGroup.style.display = 'none';  // Oculta el input edición
    }else {
        authorGroup.style.display = 'none';   // Oculta el input autor
        editionGroup.style.display = 'block'; // Muestra el input edición
    }
});

// Evento click del botón agregar ítem
addItemBtn.addEventListener('click', () => {
    const tipo = itemTypeSelect.value;   // asigno los valores de los inputs a las variables
    const titulo = tituloInput.value.trim();
    const anio = parseInt(aPublicacionInput.value);
    const autor = autorInput.value.trim();
    const edicion = parseInt(numeroEdicionInput.value);

    let message = "";  // Inicializo el mensaje
    let isError = false; 

    if (tipo === 'libro') {
        if (titulo && !isNaN(anio) && autor) {
            const nuevoLibro = new Libro(titulo, anio, autor); // Crea el objeto Libro y se asigna los argumentos correspondientes
            catalogoBiblioteca.push(nuevoLibro);  // Carga el array con los ítems
            message = `Libro: "${titulo}" agregado con éxito.`;  // Agrego texto al mensaje
            // Limpiar campos
            tituloInput.value = "";
            aPublicacionInput.value = '';
            autorInput.value = '';
        }else {
            message = "Datos incompletos o incorrectos para el libro.";
            isError = true;
        }
    }else if (tipo === 'revista') {
        if (titulo && !isNaN(anio) && !isNaN(edicion)) { 
            const nuevaRevista = new Revista(titulo, anio, edicion); // Crea el objeto Revista con los argumentos correspondientes
            catalogoBiblioteca.push(nuevaRevista);  
            message = `Revista "${titulo}" (Edición: ${edicion}) agregada con éxito.`;
            tituloInput.value = '';
            aPublicacionInput.value = '';
            numeroEdicionInput.value = '';
        }else {
            message = "Datos incompletos o incorrectos para la revista.";
            isError = true;
        }
    }else {
        message = "Tipo de item no reconocido.";
        isError = true; // si no se seleccionó libro o revista es error, cuando llama a display cambia el valor por defecto de isError y realiza según las condiciones establecidas dentro de la función
    }
    displayMessage(addMessageDiv, message, isError); // Llama a al función displayMessage y pasa como argumentos el div addMessageDiv, el mensaje que corresponde según las condiciones anteriores y si isError es true o false
    listarItemsDOM(); // Llama a la función para actualizar la lista de ítems
});
// Función para listar ítems y actualizar el DOM
function listarItemsDOM(){
    let outputHTML = "--- CATÁLOGO DE LA BIBLIOTECA ----\n";  // Variable que irá agrupando los elementos a mostrar en el listado
    if (catalogoBiblioteca.length === 0) {      
        outputHTML += "El catálogo está vacío.";
    }else {
        catalogoBiblioteca.forEach((item, index) => {
            const estadoClass = item.disponible ? '': 'prestado'; // Esto define que estilo va al ítem de acuerdo si está prestado o no
            const estadoText = item.disponible ? "Disponible" : "Prestado";
            outputHTML += `<div class="item-list"> ${index + 1}. <span class="${estadoClass}"> ${item.obtenerInfo()}</span> [Estado: ${estadoText}]</div>`;
        });  // Esta línea muestra todo el ítem, desde el valor del índice que comenzaría en 1, en lugar de 0, la clase es definida arriba de acuerdo a si está disponible o no y luego la leyenda al lado con la palabra "Disponible" o "Prestado" asignado a la variable estadoText
    }
    outputHTML += "------------------------------------------------------\n";
    outputDiv.innerHTML = outputHTML; // Mostramos en el HTML toda la cadena del ítem agregado y los que se van agregando
};
// Evento botón 'Listar ítem'
listItemsBtn.addEventListener('click', () => {
    listarItemsDOM();   // Actualiza el listado para reflejar lo nuevo ingresado
    displayMessage(actionMessageDiv, "Catálogo actualizado.");
});
// Evento botón 'Prestar ítem'
lendItemBtn.addEventListener('click', () => {
    if (catalogoBiblioteca.length === 0){
        displayMessage(actionMessageDiv, "No hay ítems en el catálogo para prestar.", true);
        return;
    }
    const tituloBuscar = prompt("Ingresa el título del ítem a prestar:");
    if (!tituloBuscar){
        displayMessage(actionMessageDiv, "Préstamo cancelado. Título no ingresado.", true);
        return;
    }
    const itemAprestar = catalogoBiblioteca.find(item => item.titulo.toLowerCase() === tituloBuscar.toLowerCase()); // Busca el título asignado por el usuario a tituloBuscar dentro del array convirtiendo todo a minúscula para evitar errores de tipeo con mayúsculas y minúsculas
    let message = "";   // Defino e inicializo la variable message que va a ir obteniendo los mensajes a través de las condiciones establecidas
    let isError = false;  // Inicializo la variable parámetro de displayMessage a false (sin error)
    
    if (itemAprestar){          // Evalúa si se ingreso un título
        if (itemAprestar.disponible) {    // Evalúa si está disponible el título
            const usuario = prompt(`Ingresa el nombre del usuario que prestará " ${itemAprestar.titulo}": `);
            if (usuario) {          // Evalúa que se haya ingresado un nombre
                itemAprestar.disponible = false;  // Pongo en false la disponibilidad del libro porque estaría a prestado ahora
                message = `"${itemAprestar.titulo}" prestado a ${usuario}.`; // Mensaje para la función displayMessage
            }else {     // Si no ingresó un nombre
                message = "Préstamo cancelado. Nombre de usuario no ingresado.";
                isError = true; // Para que al llamar a displayMessage muestre el mensaje en rojo de error
            }
        } else {  // Si el título no está disponible
            message = `"${itemAprestar.titulo}" ya está prestado.`;
            isError = true;
        }
    }else { // Si no se encontró el título
        message = `"${tituloBuscar}" no encontrado en el catálogo.`;
        isError = true; 
    }
    displayMessage(actionMessageDiv, message, isError); // Llamamos a la función encargada de mostrar el div informativo con el mensaje correspondiente
    listarItemsDOM();  // Lista los ítems actualizados
});
// Botón 'Devolver ítem', toda la función es similar a la de prestar
returnItemBtn.addEventListener('click', () => {
    const tituloDevolver = prompt("Ingresa el título del ítem a devolver:");
    if (!tituloDevolver) {
        displayMessage(actionMessageDiv, "Devolución cancelada. Título no ingresado.", true);
        return;
    }
    const itemADevolver = catalogoBiblioteca.find(item => item.titulo.toLowerCase() === tituloDevolver.toLowerCase());
    let message = "";
    let isError = false;

    if (itemADevolver) {
        if (!itemADevolver.disponible) {  // Si el título no está ahora pasa a estar disponible
            itemADevolver.disponible = true;
            message = `"${itemADevolver.titulo}" ha sido devuelto.`;
        }else {  // Si el título está es porque no estaba prestado
            message = `${itemADevolver.titulo}" ya está disponible (no estaba prestado).`;
            isError = true;
        }
    }else {
        message = `"${tituloDevolver}" no encontrado en el catálogo.`;
        isError = true;
    }
    displayMessage(actionMessageDiv, message, isError);
    listarItemsDOM();
});