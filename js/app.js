// ---------- 1. "Base de datos" en localStorage ----------
const DB_KEY = 'pkEventosDB';
const USERS_KEY = 'pkEventosUsers';
const SESSION_KEY = 'pkEventosSession';

let resettingEmail = '';

function cargarUsuarios() {
    try {
        const usuarios = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        if (!Array.isArray(usuarios)) throw new Error('Formato de usuarios inválido');
        return usuarios;
    } catch (error) {
        mostrarToast('No se pudieron leer las cuentas guardadas en este navegador', 'danger');
        return null;
    }
}

function guardarUsuarios(usuarios) {
    try {
        localStorage.setItem(USERS_KEY, JSON.stringify(usuarios));
        return true;
    } catch (error) {
        mostrarToast('No se pudo guardar la cuenta en este navegador', 'danger');
        return false;
    }
}

function mostrarVistaAuth(vista) {
    document.querySelectorAll('.auth-view').forEach(elemento => {
        elemento.hidden = elemento.id !== `${vista}-view`;
    });
}

function iniciarSesion(usuario, recordar) {
    const sesion = JSON.stringify({ email: usuario.email });
    try {
        sessionStorage.setItem(SESSION_KEY, sesion);
        if (recordar) localStorage.setItem(SESSION_KEY, sesion);
        else localStorage.removeItem(SESSION_KEY);
    } catch (error) {
        mostrarToast('No se pudo guardar la sesión en este navegador', 'danger');
        return;
    }
    mostrarAplicacion(usuario);
}

function mostrarAplicacion(usuario) {
    document.getElementById('auth-screen').hidden = true;
    document.getElementById('app-shell').hidden = false;
    document.getElementById('current-user-name').textContent = usuario.name;
    document.querySelector('.avatar').textContent = usuario.name.trim().charAt(0).toUpperCase();
}

function cerrarSesion() {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
    document.getElementById('app-shell').hidden = true;
    document.getElementById('auth-screen').hidden = false;
    document.getElementById('login-form').reset();
    mostrarVistaAuth('login');
}

document.querySelectorAll('[data-auth-view]').forEach(button => {
    button.addEventListener('click', () => mostrarVistaAuth(button.dataset.authView));
});

document.getElementById('login-form').addEventListener('submit', event => {
    event.preventDefault();
    const datos = Object.fromEntries(new FormData(event.currentTarget).entries());
    const email = String(datos.email).trim().toLowerCase();
    const usuarios = cargarUsuarios();
    if (!usuarios) return;
    const usuario = usuarios.find(cuenta =>
        cuenta.email === email && cuenta.password === datos.password
    );
    if (!usuario) {
        mostrarToast('Correo o contraseña incorrectos', 'danger');
        return;
    }
    iniciarSesion(usuario, Boolean(datos.remember));
});

document.getElementById('register-form').addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const datos = Object.fromEntries(new FormData(form).entries());
    if (datos.password !== datos.confirmPassword) {
        mostrarToast('Las contraseñas no coinciden', 'danger');
        return;
    }
    const usuarios = cargarUsuarios();
    if (!usuarios) return;
    const email = String(datos.email).trim().toLowerCase();
    if (usuarios.some(cuenta => cuenta.email === email)) {
        mostrarToast('Ya existe una cuenta con ese correo', 'warning');
        return;
    }
    const usuario = { name: String(datos.name).trim(), email, password: datos.password };
    if (!guardarUsuarios([...usuarios, usuario])) return;
    mostrarToast('Cuenta creada. Ya puedes iniciar sesión.');
    form.reset();
    mostrarVistaAuth('login');
});

document.getElementById('recover-form').addEventListener('submit', event => {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get('email')).trim().toLowerCase();
    const usuarios = cargarUsuarios();
    if (!usuarios) return;
    const usuario = usuarios.find(cuenta => cuenta.email === email);
    if (!usuario) {
        mostrarToast('No hay una cuenta registrada con ese correo', 'danger');
        return;
    }
    resettingEmail = email;
    mostrarVistaAuth('reset');
});

document.getElementById('reset-form').addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const datos = Object.fromEntries(new FormData(form).entries());
    if (datos.password !== datos.confirmPassword) {
        mostrarToast('Las contraseñas no coinciden', 'danger');
        return;
    }
    const usuarios = cargarUsuarios();
    if (!usuarios) return;
    const usuario = usuarios.find(cuenta => cuenta.email === resettingEmail);
    if (!usuario) {
        mostrarToast('No se encontró la cuenta para recuperar', 'danger');
        mostrarVistaAuth('recover');
        return;
    }
    usuario.password = datos.password;
    if (!guardarUsuarios(usuarios)) return;
    resettingEmail = '';
    form.reset();
    mostrarToast('Contraseña actualizada. Ya puedes iniciar sesión.');
    mostrarVistaAuth('login');
});

