// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABnnz6XLEPdr8BqEOAdkNRrVVoGdVEzwA",
  authDomain: "rpg25-efb93.firebaseapp.com",
  projectId: "rpg25-efb93",
  storageBucket: "rpg25-efb93.firebasestorage.app",
  messagingSenderId: "1083914328300",
  appId: "1:1083914328300:web:d6532d2dd37615a893edc9"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Dados do sistema COMPLETO com todas as classes
const systemData = {
    racas: [
        { 
            nome: "Humano", 
            atributos_base: { FOR: 5, CON: 5, DES: 5, MENTE: 5, CAR: 5 },
            bonus_customizacao_jogador: "+1 em DUAS habilidades",
            habilidades: "Versatilidade: Adaptável a qualquer situação"
        },
        { 
            nome: "Elfo", 
            atributos_base: { FOR: 4, CON: 5, DES: 6, MENTE: 7, CAR: 4 },
            bonus_customizacao_jogador: "+1 em MENTE ou DES",
            habilidades: "Visão no Escuro, Ancestral Feérico"
        },
        { 
            nome: "Anão", 
            atributos_base: { FOR: 6, CON: 7, DES: 4, MENTE: 5, CAR: 4 },
            bonus_customizacao_jogador: "+1 em CON ou FOR",
            habilidades: "Visão no Escuro, Resistência a Veneno"
        },
        { 
            nome: "Orc", 
            atributos_base: { FOR: 8, CON: 6, DES: 3, MENTE: 3, CAR: 3 },
            bonus_customizacao_jogador: "+1 em FOR ou CON",
            habilidades: "Agressividade, Resistência Física"
        },
        { 
            nome: "Halfling", 
            atributos_base: { FOR: 4, CON: 4, DES: 7, MENTE: 6, CAR: 5 },
            bonus_customizacao_jogador: "+1 em DES ou CAR",
            habilidades: "Sortudo, Furtividade Natural"
        },
        { 
            nome: "Demônio", 
            atributos_base: { FOR: 5, CON: 5, DES: 4, MENTE: 7, CAR: 7 },
            bonus_customizacao_jogador: "+1 em CAR ou MENTE",
            habilidades: "Resistência ao Fogo, Persuasão Demoníaca"
        },
        { 
            nome: "Furries", 
            atributos_base: { FOR: 6, CON: 4, DES: 8, MENTE: 4, CAR: 6 },
            bonus_customizacao_jogador: "+1 em DES ou FOR",
            habilidades: "Agilidade Animal, Sentidos Aguçados"
        }
    ],
    classes: [
        { 
            nome: "Bárbaro", 
            bonus_atributos: { CON: 2, FOR: 1 }, 
            bonus_pv: 8, 
            regra_unica: "Fúria: +3 Dano, Dano reduzido pela metade (1 uso/descanso)" 
        },
        { 
            nome: "Guerreiro", 
            bonus_atributos: { FOR: 2, DES: 1 }, 
            bonus_pv: 6, 
            regra_unica: "Ataque Extra: Duas vezes na mesma rodada (1 uso/descanso)" 
        },
        { 
            nome: "Ladino", 
            bonus_atributos: { DES: 2, MENTE: 1 }, 
            bonus_pv: 4, 
            regra_unica: "Ataque Furtivo: Dobro de dano se o inimigo estiver distraído" 
        },
        { 
            nome: "Clérigo", 
            bonus_atributos: { MENTE: 2, CON: 1 }, 
            bonus_pv: 4, 
            regra_unica: "Curar Feridas: Restaura 1d8 + Mod. MENTE PV (3 usos/descanso)" 
        },
        { 
            nome: "Druida", 
            bonus_atributos: { MENTE: 2, CON: 1 }, 
            bonus_pv: 4, 
            regra_unica: "Forma Animal: Transforma-se por 3 rodadas. Ganha +2 CON (1 uso/descanso)" 
        },
        { 
            nome: "Feiticeiro", 
            bonus_atributos: { CAR: 3 }, 
            bonus_pv: 2, 
            regra_unica: "Magia Pura: Pode relançar um teste de Magia falho (1 uso/descanso)" 
        },
        { 
            nome: "Mago", 
            bonus_atributos: { MENTE: 3 }, 
            bonus_pv: 2, 
            regra_unica: "Magia Inteligente: Lança uma magia extra (Ataque/Defesa) (1 uso/descanso)" 
        },
        { 
            nome: "Artífice", 
            bonus_atributos: { MENTE: 2, DES: 1 }, 
            bonus_pv: 4, 
            regra_unica: "Infusão: Encanta arma/armadura para +1 no ataque/CA (1 uso/descanso)" 
        }
    ],
    armaduras: {
        "Nenhuma": { bonus_ca: 0, des_limite: 99, display: "Nenhuma" },
        "Leve": { bonus_ca: 2, des_limite: 99, display: "Leve" },
        "Media": { bonus_ca: 4, des_limite: 1, display: "Média" },
        "Pesada": { bonus_ca: 6, des_limite: 0, display: "Pesada" }
    }
};

