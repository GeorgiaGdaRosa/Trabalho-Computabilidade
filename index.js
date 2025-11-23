const setpControlsDiv = document.getElementById('step-controls');
const btnNextStep = document.getElementById('btn-next-step');
const currentStateDisplay = document.getElementById('current-state-display');
const currentStackDisplay = document.getElementById('current-stack-display');
const stepMessage = document.getElementById('step-message');
const computingResult = document.getElementById('computing-result');
const entriesInput = document.getElementById('entries');
const entriesPreview = document.getElementById('entries-preview');
const statesInput = document.getElementById('states');
const statesPreview = document.getElementById('states-preview');
const firstStateInput = document.getElementById('first-state');
const finalStatesInput = document.getElementById('final-states');
const pdaGraphDiv = document.getElementById('pda-graph');
const stackAlphabetInput = document.getElementById('stack-alphabet');
const stackAlphabetPreview = document.getElementById('stack-alphabet-preview');
const transitionTable = document.getElementById('transition-table');
transitionTable.innerHTML = '';

const btnAddTransitions = document.getElementById('btn-add-transitions');

let simState = '';
let simStack = [];
let simIndex = 0;
let simRunning = false;

let transitions = [];
let tapeInputs = [];
let stackInputs = [];
let states = [];

function initializeSimulation(){
    simState = firstStateInput.value.trim();
    simStack = [];
    simIndex = 0;
    simRunning = true;

    currentStateDisplay.textContent = simState;
    currentStackDisplay.textContent = JSON.stringify(simStack);
    stepMessage.textContent = "Simulação Iniciada. Clique em 'Próximo Passo'";
    stepMessage.style.color = "black";

    setpControlsDiv.style.display = 'block';
    btnNextStep.disabled = false;

    const domCells = document.querySelectorAll('.tape-cell');
    domCells.forEach(c => c.classList.remove('active-head'));

    if (domCells.length > 0) {
        domCells[0].classList.add('active-head');
    }
}

function performNextStep() {
    if (!simRunning) return;

    const domCells = document.querySelectorAll('.tape-cell');
    
    if (simIndex >= tapeInputs.length) {
         finishSimulation();
         return;
    }

    const symbolRead = tapeInputs[simIndex]; 
    
    const isStackEmpty = simStack.length === 0;
    const stackTop = !isStackEmpty ? simStack[simStack.length - 1] : null;

    let transition = transitions.find(t => {
        if (t.state !== simState) return false;

        let inputMatch = false;
        
        if (t.read === 'ε') {
            inputMatch = true; 
        } else {
            
            inputMatch = (t.read === symbolRead); 
        }

 
        let stackMatch = false;
        
        if (t.pop === 'ε') {
            stackMatch = true; 
        } else if (t.pop === '?') {
            stackMatch = isStackEmpty; 
        } else {
            stackMatch = (!isStackEmpty && t.pop === stackTop); 
        }

        return inputMatch && stackMatch;
    });

    
    if (!transition) {
        stepMessage.innerHTML = `❌ Travou em <b>${simState}</b>.<br>
        Leu: <b>'${symbolRead}'</b> | Topo Pilha: <b>'${stackTop || 'Vazia'}'</b>.<br>
        Não há regra definida para isso.`;
        stepMessage.style.color = "red";
        simRunning = false;
        btnNextStep.disabled = true;
        return;
    }

    const oldState = simState;
    simState = transition.nextState;

    if (transition.pop !== 'ε' && transition.pop !== '?') {
        simStack.pop();
    }

    if (transition.push !== 'ε') {
        simStack.push(transition.push);
    }

    currentStateDisplay.textContent = simState;
    currentStackDisplay.textContent = simStack.length > 0 ? `[${simStack.join(', ')}]` : '[Vazia]';
    
    let actionDesc = `De ${oldState} -> ${simState}.`;

    if (transition.read !== 'ε') {
        if (domCells[simIndex]) domCells[simIndex].classList.remove('active-head');
        
        simIndex++; 
        
        if (simIndex < tapeInputs.length && domCells[simIndex]) {
            domCells[simIndex].classList.add('active-head');
        }
        
        const visualSymbol = symbolRead === '?' ? '[Branco]' : `'${symbolRead}'`;
        actionDesc += ` (Leu ${visualSymbol})`;
    } else {
        actionDesc += ` (Movimento Vazio - Fita parada)`;
    }
    
    stepMessage.textContent = actionDesc;
}

