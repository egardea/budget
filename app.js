//Budget controller
const budgetController = (() => {



})();

//UI controller
const UIController = (() => {

    return {
        getInput: () => {
            let type = document.querySelector('.add__type').value; //will be either INC or EXP
            let description = document.querySelector('.add__description').value; //description
            let value = document.querySelector('.add__value').value; //value amount
        }
    }

})();

//Global app controller
const controller = ((budgetCtrl, UICtrl) => {

    const ctrlAddItem = () => {
        //get the input data
        
        //add the item to the budget controller

        //add the item to the UI

        //calculate the budget

        //display the budget on the UI
        
    }

    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', (e) => {
        if(e.keyCode === 13) {
            ctrlAddItem();
        }
    });
    
})(budgetController, UIController);