// Estado do personagem - INVENTÁRIO VAZIO
let character = {
    race: null,
    class: null,
    armor: "Media",
    attributes: { FOR: 5, CON: 5, DES: 5, MENTE: 5, CAR: 5 },
    name: "Aventureiro",
    raceCustomization: [],
    inventory: [], // Inventário começa vazio
    // Novos campos para a ficha editável
    level: 1,
    xp: 0,
    pv: 10,
    pvMax: 10,
    ca: 10,
    iniciativa: 0,
    notes: "",
    customAbilities: []
};

// Estado do usuário
let currentUser = null;
let isAdmin = false;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Configurar listeners de login
    document.getElementById('login-btn').addEventListener('click', login);
    document.getElementById('logout-btn').addEventListener('click', logout);
    document.getElementById('add-user-btn').addEventListener('click', addNewUser);
    
    // Permitir login com Enter
    document.getElementById('password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            login();
        }
    });
    
    // Verificar se o usuário já está logado
    auth.onAuthStateChanged(user => {
        if (user) {
            // Usuário está logado
            currentUser = user;
            isAdmin = user.email === 'pablorpg@rpg.com';
            showMainApp();
        } else {
            // Usuário não está logado
            showLoginScreen();
        }
    });
    
    // Inicializar dados do sistema
    populateRaces();
    populateClasses();
    populateAttributes();
    populateCalculatorSelectors();
    updateCharacterSheet();
    updateCalculator();
    updateWeightSystem();
    loadCharacterData();
});

// Funções de autenticação
function login() {
    const username = document.getElementById('username').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const messageElement = document.getElementById('login-message');
    
    if (!username || !password) {
        showMessage(messageElement, 'Por favor, preencha todos os campos', 'error');
        return;
    }
    
    // Adicionar domínio padrão para login com email
    const email = `${username}@rpg.com`;
    
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Login bem-sucedido
            showMessage(messageElement, 'Login realizado com sucesso!', 'success');
        })
        .catch((error) => {
            // Tratar erros de login
            let errorMessage = 'Erro ao fazer login';
            
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'Usuário não encontrado';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Senha incorreta';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Email inválido';
                    break;
                default:
                    errorMessage = error.message;
            }
            
            showMessage(messageElement, errorMessage, 'error');
        });
}

function logout() {
    auth.signOut()
        .then(() => {
            currentUser = null;
            isAdmin = false;
            showLoginScreen();
        })
        .catch((error) => {
            console.error('Erro ao fazer logout:', error);
        });
}

