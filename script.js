document.addEventListener('DOMContentLoaded', () => {

    // --- DADOS SIMULADOS DA MEDIÇÃO (5 DIAS) ---
    const dadosMedidos = [
        { data: '18/06/2025', condicao: 'Ensolarado Intenso', tempArborizado: 35, tempExposto: 59, tempSimulado: 52 },
        { data: '19/06/2025', condicao: 'Parcialmente Nublado', tempArborizado: 31, tempExposto: 48, tempSimulado: 42 },
        { data: '20/06/2025', condicao: 'Ensolarado', tempArborizado: 33, tempExposto: 55, tempSimulado: 48 },
        { data: '21/06/2025', condicao: 'Levemente Nublado', tempArborizado: 30, tempExposto: 45, tempSimulado: 39 },
        { data: '22/06/2025', condicao: 'Muito Ensolarado', tempArborizado: 36, tempExposto: 61, tempSimulado: 54 }
    ];

    // --- ELEMENTOS DO HTML (DOM) ---
    const dayButtons = document.querySelectorAll('.day-btn');
    const dataArborizadoEl = document.getElementById('data-arborizado');
    const tempArborizadoEl = document.getElementById('temp-arborizado');
    const dataExpostoEl = document.getElementById('data-exposto');
    const tempExpostoEl = document.getElementById('temp-exposto');

    // --- CONFIGURAÇÃO DOS GRÁFICOS ---
    const lineChartCtx = document.getElementById('lineChart').getContext('2d');
    const barChartCtx = document.getElementById('barChart').getContext('2d');
    let barChart; // Variável para guardar a instância do gráfico de barras para poder atualizá-lo

    // 1. CRIAR GRÁFICO DE LINHA (mostra todos os dias)
    new Chart(lineChartCtx, {
        type: 'line',
        data: {
            labels: dadosMedidos.map(d => `Dia ${d.data.split('/')[0]}`), // ['Dia 18', 'Dia 19', ...]
            datasets: [{
                label: 'Temperatura em Ponto Exposto',
                data: dadosMedidos.map(d => d.tempExposto),
                borderColor: '#e74c3c',
                backgroundColor: '#e74c3c',
                tension: 0.1
            }, {
                label: 'Temperatura em Ponto Arborizado',
                data: dadosMedidos.map(d => d.tempArborizado),
                borderColor: '#2ecc71',
                backgroundColor: '#2ecc71',
                tension: 0.1
            }]
        }
    });
    
    // --- FUNÇÕES DE ATUALIZAÇÃO ---

    // Função para ATUALIZAR os cartões e o gráfico de barras
    function updateDisplay(dayIndex) {
        const selectedData = dadosMedidos[dayIndex];

        // Atualiza os cartões de temperatura
        dataArborizadoEl.innerText = selectedData.data;
        tempArborizadoEl.innerText = `${selectedData.tempArborizado}°C`;
        dataExpostoEl.innerText = selectedData.data;
        tempExpostoEl.innerText = `${selectedData.tempExposto}°C`;

        // Atualiza o gráfico de barras
        const barChartData = {
            labels: ['Arborizado', 'Exposto (Atual)', 'Exposto (Simulado)'],
            datasets: [{
                label: 'Temperatura da Superfície',
                data: [selectedData.tempArborizado, selectedData.tempExposto, selectedData.tempSimulado],
                backgroundColor: ['#2ecc71', '#e74c3c', '#3498db'],
                borderColor: ['#27ae60', '#c0392b', '#2980b9'],
                borderWidth: 1
            }]
        };

        if (barChart) {
            barChart.data = barChartData;
            barChart.update();
        } else {
            barChart = new Chart(barChartCtx, { type: 'bar', data: barChartData, options: { indexAxis: 'y' } });
        }
    }

    // --- EVENT LISTENERS (INTERATIVIDADE) ---
    
    // Adiciona o clique para os botões de dia
    dayButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove a classe 'active' de todos os botões
            dayButtons.forEach(btn => btn.classList.remove('active'));
            // Adiciona a classe 'active' ao botão clicado
            button.classList.add('active');
            
            const dayIndex = button.getAttribute('data-day');
            updateDisplay(dayIndex);
        });
    });

    // Inicia a página exibindo os dados do primeiro dia
    updateDisplay(0);

    // --- ANIMAÇÃO DE SCROLL (CÓDIGO ANTERIOR) ---
    const hiddenElements = document.querySelectorAll('.hidden');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.1 });
    hiddenElements.forEach((el) => observer.observe(el));
});