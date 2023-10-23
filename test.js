// Welcome to the TypeScript Playground, this is a website
// which gives you a chance to write, share and learn TypeScript.

// You could think of it in three ways:
//
//  - A location to learn TypeScript where nothing can break
//  - A place to experiment with TypeScript syntax, and share the URLs with others
//  - A sandbox to experiment with different compiler features of TypeScript
// Welcome to the TypeScript Playground, this is a website
// which gives you a chance to write, share and learn TypeScript.

// You could think of it in three ways:
//
//  - A location to learn TypeScript where nothing can break
//  - A place to experiment with TypeScript syntax, and share the URLs with others
//  - A sandbox to experiment with different compiler features of TypeScript

const anExampleVariable = "Hello World";
console.log(anExampleVariable);


let string = "08008687451";
console.log(string)
let char = string.replace(/^./g, "+44")

console.log(char)


// async function topupIssuingBalance() {

//     const data = {
//     "amount": "20000", 
//     "currency": "GBP",
//   };

//   const response = await fetch('https://api.stripe.com/v1/test_helpers/issuing/fund_balance', {
//       method: 'POST',
//       headers: {
//         'Stripe-Account': "acct_1O3IfDQ9TI3XK461",
//         'content-type': 'application/x-www-form-urlencoded',
//         'Authorization': 'Bearer sk_test_51L8N45LYkLYNKoGaVwl7Q3RqsgsTu0tOElIg6y3PXcKoLej5KJ0r7iou5DMfUcJGFeijK5idhiaVQ8R2sePmNJSj00LzgcHuAt' ,
//       },
//       // body: JSON.stringify({
//       //   amount: 50000, 
//       //   currency: process.env.NEXT_PUBLIC_CURRENCY,
//       // })

//       // form: {
//       //   'amount': '5000',
//       //   'currency': 'GBP'
//       // }
      
//       body: new URLSearchParams(data),
//   });

//     const result = await response.json();
    
//     console.log(result)
// };
// topupIssuingBalance();

