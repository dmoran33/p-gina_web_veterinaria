document.addEventListener('DOMContentLoaded', () => {
    // Verificamos si la función estaLogueado existe y si el usuario ya inició sesión
    const usuarioLogueado = typeof estaLogueado === 'function' && estaLogueado();

    // Buscamos el contenedor del botón de login en el navbar (tanto público como privado)
    const linkLogin = document.getElementById('link-login');

    if (usuarioLogueado && linkLogin) {
        // Si el usuario ESTÁ logueado, reemplazamos el botón de "Iniciar Sesión" 
        // por la opción de "Cerrar Sesión" o un acceso directo al Panel.
        linkLogin.innerHTML = `
            <button class="btn btn-formulario" type="button" onclick="cerrarSesion()">Cerrar sesión</button>
        `;
    }
});