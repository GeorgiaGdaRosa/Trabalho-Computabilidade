const entriesInput = document.getElementById('entries');
const entriesPreview = document.getElementById('entries-preview');

function showPreview(){
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









entriesInput.addEventListener('input', showPreview);