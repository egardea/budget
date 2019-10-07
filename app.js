//Budget controller
const budgetController = (() => {

    class Expense {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
        };
    };

    class Income {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
        };
    };

    const data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
    };

})();

//UI controller
const UIController = (() => {

    const DOMStrings = {
        inputType: '.add__type',
        description: '.add__description',
        value: '.add__value',
        inputBtn: '.add__btn',
        expenseList: '.expenses__list',
        incomeList: '.income__list',
    }

    return {
        getInput: () => {
            return {
                type: document.querySelector(DOMStrings.inputType).value, //will be either INC or EXP
                description: document.querySelector(DOMStrings.description).value, //description
                value: document.querySelector(DOMStrings.value).value, //value amount
            }
        },

        getDOMStrings: () => {
            return DOMStrings;
        }
    };

})();

//Global app controller
const controller = ((budgetCtrl, UICtrl) => {
    const eventListenerSetUp = () => {
        const DOMStrings = UICtrl.getDOMStrings();

        document.querySelector(DOMStrings.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', (e) => {
            if(e.keyCode === 13) {
                ctrlAddItem();
            }
        });
    };
    
    const ctrlAddItem = () => {
        //get the input data
        const input = UICtrl.getInput();
        const DOMStrings = UICtrl.getDOMStrings();

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
            document.querySelector(DOMStrings.expenseList).insertAdjacentHTML('beforeend', listItem);
        } else if(input.type === 'inc') {
            document.querySelector(DOMStrings.incomeList).insertAdjacentHTML('beforeend', listItem);
        }
        //add the item to the UI

        //calculate the budget

        //display the budget on the UI
        
    };
    
    return {
        init: () => {
            console.log('app has started');
            eventListenerSetUp();
        },
    };

})(budgetController, UIController);

//initializes the event lisnters
controller.init();