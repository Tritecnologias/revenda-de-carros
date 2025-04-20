// Funções relacionadas a vendas diretas

// Carregar vendas diretas por marca
async function loadVendasDiretas(marcaId) {
    try {
        const vendasDiretasSelect = document.getElementById('vendasDiretasSelect');
        if (!vendasDiretasSelect) return;
        vendasDiretasSelect.innerHTML = '<option value="">Carregando descontos...</option>';
        
        // URL corrigida: usando 'venda-direta' (singular) em vez de 'vendas-diretas' (plural)
        const response = await fetch(`${config.apiBaseUrl}/api/venda-direta/public?marcaId=${marcaId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) throw new Error(`Falha ao carregar vendas diretas: ${response.status}`);
        const data = await response.json();
        
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
