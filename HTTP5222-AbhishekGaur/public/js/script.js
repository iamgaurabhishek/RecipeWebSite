let addIngredientsBtn = document.getElementById('addIngredientsBtn');
let indredientList = document.querySelector('.indredientList');
let indredientDiv = document.querySelectorAll('.indredientDiv')[0];

addIngredientsBtn.addEventListener('click', function(){
    let newIngredients = indredientDiv.cloneNode(true);
    let input = newIngredients.getElementByTagName('input')[0];
    input.value = '';

    indredientList.appendChild(newIngredients);
});