document.getElementById('logout-button').addEventListener('click', cerrarSesion);

function restaurarSesion() {
    let sesion;
    try {
        sesion = JSON.parse(localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY) || 'null');
    } catch (error) {
        mostrarToast('No se pudo restaurar la sesión guardada', 'danger');
        return;
    }
    if (!sesion || typeof sesion.email !== 'string') return;
    const usuarios = cargarUsuarios();
    if (!usuarios) return;
    const usuario = usuarios.find(cuenta => cuenta.email === sesion.email);
    if (usuario) mostrarAplicacion(usuario);
}

const datosIniciales = {
    events: [
        { id: 1, nombre: 'Congreso TIC Andino', fecha: '2026-11-20', ubicacion: 'Quito, Ecuador', capacidad: 150, presupuesto: 4500 },
        { id: 2, nombre: 'Hackathon COIL', fecha: '2026-12-02', ubicacion: 'Ocaña, Colombia', capacidad: 80, presupuesto: 2800 }
    ],
    assistants: [
        { id: 1, nombre: 'Carlos Puentes', email: 'cmpf@gmail.com', telefono: '3125693456', evento: 'Hackathon COIL', estado: 'Activo' },
        { id: 2, nombre: 'Omaida Amaya', email: 'oamaya@itlpn.edu.co', telefono: '3208333549', evento: 'Congreso TIC Andino', estado: 'Activo' }
    ],
    services: [
        { id: 1, servicio: 'Catering', proveedor: 'Sabores Andinos', costo: 1200, descripcion: 'Almuerzo y coffee break' },
        { id: 2, servicio: 'Sonido', proveedor: 'AudioPro', costo: 600, descripcion: 'Parlantes y micrófonos' }
    ]
};

function cargarDB() {
    try {
        const guardado = localStorage.getItem(DB_KEY);
        return guardado ? JSON.parse(guardado) : structuredClone(datosIniciales);
    } catch (e) {
        return structuredClone(datosIniciales);
    }
}

function guardarDB() {
    try { localStorage.setItem(DB_KEY, JSON.stringify(db)); } catch (e) { /* sin almacenamiento */ }
}

let db = cargarDB();

// ---------- 2. Configuración de cada módulo ----------
// Para agregar un módulo nuevo basta con copiar uno de estos bloques.
const modulos = {
    events: {
        titulo: 'Evento',
        tbody: 'events-table-body',
        campos: [
            { name: 'nombre', label: 'Nombre', type: 'text', placeholder: 'Por ejemplo, Congreso TIC', required: true },
            { name: 'fecha', label: 'Fecha', type: 'date', required: true },
            { name: 'ubicacion', label: 'Ubicación', type: 'text', placeholder: 'Por ejemplo, Quito, Ecuador', required: true },
            { name: 'capacidad', label: 'Capacidad', type: 'number', placeholder: 'Por ejemplo, 100', required: true, min: 1 },
            { name: 'presupuesto', label: 'Presupuesto ($)', type: 'number', placeholder: 'Por ejemplo, 2500', required: true, min: 0 }
        ],
        columnas: r => [r.nombre, formatearFecha(r.fecha), r.ubicacion, r.capacidad, formatearDinero(r.presupuesto)]
    },
    assistants: {
        titulo: 'Asistente',
        tbody: 'assistants-table-body',
        campos: [
            { name: 'nombre', label: 'Nombre completo', type: 'text', placeholder: 'Por ejemplo, Carlos Puentes', required: true },
            { name: 'email', label: 'Email', type: 'email', placeholder: 'Por ejemplo, cmpf@gmail.com', required: true },
            { name: 'telefono', label: 'Teléfono', type: 'tel', placeholder: 'Por ej, 3125693456', required: true, pattern: '[0-9]{7,10}', title: 'Solo números (7 a 10 dígitos)' },
            { name: 'evento', label: 'Evento asignado', type: 'select', required: true, opciones: () => db.events.map(e => e.nombre) },
            { name: 'estado', label: 'Estado', type: 'select', required: true, opciones: () => ['Activo', 'Inactivo'] }
        ],
        columnas: r => [r.nombre, r.email, r.telefono, r.evento,
            `<span class="badge ${r.estado === 'Activo' ? '' : 'inactive'}" title="Clic para cambiar" style="cursor:pointer" onclick="toggleEstado(${r.id})">${r.estado}</span>`]
    },
    services: {
        titulo: 'Servicio',
        tbody: 'services-table-body',
        campos: [
            { name: 'servicio', label: 'Servicio', type: 'text', placeholder: 'Por ejemplo, Catering', required: true },
            { name: 'proveedor', label: 'Proveedor', type: 'text', placeholder: 'Por ejemplo, Sabores Andinos', required: true },
            { name: 'costo', label: 'Costo ($)', type: 'number', placeholder: 'Por ejemplo, 800', required: true, min: 0 },
            { name: 'descripcion', label: 'Descripción', type: 'textarea', placeholder: 'Detalle del servicio' }
        ],
        columnas: r => [r.servicio, r.proveedor, formatearDinero(r.costo), r.descripcion || '—']
    }
};

