let map = L.map("map").setView([0, 0], 12);
let editMap = L.map("editMap").setView([0, 0], 12);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
  editMap
);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

const bounds = L.latLngBounds();

let markers = [];
let editMarker;

// Carrega as denúncias
async function carregarDenuncias(query = "") {
  markers.forEach((marker) => map.removeLayer(marker));
  markers = [];

  const url = query
    ? `http://localhost:5000/denuncias?q=${encodeURIComponent(query)}`
    : "http://localhost:5000/denuncias";

  const res = await fetch(url);
  const denuncias = await res.json();

  for (const denuncia of denuncias) {
    const coords = [
      denuncia.localizacao.coordinates[1],
      denuncia.localizacao.coordinates[0],
    ];

    const marker = L.marker(coords).addTo(map);
    markers.push(marker);

    marker.bindPopup(`
      <div style="font-family: sans-serif; max-width: 220px;">
        <h3 style="font-size: 1rem; font-weight: bold; margin-bottom: 4px;">${denuncia.titulo}</h3>
        <p style="margin: 0 0 6px 0; font-size: 0.9rem; color: #555;">${denuncia.descricao}</p>
        <span style="display: inline-block; font-size: 0.8rem; color: #666; margin-bottom: 8px;">
          <em>${denuncia.categoria}</em>
        </span><br>
        <span class="endereco" style="display: block; font-size: 0.8rem; color: #444; margin-bottom: 8px;">
          📍 <em>Carregando endereço...</em>
        </span>
        <div style="display: flex; gap: 6px;">
          <button onclick="editarDenuncia('${denuncia._id}')" 
            style="flex: 1; background: #2563eb; color: white; padding: 4px 6px; border: none; border-radius: 4px; cursor: pointer;">
            ✏️ Editar
          </button>
          <button onclick="deletarDenuncia('${denuncia._id}')" 
            style="flex: 1; background: #dc2626; color: white; padding: 4px 6px; border: none; border-radius: 4px; cursor: pointer;">
            🗑️ Deletar
          </button>
        </div>
      </div>
    `);

    marker.on("popupopen", async (e) => {
      try {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords[0]}&lon=${coords[1]}`
        );
        const geoData = await geoRes.json();

        let endereco = "Endereço não encontrado";
        if (geoData.address) {
          const { road, suburb, city, town, state } = geoData.address;
          endereco = `${road || ""} ${suburb || ""} - ${city || town || ""} / ${
            state || ""
          }`.trim();
        }

        const popupNode = e.popup.getElement();
        const enderecoEl = popupNode.querySelector(".endereco");
        if (enderecoEl) {
          enderecoEl.innerHTML = `📍 ${endereco}`;
        }
      } catch (err) {
        console.error("Erro ao buscar endereço:", err);
      }
    });

    bounds.extend(coords);
  }

  map.fitBounds(bounds);
}

// Busca denúncias por texto
function buscarDenuncias() {
  const query = document.getElementById("buscaTexto").value;
  carregarDenuncias(query);
}

async function buscarLocal() {
  const query = document.getElementById("editLocalBusca").value;
  if (!query) return;

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}`
  );
  const data = await res.json();

  if (data.length > 0) {
    const { lat, lon } = data[0];
    const coords = [parseFloat(lat), parseFloat(lon)];
    editMap.setView(coords, 17);

    if (editMarker) {
      editMarker.setLatLng(coords);
    } else {
      editMarker = L.marker(coords).addTo(editMap);
    }

    document.getElementById("latitude").value = lat;
    document.getElementById("longitude").value = lon;
  } else {
    alert("Endereço não encontrado.");
  }
}

// Editar denúncia
async function editarDenuncia(id) {
  const res = await fetch(`http://localhost:5000/denuncias/${id}`);
  if (!res.ok) return alert("Denúncia não encontrada.");

  const denuncia = await res.json();

  const [longitude, latitude] = denuncia.localizacao?.coordinates;
  const coords = [latitude, longitude];

  document.getElementById("container-form").classList.remove("hidden");

  setTimeout(() => {
    editMap.invalidateSize();
  }, 100);

  if (editMarker) {
    editMarker.setLatLng(coords);
  } else {
    editMarker = L.marker(coords).addTo(editMap);
  }

  editMap.setView(coords, 17);

  document.getElementById("editId").value = id;
  document.getElementById("latitude").value = latitude;
  document.getElementById("longitude").value = longitude;
  document.getElementById("editTitulo").value = denuncia.titulo;
  document.getElementById("editDescricao").value = denuncia.descricao;
  document.getElementById("editCategoria").value = denuncia.categoria;
}

// Deletar denúncia
async function deletarDenuncia(id) {
  if (!confirm("Tem certeza que deseja deletar esta denúncia?")) return;

  const res = await fetch(`http://localhost:5000/denuncias/${id}`, {
    method: "DELETE",
  });

  if (res.ok) {
    alert("Denúncia deletada com sucesso!");
    carregarDenuncias();
  } else {
    const error = await res.json();
    alert("Erro ao deletar: " + (error.message || "Erro desconhecido"));
  }
}

editMap.on("click", function (e) {
  const { lat, lng } = e.latlng;
  document.getElementById("latitude").value = lat;
  document.getElementById("longitude").value = lng;

  if (editMarker) {
    editMarker.setLatLng(e.latlng);
  } else {
    editMarker = L.marker(e.latlng).addTo(editMap);
  }
});

document
  .querySelector("#btn-fechar-modal-denuncia")
  .addEventListener("click", () => {
    document.getElementById("container-form").classList.add("hidden");
  });

document
  .querySelector("#form-pesquisar-denuncia")
  .addEventListener("submit", (e) => {
    e.preventDefault();

    buscarDenuncias();
  });

document
  .getElementById("editForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const id = document.getElementById("editId").value;
    const titulo = document.getElementById("editTitulo").value;
    const descricao = document.getElementById("editDescricao").value;
    const categoria = document.getElementById("editCategoria").value;
    const latitude = document.getElementById("latitude").value;
    const longitude = document.getElementById("longitude").value;

    if (!latitude || !longitude) {
      return alert("Selecione uma localização no mapa.");
    }

    try {
      const res = await fetch(`http://localhost:5000/denuncias/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo,
          descricao,
          categoria,
          localizacao: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
        }),
      });

      if (res.ok) {
        alert("Denúncia atualizada com sucesso!");
        document.getElementById("container-form").classList.add("hidden");
        carregarDenuncias();
      } else {
        const error = await res.json();
        throw new Error(error.message || "Erro ao atualizar");
      }
    } catch (error) {
      alert("Erro ao atualizar denúncia: " + error.message);
    }
  });

window.onload = () => carregarDenuncias();
