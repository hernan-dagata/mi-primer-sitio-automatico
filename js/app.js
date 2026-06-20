const SUPABASE_URL = "https://axmywsefljqnnpzsvvha.supabase.co";
const SUPABASE_KEY = "sb_publishable_ZLxFry6SNTIErzsTFAiitA_gkYx6Pd9";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

let editandoId = null;

function formatearFecha(fecha) {
    return new Date(fecha).toLocaleString("es-CO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}

async function cargarUsuarios() {
    const { data, error } = await supabaseClient
        .from("usuarios")
        .select("*")
        .order("id");
    if (error) {
        console.log("Error:", error);
        return;
    }
    const container = document.getElementById("userContainer");
    container.innerHTML = "";
    data.forEach(usuario => {
        const card = document.createElement("div");
        card.classList.add("user-card");
        card.innerHTML = `
            <h3>${usuario.name}</h3>
            <p>${usuario.email}</p>
            <small>
                📅 Registrado el:
                ${formatearFecha(usuario.created_at)}
            </small>
            <button onclick="editarUsuario(
                '${usuario.id}',
                '${usuario.name}',
                '${usuario.email}'
            )">
                Editar
            </button>
            <button onclick="eliminarUsuario('${usuario.id}')">
                Eliminar
            </button>
        `;
        container.appendChild(card);
    });
}
cargarUsuarios();

const form = document.getElementById("userForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    let response;

    if (editandoId !== null) {
        response = await supabaseClient
            .from("usuarios")
            .update({
                name: name,
                email: email

            })
            .eq("id", editandoId);
    } else {
        response = await supabaseClient
            .from("usuarios")
            .insert([{
                name: name,
                email: email
            }]);
    }

    if (response.error) {
        console.log("Error:", response.error);
    } else {
        alert(
            editandoId
                ? "Usuario actualizado"
                : "Usuario creado"
        );
        document
            .getElementById("userForm")
            .reset();
        editandoId = null;
        document
            .getElementById("saveButton")
            .textContent = "Crear usuario";
        cargarUsuarios();
    }
});

window.editarUsuario = function (id, name, email) {
    console.log("Editando:", id, name, email);
    editandoId = id;
    document.getElementById("name").value = name;
    document.getElementById("email").value = email;
    document.getElementById("saveButton").textContent = "Actualizar usuario";
};
cargarUsuarios();

window.eliminarUsuario = async function(id) {
    const confirmar = confirm(
        "¿Estás seguro de eliminar este usuario?"
    );
    if(!confirmar){
        return;
    }
    const { error } = await supabaseClient
        .from("usuarios")
        .delete()
        .eq("id", id);
    if(error){
        console.log("Error:", error);
    } else {
        alert("Usuario eliminado");
        cargarUsuarios();
    }
};