function addNewUser() {
    const username = document.getElementById('new-username').value.trim().toLowerCase();
    const password = document.getElementById('new-password').value;
    const messageElement = document.getElementById('admin-message');
    
    if (!username || !password) {
        showMessage(messageElement, 'Por favor, preencha todos os campos', 'error');
        return;
    }
    
    // Adicionar domínio padrão para criação de usuário
    const email = `${username}@rpg.com`;
    
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            showMessage(messageElement, `Usuário ${username} criado com sucesso!`, 'success');
            document.getElementById('new-username').value = '';
            document.getElementById('new-password').value = '';
        })
        .catch((error) => {
            let errorMessage = 'Erro ao criar usuário';
            
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'Este usuário já existe';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'A senha é muito fraca';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Nome de usuário inválido';
                    break;
                default:
                    errorMessage = error.message;
            }
            
            showMessage(messageElement, errorMessage, 'error');
        });
}

function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `${element.className.split(' ')[0]} ${type}`;
    element.style.display = 'block';
    
    // Limpar mensagem após alguns segundos
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}

function showLoginScreen() {
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('main-app').style.display = 'none';
}

function showMainApp() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    
    // Atualizar informações do usuário
    document.getElementById('user-display').textContent = currentUser.email.split('@')[0];
    
    // Mostrar/ocultar painel de administração
    if (isAdmin) {
        document.getElementById('admin-panel').style.display = 'block';
    } else {
        document.getElementById('admin-panel').style.display = 'none';
    }
}

