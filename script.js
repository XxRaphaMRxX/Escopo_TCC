// Aguarda o conteúdo da página carregar completamente
document.addEventListener('DOMContentLoaded', () => {

    // Seleciona todas as seções que devem ser animadas (as que têm a classe 'hidden')
    const hiddenElements = document.querySelectorAll('.hidden');

    // Cria um "observador" que vai verificar quando um elemento entra na tela
    const observer = new IntersectionObserver((entries) => {
        // Para cada elemento que o observador está vigiando...
        entries.forEach((entry) => {
            // Se o elemento estiver visível na tela...
            if (entry.isIntersecting) {
                // Adiciona a classe 'show', que torna o elemento visível com a animação CSS
                entry.target.classList.add('show');
            } else {
                // Opcional: Se quiser que a animação aconteça toda vez que rolar para cima e para baixo
                // entry.target.classList.remove('show');
            }
        });
    }, {
        // Define que a animação começa quando 5% do elemento estiver visível
        threshold: 0.05 
    });

    // Pede ao observador para vigiar cada uma das seções escondidas
    hiddenElements.forEach((el) => observer.observe(el));

});