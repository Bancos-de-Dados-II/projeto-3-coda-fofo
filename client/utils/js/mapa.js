let map = L.map("map").setView([0, 0], 12);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

const bounds = L.latLngBounds();

async function getDenuncias() {
  try {
    const res = await fetch("http://localhost:5000/denuncias");

    if (!res.ok) {
      throw new Error("Erro ao buscar as denuncias");
    }

    const denuncias = await res.json();
    return denuncias;
  } catch (error) {
    alert("ERRO: ", error);
  }
}

async function getDenunciaPorId(id) {
  try {
    const res = await fetch(`http://localhost:5000/denuncias/${id}`);

    if (!res.ok) {
      throw new Error("Erro ao buscar a denuncia");
    }

    const denuncia = await res.json();
    return denuncia;
  } catch (error) {
    alert("ERRO: ", error);
  }
}

// Carrega as denúncias
async function carregarDenuncias() {
  const denuncias = await getDenuncias();

  denuncias.forEach((denuncia) => {
    const [longitude, latitude] = denuncia.localizacao?.coordinates;
    const marker = L.marker([latitude, longitude]).addTo(map);

    marker.bindPopup(`
      <strong>${denuncia.titulo}</strong><br>
      ${denuncia.descricao}<br>
      <em>${denuncia.categoria}</em><br><br>
      <button onclick="editar('${denuncia._id}')" class='text-blue-600 underline'>✏️ Editar</button>
      <button onclick="deletar('${denuncia._id}')" class='text-red-600 underline ml-2'>🗑️ Deletar</button>
    `);

    bounds.extend([latitude, longitude]);
  });

  map.fitBounds(bounds);
}

async function editar(id) {
  const denuncia = await getDenunciaPorId(id);

  if (!denuncia) return alert("Denúncia não encontrada.");

  document.getElementById("editId").value = id;
  document.getElementById("editTitulo").value = denuncia.titulo;
  document.getElementById("editDescricao").value = denuncia.descricao;
  document.getElementById("editCategoria").value = denuncia.categoria;

  document.getElementById("editForm").classList.remove("hidden");
}

async function deletar(id) {
  if (!confirm("Tem certeza que deseja deletar?")) return;

  const res = await fetch(`http://localhost:5000/denuncias/${id}`, {
    method: "DELETE",
  });

  if (res.ok) {
    alert("Denúncia deletada.");
    location.reload();
  } else {
    alert("Erro ao deletar.");
  }
}

document
  .getElementById("editForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const id = document.getElementById("editId").value;
    const titulo = document.getElementById("editTitulo").value;
    const descricao = document.getElementById("editDescricao").value;
    const categoria = document.getElementById("editCategoria").value;

    try {
      const res = await fetch(`http://localhost:5000/denuncias/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo,
          descricao,
          categoria,
        }),
      });

      if (!res.ok) {
        throw new Error("Erro na requisição");
      }
      alert("Denúncia atualizada!");
      location.reload();
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar.");
    }
  });

carregarDenuncias();
