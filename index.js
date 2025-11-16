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

let transitions = [];
let tapeInputs = [];
let stackInputs = [];
let states = [];

function getTapeAlphabet(){
    const rawValue = entriesInput.value;

    const symbols = rawValue.split(',')
                    .map(s => s.trim())
                    .filter(s => s.length == 1);
    
    tapeInputs = [...new Set(symbols)];

    if(tapeInputs.length > 0){
        entriesPreview.textContent = `${tapeInputs.join(', ')}`;
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

document.querySelector('form').addEventListener('submit', function(event){
    event.preventDefault();
    renderGraph();
});