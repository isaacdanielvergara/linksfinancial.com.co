document.addEventListener("DOMContentLoaded", () => {
  // Simular datos de activos
  const activos = [
    { nombre: "Oro", precio: 1950, variacion: "+1.2%" },
    { nombre: "Plata", precio: 25.3, variacion: "-0.8%" },
    { nombre: "Acción ABC", precio: 120.5, variacion: "+0.5%" },
  ];

  // Cargar activos en tarjetas
  const contenedorActivos = document.getElementById("activos");
  activos.forEach((activo) => {
    const div = document.createElement("div");
    div.className = "col-md-4";
    div.innerHTML = `
        <div class="card mb-3 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">${activo.nombre}</h5>
            <p class="card-text">Precio actual: $${activo.precio}</p>
            <p class="card-text text-muted">Variación: ${activo.variacion}</p>
            <button class="btn btn-success btn-sm">Comprar</button>
            <button class="btn btn-danger btn-sm ms-2">Vender</button>
          </div>
        </div>
      `;
    contenedorActivos.appendChild(div);
  });

  // Simular historial
  const historial = [
    { fecha: "2025-04-10", tipo: "Compra", activo: "Oro", monto: "$1950" },
    { fecha: "2025-04-09", tipo: "Venta", activo: "Plata", monto: "$250" },
  ];
  const tablaHistorial = document.getElementById("historial");
  historial.forEach((t) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
        <td>${t.fecha}</td>
        <td>${t.tipo}</td>
        <td>${t.activo}</td>
        <td>${t.monto}</td>
      `;
    tablaHistorial.appendChild(fila);
  });

  // Gráfico con Chart.js
  const ctx = document.getElementById("graficoPortafolio").getContext("2d");
  const grafico = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
      datasets: [
        {
          label: "Valor del Portafolio",
          data: [10000, 11200, 11900, 12500],
          borderColor: "rgba(13, 110, 253, 0.8)",
          backgroundColor: "rgba(13, 110, 253, 0.1)",
          tension: 0.3,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  });
});
