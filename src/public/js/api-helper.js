/**
 * API Helper - Funções auxiliares para chamadas à API
 * Este arquivo fornece funções padronizadas para fazer chamadas à API
 * garantindo que as URLs sejam construídas corretamente em qualquer ambiente
 */

// Verificar se config está disponível
if (typeof config === 'undefined') {
    console.error('Erro: config.js não está carregado. Certifique-se de incluir config.js antes deste arquivo.');
}

const ApiHelper = {
    /**
     * Faz uma requisição GET à API
     * @param {string} endpoint - Endpoint da API (sem a URL base)
     * @param {boolean} requiresAuth - Se a requisição requer autenticação
     * @returns {Promise} - Promise com o resultado da requisição
     */
    get: async function(endpoint, requiresAuth = true) {
        try {
            const url = config.getApiUrl(endpoint);
            console.log(`[ApiHelper] GET: ${url}`);
            
            const headers = {
                'Content-Type': 'application/json'
            };
            
            // Adicionar token de autenticação se necessário
            if (requiresAuth) {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Token de autenticação não encontrado');
                    throw new Error('Falha na autenticação. Por favor, faça login novamente.');
                }
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            const response = await fetch(url, {
                method: 'GET',
                headers: headers
            });
            
            if (!response.ok) {
                // Verificar se é erro de autenticação
                if (response.status === 401) {
                    console.error('Erro de autenticação. Redirecionando para login...');
                    // Se auth.js estiver disponível, usar seu método de logout
                    if (typeof auth !== 'undefined' && auth.logout) {
                        auth.logout();
                    } else {
                        // Caso contrário, fazer logout manual
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        window.location.href = '/login.html';
                    }
                    return null;
                }
                
                throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`[ApiHelper] Erro na requisição GET para ${endpoint}:`, error);
            throw error;
        }
    },
    
    /**
     * Faz uma requisição POST à API
     * @param {string} endpoint - Endpoint da API (sem a URL base)
     * @param {object} data - Dados a serem enviados no corpo da requisição
     * @param {boolean} requiresAuth - Se a requisição requer autenticação
     * @returns {Promise} - Promise com o resultado da requisição
     */
    post: async function(endpoint, data, requiresAuth = true) {
        try {
            const url = config.getApiUrl(endpoint);
            console.log(`[ApiHelper] POST: ${url}`);
            
            const headers = {
                'Content-Type': 'application/json'
            };
            
            // Adicionar token de autenticação se necessário
            if (requiresAuth) {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Token de autenticação não encontrado');
                    throw new Error('Falha na autenticação. Por favor, faça login novamente.');
                }
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                // Verificar se é erro de autenticação
                if (response.status === 401) {
                    console.error('Erro de autenticação. Redirecionando para login...');
                    // Se auth.js estiver disponível, usar seu método de logout
                    if (typeof auth !== 'undefined' && auth.logout) {
                        auth.logout();
                    } else {
                        // Caso contrário, fazer logout manual
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        window.location.href = '/login.html';
                    }
                    return null;
                }
                
                throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`[ApiHelper] Erro na requisição POST para ${endpoint}:`, error);
            throw error;
        }
    },
    
    /**
     * Faz uma requisição PUT à API
     * @param {string} endpoint - Endpoint da API (sem a URL base)
     * @param {object} data - Dados a serem enviados no corpo da requisição
     * @param {boolean} requiresAuth - Se a requisição requer autenticação
     * @returns {Promise} - Promise com o resultado da requisição
     */
    put: async function(endpoint, data, requiresAuth = true) {
        try {
            const url = config.getApiUrl(endpoint);
            console.log(`[ApiHelper] PUT: ${url}`);
            
            const headers = {
                'Content-Type': 'application/json'
            };
            
            // Adicionar token de autenticação se necessário
            if (requiresAuth) {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Token de autenticação não encontrado');
                    throw new Error('Falha na autenticação. Por favor, faça login novamente.');
                }
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            const response = await fetch(url, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                // Verificar se é erro de autenticação
                if (response.status === 401) {
                    console.error('Erro de autenticação. Redirecionando para login...');
                    // Se auth.js estiver disponível, usar seu método de logout
                    if (typeof auth !== 'undefined' && auth.logout) {
                        auth.logout();
                    } else {
                        // Caso contrário, fazer logout manual
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        window.location.href = '/login.html';
                    }
                    return null;
                }
                
                throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`[ApiHelper] Erro na requisição PUT para ${endpoint}:`, error);
            throw error;
        }
    },
    
    /**
     * Faz uma requisição DELETE à API
     * @param {string} endpoint - Endpoint da API (sem a URL base)
     * @param {boolean} requiresAuth - Se a requisição requer autenticação
     * @returns {Promise} - Promise com o resultado da requisição
     */
    delete: async function(endpoint, requiresAuth = true) {
        try {
            const url = config.getApiUrl(endpoint);
            console.log(`[ApiHelper] DELETE: ${url}`);
            
            const headers = {
                'Content-Type': 'application/json'
            };
            
            // Adicionar token de autenticação se necessário
            if (requiresAuth) {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Token de autenticação não encontrado');
                    throw new Error('Falha na autenticação. Por favor, faça login novamente.');
                }
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            const response = await fetch(url, {
                method: 'DELETE',
                headers: headers
            });
            
            if (!response.ok) {
                // Verificar se é erro de autenticação
                if (response.status === 401) {
                    console.error('Erro de autenticação. Redirecionando para login...');
                    // Se auth.js estiver disponível, usar seu método de logout
                    if (typeof auth !== 'undefined' && auth.logout) {
                        auth.logout();
                    } else {
                        // Caso contrário, fazer logout manual
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        window.location.href = '/login.html';
                    }
                    return null;
                }
                
                throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
            }
            
            // Verificar se a resposta tem conteúdo
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            
            return { success: true };
        } catch (error) {
            console.error(`[ApiHelper] Erro na requisição DELETE para ${endpoint}:`, error);
            throw error;
        }
    }
};

// Disponibilizar globalmente
if (typeof window !== 'undefined') {
    window.ApiHelper = ApiHelper;
    console.log('ApiHelper disponível globalmente');
}
