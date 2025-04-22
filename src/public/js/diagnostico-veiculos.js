/**
 * DIAGNÓSTICO DE VEÍCULOS
 * 
 * Este script analisa a estrutura dos veículos retornados pela API
 * para identificar o problema com o carregamento das versões.
 */

console.log('Iniciando diagnóstico de veículos...');

// Função para analisar a estrutura dos veículos
async function analisarVeiculos() {
    try {
        // Obter token de autenticação
        let headers = { 'Content-Type': 'application/json' };
        try {
            const auth = new Auth();
            const token = auth.getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        } catch (error) {
            console.warn('Erro ao obter token:', error);
        }
        
        // Buscar veículos
        console.log('Buscando veículos da API...');
        const response = await fetch('http://localhost:3000/api/veiculos', {
            method: 'GET',
            headers: headers
        });
        
        if (!response.ok) {
            throw new Error(`Erro ao buscar veículos: ${response.status} ${response.statusText}`);
        }
        
        const responseData = await response.json();
        console.log('Resposta da API:', responseData);
        
        // Extrair os veículos
        let veiculos = [];
        if (Array.isArray(responseData)) {
            veiculos = responseData;
        } else if (responseData && typeof responseData === 'object') {
            if (responseData.items && Array.isArray(responseData.items)) {
                veiculos = responseData.items;
            } else if (responseData.veiculos && Array.isArray(responseData.veiculos)) {
                veiculos = responseData.veiculos;
            } else if (responseData.data && Array.isArray(responseData.data)) {
                veiculos = responseData.data;
            } else if (responseData.results && Array.isArray(responseData.results)) {
                veiculos = responseData.results;
            }
        }
        
        console.log(`Total de veículos encontrados: ${veiculos.length}`);
        
        if (veiculos.length === 0) {
            console.log('Nenhum veículo encontrado na API.');
            return;
        }
        
        // Analisar o primeiro veículo para entender a estrutura
        const primeiroVeiculo = veiculos[0];
        console.log('Estrutura completa do primeiro veículo:');
        console.log(JSON.stringify(primeiroVeiculo, null, 2));
        
        // Verificar campos relacionados a versão
        console.log('\nBuscando informações de VERSÃO em cada veículo:');
        
        // Mapa para armazenar versões únicas
        const versoesEncontradas = new Map();
        
        veiculos.forEach((veiculo, index) => {
            console.log(`\nAnalisando veículo ${index + 1}/${veiculos.length} (ID: ${veiculo.id}):`);
            
            // Verificar se o veículo tem versão
            let versaoInfo = null;
            
            if (veiculo.versao) {
                versaoInfo = {
                    id: veiculo.versao.id,
                    nome: veiculo.versao.nome,
                    fonte: 'objeto versao'
                };
                console.log(`✓ Versão encontrada no objeto 'versao': ${versaoInfo.nome} (ID: ${versaoInfo.id})`);
            } else if (veiculo.versao_id && veiculo.versao_nome) {
                versaoInfo = {
                    id: veiculo.versao_id,
                    nome: veiculo.versao_nome,
                    fonte: 'campos versao_id e versao_nome'
                };
                console.log(`✓ Versão encontrada nos campos 'versao_id' e 'versao_nome': ${versaoInfo.nome} (ID: ${versaoInfo.id})`);
            } else if (veiculo.versaoId && veiculo.versaoNome) {
                versaoInfo = {
                    id: veiculo.versaoId,
                    nome: veiculo.versaoNome,
                    fonte: 'campos versaoId e versaoNome'
                };
                console.log(`✓ Versão encontrada nos campos 'versaoId' e 'versaoNome': ${versaoInfo.nome} (ID: ${versaoInfo.id})`);
            } else {
                console.log('✗ Nenhuma versão encontrada neste veículo');
                
                // Mostrar campos disponíveis para diagnóstico
                console.log('Campos disponíveis neste veículo:');
                Object.keys(veiculo).forEach(campo => {
                    console.log(`- ${campo}: ${JSON.stringify(veiculo[campo])}`);
                });
            }
            
            // Se encontrou uma versão, adicioná-la ao mapa
            if (versaoInfo) {
                const chave = `${versaoInfo.id}`;
                if (!versoesEncontradas.has(chave)) {
                    versoesEncontradas.set(chave, {
                        ...versaoInfo,
                        veiculos: [veiculo.id]
                    });
                } else {
                    // Adicionar este veículo à lista de veículos desta versão
                    versoesEncontradas.get(chave).veiculos.push(veiculo.id);
                }
            }
        });
        
        // Mostrar todas as versões encontradas
        console.log('\nVersões encontradas nos veículos:');
        if (versoesEncontradas.size > 0) {
            const versoes = Array.from(versoesEncontradas.values());
            versoes.forEach(versao => {
                console.log(`- ${versao.nome} (ID: ${versao.id})`);
                console.log(`  Fonte: ${versao.fonte}`);
                console.log(`  Veículos: ${versao.veiculos.join(', ')}`);
            });
        } else {
            console.log('Nenhuma versão encontrada em nenhum veículo.');
        }
        
        // Verificar se há um endpoint específico para versões
        console.log('\nVerificando se há um endpoint específico para versões...');
        try {
            const versaoResponse = await fetch('http://localhost:3000/api/versoes', {
                method: 'GET',
                headers: headers
            });
            
            if (versaoResponse.ok) {
                const versoes = await versaoResponse.json();
                console.log('Endpoint de versões encontrado!');
                console.log('Versões retornadas:', versoes);
            } else {
                console.log(`Endpoint de versões não encontrado (${versaoResponse.status})`);
            }
        } catch (error) {
            console.log('Erro ao verificar endpoint de versões:', error);
        }
        
        console.log('\nDiagnóstico concluído.');
    } catch (error) {
        console.error('Erro durante o diagnóstico:', error);
    }
}

// Executar o diagnóstico quando o script for carregado
analisarVeiculos();
