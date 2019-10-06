//Budget controller
const budgetController = (() => {



})();

//UI controller
const UIController = (() => {

    const DOMStrings = {
        inputType: '.add__type',
        description: '.add__description',
        value: '.add__value',
    }

    return {
        getInput: () => {
            return {
                type: document.querySelector(DOMStrings.inputType).value, //will be either INC or EXP
                description: document.querySelector(DOMStrings.description).value, //description
                value: document.querySelector(DOMStrings.value).value, //value amount
            }
        }
    }

})();

//Global app controller
const controller = ((budgetCtrl, UICtrl) => {

    const ctrlAddItem = () => {
        //get the input data
        let input = UICtrl.getInput();
        console.log(input);

        //add the item to the budget controller
        const listItem = `
            <div class="item clearfix" id="${input.type === 'exp' ? 'expense' : 'income'}-0">
                <div class="item__description">${input.description}</div>
                <div class="right clearfix">
                    <div class="item__value">${input.type === 'exp' ? '-' : '+'} ${parseInt(input.value)}</div>
                    ${input.type === 'exp' ? `<div class="item__percentage">21%</div>` : ''}
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                </div>
            </div>  
        `;

        if(input.type === 'exp') {
            document.querySelector('.expenses__list').insertAdjacentHTML('beforeend', listItem);
        } else if(input.type === 'inc') {
            document.querySelector('.income__list').insertAdjacentHTML('beforeend', listItem);
        }
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