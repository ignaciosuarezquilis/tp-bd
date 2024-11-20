// Función para obtener la lista de médicos
async function obtenerMedicos() {
    try {
        const response = await fetch('http://localhost:3001/medicos');
        const data = await response.json();
        const medicosList = document.getElementById('medicosList');
        const medicosTable = document.getElementById('medicosTable');
        const noMedicosMessage = document.getElementById('noMedicosMessage');

        medicosTable.style.display = 'none';  // Ocultar la tabla
        noMedicosMessage.style.display = 'none';  // Ocultar el mensaje de "no hay médicos"
        const tbody = medicosTable.querySelector('tbody');
        tbody.innerHTML = '';  // Limpiar la tabla

        if (data.length === 0) {
            noMedicosMessage.style.display = 'block';  // Mostrar el mensaje si no hay médicos
        } else {
            medicosTable.style.display = 'table';  // Mostrar la tabla si hay médicos
            data.forEach(medico => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><button onclick="eliminarMedico(${medico.matricula})">Eliminar</button></td>
                    <td>${medico.nombre} ${medico.apellido}</td>
                    <td>${medico.dni_medico}</td>
                    <td>${medico.matricula}</td>
                    <td>${medico.CUIL_CUIT}</td>
                    <td>${medico.cant_dispuesto}</td>
                    <td>${new Date(medico.fecha_ingreso).toLocaleDateString()}</td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (error) {
        console.error('Error al obtener médicos:', error);
    }
}

// Función para eliminar un médico
async function eliminarMedico(matricula) {
    try {
        const response = await fetch(`http://localhost:3001/medicos/${matricula}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Médico eliminado correctamente');
            obtenerMedicos();  // Refrescar la lista de médicos
        } else {
            alert('Hubo un error al eliminar el médico');
        }
    } catch (error) {
        console.error('Error al eliminar médico:', error);
    }
}

// Asocia el evento de clic al botón "Obtener Médicos"
document.getElementById('obtenerMedicosBtn').addEventListener('click', obtenerMedicos);

// Función para eliminar un médico
async function eliminarMedico(matricula) {
    try {
        const response = await fetch(`http://localhost:3001/medicos/${matricula}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Médico eliminado correctamente');
            obtenerMedicos();  // Refrescar la lista de médicos
        } else {
            alert('Hubo un error al eliminar el médico');
        }
    } catch (error) {
        console.error('Error al eliminar médico:', error);
    }
}

// Asocia el evento de clic al botón "Obtener Médicos"
document.getElementById('obtenerMedicosBtn').addEventListener('click', obtenerMedicos);



// Función para agregar un nuevo médico
async function agregarMedico(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const dni_medico = document.getElementById('dni_medico').value;
    const cant_dispuesto = document.getElementById('cant_dispuesto').value;
    const fecha_ingreso = document.getElementById('fecha_ingreso').value;
    const cuil = document.getElementById('cuil').value;

    const medico = { nombre, apellido, dni_medico, cant_dispuesto, fecha_ingreso, CUIL_CUIT: cuil };

    try {
        const response = await fetch('http://localhost:3001/medicos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(medico),
        });

        if (response.ok) {
            alert('Médico agregado correctamente');
            obtenerMedicos();  // Refrescar la lista de médicos
        } else {
            alert('Hubo un error al agregar el médico');
        }
    } catch (error) {
        console.error('Error al agregar médico:', error);
    }
}

// Manejar el envío del formulario
document.getElementById('formAddMedico').addEventListener('submit', agregarMedico);


