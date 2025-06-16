document.addEventListener('DOMContentLoaded', () => {

    // Registra o novo plugin globalmente para que todos os gráficos possam usá-lo
    Chart.register(ChartDataLabels);

    // --- DADOS SIMULADOS E CÁLCULO INICIAL ---
    const dadosMedidos = [
        { data: '18/06/2025', tempAmbiente: 32, tempArborizado: 35, tempExposto: 59 },
        { data: '19/06/2025', tempAmbiente: 29, tempArborizado: 31, tempExposto: 48 },
        { data: '20/06/2025', tempAmbiente: 31, tempArborizado: 33, tempExposto: 55 },
        { data: '21/06/2025', tempAmbiente: 28, tempArborizado: 30, tempExposto: 45 },
        { data: '22/06/2025', tempAmbiente: 34, tempArborizado: 36, tempExposto: 61 }
    ];

    dadosMedidos.forEach(dado => {
        const excessoCalor = dado.tempExposto - dado.tempAmbiente;
        const reducao = excessoCalor * 0.25;
        dado.tempSimulado = parseFloat((dado.tempExposto - reducao).toFixed(1));
    });

    // --- LÓGICA PARA A SEÇÃO INTERATIVA (DIA A DIA) ---
    const dayButtons = document.querySelectorAll('.day-btn');
    const dataArborizadoEl = document.getElementById('data-arborizado');
    const tempAmbienteArborizadoEl = document.getElementById('ambiente-arborizado');
    const tempArborizadoEl = document.getElementById('temp-arborizado');
    const dataExpostoEl = document.getElementById('data-exposto');
    const tempAmbienteExpostoEl = document.getElementById('ambiente-exposto');
    const tempExpostoEl = document.getElementById('temp-exposto');

    function updateDayDisplay(dayIndex) {
        const selectedData = dadosMedidos[dayIndex];
        dataArborizadoEl.innerText = selectedData.data;
        tempAmbienteArborizadoEl.innerText = `${selectedData.tempAmbiente}°C`;
        tempArborizadoEl.innerText = `${selectedData.tempArborizado}°C`;
        dataExpostoEl.innerText = selectedData.data;
        tempAmbienteExpostoEl.innerText = `${selectedData.tempAmbiente}°C`;
        tempExpostoEl.innerText = `${selectedData.tempExposto}°C`;
    }

    dayButtons.forEach(button => {
        button.addEventListener('click', () => {
            dayButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            updateDayDisplay(button.getAttribute('data-day'));
        });
    });
    updateDayDisplay(0); // Inicia com o primeiro dia selecionado

    // --- LÓGICA PARA OS GRÁFICOS GERAIS ---
    
    // 1. Gráfico de Linha (Tendência)
    const lineChartCtx = document.getElementById('lineChart').getContext('2d');
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
                borderDash: [5, 5]
            }]
        }
    });
    
    // 2. Gráfico de Barras (Médias)
    const average = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
    const avgArborizado = average(dadosMedidos.map(d => d.tempArborizado));
    const avgExposto = average(dadosMedidos.map(d => d.tempExposto));

    const averageBarCtx = document.getElementById('averageBarChart').getContext('2d');
    new Chart(averageBarCtx, {
        type: 'bar',
        data: {
            labels: ['Ponto Arborizado', 'Ponto Exposto'],
            datasets: [{
                label: 'Média de Temperatura (°C)',
                data: [avgArborizado.toFixed(1), avgExposto.toFixed(1)],
                backgroundColor: ['#2ecc71', '#e74c3c'],
            }]
        },
        options: { 
            indexAxis: 'y', 
            plugins: { 
                legend: { display: false },
                datalabels: {
                    color: '#ffffff',
                    anchor: 'center',
                    align: 'center',
                    font: { weight: 'bold', size: 14 },
                    formatter: function(value) { return value + '°C'; }
                }
            } 
        }
    });

    // --- LÓGICA PARA O GRÁFICO FINAL DE SIMULAÇÃO ---
    const avgSimulado = average(dadosMedidos.map(d => d.tempSimulado));
    const finalComparisonCtx = document.getElementById('finalComparisonChart').getContext('2d');
    new Chart(finalComparisonCtx, {
        type: 'bar',
        data: {
            labels: ['Arborizado (Média)', 'Exposto (Média Atual)', 'Exposto (Média Simulada)'],
            datasets: [{
                label: 'Temperatura Média da Superfície (°C)',
                data: [avgArborizado.toFixed(1), avgExposto.toFixed(1), avgSimulado.toFixed(1)],
                backgroundColor: ['#2ecc71', '#e74c3c', '#3498db'],
            }]
        },
        // ATUALIZAÇÃO AQUI PARA ADICIONAR TÍTULO
        options: {
            plugins: {
                legend: { 
                    display: false 
                },
                // Adiciona um título principal ao gráfico
                title: {
                    display: true,
                    text: 'Comparativo de Temperaturas Médias',
                    font: {
                        size: 18
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    }
                },
                datalabels: {
                    color: '#ffffff',
                    anchor: 'center',
                    align: 'center',
                    font: { weight: 'bold', size: 14 },
                    formatter: function(value) { return value + '°C'; }
                }
            }
        }
    });

    // --- ANIMAÇÃO DE SCROLL ---
    const hiddenElements = document.querySelectorAll('.hidden');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add('show');
        });
    }, { threshold: 0.1 });
    hiddenElements.forEach((el) => observer.observe(el));
});