let map = L.map("map").setView([0, 0], 12);

map.locate({ setView: true, maxZoom: 16 });

map.on("locationfound", function (e) {
  const radius = e.accuracy;

  L.marker(e.latlng).addTo(map).bindPopup("Você está aqui!").openPopup();

  L.circle(e.latlng, radius).addTo(map);
});

map.on("locationerror", function (e) {
  alert("Não foi possível obter sua localização: " + e.message);
  map.setView([-23.55, -46.63], 12);
});

let marker;

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

map.on("click", function (e) {
  const { lat, lng } = e.latlng;
  document.getElementById("latitude").value = lat;
  document.getElementById("longitude").value = lng;

  if (marker) {
    marker.setLatLng(e.latlng);
  } else {
    marker = L.marker(e.latlng).addTo(map);
  }
});

async function buscarEndereco() {
  const query = document.getElementById("buscaLocal").value;
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
    map.setView(coords, 17);

    if (marker) {
      marker.setLatLng(coords);
    } else {
      marker = L.marker(coords).addTo(map);
    }

    document.getElementById("latitude").value = lat;
    document.getElementById("longitude").value = lon;
  } else {
    alert("Endereço não encontrado.");
  }
}

document
  .getElementById("denunciaForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    try {
      const titulo = document.getElementById("titulo").value;
      const descricao = document.getElementById("descricao").value;
      const categoria = document.getElementById("categoria").value;
      const latitude = document.getElementById("latitude").value;
      const longitude = document.getElementById("longitude").value;
      if (!latitude || !longitude) {
        return alert("Selecione uma localização no mapa.");
      }

      const res = await fetch("http://localhost:5000/denuncias", {
        method: "POST",
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

      if (!res.ok) {
        throw new Error("Erro na requisição");
      }

      alert("Denúncia enviada com sucesso!");
      location.reload();
    } catch (error) {
      alert("Erro ao enviar denúncia: " + error);
    }
  });
