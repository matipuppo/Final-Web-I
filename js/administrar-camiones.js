const tablaHTML = document.getElementById("lista-camiones-id");
const cuerpoTablaHTML = document.getElementById("cuerpo-de-tabla");
const camionFormHTML = document.getElementById("camion-form");
const btnCerrarFormulario = document.getElementById("btn-cerrar-formulario");

//? Cargar desde localStorage si existe, si no usar array inicial de camiones.js
const camionesGuardados = JSON.parse(localStorage.getItem("camiones"));
let camionesGlobal = camionesGuardados ? camionesGuardados : camiones;
let ultimoIdCamion = camionesGlobal.length > 0 ? Math.max(...camionesGlobal.map(c => c.id)) : 0;

//? Guardar en localStorage
function guardarCamionesEnLocalStorage() {
  localStorage.setItem("camiones", JSON.stringify(camionesGlobal));
}

//? Agregar camion
camionFormHTML.addEventListener("submit", (eve) =>{
    eve.preventDefault();

    const el = eve.target.elements;
    const dominioIngresado = el.dominio.value.trim().toUpperCase();

    try {
      const existeDominio = camionesGlobal.some(camion => camion.dominio.toUpperCase() === dominioIngresado);
      if (existeDominio) {
        alert("Ya existe un camión con ese dominio");
        return;
      }

      const nuevoCamion = {
        id: ++ultimoIdCamion,
        dominio: dominioIngresado,
        marca: el.marca.value,
        modelo: el.modelo.value,
        anio: parseInt(el.anio.value),
        descripcion: el.descripcion.value,
        precio: parseInt(el.precio.value),
        image: el.image.value
      };

      camionesGlobal.push(nuevoCamion);
      guardarCamionesEnLocalStorage(); //! guardar cambios en e localStorage
      alert("Camion agregado correctamente");
      actualizarVistaCamiones();
      document.dispatchEvent(new CustomEvent("camionActualizado"));

      eve.target.reset();
      el.dominio.focus();
      document.getElementById("formulario-agregar-camion").classList.add("oculto");

    } catch(error) {
      console.log("Error al agregar camion ", error);
      alert("No se pudo agregar el camion");
    }
});

//? Renderizar tabla
function renderizarCamiones(camionesGlobal) {
  cuerpoTablaHTML.innerHTML = camionesGlobal.map(crearFilaCamion).join('');
}

//? Actualizar vista
function actualizarVistaCamiones() {
  try {
    renderizarCamiones(camionesGlobal);
    activarBotonesEditar();
  } catch(error) {
    console.error("Error al obtener camiones:", error);
  }
}

//? Crear fila
function crearFilaCamion(camion) {
  return `
    <tr class="fila-camion">
      <td class="camion-id">${camion.id}</td>
      <td class="camion-dominio">${camion.dominio.toUpperCase()}</td>
      <td class="camion-marca">${camion.marca}</td>
      <td class="camion-modelo">${camion.modelo}</td>
      <td class="camion-anio">${camion.anio}</td>
      <td class="camion-precio">$${Number(camion.precio).toLocaleString()}</td>
      <td class="camion-descripcion">${camion.descripcion}</td>
      <td class="user-actions">
        <button class="btn delete" onclick="eliminarCamiones('${camion.id}')">
          <i class="fa-solid fa-trash"></i>
        </button>                                   
        <button class="btn edit" data-id="${camion.id}">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
      </td>
    </tr>
  `;
}

actualizarVistaCamiones();

//? Buscador
function buscador(evt) {
  const busqueda = evt.target.value.toLowerCase();
  const filtroCamiones = camionesGlobal.filter((cam) => {
    return(
      cam.id.toString().toLowerCase().includes(busqueda) ||
      cam.dominio.toLowerCase().includes(busqueda) || 
      cam.marca.toLowerCase().includes(busqueda) || 
      cam.modelo.toLowerCase().includes(busqueda) || 
      cam.anio.toString().toLowerCase().includes(busqueda)
    )
  });

  if (filtroCamiones.length === 0) {
    cuerpoTablaHTML.innerHTML = `<tr><td colspan="8">No se encontraron camiones</td></tr>`;
  } else {
    renderizarCamiones(filtroCamiones);
  }
}