// Funções de navegação mobile
function scrollToSection(section) {
    const element = document.querySelector(`.${section}-section`);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Funções do sistema
function populateRaces() {
    const raceGrid = document.getElementById('race-grid');
    systemData.racas.forEach(race => {
        const card = document.createElement('div');
        card.className = 'race-card';
        card.innerHTML = `
            <h4>${race.nome}</h4>
            <p class="text-xsmall">FOR ${race.atributos_base.FOR} | CON ${race.atributos_base.CON} | DES ${race.atributos_base.DES}</p>
            <p class="text-xsmall">MENTE ${race.atributos_base.MENTE} | CAR ${race.atributos_base.CAR}</p>
            <p class="text-xsmall" style="color: var(--accent-purple); margin-top: 4px;">${race.bonus_customizacao_jogador}</p>
            <p class="text-xsmall" style="color: var(--accent-burgundy); margin-top: 4px;"><strong>Habilidades:</strong> ${race.habilidades}</p>
        `;
        card.onclick = () => selectRace(race);
        raceGrid.appendChild(card);
    });
}

function populateClasses() {
    const classGrid = document.getElementById('class-grid');
    systemData.classes.forEach(cls => {
        const card = document.createElement('div');
        card.className = 'class-card';
        card.innerHTML = `
            <h4>${cls.nome}</h4>
            <p class="text-xsmall">PV +${cls.bonus_pv}</p>
            <p class="text-xsmall" style="color: var(--accent-burgundy); margin-top: 4px;">${cls.regra_unica}</p>
        `;
        card.onclick = () => selectClass(cls);
        classGrid.appendChild(card);
    });
}

function populateCalculatorSelectors() {
    const raceSelect = document.getElementById('calc-race-select');
    const classSelect = document.getElementById('calc-class-select');
    
    systemData.racas.forEach(race => {
        const option = document.createElement('option');
        option.value = race.nome;
        option.textContent = race.nome;
        raceSelect.appendChild(option);
    });
    
    systemData.classes.forEach(cls => {
        const option = document.createElement('option');
        option.value = cls.nome;
        option.textContent = cls.nome;
        classSelect.appendChild(option);
    });
    
    raceSelect.value = 'Humano';
    classSelect.value = 'Guerreiro';
}

function populateAttributes() {
    const grid = document.getElementById('attributes-grid');
    grid.innerHTML = '';
    ['FOR', 'CON', 'DES', 'MENTE', 'CAR'].forEach(attr => {
        const value = character.attributes[attr];
        const mod = value - 5;
        const card = document.createElement('div');
        card.className = 'attribute-card';
        card.innerHTML = `
            <div class="text-xsmall">${attr}</div>
            <div class="attribute-value">${value}</div>
            <div class="attribute-mod">${mod >= 0 ? '+' + mod : mod}</div>
        `;
        grid.appendChild(card);
    });
}

function selectRace(race) {
    character.race = race;
    character.attributes = { ...race.atributos_base };
    character.raceCustomization = [];
    
    document.querySelectorAll('.race-card').forEach(c => c.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    document.getElementById('selected-race').textContent = race.nome;
    
    // Mostrar customização
    showRaceCustomization(race);
    
    populateAttributes();
    updateCharacterSheet();
    updateCalculator();
    updateWeightSystem();
}

function showRaceCustomization(race) {
    const container = document.getElementById('race-customization');
    container.style.display = 'block';
    container.innerHTML = `
        <div class="customization-section">
            <h4>🎯 Customização</h4>
            <p class="text-small">${race.bonus_customizacao_jogador}</p>
            <div class="customization-options" id="customization-options">
                ${generateCustomizationOptions(race)}
            </div>
        </div>
    `;
    
    document.querySelectorAll('.customization-option').forEach(option => {
        option.onclick = function() {
            handleCustomizationSelection(race, this.dataset.attribute);
        };
    });
}

function generateCustomizationOptions(race) {
    if (race.nome === "Humano") {
        return ['FOR', 'CON', 'DES', 'MENTE', 'CAR'].map(attr => `
            <div class="customization-option" data-attribute="${attr}">
                +1 ${attr}
            </div>
        `).join('');
    } else {
        const options = race.bonus_customizacao_jogador.split(' ou ');
        return options.map(option => {
            const attr = option.match(/[A-Z]{2,}/)[0];
            return `
                <div class="customization-option" data-attribute="${attr}">
                    ${option}
                </div>
            `;
        }).join('');
    }
}

function handleCustomizationSelection(race, selectedAttr) {
    if (race.nome === "Humano") {
        if (character.raceCustomization.includes(selectedAttr)) {
            character.raceCustomization = character.raceCustomization.filter(attr => attr !== selectedAttr);
        } else if (character.raceCustomization.length < 2) {
            character.raceCustomization.push(selectedAttr);
        } else {
            alert('Humano pode selecionar apenas DUAS habilidades');
            return;
        }
    } else {
        character.raceCustomization = [selectedAttr];
    }
    
    // Atualizar seleção visual
    document.querySelectorAll('.customization-option').forEach(option => {
        option.classList.remove('selected');
        if (character.raceCustomization.includes(option.dataset.attribute)) {
            option.classList.add('selected');
        }
    });
    
    applyRaceCustomization();
    populateAttributes();
    updateCharacterSheet();
    updateCalculator();
    updateWeightSystem();
}

function applyRaceCustomization() {
    if (!character.race) return;
    
    character.attributes = { ...character.race.atributos_base };
    
    character.raceCustomization.forEach(attr => {
        character.attributes[attr] += 1;
    });
    
    if (character.class) {
        Object.keys(character.class.bonus_atributos).forEach(attr => {
            character.attributes[attr] += character.class.bonus_atributos[attr];
        });
    }
}

function selectClass(cls) {
    character.class = cls;
    applyRaceCustomization();
    
    document.querySelectorAll('.class-card').forEach(c => c.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    document.getElementById('selected-class').textContent = cls.nome;
    
    populateAttributes();
    updateCharacterSheet();
    updateCalculator();
    updateWeightSystem();
}

function updateCharacter() {
    character.armor = document.getElementById('armor-select').value;
    updateCharacterSheet();
}

function updateCharacterSheet() {
    if (character.race) {
        document.getElementById('sheet-race').textContent = character.race.nome;
    }
    if (character.class) {
        document.getElementById('sheet-class').textContent = character.class.nome;
        document.getElementById('special-rule-container').innerHTML = `
            <div class="special-rule">
                <strong>Habilidade:</strong> ${character.class.regra_unica}
            </div>
        `;
    }
    
    // Calcular PV e CA
    const conMod = character.attributes.CON - 5;
    const pv = 10 + (character.class?.bonus_pv || 0) + conMod;
    const desMod = character.attributes.DES - 5;
    const armor = systemData.armaduras[character.armor];
    const ca = 10 + Math.min(desMod, armor.des_limite) + armor.bonus_ca;
    
    document.getElementById('sheet-pv').textContent = pv;
    document.getElementById('sheet-ca').textContent = ca;
}

// Calculadora
function updateCalculator() {
    const raceName = document.getElementById('calc-race-select').value;
    const className = document.getElementById('calc-class-select').value;
    const armorType = document.getElementById('calc-armor-select').value;
    
    const race = systemData.racas.find(r => r.nome === raceName);
    const cls = systemData.classes.find(c => c.nome === className);
    const armor = systemData.armaduras[armorType];
    
    if (!race || !cls) return;
    
    // Calcular atributos
    let attributes = { ...race.atributos_base };
    Object.keys(cls.bonus_atributos).forEach(attr => {
        attributes[attr] += cls.bonus_atributos[attr];
    });
    
    // Calcular PV e CA
    const conMod = attributes.CON - 5;
    const pv = 10 + cls.bonus_pv + conMod;
    const desMod = attributes.DES - 5;
    const ca = 10 + Math.min(desMod, armor.des_limite) + armor.bonus_ca;
    
    document.getElementById('calc-pv-result').textContent = pv;
    document.getElementById('calc-ca-result').textContent = ca;
}

// Sistema de Peso
function updateWeightSystem() {
    const str = character.attributes.FOR;
    const lmc = str * 7.5;
    const totalWeight = character.inventory.reduce((sum, item) => sum + item.peso, 0);
    
    document.getElementById('weight-str').textContent = str;
    document.getElementById('weight-lmc').textContent = lmc.toFixed(1);
    document.getElementById('weight-current').textContent = totalWeight.toFixed(1);
    
    // Status de carga
    let status, level, percentage;
    if (totalWeight > lmc) {
        status = "Imóvel"; level = "imovel"; percentage = 100;
    } else if (totalWeight > lmc * 2/3) {
        status = "Peso Pesado"; level = "pesado"; percentage = (totalWeight / lmc) * 100;
    } else if (totalWeight > lmc / 3) {
        status = "Peso Médio"; level = "medio"; percentage = (totalWeight / lmc) * 100;
    } else {
        status = "Peso Leve"; level = "leve"; percentage = (totalWeight / lmc) * 100;
    }
    
    document.getElementById('weight-status').textContent = status;
    const bar = document.getElementById('weight-bar');
    bar.className = 'weight-bar ' + level;
    bar.style.width = Math.min(percentage, 100) + '%';
    
    // Penalidades
    const penaltyElement = document.getElementById('weight-penalty');
    switch(level) {
        case 'leve': penaltyElement.textContent = "Sem penalidades"; break;
        case 'medio': penaltyElement.textContent = "-3m movimento, -2 em testes de DES"; break;
        case 'pesado': penaltyElement.textContent = "Move-se 1.5m, desvantagem em ataques"; break;
        case 'imovel': penaltyElement.textContent = "Não pode se mover"; break;
    }
    
    // Atualizar exemplos
    document.getElementById('weight-light-example').textContent = (lmc / 3).toFixed(1);
    document.getElementById('weight-medium-example').textContent = (lmc * 2 / 3).toFixed(1);
    document.getElementById('weight-heavy-example').textContent = lmc.toFixed(1);
    
    updateInventoryDisplay();
}

function updateInventoryDisplay() {
    const container = document.getElementById('inventory-items');
    container.innerHTML = '';
    
    if (character.inventory.length === 0) {
        container.innerHTML = `
            <div class="empty-inventory">
                <p>🎁 Inventário vazio</p>
                <p class="text-xsmall mt-1">Adicione itens usando o formulário abaixo</p>
            </div>
        `;
    } else {
        character.inventory.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'inventory-item';
            div.innerHTML = `
                <div>
                    <strong>${item.nome}</strong>
                    <div class="text-xsmall">${item.peso} kg</div>
                </div>
                <button onclick="removeItem(${index})">🗑️</button>
            `;
            container.appendChild(div);
        });
    }
}

function addItem() {
    const name = document.getElementById('item-name').value.trim();
    const weight = parseFloat(document.getElementById('item-weight').value);
    
    if (name && weight > 0) {
        character.inventory.push({ nome: name, peso: weight });
        document.getElementById('item-name').value = '';
        document.getElementById('item-weight').value = '';
        updateWeightSystem();
    } else {
        alert('Por favor, preencha o nome e o peso do item corretamente!');
    }
}

function removeItem(index) {
    character.inventory.splice(index, 1);
    updateWeightSystem();
}

// Nova Aba - Ficha de Personagem Editável
function openCharacterTab() {
    if (!character.race || !character.class) {
        alert('Selecione uma raça e classe primeiro!');
        return;
    }
    
    updateCharacterTab();
    document.getElementById('character-tab').classList.add('active');
}

function closeCharacterTab() {
    document.getElementById('character-tab').classList.remove('active');
}

function updateCharacterTab() {
    // Informações básicas
    document.getElementById('tab-name').value = character.name;
    document.getElementById('tab-race').textContent = character.race?.nome || '---';
    document.getElementById('tab-class').textContent = character.class?.nome || '---';
    document.getElementById('tab-armor').textContent = systemData.armaduras[character.armor].display;
    document.getElementById('tab-level').value = character.level;
    document.getElementById('tab-xp').value = character.xp;
    
    // Atributos
    const attributesContainer = document.getElementById('attributes-detailed');
    attributesContainer.innerHTML = '';
    
    ['FOR', 'CON', 'DES', 'MENTE', 'CAR'].forEach(attr => {
        const value = character.attributes[attr];
        const mod = value - 5;
        const card = document.createElement('div');
        card.className = 'attribute-detailed';
        card.innerHTML = `
            <div class="attribute-name">${attr}</div>
            <input type="number" class="attribute-value-detailed" value="${value}" min="1" max="20" data-attribute="${attr}" onchange="updateAttribute(this)">
            <div class="attribute-mod-detailed">${mod >= 0 ? '+' + mod : mod}</div>
        `;
        attributesContainer.appendChild(card);
    });
    
    // Combate
    document.getElementById('tab-pv').value = character.pv;
    document.getElementById('tab-ca').value = character.ca;
    document.getElementById('tab-pv-max').value = character.pvMax;
    document.getElementById('tab-iniciativa').value = character.iniciativa;
    
    // Habilidades
    const abilitiesContainer = document.getElementById('abilities-section');
    abilitiesContainer.innerHTML = '';
    
    if (character.race) {
        const raceAbility = document.createElement('div');
        raceAbility.className = 'ability-item';
        raceAbility.innerHTML = `
            <div class="ability-name">🏹 ${character.race.nome}</div>
            <div class="ability-description" contenteditable="true" onblur="updateCharacterData()">${character.race.habilidades}</div>
        `;
        abilitiesContainer.appendChild(raceAbility);
    }
    
    if (character.class) {
        const classAbility = document.createElement('div');
        classAbility.className = 'ability-item';
        classAbility.innerHTML = `
            <div class="ability-name">⚔️ ${character.class.nome}</div>
            <div class="ability-description" contenteditable="true" onblur="updateCharacterData()">${character.class.regra_unica}</div>
        `;
        abilitiesContainer.appendChild(classAbility);
    }
    
    // Adicionar campo para habilidades customizadas
    const customAbility = document.createElement('div');
    customAbility.className = 'ability-item';
    customAbility.innerHTML = `
        <div class="ability-name">✨ Habilidades Customizadas</div>
        <div class="ability-description" contenteditable="true" placeholder="Adicione outras habilidades, talentos, magias..." onblur="updateCharacterData()">${character.customAbilities.join('\n')}</div>
    `;
    abilitiesContainer.appendChild(customAbility);
    
    // Inventário
    const inventoryContainer = document.getElementById('inventory-detailed');
    inventoryContainer.innerHTML = '';
    
    if (character.inventory.length === 0) {
        inventoryContainer.innerHTML = `
            <div class="empty-inventory">
                <p>🎁 Inventário vazio</p>
                <p class="text-xsmall mt-1">Adicione itens abaixo</p>
            </div>
        `;
    } else {
        character.inventory.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'inventory-item-detailed';
            div.innerHTML = `
                <input type="text" class="item-name-detailed" value="${item.nome}" data-index="${index}" onchange="updateInventoryItem(this)">
                <input type="number" class="item-weight-detailed" value="${item.peso}" step="0.1" min="0" data-index="${index}" onchange="updateInventoryItem(this)">
                <div class="item-controls-detailed">
                    <button onclick="removeItemDetailed(${index})">🗑️</button>
                </div>
            `;
            inventoryContainer.appendChild(div);
        });
    }
    
    // Anotações
    document.getElementById('tab-notes').value = character.notes;
}

