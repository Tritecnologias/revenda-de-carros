// Funções relacionadas a vendas diretas

// Carregar vendas diretas por marca
async function loadVendasDiretas(marcaId) {
    try {
        const vendasDiretasSelect = document.getElementById('vendasDiretasSelect');
        if (!vendasDiretasSelect) return;
        vendasDiretasSelect.innerHTML = '<option value="">Carregando descontos...</option>';
        
        // URLs para tentar carregar vendas diretas
        const apiUrls = [
            `/api/venda-direta/public?marcaId=${marcaId}`,
            `http://localhost:3000/api/venda-direta/public?marcaId=${marcaId}`,
            `http://69.62.91.195:3000/api/venda-direta/public?marcaId=${marcaId}`
        ];
        
        // Tentar cada URL em sequência
        let response = null;
        let lastError = null;
        let data = null;
        
        for (const url of apiUrls) {
            try {
                console.log(`Tentando carregar vendas diretas de: ${url}`);
                response = await fetch(url, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                
                if (response.ok) {
                    data = await response.json();
                    console.log(`URL bem-sucedida: ${url}`);
                    break; // Sair do loop se a resposta for bem-sucedida
                } else {
                    const errorText = await response.text();
                    console.error(`Falha na URL ${url}:`, errorText);
                    lastError = `${response.status} ${response.statusText}`;
                }
            } catch (error) {
                console.error(`Erro ao acessar ${url}:`, error.message);
                lastError = error.message;
            }
        }
        
        // Se todas as URLs falharam
        if (!data) {
            throw new Error(`Falha ao carregar vendas diretas: ${lastError}`);
        }
        
        // Extrair as vendas diretas do objeto de resposta paginada
        const vendasDiretas = data.items || data;
        
        // Limpar select
        vendasDiretasSelect.innerHTML = '';
        
        // Adicionar opção padrão
        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "DESCONTOS VENDA DIRETA";
        vendasDiretasSelect.appendChild(defaultOption);
        
        // Adicionar vendas diretas
        vendasDiretas.forEach(vendaDireta => {
            const option = document.createElement('option');
            option.value = vendaDireta.id;
            option.textContent = `${vendaDireta.nome} (${vendaDireta.percentual}%)`;
            vendasDiretasSelect.appendChild(option);
        });
        
        // Habilitar select apenas se houver vendas diretas
        vendasDiretasSelect.disabled = vendasDiretas.length === 0;
        
        // Remover event listeners anteriores para evitar duplicação
        const newSelect = vendasDiretasSelect.cloneNode(true);
        vendasDiretasSelect.parentNode.replaceChild(newSelect, vendasDiretasSelect);
        
        // Restaurar seleção anterior se existir
        if (window.vendaDiretaSelecionada) {
            const vendaDiretaExiste = vendasDiretas.some(vd => vd.id == window.vendaDiretaSelecionada.id);
            if (vendaDiretaExiste) {
                newSelect.value = window.vendaDiretaSelecionada.id;
            } else {
                newSelect.value = "";
                window.vendaDiretaSelecionada = null;
            }
        }
        
        // Adicionar event listener para seleção
        newSelect.addEventListener('change', function() {
            if (this.value === "") {
                window.vendaDiretaSelecionada = null;
                const descontoInput = document.getElementById('descontoInput');
                if (descontoInput) {
                    descontoInput.value = "0,0%";
                    const inputEvent = new Event('input', { bubbles: true });
                    descontoInput.dispatchEvent(inputEvent);
                }
                return;
            }
            const selectedVendaDireta = vendasDiretas.find(vd => vd.id == this.value);
            if (selectedVendaDireta) {
                window.vendaDiretaSelecionada = selectedVendaDireta;
                const descontoInput = document.getElementById('descontoInput');
                if (descontoInput) {
                    descontoInput.value = selectedVendaDireta.percentual;
                    const inputEvent = new Event('input', { bubbles: true });
                    descontoInput.dispatchEvent(inputEvent);
                }
            }
        });
    } catch (error) {
        console.error('Erro ao carregar vendas diretas:', error);
        const vendasDiretasSelect = document.getElementById('vendasDiretasSelect');
        if (vendasDiretasSelect) {
            vendasDiretasSelect.innerHTML = '';
            const defaultOption = document.createElement('option');
            defaultOption.value = "";
            defaultOption.textContent = "DESCONTOS VENDA DIRETA";
            vendasDiretasSelect.appendChild(defaultOption);
            vendasDiretasSelect.disabled = true;
        }
    }
}

window.loadVendasDiretas = loadVendasDiretas;
