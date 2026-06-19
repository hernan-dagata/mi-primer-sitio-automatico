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


    const lista = document.getElementById("userList");


    data.forEach(usuario => {

        const item = document.createElement("li");

        item.textContent =
            `${usuario.name} - ${usuario.email}`;


        lista.appendChild(item);

    });

}


cargarUsuarios();