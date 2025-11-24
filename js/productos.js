function renderizarProductos() {
  const contenedor = document.querySelector(".lista-camiones");

  //? Siempre usamos lo que esté en localStorage, o el array inicial si no hay nada
  const camionesGuardados = JSON.parse(localStorage.getItem("camiones"));
  const lista = Array.isArray(camionesGuardados) ? camionesGuardados : camiones;

  //? Encabezado
  contenedor.innerHTML = `<h2>Lista de camiones (${lista.length})</h2>`;

  //? Renderizar cada camión
  lista.forEach(camion => {
    const card = document.createElement("div");
    card.className = "camion-card";

    //? Fallback de imagen si no existe o está vacío
    const imagenSrc = camion.image && camion.image.trim() !== ""
      ? camion.image
      : "https://via.placeholder.com/300x200?text=Sin+Imagen";

    card.innerHTML = `
      <img src="${imagenSrc}" alt="${camion.marca} ${camion.modelo}" class="camion-img">
      <h3>${camion.marca} ${camion.modelo}</h3>
      <p>Año: ${camion.anio} | Dominio: ${camion.dominio}</p>
      <p class="precio">USD ${Number(camion.precio).toLocaleString()}</p>
      <p>${camion.descripcion || ""}</p>
    `;

    contenedor.appendChild(card);
  });
   //? Cargar filtros dinámicos
  cargarFiltros(lista);

}

//? Render inicial
document.addEventListener("DOMContentLoaded", renderizarProductos);

//? Escuchar evento disparado desde administrar-camiones.js
document.addEventListener("camionActualizado", renderizarProductos);


function cargarFiltros(lista) {
  //? Obtener referencias a los selects
  const filtroMarca = document.getElementById("filtro-marca");
  const filtroModelo = document.getElementById("filtro-modelo");
  const filtroAnio = document.getElementById("filtro-anio");
  const filtroPrecio = document.getElementById("filtro-precio");

  //? Limpiar opciones previas (dejamos "Todos")
  [filtroMarca, filtroModelo, filtroAnio, filtroPrecio].forEach(select => {
    select.innerHTML = "<option>Todos</option>";
  });

  //? Crear sets únicos
  const marcas = [...new Set(lista.map(c => c.marca))];
  const modelos = [...new Set(lista.map(c => c.modelo))];
  const anios = [...new Set(lista.map(c => c.anio))];

  //? Rangos de Precios
  const precios = [
    { label: "Menos de 100.000", min: 0, max: 100000 },
    { label: "100.000 - 200.000", min: 100000, max: 200000 },
    { label: "200.000 - 300.000", min: 200000, max: 300000 },
    { label: "Más de 300.000", min: 300000, max: Infinity }
  ];

  //? Insertar opciones
  marcas.forEach(m => filtroMarca.innerHTML += `<option>${m}</option>`);
  modelos.forEach(m => filtroModelo.innerHTML += `<option>${m}</option>`);
  anios.forEach(a => filtroAnio.innerHTML += `<option>${a}</option>`);
  precios.forEach(p => filtroPrecio.innerHTML += `<option value="${p.min}-${p.max}">${p.label}</option>`);
}

  //? Se aplican filtros al presionar Aplicar Filtros 
document.querySelector(".filters button").addEventListener("click", () => {
  const marca = document.getElementById("filtro-marca").value;
  const modelo = document.getElementById("filtro-modelo").value;
  const anio = document.getElementById("filtro-anio").value;
  const precio = document.getElementById("filtro-precio").value;

  const camionesGuardados = JSON.parse(localStorage.getItem("camiones"));
  const lista = Array.isArray(camionesGuardados) ? camionesGuardados : camiones;

  const filtrados = lista.filter(c => {
    const cumpleMarca = marca === "Todos" || c.marca === marca;
    const cumpleModelo = modelo === "Todos" || c.modelo === modelo;
    const cumpleAnio = anio === "Todos" || c.anio == anio;
    let cumplePrecio = true;
    if (precio !== "Todos") {
      const [min, max] = precio.split("-").map(Number);
      cumplePrecio = c.precio >= min && c.precio <= max;
    }
    return cumpleMarca && cumpleModelo && cumpleAnio && cumplePrecio;
  });

  //? Renderizar con la lista filtrada
  const contenedor = document.querySelector(".lista-camiones");
  contenedor.innerHTML = `<h2>Lista de camiones (${filtrados.length})</h2>`;
  filtrados.forEach(camion => {
    const card = document.createElement("div");
    card.className = "camion-card";
    card.innerHTML = `
      <img src="${camion.image}" alt="${camion.marca} ${camion.modelo}" class="camion-img">
      <h3>${camion.marca} ${camion.modelo}</h3>
      <p>Año: ${camion.anio} | Dominio: ${camion.dominio}</p>
      <p class="precio">USD ${Number(camion.precio).toLocaleString()}</p>
      <p>${camion.descripcion || ""}</p>
    `;
    contenedor.appendChild(card);
  });
});