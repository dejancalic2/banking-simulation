"use strict";

/////////////////////////////////////////////////
let account1;
let account2;
let account3;
let account4;

fetch("https://banking-dbfae-default-rtdb.firebaseio.com/users.json")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    account1 = data[0];
    account2 = data[1];
    account3 = data[2];
    account4 = data[3];

    console.log(account4);

    /////////////////////////////////////////////////
    // BANKIST APP
    // Data
    // const account1 = {
    //   owner: 'Dejan Calic',
    //   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    //   interestRate: 1.2, // %
    //   pin: 1111,
    //   currentBalance: 25000,
    //   in: '',
    //   out: '',
    // };

    // const account2 = {
    //   owner: 'Ivana Calic',
    //   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    //   interestRate: 1.5,
    //   pin: 2222,
    //   currentBalance: 11000,
    //   in: '',
    //   out: '',
    // };

    // const account3 = {
    //   owner: 'Pera Peric',
    //   movements: [200, -200, 340, -300, -20, 50, 400, -460],
    //   interestRate: 0.7,
    //   pin: 3333,
    //   currentBalance: 35000,
    //   in: '',
    //   out: '',
    // };

    // const account4 = {
    //   owner: 'Mile Simic',
    //   movements: [430, 1000, 700, 50, 90],
    //   interestRate: 1,
    //   pin: 4444,
    //   currentBalance: 65000,
    //   in: '',
    //   out: '',
    // };

    const accounts = [account1, account2, account3, account4];

    let AllUsersInfoBtn = document.querySelector(".users-info-btn");
    let AllUsersInfo = document.querySelector(".users-info");

    AllUsersInfoBtn.addEventListener("click", function () {
      AllUsersInfo.classList.toggle("active");
      AllUsersInfo.innerHTML = "";
      for (const account of accounts) {
        let userNameInfo = account.owner;
        let userPinInfo = account.pin;
        let userBalanceInfo = account.currentBalance;
        AllUsersInfo.innerHTML += `
    <ul>
    <p><i class="fas fa-user"></i>${userNameInfo}</p>
    <li><i class="fas fa-lock"></i><span>Pin:</span> ${userPinInfo}</li>
    <li><i class="fas fa-dollar-sign"></i><span>Balance:</span> ${userBalanceInfo}</li>
    </ul>
    `;
      }
    });

    // Elements
    const labelWelcome = document.querySelector(".welcome");
    const labelDate = document.querySelector(".date");
    const labelBalance = document.querySelector(".balance__value");
    const labelSumIn = document.querySelector(".summary__value--in");
    const labelSumOut = document.querySelector(".summary__value--out");
    const labelSumInterest = document.querySelector(
      ".summary__value--interest"
    );
    const labelTimer = document.querySelector(".timer");

    const containerApp = document.querySelector(".app");
    const containerMovements = document.querySelector(".movements");

    const btnLogin = document.querySelector(".login__btn");
    const btnTransfer = document.querySelector(".form__btn--transfer");
    const btnLoan = document.querySelector(".form__btn--loan");
    const btnClose = document.querySelector(".form__btn--close");
    const btnSort = document.querySelector(".btn--sort");

    const inputLoginUsername = document.querySelector(".login__input--user");
    const inputLoginPin = document.querySelector(".login__input--pin");
    const inputTransferTo = document.querySelector(".form__input--to");
    const inputTransferAmount = document.querySelector(".form__input--amount");
    const inputLoanAmount = document.querySelector(".form__input--loan-amount");
    const inputCloseUsername = document.querySelector(".form__input--user");
    const inputClosePin = document.querySelector(".form__input--pin");

    let loginedUser = document.querySelector(".logined-user");

    let movementsType = document.querySelector(".movements__type");

    btnTransfer.addEventListener("click", function (e) {
      e.preventDefault();
    });
    btnLoan.addEventListener("click", function (e) {
      e.preventDefault();
    });
    btnClose.addEventListener("click", function (e) {
      e.preventDefault();
    });
    btnSort.addEventListener("click", function (e) {
      e.preventDefault();
    });
    /////////////////////////////////////////////////
    /////////////////////////////////////////////////
    // LECTURES

    const currencies = new Map([
      ["USD", "United States dollar"],
      ["EUR", "Euro"],
      ["GBP", "Pound sterling"],
    ]);
    // LOGIN
    let initialName;
    let loginUser;
    let loginPin;
    let loginAccount;
    let accountPin;

    // User input
    inputLoginUsername.addEventListener("keyup", function () {
      let user = this.value.toUpperCase();
      loginUser = user;
    });
    // Password input
    inputLoginPin.addEventListener("keyup", function () {
      let pin = this.value.toUpperCase();
      loginPin = pin;
    });

    // Confirm login
    let sumNegative = 0;
    let sumPositive = 0;

    btnLogin.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(".error-login-message").style.opacity = "1";
      /* 
  Gleda sve postojece accounte njihovog owener-a uzima njihove inicijale uporedjuje sa podatcima iz input polja
  i ako postoji account prosledjuhe ga u getData funkciju i stampa
  */
      for (const account of accounts) {
        let accountOwner = account.owner;
        let [name, lastName] = accountOwner.split(" ");
        initialName = name[0] + lastName[0];
        accountPin = account.pin;
        if (initialName == loginUser && loginPin == accountPin) {
          loginAccount = account;
          document.querySelector(".app").style.opacity = "1";
          document.querySelector(".error-login-message").style.opacity = "0";
          sumPositive = 0;
          sumNegative = 0;
          for (const negativeVal of account.movements) {
            if (negativeVal < 0) {
              sumNegative += negativeVal;
              account.out = `${sumNegative}`;
            } else {
              sumPositive += negativeVal;
              account.in = `${sumPositive}`;
            }
          }
          labelSumIn.innerHTML = `${account.in}`;
          labelSumOut.innerHTML = account.out;
        }
      }
      getData();
      inputLoginUsername.value = "";
      inputLoginPin.value = "";
    });

    // const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

    ///////////////////////// Request loan ////////////////////////

    function getData() {
      containerMovements.innerHTML = "";
      let bla = loginAccount.movements.length + 1;
      for (let [index, movement] of loginAccount.movements.entries()) {
        bla--;
        movement > 0
          ? (movementsType = "deposit")
          : (movementsType = "withdrawal");
        containerMovements.innerHTML += `
      <div class="movements__row">
        <div class="movements__type movements__type--${movementsType}">${bla} ${movementsType}</div>
        <div class="movements__date"></div>
        <div class="movements__value">${movement}</div>
      </div>
    `;
      }
      labelBalance.innerHTML = `${loginAccount.currentBalance}€`;
      loginedUser.innerHTML = `Hi! ${loginAccount.owner}`;
    }

    let inputLoan = "";

    inputLoanAmount.addEventListener("keyup", function () {
      inputLoan = Number(this.value);
    });

    btnLoan.addEventListener("click", function () {
      loginAccount.movements.unshift(inputLoan);
      getData();
      labelBalance.innerHTML = `${(loginAccount.currentBalance =
        loginAccount.currentBalance + inputLoan)}€`;

      let s = labelSumIn.textContent;
      let a = Number(s);
      labelSumIn.innerHTML = a + inputLoan;

      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(accounts),
      };
      fetch(
        "https://banking-dbfae-default-rtdb.firebaseio.com/users.json",
        requestOptions
      );
    });

    ////////////////////////////// Transfer money //////////////////////////////////

    let transferTo;
    let TransferAmount;

    inputTransferTo.addEventListener("keyup", function () {
      transferTo = this.value.toUpperCase();
    });

    inputTransferAmount.addEventListener("keyup", function () {
      TransferAmount = Number(this.value);
    });

    btnTransfer.addEventListener("click", function () {
      loginAccount.movements.unshift(TransferAmount - TransferAmount * 2);

      // account kome prebacuje novac

      for (const account of accounts) {
        let accountOwner = account.owner;
        let [name, lastName] = accountOwner.split(" ");
        initialName = name[0] + lastName[0];
        if (initialName == transferTo) {
          account.movements.unshift(TransferAmount);
          account.currentBalance += TransferAmount;
        }
      }
      for (const account of accounts) {
        let a = loginedUser.textContent.replaceAll("Hi! ", "");
        let b = account.owner;
        if (a == b) {
          account.currentBalance -= TransferAmount;
          account.out -= TransferAmount;
          console.log(account.out);
          labelSumOut.innerHTML = account.out;
          console.log(account.currentBalance);
        }
      }
      getData();
      console.log("AAAAA");
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(accounts),
      };
      fetch(
        "https://banking-dbfae-default-rtdb.firebaseio.com/users.json",
        requestOptions
      );
    });
  });
