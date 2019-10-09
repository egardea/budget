//Budget controller
const budgetController = (() => {

    class Expense {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
        };
        calcPercentage(totalIncome) {
            if(totalIncome > 0) {
                this.percentage = Math.round((this.value / totalIncome) * 100);
            } else {
                this.percentage = -1;
            }
        };
        getPercentage() {
            return this.percentage;
        };
    };

    class Income {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
        };
    };

    const calcTotal = (type) => {
        let sum = 0;
        data.allItems[type].forEach((current) => {
            sum += current.value;
        });

        data.allItems[type] = sum;
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
        budget: 0,
        percentage: -1,
    };

    return {
        addItem: (type, des, val) => {
            let newItem, ID;

            //created new id based on inc or exp
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            if(type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if(type === 'inc'){
                newItem = new Income(ID, des, val);
            }

            //push the item into the data structure 
            data.allItems[type].push(newItem);

            //return the new element
            return newItem;

        },

        /*calculateBudget: () => {
            //calculate the totals for income and expenses
            calcTotal('exp');
            calcTotal('inc');

            //calculate the budget inc minues expenses
            data.budget = data.totals.inc - data.totals.exp;

            //calculate the percentage of income that we have spent
            if(data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },*/

        getBudget: () => {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        testing: () => {
            console.log(data);
        },
    };

})();

//UI controller----------------------------------------------------------------------------------
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
                value: parseFloat(document.querySelector(DOMStrings.value).value), //value amount
            };
        },

        getDOMStrings: () => {
            return DOMStrings;
        },

        //takes in the Income or Expense object from budget controller and adds it to the UI
        addItemToUI: (input, type) => {
            const listItem = `
                <div class="item clearfix" id="${input.type === 'exp' ? 'expense' : 'income'}-${input.id}">
                    <div class="item__description">${input.description}</div>
                    <div class="right clearfix">
                        <div class="item__value">${type === 'exp' ? '-' : '+'} ${input.value}</div>
                        ${type === 'exp' ? `<div class="item__percentage">21%</div>` : ''}
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>  
            `;

            if(type === 'exp') {
                document.querySelector(DOMStrings.expenseList).insertAdjacentHTML('beforeend', listItem);
            } else if(type === 'inc') {
                document.querySelector(DOMStrings.incomeList).insertAdjacentHTML('beforeend', listItem);
            }
        },

        clearInputFields: () => {
            let fields, fieldsToArray;
            fields = document.querySelectorAll(`${DOMStrings.description}, ${DOMStrings.value}`);

            fieldsToArray = Array.prototype.slice.call(fields);

            fieldsToArray.forEach((current) => {
                current.value = '';
            })

            fieldsToArray[0].focus();
        },
    };

})();

//Global app controller--------------------------------------------------------------------------------
const controller = ((budgetCtrl, UICtrl) => {
    //event listner for the whole app 
    const eventListenerSetUp = () => {
        const DOMStrings = UICtrl.getDOMStrings();

        document.querySelector(DOMStrings.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', (e) => {
            if(e.keyCode === 13) {
                ctrlAddItem();
            }
        });
    };

    const updateBudget = () => {
        //calculate the budget

        //return the budget on a variable
        
        //display the budget on the UI

    };
    
    const ctrlAddItem = () => {
        //get the input data
        let input = UICtrl.getInput();

        //add the item to the budget controller
        let newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        //add the item to the UI
        UICtrl.addItemToUI(newItem, input.type);

        //clear the input fields
        UICtrl.clearInputFields();

        //calculate and update budget
        updateBudget();
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