// ---------- 3. Utilidades ----------
const formatearDinero = n => '$' + Number(n || 0).toLocaleString('es-EC', { maximumFractionDigits: 2 });

function formatearFecha(iso) {
    if (!iso) return '—';
    const [a, m, d] = iso.split('-');
    return `${d}/${m}/${a}`;
}

function escapar(texto) {
    const div = document.createElement('div');
    div.textContent = texto ?? '';
    return div.innerHTML;
}

// ---------- 4. Navegación entre pestañas ----------
function switchTab(tab, event) {
    document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.add('active');

    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    if (event) event.currentTarget.classList.add('active');

    document.body.classList.remove('menu-open'); // cierra el menú en celular
}

// ---------- 5. Renderizado de tablas y métricas ----------
function renderTabla(tipo) {
    const mod = modulos[tipo];
    const tbody = document.getElementById(mod.tbody);
    tbody.innerHTML = db[tipo].map(r => {
        const celdas = mod.columnas(r).map((c, i) =>
            // la columna de estado ya trae HTML propio; el resto se escapa
            `<td>${tipo === 'assistants' && i === 4 ? c : escapar(String(c))}</td>`
        ).join('');
        return `<tr>${celdas}
            <td>
                <button class="btn-edit" title="Editar" onclick="openEditModal('${tipo}', ${r.id})"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-delete" title="Eliminar" onclick="confirmarEliminar('${tipo}', ${r.id})"><i class="fa-solid fa-trash"></i></button>
            </td></tr>`;
    }).join('');
}

function renderDashboard() {
    document.getElementById('total-events-count').textContent = db.events.length;
    document.getElementById('total-assistants-count').textContent = db.assistants.length;
    document.getElementById('total-services-count').textContent = db.services.length;
    const total = db.events.reduce((s, e) => s + Number(e.presupuesto || 0), 0);
    document.getElementById('total-budget-count').textContent = formatearDinero(total);
}

function renderTodo() {
    Object.keys(modulos).forEach(renderTabla);
    renderDashboard();
}

// ---------- 6. Modal de Agregar / Editar ----------
let moduloActual = null;
let idEditando = null;

function crearCampo(campo, valor = '') {
    const req = campo.required ? 'required' : '';
    const v = escapar(String(valor));
    let control;

    if (campo.type === 'select') {
        const opciones = campo.opciones();
        control = `<select name="${campo.name}" ${req}>
            <option value="">Seleccione...</option>
            ${opciones.map(o => `<option ${o === valor ? 'selected' : ''}>${escapar(o)}</option>`).join('')}
        </select>`;
    } else if (campo.type === 'textarea') {
        control = `<textarea name="${campo.name}" placeholder="${campo.placeholder || ''}" ${req}>${v}</textarea>`;
    } else {
        const extra = [
            campo.min !== undefined ? `min="${campo.min}"` : '',
            campo.pattern ? `pattern="${campo.pattern}"` : '',
            campo.title ? `title="${campo.title}"` : ''
        ].join(' ');
        control = `<input type="${campo.type}" name="${campo.name}" value="${v}" placeholder="${campo.placeholder || ''}" ${req} ${extra}>`;
    }

    const ancho = campo.type === 'textarea' ? 'full' : '';
    return `<div class="form-group ${ancho}"><label>${campo.label}</label>${control}</div>`;
}