function finishSimulation() {
    const finalStates = finalStatesInput.value.split(',').map(s => s.trim());
        
    if (finalStates.includes(simState)) {
        stepMessage.innerHTML = "✅ <b>ACEITA!</b> A cadeia foi consumida e o autômato parou em estado final.";
        stepMessage.style.color = "green";
    } else {
        stepMessage.innerHTML = `❌ <b>REJEITA.</b> A cadeia acabou mas o estado <b>${simState}</b> não é final.`;
        stepMessage.style.color = "red";
    }

    simRunning = false;
    btnNextStep.disabled = true;
    
    document.querySelectorAll('.tape-cell').forEach(c => c.classList.remove('active-head'));
}



function getTapeAlphabet(){
    const rawValue = entriesInput.value;

    const symbols = rawValue.split(',')
                    .map(s => s.trim())
                    .filter(s => s.length >= 1);
    
    //tapeInputs = [...new Set(symbols)];
    tapeInputs = symbols;

    entriesPreview.innerHTML = '';

    if(tapeInputs.length > 0){
        tapeInputs.forEach(input => {
            const cell = document.createElement('div');
            cell.classList.add('tape-cell');
            if (input === '?') {
                cell.innerHTML = '&nbsp;'; 
            } else {
                cell.textContent = input;
            }
            entriesPreview.appendChild(cell);
        })
    }else{
        entriesPreview.textContent = '';
    }
}

function getStackAlphabet(){
    const rawValue = stackAlphabetInput.value;
    
    const symbols = rawValue.split(',')
                    .map(s => s.trim())
                    .filter(s => s.length == 1);

    stackInputs = [...new Set(symbols)];

    if(stackInputs.length > 0){
        stackAlphabetPreview.textContent = `${stackInputs.join(', ')}`;
    }else{
        stackAlphabetPreview.textContent = '';
    }
}

function showStatesPreview(){
    const rawValue = statesInput.value;

    const symbols = rawValue.split(',')
                    .map(s => s.trim())
                    .filter(s => /^[a-zA-Z][0-9]$/.test(s));

    uniqueSymbols = [...new Set(symbols)];
    states = uniqueSymbols;

    if(uniqueSymbols.length > 0){
        statesPreview.textContent = `${states.join(', ')}`;
    }else{
        statesPreview.textContent = '';
    }

    stackInputs = [...new Set(symbols)];    
}



function addTransition(){
    const transitionId = Date.now();

    const newTransition = {
        id: transitionId,
        state: '',
        read: '',
        pop: '',
        push: '',
        nextState: '',
    }
    transitions.push(newTransition);
    const row = document.createElement('div');
    row.classList.add('transition-row');
    row.dataset.transitionId = transitionId;

    row.innerHTML = `
    <div class="div-transition-table">
        <div class="div-states-transition-inputs">
            <label>Estado Origem:</label>
            <input type="text" class="transition-input" data-transition-id="${transitionId}" data-field="state" placeholder="q0">
        </div>

        <div class="div-states-transition-inputs">
            <label >a</label>
            <input type="text" class="transition-input" data-transition-id="${transitionId}"  data-field="read"  >
        </div>
        
        <div class="div-states-transition-inputs">
            <label >A</label>
            <input type="text" class="transition-input" data-transition-id="${transitionId}"  data-field="pop" >
        </div>

        <div class="div-states-transition-inputs">
            <label >α</label>
            <input type="text" class="transition-input" data-transition-id="${transitionId}" data-field="push" >
        </div>

        <div class="div-states-transition-inputs">
            <label >Destino:</label>
            <input type="text" class="transition-input" data-transition-id="${transitionId}"  data-field="nextState">
        </div>

        <button type="button" class="btn-remove-transition" data-transition-id="${transitionId}">X</button>
    </div>
    `;

    transitionTable.append(row);

    row.querySelectorAll('.transition-input').forEach(input =>{
        input.addEventListener('input', updateTransition)
    });

    row.querySelector('.btn-remove-transition').addEventListener('click', removeTransition);
}

