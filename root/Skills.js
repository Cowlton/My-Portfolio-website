
let faideDelay = 100;
let faideTimer = null;


window.updateDisplay = function updateDisplay(textID = null) {
    let selectedItem = document.querySelector('.item.selected');
    const display = document.querySelector('#display');
    let itemText;
        
        if(textID){
            itemText = document.getElementById(textID);
            console.log(textID);
        }else{
            itemText = selectedItem.querySelector('.itemText');
        }
        if (itemText) {
            display.innerHTML = itemText.innerHTML;
        } else {
            display.innerHTML = 'None';
        }

        // Clear previous timer if one exists 
        if (faideTimer) { 
            clearTimeout(faideTimer); 
        }
         // toggle off and back on to trigger animation
        display.style.display = 'none';
        faideTimer = setTimeout(function() {
            faideTimer = null;
            display.style.display = 'block';
        }, faideDelay);
    
}