function abrirModal(tipo, id = null) {
    moduloActual = tipo;
    idEditando = id;
    const mod = modulos[tipo];
    const registro = id ? db[tipo].find(r => r.id === id) : {};

    document.getElementById('modal-title').textContent = (id ? 'Editar ' : 'Nuevo ') + mod.titulo;
    document.getElementById('form-fields').innerHTML = mod.campos.map(c => crearCampo(c, registro[c.name] ?? '')).join('');
    document.querySelector('#generic-form button[type="submit"]').innerHTML =
        `<i class="fa-solid fa-floppy-disk"></i> ${id ? 'Actualizar' : 'Registrar'}`;

    document.getElementById('modal-container').classList.add('active');
    const primero = document.querySelector('#form-fields input, #form-fields select');
    if (primero) primero.focus();
}

// Funciones que llama el index.html
function openEventModal()     { abrirModal('events'); }
function openAssistantModal() {
    if (db.events.length === 0) return mostrarToast('Primero crea un evento para asignar asistentes', 'warning');
    abrirModal('assistants');
}
function openServiceModal()   { abrirModal('services'); }
function openEditModal(tipo, id) { abrirModal(tipo, id); }

function closeModal() {
    document.getElementById('modal-container').classList.remove('active');
    document.getElementById('generic-form').reset();
}

function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const datos = Object.fromEntries(new FormData(form).entries());
    modulos[moduloActual].campos.forEach(c => {
        if (c.type === 'number') datos[c.name] = Number(datos[c.name]);
        else datos[c.name] = (datos[c.name] || '').trim();
    });

    const lista = db[moduloActual];
    if (idEditando) {
        const i = lista.findIndex(r => r.id === idEditando);
        lista[i] = { ...lista[i], ...datos };
        mostrarToast(`${modulos[moduloActual].titulo} actualizado correctamente`);
    } else {
        const nuevoId = lista.length ? Math.max(...lista.map(r => r.id)) + 1 : 1;
        lista.push({ id: nuevoId, ...datos });
        mostrarToast(`${modulos[moduloActual].titulo} registrado correctamente`);
    }

    guardarDB();
    renderTodo();
    restaurarSesion();
    closeModal();
}

// ---------- 7. Eliminar con confirmación (estilo SweetAlert) ----------
function confirmarEliminar(tipo, id) {
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    overlay.innerHTML = `
        <div class="confirm-box" role="alertdialog" aria-modal="true">
            <div class="confirm-icon">!</div>
            <h3>¿Estás seguro?</h3>
            <p>Este registro se eliminará definitivamente</p>
            <div class="confirm-actions">
                <button class="btn btn-primary" data-ok>Aceptar</button>
                <button class="btn btn-danger" data-cancel>Cancelar</button>
            </div>
        </div>`;
    document.body.appendChild(overlay);

    const cerrar = () => overlay.remove();
    overlay.querySelector('[data-cancel]').onclick = cerrar;
    overlay.addEventListener('click', e => { if (e.target === overlay) cerrar(); });
    overlay.querySelector('[data-ok]').onclick = () => {
        db[tipo] = db[tipo].filter(r => r.id !== id);
        guardarDB();
        renderTodo();
        cerrar();
        mostrarToast('Registro eliminado', 'danger');
    };
    overlay.querySelector('[data-ok]').focus();
}

// ---------- 8. Cambiar estado Activo / Inactivo con un clic ----------
function toggleEstado(id) {
    const a = db.assistants.find(r => r.id === id);
    a.estado = a.estado === 'Activo' ? 'Inactivo' : 'Activo';
    guardarDB();
    renderTabla('assistants');
    mostrarToast(`Estado cambiado a ${a.estado}`, a.estado === 'Activo' ? 'success' : 'warning');
}

// ---------- 9. Notificaciones tipo toast ----------
function mostrarToast(mensaje, tipo = 'success') {
    let zona = document.querySelector('.toast-zone');
    if (!zona) {
        zona = document.createElement('div');
        zona.className = 'toast-zone';
        document.body.appendChild(zona);
    }
    const iconos = { success: 'fa-circle-check', danger: 'fa-trash', warning: 'fa-triangle-exclamation' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;
    toast.innerHTML = `<i class="fa-solid ${iconos[tipo] || iconos.success}"></i> ${escapar(mensaje)}`;
    zona.appendChild(toast);
    setTimeout(() => toast.classList.add('salir'), 2600);
    setTimeout(() => toast.remove(), 3000);
}

// ---------- 10. Atajos y arranque ----------
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        const confirm = document.querySelector('.confirm-overlay');
        if (confirm) confirm.remove(); else closeModal();
    }
});

document.getElementById('modal-container').addEventListener('click', e => {
    if (e.target.id === 'modal-container') closeModal();
});

renderTodo();
