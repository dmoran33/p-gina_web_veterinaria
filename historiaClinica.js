document.addEventListener('DOMContentLoaded', () => {
  const formHistoria = document.getElementById('form-historia');
  const listadoHistorias = document.getElementById('listado-historias');
  const totalSpan = document.getElementById('totalHistorias');
  const selectPaciente = document.getElementById('pacienteSelect');
  
  // Elementos del Modal de Historial Completo
  const dialogVerHistorial = document.getElementById('dialogVerHistorial');
  const nombrePacienteModal = document.getElementById('nombrePacienteModal');
  const contenedorHistorialCompleto = document.getElementById('contenedorHistorialCompleto');

  // Elementos del Modal de Eliminación
  const dialogEliminar = document.getElementById('dialogEliminarHistoria');
  const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminarHistoria');
  const deleteIdInput = document.getElementById('deleteIdHistoria');

  let historias = JSON.parse(localStorage.getItem('historias_la_mary')) || [];

  // 1. Cargar pacientes leyendo exactamente de la clave 'animales' de tu pacientes.js
  function cargarPacientesEnSelect() {
    const listaDeAnimales = JSON.parse(localStorage.getItem('animales')) || [];

    selectPaciente.innerHTML = '<option value="" selected disabled>Seleccione una mascota...</option>';

    if (listaDeAnimales.length === 0) {
      const option = document.createElement('option');
      option.value = "";
      option.disabled = true;
      option.textContent = "No hay pacientes registrados en el sistema";
      selectPaciente.appendChild(option);
      return;
    }

    listaDeAnimales.forEach((animal) => {
      const nombreMascota = animal.nombreAnimal || "Sin Detalle";
      const nombreDuenio = animal.nombreDuenio || "Anónimo";
      
      const option = document.createElement('option');
      // Guardamos el nombre de la mascota como valor para identificarla
      option.value = nombreMascota;
      option.textContent = `${nombreMascota} (${animal.tipoAnimal} - Tutor: ${nombreDuenio})`;
      selectPaciente.appendChild(option);
    });
  }

  // 2. Actualizar la tabla principal de historias clínicas
  function actualizarTabla() {
    listadoHistorias.innerHTML = '';
    totalSpan.textContent = historias.length;

    if (historias.length === 0) {
      listadoHistorias.innerHTML = `
        <tr>
          <td colspan="4" class="text-center text-muted py-3">No hay registros clínicos actualmente.</td>
        </tr>
      `;
      return;
    }

    historias.forEach((item) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${item.fechaAtencion}</strong></td>
        <td><span class="badge bg-secondary">${escapeHTML(item.paciente)}</span></td>
        <td>${escapeHTML(item.diagnostico)}</td>
        <td>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-outline-primary btn-ver" data-paciente="${item.paciente}" title="Ver historial completo">
              <i class="bi bi-eye-fill"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${item.id}" title="Eliminar registro">
              <i class="bi bi-trash-fill"></i>
            </button>
          </div>
        </td>
      `;
      listadoHistorias.appendChild(tr);
    });
  }

  // 3. Registrar nueva evolución médica
  formHistoria.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(formHistoria);
    
    const nuevaHistoria = {
      id: String(Date.now()),
      paciente: formData.get('pacienteSelect'),
      fechaAtencion: formData.get('fechaAtencion'),
      diagnostico: formData.get('diagnostico'),
      tratamiento: formData.get('tratamiento')
    };

    historias.push(nuevaHistoria);
    guardarYActualizar();
    formHistoria.reset();
    cargarPacientesEnSelect();
  });

  // 4. Delegación de eventos para Ver Historial y Eliminar
  listadoHistorias.addEventListener('click', (e) => {
    const btnVer = e.target.closest('.btn-ver');
    const btnEliminar = e.target.closest('.btn-eliminar');

    if (btnVer) {
      const nombrePaciente = btnVer.dataset.paciente;
      mostrarHistorialCompleto(nombrePaciente);
    }

    if (btnEliminar) {
      const id = btnEliminar.dataset.id;
      deleteIdInput.value = id;
      if (dialogEliminar && typeof dialogEliminar.showModal === 'function') {
        dialogEliminar.showModal();
      }
    }
  });

  // 5. Mostrar historial completo de una mascota en el <dialog>
  function mostrarHistorialCompleto(nombrePaciente) {
    nombrePacienteModal.textContent = nombrePaciente;
    contenedorHistorialCompleto.innerHTML = '';

    const historialPaciente = historias.filter(h => h.paciente === nombrePaciente);

    if (historialPaciente.length === 0) {
      contenedorHistorialCompleto.innerHTML = `<p class="text-muted text-center my-3">No hay registros médicos previos para este paciente.</p>`;
    } else {
      historialPaciente.forEach((evo) => {
        const div = document.createElement('div');
        div.className = 'p-3 bg-body-secondary rounded-3 border';
        div.innerHTML = `
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="badge text-bg-primary"><i class="bi bi-calendar-event me-1"></i>${evo.fechaAtencion}</span>
          </div>
          <p class="mb-1"><strong>Diagnóstico:</strong> ${escapeHTML(evo.diagnostico)}</p>
          <p class="mb-0 text-muted small"><strong>Tratamiento:</strong> ${escapeHTML(evo.tratamiento)}</p>
        `;
        contenedorHistorialCompleto.appendChild(div);
      });
    }

    if (dialogVerHistorial && typeof dialogVerHistorial.showModal === 'function') {
      dialogVerHistorial.showModal();
    }
  }

  // 6. Confirmar eliminación
  btnConfirmarEliminar.addEventListener('click', () => {
    const idAEliminar = deleteIdInput.value;
    historias = historias.filter(h => String(h.id) !== String(idAEliminar));
    guardarYActualizar();
    
    if (dialogEliminar && typeof dialogEliminar.close === 'function') {
      dialogEliminar.close();
    }
  });

  function guardarYActualizar() {
    localStorage.setItem('historias_la_mary', JSON.stringify(historias));
    actualizarTabla();
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str.toString().replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  // Inicialización
  cargarPacientesEnSelect();
  actualizarTabla();
});