function removeTransition(event) {
    const transitionId = parseInt(event.target.dataset.transitionId);
    
    const index = transitions.findIndex(t => t.id === transitionId);
    if (index !== -1) {
        transitions.splice(index, 1);
    }
    
    event.target.closest('.transition-row').remove();
    
    console.log('Transição removida. Estado atual:', transitions);
}

function updateTransition(event){
    const field = event.target.dataset.field;
    const transitionId = parseInt(event.target.dataset.transitionId);
    const value = event.target.value.trim();

    const transition= transitions.find(t => t.id === transitionId);
    
    if (transition) {
        transition[field] = value;
    }
    

    console.log(transitions);
}

function generateMermaidString(){
    let mermaid = 'graph LR\n';

    const statesRaw = statesInput.value.split(',').map(s => s.trim()).filter(s => s);
    const firstState = firstStateInput.value.trim();
    const finalStates = finalStatesInput.value.split(',').map(s => s.trim()).filter(s => s);

    if(firstState && statesRaw.includes(firstState)){
    mermaid += `    StartNode[ ]\n`;
    mermaid += `    style StartNode fill:#fff,stroke:#fff\n`; 
    mermaid += `    StartNode -- Start --> ${firstState}\n`;
    }
    
    transitions.forEach(transition => {
        const stateName = transition.state; 
        const nextState = transition.nextState;

        if (!stateName || !nextState || !statesRaw.includes(stateName) || !statesRaw.includes(nextState)) {
            return;
        }

        const read = transition.read || 'ε';
        const pop = transition.pop || 'ε';
        const push = transition.push || 'ε';
        const label = `${read}, ${pop} / ${push}`;

        mermaid += `    ${stateName} -- "${label}" --> ${nextState}\n`;
    });

    finalStates.filter(s => statesRaw.includes(s)).forEach(state => {
        mermaid += `     ${state}((${state}))\n`;
    });
    return mermaid;
}



async function renderGraph(){
    let mermaidString = generateMermaidString();

    pdaGraphDiv.innerHTML = '';

    if(mermaidString.includes('-->')){
        try{
            const {svg} = await mermaid.render('tempGraphId', mermaidString);
            pdaGraphDiv.innerHTML = svg;

            initializeSimulation();
        
        }catch(e){
            pdaGraphDiv.innerHTML = `<p style="color:red; font-family: monospace;"><b>Erro de Sintaxe no Mermaid:</b><br>${e.message}</p>`;
        }

    }else{
        pdaGraphDiv.innerHTML = '<p>Adicione estados, estado inicial e transições para gerar o grafo.</p>';
    }
}


entriesInput.addEventListener('input', getTapeAlphabet);
statesInput.addEventListener('input', showStatesPreview);
stackAlphabetInput.addEventListener('input', getStackAlphabet);
btnAddTransitions.addEventListener('click', addTransition);
btnNextStep.addEventListener('click', performNextStep);

document.querySelector('form').addEventListener('submit', function(event){
    event.preventDefault();
    renderGraph();
});


function accpetOrReject(){

    const firstState = firstStateInput.value.trim();
    let firstTransition = transitions.filter(t => t.state === firstState && t.read == tapeInputs[0] && t.pop === "ε" && stackInputs.includes(t.push));
    if(firstTransition == null || !firstTransition){
        computingResult.innerHTML = '<p>Rejeita.</p>';
        return;
    }
    

    let currentTapeInput = tapeInputs[0];
    let currentTransition = firstTransition;
    let currentStack = [];

    for(let i = 1; i < tapeInputs.length; i++){
        //flecha vai para proximo na fita
        currentTapeInput = tapeInputs[i];
        currentTransition = transitions.filter(t => t.read == currentTapeInput && (t.pop == "ε" || t.pop == currentStack[currentStack.length]));
        if(currentTransition == null || !currentTransition){
            computingResult.innerHTML = '<p>Rejeita.</p>';
            return;
            //sai do loop
        }
        currentStack.appendChild(currentTransition.push);
    }
    computingResult.innerHTML = '<p>Aceita.</p>';

}