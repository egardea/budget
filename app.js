//Budget controller
const budgetController = (() => {

    class Expense {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
            this.percentage = -1;
        };
        calcPercentage(totalInc) {
            if(totalInc > 0) {
                this.percentage = Math.round((this.value / totalInc) * 100)
            } else {
                this.percentage = -1;
            }
        };
        getPercentage(){
            return this.percentage;
        };
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

        calculatePercentages: () => {
            data.allItems.exp.forEach((current) => {
                current.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: () => {
            let allPercentages = data.allItems.exp.map((current) => {
                return current.getPercentage();
            });

            return allPercentages;
        },

        getBudget: () => {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        testing: () => {
            console.log(data)
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
        expensePercentageLabel: '.item__percentage',
        monthLabel: '.budget__title--month',
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
        addItemToUI: (input, type) => {
            const listItem = `
                <div class="item clearfix" id="${type === 'exp' ? 'exp' : 'inc'}-${input.id}">
                    <div class="item__description">${input.description}</div>
                    <div class="right clearfix">
                        <div class="item__value">${type === 'exp' ? '-' : '+'} ${formatNumber(input.value)}</div>
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
        
        deleteItemfromUI: (elementId) => {
            //select the element that will be removed
            let el = document.getElementById(elementId);
            //go up to the parent element and back to the element to remove
            el.parentNode.removeChild(el);
        },

        clearInputFields: () => {
            let fields, fieldsToArray;
            //select the elements
            fields = document.querySelectorAll(`${DOMStrings.description}, ${DOMStrings.value}`);

            //turn the element nodes into an array
            fieldsToArray = Array.prototype.slice.call(fields);

            //loop through that array to delete the values
            fieldsToArray.forEach((current) => {
                current.value = '';
            });

            //select the first index to always focus on it
            fieldsToArray[0].focus();
        },

        displayBudget: (obj) => {
            //select all the dom elements and add the numbers for the budget by passing the budget object
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc);
            document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber(obj.totalExp);   

            //only add the percentage if its greater than zero
            if(obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }
        },

        displayPercentages: (percentages) => {
            //get all the expense items
            let expenseNodes = document.querySelectorAll(DOMStrings.expensePercentageLabel);
            
            const nodeListForEach = (list, callback) => {
                for(let i = 0; i < expenseNodes.length; i++) {
                    callback(expenseNodes[i], i);
                }
            };

            nodeListForEach(expenseNodes, (current, index) => {
                if(percentages[index] > 0){
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
        },

        displayMonth: () => {
            let currentDate, months, month;
            //get current date
            currentDate = new Date();
            //array with month names
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            //get the current month index
            month = currentDate.getMonth();
            //use the index to return the month string
            document.querySelector(DOMStrings.monthLabel).textContent = months[month];
            
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

        //selects the child element that needs to be deleted and executes the delete function
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

    const updatePercentages = () => {
        //calculate the percentages
        budgetCtrl.calculatePercentages();

        //read them from the budget controller
        let percentages = budgetCtrl.getPercentages();

        //update the UI with the new percentages
        UICtrl.displayPercentages(percentages);

    };
    
    const ctrlAddItem = () => {
        //get the input data
        let input = UICtrl.getInput();
        
        if(input.description !== '' && !isNaN(input.value) && input.value > 0) {
            //add the item to the budget controller
            let newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            //add the item to the UI
            UICtrl.addItemToUI(newItem, input.type);

            //clear the input fields
            UICtrl.clearInputFields();

            //calculate and update budget
            updateBudget();

            //update the percentages
            updatePercentages();
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
        UICtrl.deleteItemfromUI(getitemID);

        //update the budget numbers
        updateBudget();

        //update the percentages
        updatePercentages();
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
            UICtrl.displayMonth();
            eventListenerSetUp();
        },
    };

})(budgetController, UIController);

//initializes the event lisnters
controller.init();