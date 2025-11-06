    const entriesInput = document.getElementById('entries');
    const entriesPreview = document.getElementById('entries-preview');
    const statesInput = document.getElementById('states');
    const statesPreview = document.getElementById('states-preview');
    const transitionTable = document.getElementById('transition-table');
    const transitions = {};

    function showEntriesPreview(){
        const rawValue = entriesInput.value;

        const symbols = rawValue.split(',')
                        .map(s => s.trim())
                        .filter(s => s.length == 1);
        
        const uniqueSymbols = [...new Set(symbols)];

        if(uniqueSymbols.length > 0){
            entriesPreview.textContent = `${uniqueSymbols.join(', ')}`;
        }else{
            entriesPreview.textContent = '';
        }
    }

    function showStatesPreview(){
        const rawValue = statesInput.value;

        const symbols = rawValue.split(',')
                        .map(s => s.trim())
                        .filter(s => /^[a-zA-Z][0-9]$/.test(s));

        const uniqueSymbols = [...new Set(symbols)];

        if(uniqueSymbols.length > 0){
            statesPreview.textContent = `${uniqueSymbols}`;
        }else{
            statesPreview.textContent = '';
        }

        generateTransitionTable(uniqueSymbols);
    }

    function generateTransitionTable(states){
        transitionTable.innerHTML = '';
        const i = 0;
        states.forEach(state => {
            const row = document.createElement('div');
            row.classList.add('transition-row');

            transitions[state] = {read: '', pop: '', push: ''};
            row.innerHTML = `
            <div class="div-transition-table">
                <span class="state-label">${state}</span>

                <div class="div-states-transition-inputs">
                    <label >a</label>
                    <input type="text" class="transition-input" data-state="${state}" data-field="read"  >
                </div>
                
                <div class="div-states-transition-inputs">
                    <label >A</label>
                    <input type="text" class="transition-input" data-state="${state}" data-field="pop" >
                </div>

                <div class="div-states-transition-inputs">
                    <label >α</label>
                    <input type="text" class="transition-input" data-state="${state}" data-field="push" >
                </div>
            </div>
            `;

            transitionTable.append(row);
        });

        document.querySelectorAll('.transition-input').forEach(input =>{
            input.addEventListener('input', updateTransition)
        })
        //procura todos os elementos que tem a classe transition-input

    }

    function updateTransition(event){
        const state = event.target.dataset.state;
        const field = event.target.dataset.field;
        const value = event.target.value;

        transitions[state][field] = value;

        console.log(transitions);
    }

    entriesInput.addEventListener('input', showEntriesPreview);
    statesInput.addEventListener('input', showStatesPreview);