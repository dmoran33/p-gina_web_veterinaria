document.addEventListener('DOMContentLoaded', () => {
  const formTurnos = document.getElementById('form-turnos');
  const listadoTurnos = document.getElementById('listado-turnos');
  const totalSpan = document.getElementById('totalTurnos');
  const selectVeterinario = document.getElementById('veterinario');
  const selectPaciente = document.getElementById('nombreMascota');
  const inputDuenio = document.getElementById('nombreDuenio');
  
  const dialogEliminar = document.getElementById('dialogEliminarTurno');
  const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminarTurno');
  const eliminarIdInput = document.getElementById('eliminarIdTurno');

  let turnos = JSON.parse(localStorage.getItem('turnos_la_mary')) || [];

  function cargarVeterinariosEnSelect() {
    let veterinariosGuardados = JSON.parse(localStorage.getItem('veterinarios')) || [];
    
    if (veterinariosGuardados.length === 0) {
      veterinariosGuardados = [
        { nombre: "Dra. María González", especializacion: "Caninos y Felinos" },
        { nombre: "Dr. Carlos Pérez", especializacion: "Cirugía General" },
        { nombre: "Dra. Ana López", especializacion: "Animales de Granja" }
      ];
    }
   
    selectVeterinario.innerHTML = '<option value="" selected disabled>Seleccione un veterinario...</option>';

    veterinariosGuardados.forEach((vet) => {
      const option = document.createElement('option');
      const nombreVet = vet.nombre || vet; 
      const especialidadVet = vet.especializacion ? ` (${vet.especializacion})` : '';
      
      option.value = nombreVet;
      option.textContent = `${nombreVet}${especialidadVet}`;
      selectVeterinario.appendChild(option);
    });
  }

  function cargarPacientesEnSelect() {
    const listaDeAnimales = JSON.parse(localStorage.getItem('animales')) || [];
    
    if(selectPaciente) {
      selectPaciente.innerHTML = '<option value="" selected disabled>Seleccione una mascota...</option>';

      if (listaDeAnimales.length === 0) {
        const option = document.createElement('option');
        option.value = "";
        option.disabled = true;
        option.textContent = "No hay pacientes registrados";
        selectPaciente.appendChild(option);
        return;
      }

      listaDeAnimales.forEach((animal) => {
        const option = document.createElement('option');
        const nombreMascota = animal.nombreAnimal || "Sin Detalle";
        const nombreDuenio = animal.nombreDuenio || "Anónimo";

        option.value = nombreMascota;
        option.dataset.duenio = nombreDuenio;
        option.textContent = `${nombreMascota} (${animal.tipoAnimal} - Tutor: ${nombreDuenio})`;
        selectPaciente.appendChild(option);
      });
    }
  }


  if(selectPaciente) {
    selectPaciente.addEventListener('change', (e) => {
      const selectedOption = e.target.options[e.target.selectedIndex];
      const duenio = selectedOption.dataset.duenio;
      if (duenio && inputDuenio) {
        inputDuenio.value = duenio;
      }
    });
  }

  function actualizarTabla() {
    listadoTurnos.innerHTML = '';
    totalSpan.textContent = turnos.length;

    turnos.forEach((turno) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${turno.fechaTurno}</strong> - ${turno.horaTurno} hs</td>
        <td>${escapeHTML(turno.nombreDuenio)}</td>
        <td>${escapeHTML(turno.nombreMascota)}</td>
        <td><span class="badge bg-info text-dark">${escapeHTML(turno.motivo)}</span></td>
        <td>${escapeHTML(turno.veterinario)}</td>
        <td>
          <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${turno.id}" title="Eliminar turno">
            <i class="bi bi-trash-fill"></i>
          </button>
        </td>
      `;
      listadoTurnos.appendChild(tr);
    });
  }

  formTurnos.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(formTurnos);
    
    const nuevoTurno = {
      id: Date.now().toString(),
      nombreDuenio: formData.get('nombreDuenio'),
      nombreMascota: formData.get('nombreMascota'),
      fechaTurno: formData.get('fechaTurno'),
      horaTurno: formData.get('horaTurno'),
      motivo: formData.get('motivo'),
      veterinario: formData.get('veterinario')
    };

    turnos.push(nuevoTurno);
    guardarYActualizar();
    formTurnos.reset();
    cargarVeterinariosEnSelect();
    cargarPacientesEnSelect();
  });

  listadoTurnos.addEventListener('click', (e) => {
    const btnEliminar = e.target.closest('.btn-eliminar');
    if (!btnEliminar) return;

    const id = btnEliminar.dataset.id;
    eliminarIdInput.value = id;
    
    if (dialogEliminar && typeof dialogEliminar.showModal === 'function') {
      dialogEliminar.showModal();
    }
  });

  btnConfirmarEliminar.addEventListener('click', () => {
    const id = eliminarIdInput.value;
    turnos = turnos.filter(t => t.id !== id);
    guardarYActualizar();
    dialogEliminar.close();
  });

  function guardarYActualizar() {
    localStorage.setItem('turnos_la_mary', JSON.stringify(turnos));
    actualizarTabla();
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str.toString().replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  cargarVeterinariosEnSelect();
  cargarPacientesEnSelect();
  actualizarTabla();
});