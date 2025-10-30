const entriesInput = document.getElementById('entries');
const entriesPreview = document.getElementById('entries-preview');
const statesInput = document.getElementById('states');
const statesPreview = document.getElementById('states-preview');

function showEntriesPreview(){
    const rawValue = entriesInput.value;

    const symbols = rawValue.split(',')
                    .map(s => s.trim())
                    .filter(s => s.length == 1);

    if(symbols.length > 0){
        entriesPreview.textContent = `${symbols.join(', ')}`;
    }else{
        entriesPreview.textContent = '';
    }
}

function showStatesPreview(){
    const rawValue = statesInput.value;

    const symbols = rawValue.split(',')
                    .map(s => s.trim())
                    .filter(s => s.length == 2);

    const uniqueSymbols = [...new Set(symbols)];

    if(uniqueSymbols.length > 0){
        statesPreview.textContent = `${uniqueSymbols.join(', ')}`;
    }else{
        statesPreview.textContent = '';
    }

}

entriesInput.addEventListener('input', showEntriesPreview);
statesInput.addEventListener('input', showStatesPreview);