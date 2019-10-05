const budgetController = (() => {
    const x = 23;

    const add = (a) => {
        return x + a;
    }
    return {
        publicTest: (b) => {
            return add(b);
        }
    }
})();

//UI controller
const UIController = (() => {

    //some code

})();

//app controller
const controller = ((budgetCtrl, UICtrl) => {

    let z = budgetCtrl.publicTest(5);

    return {
        anotherPublic: () => {
            console.log(z);
        }
    }

})(budgetController, UIController);