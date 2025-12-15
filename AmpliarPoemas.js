function ampliarPoema(titulo, texto) {
  document.getElementById("modalTitulo").textContent = titulo;
  document.getElementById("modalTexto").textContent = texto;
  document.getElementById("poemaModal").style.display = "flex";
}

function cerrarPoema() {
  document.getElementById("poemaModal").style.display = "none";
}