//Budget controller
const budgetController = (() => {

    class Expense {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
        }
    };

    class Income {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
        }
    };

    const calcTotal = (type) => {
        let sum = 0;
        data.allItems[type].forEach((current) => {
            sum += current.value;
        });

        data.totals[type] = sum;
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

        deleteItem: (type, ID) => {
            let index, ids;
        
            ids = data.allItems[type].map((current) => {
                return current.id;
            });
            
            index = ids.indexOf(ID);

            if(index !== -1){
                data.allItems[type].splice(index, 1);
            }
        },

        calcBudget: () => {
            //calculate the total income and expenses
            calcTotal('inc');
            calcTotal('exp');

            //calculate the budget
            data.budget = data.totals.inc - data.totals.exp;

            //calculate the percentage of income that is spent
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        getBudget: () => {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        getAllItems: () => {
            return {
                inc: data.allItems.inc,
                exp: data.allItems.exp,
            }
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
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        listContainer: '.container',
    };

    const formatNumber = (n) => {
        let parts=n.toString().split(".");
        return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
    };

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
        addItemToUI: (input) => { /** input, type */
            /*const listItem = `
                <div class="item clearfix" id="${input.type === 'exp' ? 'exp' : 'inc'}-${input.id}">
                    <div class="item__description">${input.description}</div>
                    <div class="right clearfix">
                        <div class="item__value">${type === 'exp' ? '-' : '+'} ${input.value}</div>
                        ${type === 'exp' ? `<div class="item__percentage">21%</div>` : ''}
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>  
            `;*/

            let inc, exp;

            inc = input.inc;
            exp = input.exp;
            console.log(inc);

            /*
            if(type === 'exp') {
                document.querySelector(DOMStrings.expenseList).insertAdjacentHTML('beforeend', listItem);
            } else if(type === 'inc') {
                document.querySelector(DOMStrings.incomeList).insertAdjacentHTML('beforeend', listItem);
            }
            */
    
            if(input.exp > 0){
                let listItem = inc.map((current) => {
                    console.log(current);
                    return `
                        <div class="item clearfix" id="exp-${current.id}">
                            <div class="item__description">${current.description}</div>
                            <div class="right clearfix">
                                <div class="item__value">- ${current.value}</div>
                                <div class="item__percentage">21%</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>
                    `;
                });

                document.querySelector(DOMStrings.expenseList).insertAdjacentHTML('beforeend', listItem);
            } else if (input.inc > 0) {
                let listItem = exp.map((current) => {
                    return `
                        <div class="item clearfix" id="exp-${current.id}">
                            <div class="item__description">${current.description}</div>
                            <div class="right clearfix">
                                <div class="item__value">- ${current.value}</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>
                    `;
                });

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

        displayBudget: (obj) => {
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc);
            document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber(obj.totalExp);

            if(obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }
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

        document.querySelector(DOMStrings.listContainer).addEventListener('click', ctrlDeleteItem);
    };

    const updateBudget = () => {
        //calculate the budget
        budgetCtrl.calcBudget();
        
        //return the budget on a variable
        let budget = budgetCtrl.getBudget();

        //display the budget on the UI
        UICtrl.displayBudget(budget);

    };
    
    const ctrlAddItem = () => {
        //get the input data
        let input = UICtrl.getInput();
        let allItems = budgetCtrl.getAllItems();
        
        if(input.description !== '' && !isNaN(input.value) && input.value > 0) {
            //add the item to the budget controller
            let newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            //add the item to the UI
            UICtrl.addItemToUI(allItems);/** newItem, input.type */

            //clear the input fields
            UICtrl.clearInputFields();

            //calculate and update budget
            updateBudget();
        }
    };

    const ctrlDeleteItem = (event) => {
        let getitemID, splitID, type, ID;

        //retrieve id from html
        getitemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        //split the income-0 
        splitID = getitemID.split('-');
        type = splitID[0];
        ID = parseInt(splitID[1]);

        //delete item from the data structure
        budgetCtrl.deleteItem(type, ID);

        //delete item from the UI

        //update the budget numbers

        //update the percentages

        
    };
    
    return {
        init: () => {
            console.log('app has started');
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            eventListenerSetUp();
        },
    };

})(budgetController, UIController);

//initializes the event lisnters
controller.init();