function updateAttribute(input) {
    const attr = input.dataset.attribute;
    const value = parseInt(input.value);
    character.attributes[attr] = value;
    
    // Atualizar modificador
    const mod = value - 5;
    input.parentElement.querySelector('.attribute-mod-detailed').textContent = mod >= 0 ? '+' + mod : mod;
    
    updateCharacterData();
}

function updateInventoryItem(input) {
    const index = parseInt(input.dataset.index);
    if (input.classList.contains('item-name-detailed')) {
        character.inventory[index].nome = input.value;
    } else {
        character.inventory[index].peso = parseFloat(input.value);
    }
    updateCharacterData();
}

function addItemDetailed() {
    const name = document.getElementById('new-item-name').value.trim();
    const weight = parseFloat(document.getElementById('new-item-weight').value);
    
    if (name && weight > 0) {
        character.inventory.push({ nome: name, peso: weight });
        document.getElementById('new-item-name').value = '';
        document.getElementById('new-item-weight').value = '';
        updateCharacterTab();
        updateCharacterData();
    } else {
        alert('Por favor, preencha o nome e o peso do item corretamente!');
    }
}

function removeItemDetailed(index) {
    character.inventory.splice(index, 1);
    updateCharacterTab();
    updateCharacterData();
}

function updateCharacterData() {
    // Atualizar dados do personagem com os valores dos campos
    character.name = document.getElementById('tab-name').value;
    character.level = parseInt(document.getElementById('tab-level').value);
    character.xp = parseInt(document.getElementById('tab-xp').value);
    character.pv = parseInt(document.getElementById('tab-pv').value);
    character.ca = parseInt(document.getElementById('tab-ca').value);
    character.pvMax = parseInt(document.getElementById('tab-pv-max').value);
    character.iniciativa = parseInt(document.getElementById('tab-iniciativa').value);
    character.notes = document.getElementById('tab-notes').value;
    
    // Salvar no localStorage (por usuário)
    if (currentUser) {
        const userKey = `dndCharacter_${currentUser.uid}`;
        localStorage.setItem(userKey, JSON.stringify(character));
    }
}

function saveCharacterData() {
    updateCharacterData();
    alert('✅ Personagem salvo com sucesso!');
}

function loadCharacterData() {
    if (currentUser) {
        const userKey = `dndCharacter_${currentUser.uid}`;
        const saved = localStorage.getItem(userKey);
        if (saved) {
            const savedCharacter = JSON.parse(saved);
            // Mesclar dados salvos com o personagem atual
            character = { ...character, ...savedCharacter };
        }
    }
}
