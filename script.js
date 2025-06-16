document.addEventListener('DOMContentLoaded', () => {

    // --- DADOS SIMULADOS (com Temperatura Ambiente e novo cálculo de Simulação) ---
    const dadosMedidos = [
        { data: '18/06/2025', tempAmbiente: 32, tempArborizado: 35, tempExposto: 59 },
        { data: '19/06/2025', tempAmbiente: 29, tempArborizado: 31, tempExposto: 48 },
        { data: '20/06/2025', tempAmbiente: 31, tempArborizado: 33, tempExposto: 55 },
        { data: '21/06/2025', tempAmbiente: 28, tempArborizado: 30, tempExposto: 45 },
        { data: '22/06/2025', tempAmbiente: 34, tempArborizado: 36, tempExposto: 61 }
    ];

    // Adiciona a temperatura simulada calculada a cada dia
    dadosMedidos.forEach(dado => {
        const excessoCalor = dado.tempExposto - dado.tempAmbiente;
        const reducao = excessoCalor * 0.25; // Redução de 25%
        dado.tempSimulado = parseFloat((dado.tempExposto - reducao).toFixed(1));
    });

    // --- ELEMENTOS DO HTML (DOM) ---
    const dayButtons = document.querySelectorAll('.day-btn');
    const dataArborizadoEl = document.getElementById('data-arborizado');
    const tempAmbienteArborizadoEl = document.getElementById('ambiente-arborizado');
    const tempArborizadoEl = document.getElementById('temp-arborizado');
    const dataExpostoEl = document.getElementById('data-exposto');
    const tempAmbienteExpostoEl = document.getElementById('ambiente-exposto');
    const tempExpostoEl = document.getElementById('temp-exposto');

    // ... (O restante do código, incluindo a configuração dos gráficos e a lógica de atualização, permanece o mesmo) ...
    // --- CONFIGURAÇÃO DOS GRÁFICOS ---
    const lineChartCtx = document.getElementById('lineChart').getContext('2d');
    const barChartCtx = document.getElementById('barChart').getContext('2d');
    let barChart;

    // 1. CRIAR GRÁFICO DE LINHA (mostra todos os dias)
    new Chart(lineChartCtx, {
        type: 'line',
        data: {
            labels: dadosMedidos.map(d => `Dia ${d.data.split('/')[0]}`),
            datasets: [{
                label: 'Temp. Ponto Exposto (°C)',
                data: dadosMedidos.map(d => d.tempExposto),
                borderColor: '#e74c3c',
                backgroundColor: '#e74c3c',
                tension: 0.1
            }, {
                label: 'Temp. Ponto Arborizado (°C)',
                data: dadosMedidos.map(d => d.tempArborizado),
                borderColor: '#2ecc71',
                backgroundColor: '#2ecc71',
                tension: 0.1
            }, {
                label: 'Temp. Ambiente (°C)',
                data: dadosMedidos.map(d => d.tempAmbiente),
                borderColor: '#f39c12',
                backgroundColor: '#f39c12',
                tension: 0.1,
                borderDash: [5, 5] // Linha tracejada
            }]
        }
    });
    
    // --- FUNÇÕES DE ATUALIZAÇÃO ---
    function updateDisplay(dayIndex) {
        const selectedData = dadosMedidos[dayIndex];

        // Atualiza os cartões de temperatura
        dataArborizadoEl.innerText = selectedData.data;
        tempAmbienteArborizadoEl.innerText = `${selectedData.tempAmbiente}°C`;
        tempArborizadoEl.innerText = `${selectedData.tempArborizado}°C`;
        dataExpostoEl.innerText = selectedData.data;
        tempAmbienteExpostoEl.innerText = `${selectedData.tempAmbiente}°C`;
        tempExpostoEl.innerText = `${selectedData.tempExposto}°C`;

        // Atualiza o gráfico de barras
        const barChartData = {
            labels: ['Arborizado', 'Exposto (Atual)', 'Exposto (Simulado)'],
            datasets: [{
                label: 'Temperatura da Superfície (°C)',
                data: [selectedData.tempArborizado, selectedData.tempExposto, selectedData.tempSimulado],
                backgroundColor: ['#2ecc71', '#e74c3c', '#3498db'],
            }]
        };

        if (barChart) {
            barChart.data = barChartData;
            barChart.update();
        } else {
            barChart = new Chart(barChartCtx, { type: 'bar', data: barChartData, options: { plugins: { legend: { display: false } } } });
        }
    }

    // --- EVENT LISTENERS (INTERATIVIDADE) ---
    dayButtons.forEach(button => {
        button.addEventListener('click', () => {
            dayButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const dayIndex = button.getAttribute('data-day');
            updateDisplay(dayIndex);
        });
    });

    updateDisplay(0);

    // --- ANIMAÇÃO DE SCROLL ---
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