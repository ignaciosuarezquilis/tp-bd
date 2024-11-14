// Función para obtener la lista de médicos
async function obtenerMedicos() {
    try {
        const response = await fetch('http://localhost:3001/medicos');
        const data = await response.json();
        const medicosList = document.getElementById('medicosList');
        medicosList.innerHTML = '';  // Limpiar la lista
        data.forEach(medico => {
            const li = document.createElement('li');
            li.textContent = `${medico.nombre} ${medico.apellido} - ${medico.dni_medico}`;
            medicosList.appendChild(li);
        });
    } catch (error) {
        console.error('Error al obtener médicos:', error);
    }
}

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

// Cargar la lista de médicos al cargar la página
window.onload = obtenerMedicos;
