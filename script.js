document.addEventListener('DOMContentLoaded', () => {

    // Função principal que constrói o site depois que os dados são carregados
    function inicializarSite(dadosMedidos) {
        
        // Registra o plugin de rótulos de dados
        Chart.register(ChartDataLabels);

        // --- CÁLCULO INICIAL ---
        dadosMedidos.forEach(dado => {
            const reducao = 7; // Redução fixa de 7°C
            dado.tempArborizadoSimulado = dado.tempArborizado - reducao;
            dado.tempExpostoSimulado = dado.tempExposto - reducao;
        });

        // --- LÓGICA PARA A SEÇÃO INTERATIVA (DIA A DIA) ---
        const dayButtonsContainer = document.querySelector('.day-selector');
        dayButtonsContainer.innerHTML = ''; // Limpa botões antigos para o caso de recarregar
        
        if (dadosMedidos.length > 0) {
            dadosMedidos.forEach((dado, index) => {
                const button = document.createElement('button');
                button.className = 'day-btn';
                button.innerText = dado.nome || `Teste ${index + 1}`; // Usa o nome ou um fallback
                button.setAttribute('data-day', index);
                if (index === 0) button.classList.add('active');
                dayButtonsContainer.appendChild(button);
            });
        }
        
        const dayButtons = document.querySelectorAll('.day-btn');
        const dataArborizadoEl = document.getElementById('data-arborizado');
        const tempAmbienteArborizadoEl = document.getElementById('ambiente-arborizado');
        const tempArborizadoEl = document.getElementById('temp-arborizado');
        const dataExpostoEl = document.getElementById('data-exposto');
        const tempAmbienteExpostoEl = document.getElementById('ambiente-exposto');
        const tempExpostoEl = document.getElementById('temp-exposto');

        function updateDayDisplay(dayIndex) {
            if (dadosMedidos.length === 0) return;
            const selectedData = dadosMedidos[dayIndex];
            dataArborizadoEl.innerText = selectedData.nome;
            tempAmbienteArborizadoEl.innerText = `${selectedData.tempAmbiente}°C`;
            tempArborizadoEl.innerText = `${selectedData.tempArborizado}°C`;
            dataExpostoEl.innerText = selectedData.nome;
            tempAmbienteExpostoEl.innerText = `${selectedData.tempAmbiente}°C`;
            tempExpostoEl.innerText = `${selectedData.tempExposto}°C`;
        }

        if (dadosMedidos.length > 0) {
            dayButtons.forEach(button => {
                button.addEventListener('click', () => {
                    dayButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    updateDayDisplay(button.getAttribute('data-day'));
                });
            });
            updateDayDisplay(0);
        }

        // --- LÓGICA PARA OS GRÁFICOS ---
        const average = (arr) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
        
        // Gráfico de Linha (Tendência)
        const lineChartCtx = document.getElementById('lineChart').getContext('2d');
        new Chart(lineChartCtx, {
            type: 'line',
            data: {
                labels: dadosMedidos.map(d => d.nome),
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
        
        // Gráfico de Barras (Médias)
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

        // Gráfico Final de Simulação
        const avgArborizadoSimulado = average(dadosMedidos.map(d => d.tempArborizadoSimulado));
        const avgExpostoSimulado = average(dadosMedidos.map(d => d.tempExpostoSimulado));
        const finalComparisonCtx = document.getElementById('finalComparisonChart').getContext('2d');
        new Chart(finalComparisonCtx, {
            type: 'bar',
            data: {
                labels: ['Cenário Arborizado', 'Cenário Exposto ao Sol'],
                datasets: [
                    {
                        label: 'Média Atual (°C)',
                        data: [avgArborizado.toFixed(1), avgExposto.toFixed(1)],
                        backgroundColor: '#ff6384'
                    },
                    {
                        label: 'Média Simulada com Asfalto Frio (°C)',
                        data: [avgArborizadoSimulado.toFixed(1), avgExpostoSimulado.toFixed(1)],
                        backgroundColor: '#36a2eb'
                    }
                ]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Comparativo: Temperatura Média Atual vs. Simulada',
                        font: { size: 16 }
                    },
                    datalabels: {
                        color: '#ffffff',
                        anchor: 'center',
                        align: 'center',
                        font: { weight: 'bold' },
                        formatter: function(value) { return value + '°C'; }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Temperatura Média (°C)'
                        }
                    }
                }
            }
        });

        // ANIMAÇÃO DE SCROLL
        const hiddenElements = document.querySelectorAll('.hidden');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) entry.target.classList.add('show');
            });
        }, { threshold: 0.1 });
        hiddenElements.forEach((el) => observer.observe(el));
    }

    // --- PONTO DE PARTIDA: BUSCAR OS DADOS DO ARQUIVO JSON ---
    fetch('dados.json')
        .then(response => {
            if (!response.ok) {
                // Se o servidor responder com um erro (ex: 404 Not Found)
                throw new Error(`Erro na rede: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            // Se os dados foram carregados com sucesso, constrói o site
            if (data && data.length > 0) {
                inicializarSite(data);
            } else {
                throw new Error("O arquivo dados.json está vazio ou não é um array válido.");
            }
        })
        .catch(error => {
            // Se houver qualquer erro no processo, exibe uma mensagem na página
            console.error('Erro ao carregar ou processar o arquivo dados.json:', error);
            document.body.innerHTML = `<div style="text-align: center; padding: 50px; font-family: sans-serif;"><h1>Erro ao Carregar Dados</h1><p>Não foi possível carregar o arquivo <strong>dados.json</strong>. Verifique se o arquivo está na mesma pasta do projeto, não está vazio e tem o formato JSON correto. Pode ser necessário usar um servidor local (como o Live Server do VS Code) para que o navegador consiga ler o arquivo.</p></div>`;
        });
});