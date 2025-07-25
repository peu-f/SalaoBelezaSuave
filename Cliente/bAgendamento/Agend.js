function logout() {
    alert('Você clicou em Sair!');
    window.location.href = '/Cliente/aLogineCadastro/login.html';
};

document.addEventListener('DOMContentLoaded', () => {
    const openSidebarButton = document.getElementById('openSidebarButton');
    const closeSidebarButton = document.getElementById('closeSidebarButton');
    const customSidebar = document.getElementById('customSidebar');
    const customSidebarOverlay = document.getElementById('customSidebarOverlay');

    if (openSidebarButton && customSidebar && closeSidebarButton && customSidebarOverlay) {
        openSidebarButton.addEventListener('click', () => {
            customSidebar.classList.add('show');
            customSidebarOverlay.classList.add('show');
            document.body.style.overflow = 'hidden'; // Evita scroll da página principal
        });

        closeSidebarButton.addEventListener('click', () => {
            customSidebar.classList.remove('show');
            customSidebarOverlay.classList.remove('show');
            document.body.style.overflow = ''; // Permite scroll da página principal
        });

        customSidebarOverlay.addEventListener('click', () => {
            customSidebar.classList.remove('show');
            customSidebarOverlay.classList.remove('show');
            document.body.style.overflow = '';
        });
    }
});