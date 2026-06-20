const SUPABASE_URL = "https://axmywsefljqnnpzsvvha.supabase.co";
const SUPABASE_KEY = "sb_publishable_ZLxFry6SNTIErzsTFAiitA_gkYx6Pd9";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

let editandoId = null;

/* =========================
    🔥 UTILIDADES PRO
========================= */
function toast(msg) {
    const t = document.createElement("div");
    t.textContent = msg;
    Object.assign(t.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        background: "#38bdf8",
        color: "#000",
        padding: "12px 16px",
        borderRadius: "10px",
        fontWeight: "bold",
        zIndex: 9999,
        boxShadow: "0 0 15px rgba(56,189,248,0.5)"
    });
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2000);
}

function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setLoading(state) {
    const btn = document.getElementById("saveButton");
    btn.disabled = state;
    btn.textContent = state
        ? "Guardando..."
        : editandoId ? "Actualizar usuario" : "Guardar usuario";
}

function formatearFecha(fecha) {
    return new Date(fecha).toLocaleString("es-CO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}

/* =========================
    📦 CARGAR USUARIOS
========================= */
async function cargarUsuarios() {
    const { data, error } = await supabaseClient
        .from("usuarios")
        .select("*")
        .order("id");
    if (error) {
        console.log("Error:", error);
        return;
    }
    usuariosCache = data;
    renderUsuarios(data);
}

/* =========================
    💾 GUARDAR / ACTUALIZAR
========================= */
document.getElementById("userForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    if (!validarEmail(email)) {
        toast("Email inválido");
        return;
    }
    setLoading(true);
    let response;
    if (editandoId) {
        response = await supabaseClient
            .from("usuarios")
            .update({ name, email })
            .eq("id", editandoId);
    } else {
        response = await supabaseClient
            .from("usuarios")
            .insert([{ name, email }]);
    }
    setLoading(false);
    if (response.error) {
        console.log(response.error);
        toast("Error al guardar");
        return;
    }
    toast(editandoId ? "Usuario actualizado" : "Usuario creado");
    e.target.reset();
    editandoId = null;
    cargarUsuarios();
});

/* =========================
    ✏️ EDITAR
========================= */
window.editarUsuario = function (id, name, email) {
    editandoId = id;
    document.getElementById("name").value = name;
    document.getElementById("email").value = email;
    document.getElementById("saveButton").textContent = "Actualizar usuario";
    document.querySelector(".hero").scrollIntoView({ behavior: "smooth" });
};

/* =========================
    🗑️ ELIMINAR
========================= */
window.eliminarUsuario = async function (id) {
    const confirmar = confirm("¿Seguro que quieres eliminar este usuario?");
    if (!confirmar) return;
    const { error } = await supabaseClient
        .from("usuarios")
        .delete()
        .eq("id", id);
    if (error) {
        console.log(error);
        toast("Error al eliminar");
        return;
    }
    toast("Usuario eliminado");
    cargarUsuarios();
};

/* =========================
    🚀 INIT
========================= */
cargarUsuarios();


/* =========================
    🔍 BUSCAR USUARIO
========================= */
let usuariosCache = [];
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", (e) => {
    const valor = e.target.value.toLowerCase().trim();
    const filtrados = usuariosCache.filter(u =>
        u.name.toLowerCase().includes(valor) ||
        u.email.toLowerCase().includes(valor)
    );
    renderUsuarios(filtrados);
});

function renderUsuarios(data) {
    const container = document.getElementById("userContainer");
    container.innerHTML = "";
    data.forEach(usuario => {
        const card = document.createElement("div");
        card.classList.add("user-card");
        const name = document.createElement("h3");
        name.textContent = usuario.name;
        const email = document.createElement("p");
        email.textContent = usuario.email;
        const fecha = document.createElement("small");
        fecha.textContent = `📅 Registrado: ${formatearFecha(usuario.created_at)}`;
        const editBtn = document.createElement("button");
        editBtn.textContent = "Editar";
        editBtn.onclick = () =>
            editarUsuario(usuario.id, usuario.name, usuario.email);
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Eliminar";
        deleteBtn.onclick = () =>
            eliminarUsuario(usuario.id);
        card.append(name, email, fecha, editBtn, deleteBtn);
        container.appendChild(card);
    });
}

async function cargarMetricas() {
    const { data, error } = await supabaseClient
        .from("usuarios")
        .select("id, created_at");
    if (error) {
        console.log(error);
        return;
    }
    const total = data.length;
    const hoy = new Date();
    const inicioHoy = new Date();
    inicioHoy.setHours(0, 0, 0, 0);
    const hace7dias = new Date();
    hace7dias.setDate(hoy.getDate() - 7);
    let hoyCount = 0;
    let semanaCount = 0;
    data.forEach(u => {
        const fecha = new Date(u.created_at);
        if (fecha >= inicioHoy) {
            hoyCount++;
        }
        if (fecha >= hace7dias) {
            semanaCount++;
        }
    });
    document.getElementById("totalUsers").textContent = total;
    document.getElementById("usersToday").textContent = hoyCount;
    document.getElementById("usersWeek").textContent = semanaCount;
}
cargarMetricas();