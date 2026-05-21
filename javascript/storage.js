/* BOTÓN MODO OSCURO */
export const inicializarModoOscuro = () => {
  const btn = document.getElementById("theme-toggle");
  const currentTheme = localStorage.getItem("theme");

  // Aplicar tema guardado
  document.body.classList.toggle("dark-mode", currentTheme === "dark");

  // Click del botón
  if (btn) {
    btn.addEventListener("click", () => {
      const esOscuro = document.body.classList.toggle("dark-mode");
      localStorage.setItem("theme", esOscuro ? "dark" : "light");
    });
  }
};