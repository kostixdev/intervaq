# Intervaq
> Just another one solution for `intervals` \ `timeouts` via `requestAnimationFrame`.

Working well in a project that based on [three.js][threejs-url] library.



## Why:
  - to use `intervals` \ `timeouts` via [requestAnimationFrame][requestAnimationFrame-url];
  - to avoid some time based glitches, violations;
  - to control some time based actions.



## Documentation:
Check documentation [here][docs-url]


## Some info to use:
  - `intervaq`:
    - `.checkToExecute()` in `requestAnimationFrame` callback body;
    - `.setInterval(callback, timeMs)` / `.clearInterval(interval)` as usual;
    - `.setTimeout(callback, timeMs)` / `.clearTimeout(timeout)` as usual;
    - `.pauseProcessing()` / `.continueProcessing()` when its necessary;
  - `intervaq` . `intervals` / `timeouts`:
    - `.pauseExecuting(currentTimeInt)` and `.continueExecuting(currentTimeInt)` manually;
    - `.disable()` / `.enable()` / `.restart()` manually.



## Usage:

sode sample:

```javascript

import { Intervaq } from 'intervaq';



// init intervaq object
const intervaq = new Intervaq();

// using intervaq via requestAnimationFrame
function animate() {
  requestAnimationFrame( animate );

  // here
  if (intervaq !== undefined)
    intervaq.checkToExecute();
}



// to control visibility state
document.addEventListener( 'visibilitychange', onVisibilityChange );

function onVisibilityChange ( event ) {
  if (event.target.visibilityState === 'visible') {
    console.log(`tab is active at ${new Date().getTime()} `);
    // continue processing
    intervaq.continueProcessing();
  } else {
    console.log(`tab is inactive at ${new Date().getTime()} `);
    // pause processing
    intervaq.pauseProcessing();
  }
}



// intervaq.setInterval case:
let testIntervalValue = 0;
const testInterval = intervaq.setInterval( () => {
  console.log(`testInterval every 1000ms #${testIntervalValue} at ${new Date().getTime()} `);
  testValue++;
}, 1000);



// intervaq.setTimeout case:
let testTimeoutValue = 0;
const testTimeout = intervaq.setTimeout( () => {
  // disable its testInterval
  intervaq.clearInterval(testInterval);
  console.log(`testTimeout in 5500ms #${testTimeoutValue} at ${new Date().getTime()} `);
}, 5500);



// action
animate();

```

output sample 0:
```
testInterval every 1000ms #0 at 1689861750168 
testInterval every 1000ms #1 at 1689861751169 
testInterval every 1000ms #2 at 1689861752184 
testInterval every 1000ms #3 at 1689861753184 
testInterval every 1000ms #4 at 1689861754201 
testTimeout in 5500ms #0 at 1689861754667
```

output sample 1 (on tabs switching):
```
testInterval every 1000ms #0 at 1689877224270 
testInterval every 1000ms #1 at 1689877225287 
tab is inactive at 1689877226100 
tab is active at 1689877230127 
testInterval every 1000ms #2 at 1689877230319 
tab is inactive at 1689877231240 
tab is active at 1689877234740 
testInterval every 1000ms #3 at 1689877234820 
testInterval every 1000ms #4 at 1689877235821 
testTimeout in 5500ms #0 at 1689877236288

```


# Dev:

  - `npm install`
  - configure your gitflow workspace like it is [here][gitflow-url]
  - `npm run prepare` (check [husky][husky-url] documentation)



## TODO:

  - [ ] apply some pattern... maybe...
  - [ ] mk some prettify
  - [ ] mk some cleanup... maybe...
  - [ ] modify some `checkToExecute` functionality
  - [ ] chck `clearInterval` on `executionInProcess`
  - [ ] try to keep pausing at its `Intervaq` class only
  - [ ] do smth with `destroy` method
  - [ ] transfer to typescript... maybe...
  - [ ] check some scope executing



---
© [kostix.dev][kostix-url]



[kostix-url]: https://kostix.dev
[threejs-url]: https://threejs.org
[requestAnimationFrame-url]: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
[gitflow-url]: https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow
[docs-url]: docs/README.md
[husky-url]: https://typicode.github.io/husky/
