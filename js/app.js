const SUPABASE_URL = "https://axmywsefljqnnpzsvvha.supabase.co";
const SUPABASE_KEY = "sb_publishable_ZLxFry6SNTIErzsTFAiitA_gkYx6Pd9";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

async function cargarUsuarios() {
    const { data, error } = await supabaseClient
        .from("usuarios")
        .select("*");
    if (error) {
        console.log("Error:", error);
        return;
    }
    const container = document.getElementById("userContainer");
    data.forEach(usuario => {
        const card = document.createElement("div");
        card.classList.add("user-card");
        card.innerHTML = `
        <h3>${usuario.name}</h3>
        <p>${usuario.email}</p>
        <small>${usuario.created_at}</small>
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
    const { data, error } = await supabaseClient
        .from("usuarios")
        .insert([
            {
                name: name,
                email: email
            }
        ]);
    if (error) {
        console.log("Error:", error);
    } else {
        console.log("Usuario creado:", data);
        alert("Usuario creado correctamente");
        form.reset();
        cargarUsuarios();
    }
});