//? Eliminar camiones
function eliminarCamiones(id) {
  const confirmacion = confirm("¿Estas seguro de que queres eliminar este camion?");
  if(!confirmacion) return;

  try {
    const index = camionesGlobal.findIndex(camione => camione.id == id);
    if (index === -1) {
      alert("No se encontro el camion");
      return;
    }
    camionesGlobal.splice(index,1);
    guardarCamionesEnLocalStorage(); //! guardar cambios en e localStorage
    alert("Camion eliminado correctamente");
    actualizarVistaCamiones();
    document.dispatchEvent(new CustomEvent("camionActualizado"));

  } catch(error) {
    console.log("Error al eliminar camion:", error);
    alert("Hubo un problema al eliminar el camion");
  }
}

//? Mostrar formulario
function mostrarFormularioAgregarCamion() {
  const formularioAgregarCamion = document.getElementById("formulario-agregar-camion");
  formularioAgregarCamion.classList.toggle("oculto");
}

//? Cerrar formulario
function cerrarFormularioCamion() {
  const formularioAgregarCamion = document.getElementById("formulario-agregar-camion");
  formularioAgregarCamion.classList.add("oculto");
}

//? Abrir formulario editar
function abrirFormularioEditarCamiones(){
  const formularioEditarCamion = document.getElementById("formulario-editar-camion");
  formularioEditarCamion.classList.remove("oculto");
}

//? Cerrar formulario editar
function cerrarFormularioEditarCamion() {
  const formularioEditarCamion = document.getElementById("formulario-editar-camion");
  formularioEditarCamion.classList.add("oculto");
}

//? Editar camiones
function editarCamionesid(id){
  try{
    const camion = camionesGlobal.find(camion => camion.id == id);
    const form = document.getElementById("form-editar-camion");
    const el = form.elements;

    el.dominio.value = camion.dominio;
    el.marca.value = camion.marca;
    el.modelo.value = camion.modelo;
    el.anio.value = camion.anio;
    el.descripcion.value = camion.descripcion;
    el.precio.value = camion.precio;

    form.dataset.id = camion.id;
    abrirFormularioEditarCamiones();
  } catch(error){
    console.log("Error al obtener camion para editar ", error);
    alert("Hubo un problema al cargar el camion");
  }
}

//? Activar botones editar
function activarBotonesEditar() {
  const botones = document.querySelectorAll("button.edit");
  botones.forEach((btn) => {
    btn.addEventListener("click",() =>{
      const id = btn.dataset.id;
      editarCamionesid(id);
    })
  });
}

//? Guardar ediciones
document.getElementById("form-editar-camion").addEventListener("submit", (eve) =>{
  eve.preventDefault();

  const form = eve.target;
  const el = eve.target.elements;
  const id = form.dataset.id;
  const dominioIngresado = el.dominio.value.trim().toUpperCase();

  try{
    if (!id) {
      alert("No se encontro el ID del Camion");
    }

    const dominioDuplicado = camionesGlobal.some(camion => camion.dominio.toUpperCase() === dominioIngresado && camion.id != id);
    if (dominioDuplicado) {
      alert("Este dominio ya esta registrado en otro camion. No se puede duplicar");
      return;
    }

    const index = camionesGlobal.findIndex(camion => camion.id == id);
    if (index === -1) {
      alert("No se encontro el camion");
      return;
    }

    camionesGlobal[index] = {
      ...camionesGlobal[index],
      dominio: dominioIngresado,
      marca: el.marca.value,
      modelo: el.modelo.value,
      anio: parseInt(el.anio.value),
      descripcion: el.descripcion.value,
      precio: parseInt(el.precio.value),
    };

    guardarCamionesEnLocalStorage(); //! guardar cambios en e localStorage
    alert("Camion Actualizado correctamente");
    actualizarVistaCamiones();
    cerrarFormularioEditarCamion();
    document.dispatchEvent(new CustomEvent("camionActualizado"));

  } catch(error){
    console.log("Error al editar camion ", error);
    alert("Hubo un problema al editar el camion");
  }
});


