document.addEventListener("DOMContentLoaded", () => {
  function alert(mensaje, tipo = "primary") {
    const toast = document.getElementById("toastAlerta");
    const mensajeBox = document.getElementById("toastMensaje");

    toast.className = `toast align-items-center text-white bg-${tipo} border-0`;
    mensajeBox.textContent = mensaje;

    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
  }

  // ---------- REGISTRO ----------
  const registroForm = document.getElementById("registroForm");
  if (registroForm) {
    registroForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const nombre = document.getElementById("nombre").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden.");
        return;
      }

      const user = {
        nombre,
        email,
        password,
        balance: 10000,
        operaciones: [], // historial vacío inicial
      };

      localStorage.setItem("usuarioRegistrado", JSON.stringify(user));
      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      window.location.href = "login.html";
    });
  }

  // ---------- LOGIN ----------
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      const userData = JSON.parse(localStorage.getItem("usuarioRegistrado"));

      if (!userData) {
        alert("No hay usuarios registrados. Por favor regístrate primero.");
        return;
      }

      if (email === userData.email && password === userData.password) {
        alert(`Bienvenido, ${userData.nombre}`);
        localStorage.setItem("usuarioActivo", JSON.stringify(userData));
        window.location.href = "portafolio.html";
      } else {
        alert("Correo o contraseña incorrectos.");
      }
    });
  }

  // ---------- PORTAFOLIO ----------
  const bienvenida = document.getElementById("bienvenidaUsuario");
  const balance = document.getElementById("balance");

  if (bienvenida && balance) {
    let usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

    if (usuarioActivo) {
      bienvenida.textContent = `Hola, ${usuarioActivo.nombre}. ¡Bienvenido a tu portafolio!`;

      // Mostrar balance actualizado
      if (!usuarioActivo.balance) {
        usuarioActivo.balance = 10000;
        localStorage.setItem("usuarioActivo", JSON.stringify(usuarioActivo));
      }
      balance.textContent = `$${usuarioActivo.balance.toLocaleString("es-CO")}`;
      const tablaActivos = document.getElementById("tablaActivos");
      if (tablaActivos) {
        tablaActivos.innerHTML = ""; // limpiar contenido
        const precios = {
          Oro: 1950,
          Plata: 25,
          "Acción ABC": 120,
        };

        for (let activo in usuarioActivo.portafolio) {
          const cantidad = usuarioActivo.portafolio[activo];
          const valor = precios[activo] || 0;
          const total = valor * cantidad;

          const fila = `
      <tr>
        <td>${activo}</td>
        <td>${cantidad}</td>
        <td>$${valor}</td>
        <td>$${total.toLocaleString("es-CO")}</td>
      </tr>
    `;
          tablaActivos.innerHTML += fila;
        }

        if (Object.keys(usuarioActivo.portafolio).length === 0) {
          tablaActivos.innerHTML =
            '<tr><td colspan="4" class="text-muted">No tienes activos todavía.</td></tr>';
        }
      }
    } else {
      alert("Debes iniciar sesión para ver tu portafolio.");
      window.location.href = "login.html";
    }
  }

  // ---------- MERCADO / OPERACIONES ----------
  const tabla = document.getElementById("tablaMercado");
  const formOperacion = document.getElementById("formOperacion");

  if (tabla && formOperacion) {
    let tipoOperacion = "";
    let activoSeleccionado = "";
    let precioActual = 0;

    tabla.addEventListener("click", function (e) {
      if (e.target.tagName === "BUTTON") {
        tipoOperacion = e.target.textContent;
        const fila = e.target.closest("tr");
        activoSeleccionado = fila.cells[0].textContent;
        precioActual = parseFloat(fila.cells[1].textContent.replace("$", ""));

        document.getElementById(
          "tituloOperacion"
        ).textContent = `${tipoOperacion} ${activoSeleccionado}`;
        document.getElementById(
          "detalleActivo"
        ).textContent = `Precio actual: $${precioActual}`;
        document.getElementById("cantidad").value = "";

        new bootstrap.Modal(document.getElementById("operacionModal")).show();
      }
    });

    formOperacion.addEventListener("submit", function (e) {
      e.preventDefault();

      const cantidad = parseInt(document.getElementById("cantidad").value);
      if (isNaN(cantidad) || cantidad <= 0) {
        alert("Ingresa una cantidad válida.");
        return;
      }

      let usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
      if (!usuario) {
        alert("Debes iniciar sesión.");
        return;
      }

      const totalOperacion = cantidad * precioActual;

      if (tipoOperacion === "Comprar") {
        if (usuario.balance < totalOperacion) {
          alert("Saldo insuficiente.");
          return;
        }
        usuario.balance -= totalOperacion;
      } else if (tipoOperacion === "Vender") {
        usuario.balance += totalOperacion;
      }
      localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
      localStorage.setItem("usuarioRegistrado", JSON.stringify(usuario));

      // Registrar operación en historial
      // Registro de operación
      const operacion = {
        tipo: tipoOperacion,
        activo: activoSeleccionado,
        cantidad,
        precio: precioActual,
        total: totalOperacion,
        fecha: new Date().toLocaleString(),
      };

      // Historial
      usuario.operaciones = usuario.operaciones || [];
      usuario.operaciones.push(operacion);

      // Portafolio
      usuario.portafolio = usuario.portafolio || {};
      if (tipoOperacion === "Comprar") {
        usuario.portafolio[activoSeleccionado] =
          (usuario.portafolio[activoSeleccionado] || 0) + cantidad;
      } else if (tipoOperacion === "Vender") {
        usuario.portafolio[activoSeleccionado] =
          (usuario.portafolio[activoSeleccionado] || 0) - cantidad;
        if (usuario.portafolio[activoSeleccionado] < 0) {
          usuario.portafolio[activoSeleccionado] = 0;
        }
        const balance = document.getElementById("balance");

        if (balance) {
          balance.textContent = `$${usuarioActivo.balance.toLocaleString(
            "es-CO"
          )}`;
        }
      }

      // Guardar
      localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
      localStorage.setItem("usuarioRegistrado", JSON.stringify(usuario));
      // actualizar también registro base

      alert(
        `Operación completada: ${tipoOperacion} ${cantidad} de ${activoSeleccionado}`
      );
      bootstrap.Modal.getInstance(
        document.getElementById("operacionModal")
      ).hide();
    });
  }
});
