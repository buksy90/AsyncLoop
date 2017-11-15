# AsyncLoop
Easy way to handle recursive asynchronous functions in a loop way

This library allows you to run your asynchronous code in an synchronous recursive way as a loop. Simply define a loop body as a function that will return Promise like object or false. The library will call  each iteration of your function after the previous one has been done. Each iteration receives two arguments, iteration index and return value of Promise from previous iteration.

    // Basic usage
    // https://codepen.io/anon/pen/MOvxaX?editors=0012
    var loop = AsyncLoop(function(iteration, value){
      console.log("Loop called with iteration and value set to: ", iteration, value);
      
      var random = Math.random()*500;
    
      if(random < 200)
        return false;
    
      return new Promise(function(resolve){
        setTimeout(resolve.bind(null, random), random);
      });
    })
    .finished(function(){
      console.log("Loop has ended");
    });

You can catch an error in any iteration

    // https://codepen.io/anon/pen/QOMoEa?editors=1112
    var loop = AsyncLoop(function(iteration, value){
      console.log("Loop called with iteration and value set to: ", iteration, value);
      
      var random = Math.random();
      return random > 0.3
        ? Promise.resolve(random)
        : Promise.reject("My error");
    })
    .finished(function(){
      console.log("Loop has ended");
    })
    .catch(function(e){
      console.log("My catch catched", e);
    });

Another example

    // https://codepen.io/anon/pen/dZzrOo?editors=1111
    function returnPromiseForXSeconds(seconds) {
      var until = Date.now() + seconds * 1000;
    
      function waitSecond() {
        if(Date.now() >= until)
          return false;
    
        console.log("Waiting for one second");
        return new Promise(function(resolve, reject) {
          setTimeout(resolve.bind(null, waitSecond), 1000);
        });
      }
    
      return waitSecond;
    }
    var loop = AsyncLoop(returnPromiseForXSeconds(5))
    .finished(function(){
      console.log("Loop has ended");
    })
    .catch(function(e){
      console.log("My catch catched", e);
    });
