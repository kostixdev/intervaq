# Intervaq

[![License][license-image-url]][license-url]
[![NPM version][npm-image-url]][npm-url]
[![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts)
[![Downloads][npm-downloads-image-url]][npm-url]

> Just another one solution for `intervals` \ `timeouts` via `requestAnimationFrame`.

Working well in a project that based on [three.js][threejs-url] library.

## Test coverage:
<!--READMEQ:jestBadges-->
![Coverage lines](https://img.shields.io/badge/Lines-100%25-brightgreen?logo=jest)
![Coverage functions](https://img.shields.io/badge/Functions-100%25-brightgreen?logo=jest)
![Coverage branches](https://img.shields.io/badge/Branches-98.11%25-brightgreen?logo=jest)
![Coverage statements](https://img.shields.io/badge/Statements-100%25-brightgreen?logo=jest)
<!--/READMEQ:jestBadges-->

## Why:
  - to use `intervals` \ `timeouts` via [requestAnimationFrame][requestAnimationFrame-url];
  - to avoid some time based glitches, violations;
  - to control some time based actions.

## Some info to use:
  - `intervaq`:
    - `.checkToExecute(timestamp)` in `requestAnimationFrame` callback body;
    - `.setInterval(callback, timeMs)` / `.clearInterval(interval)` as usual;
    - `.setTimeout(callback, timeMs)` / `.clearTimeout(timeout)` as usual;
    - `.pauseProcessing()` / `.continueProcessing()` when its necessary;
  - `intervaq` . `intervals` / `timeouts`:
    - `.pauseExecuting(currentTimeInt)` and `.continueExecuting(currentTimeInt)` manually;
    - `.disable()` / `.enable()` / `.restart()` manually.

## Usage:

some sample (TypeScript):

```typescript
import {Intervaq, Timestamp} from 'intervaq';

// init intervaq object
const intervaq = new Intervaq();

// using intervaq via requestAnimationFrame
function animate(timestamp?: Timestamp) {
  // process intervaq
  if (timestamp && intervaq !== undefined) {
    intervaq.checkToExecute(timestamp);
  }

  requestAnimationFrame(animate);
}

// to control visibility state
document.addEventListener('visibilitychange', onVisibilityChange);

function onVisibilityChange(event: Event) {
  const target = event.target as Document;
  if (target.visibilityState === 'visible') {
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
const testInterval = intervaq.setInterval(() => {
  console.log(
    `testInterval every 1000ms #${testIntervalValue} at ${new Date().getTime()} `
  );
  testIntervalValue++;
}, 1000);

// intervaq.setTimeout case:
const testTimeoutValue = 0;
const testTimeout = intervaq.setTimeout(() => {
  // disable its testInterval
  intervaq.clearInterval(testInterval);
  console.log(
    `testTimeout in 5500ms #${testTimeoutValue} at ${new Date().getTime()} `
  );
  // !not important
  intervaq.clearTimeout(testTimeout);
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

# Documentation:

<!--READMEQ:docsSection-->
### Enumerations

- [StatusInterval](README.md#statusinterval)
- [StatusIntervaq](README.md#statusintervaq)
- [StatusTimeout](README.md#statustimeout)

### Classes

- [Interval](README.md#interval)
- [Intervaq](README.md#intervaq)
- [Timeout](README.md#timeout)

### Type Aliases

- [Callback](README.md#callback)
- [Timestamp](README.md#timestamp)

### Functions

- [dummyCallback](README.md#dummycallback)
- [getTimestamp](README.md#gettimestamp)

## Enumerations

### StatusInterval

Status of Interval

#### Enumeration Members

| Member | Value | Description |
| :------ | :------ | :------ |
| `DISABLED` | ``2`` | disabled for execution |
| `DONE` | ``4`` | execution done |
| `EXECUTING` | ``3`` | execution is processing |
| `IN_PROCESS` | ``1`` | in process |
| `PAUSED` | ``0`` | paused |

***

### StatusIntervaq

Status of Intervaq

#### Enumeration Members

| Member | Value | Description |
| :------ | :------ | :------ |
| `IN_PROCESS` | ``1`` | in process |
| `PAUSED` | ``0`` | paused |

***

### StatusTimeout

Status of Timeout

#### Enumeration Members

| Member | Value | Description |
| :------ | :------ | :------ |
| `DISABLED` | ``3`` | disabled for execution |
| `DONE` | ``2`` | execution done |
| `EXECUTING` | ``4`` | execution is processing |
| `IN_PROCESS` | ``1`` | in process |
| `PAUSED` | ``0`` | paused |

## Classes

### Interval

Interval item class

#### Constructors

##### new Interval

> **new Interval**(
  `callback`,
  `timeInterval`,
  `isPaused`): [`Interval`](README.md#interval)

Constructor.

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `callback` | `Function` | function to execute |
| `timeInterval` | `number` | time of execution in Ms |
| `isPaused` | `boolean` | is intervaq paused on setInterval call |

###### Returns

[`Interval`](README.md#interval)

###### Defined In

[index.ts:249](https://github.com/kostixdev/intervaq/blob/148ec54/src/index.ts#L249)

#### Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| `_callback` | `Function` | `callback` function to execute. |
| `executeAtTime` | `null` \| `number` | timestamp of next execution iteration. |
| `pausedAtTime` | `null` \| `number` | null or timestamp when current interval is paused. |
| `prevTime` | `null` \| `number` | timestamp of its prev execution iteration. |
| `status` | [`StatusInterval`](README.md#statusinterval) | Status value. |
| `timeInterval` | `null` \| `number` | Int time in Ms of its interval execution. |

#### Methods

##### checkTimeToExecute

> **checkTimeToExecute**(`timeToCheck`): `void`

Check its Interval for execution.

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `timeToCheck` | `number` | timestamp to check for execution |

###### Returns

`void`

void

###### Defined In

[index.ts:272](https://github.com/kostixdev/intervaq/blob/148ec54/src/index.ts#L272)

***

##### continueExecuting

> **continueExecuting**(`continueAtTime`): `void`

Continue to execute after pause.

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `continueAtTime` | `number` | timestamp to calculate its downtime |

###### Returns

`void`

void

###### Defined In

[index.ts:312](https://github.com/kostixdev/intervaq/blob/148ec54/src/index.ts#L312)

***

##### destroy

> **destroy**(): `void`

Desctuctor functionality.

###### Returns

`void`

void

###### Defined In

[index.ts:354](https://github.com/kostixdev/intervaq/blob/148ec54/src/index.ts#L354)

***

##### disable

> **disable**(): [`Interval`](README.md#interval)

Disable execution.

###### Returns

[`Interval`](README.md#interval)

this

###### Defined In

[index.ts:324](https://github.com/kostixdev/intervaq/blob/148ec54/src/index.ts#L324)

***

##### enable

> **enable**(): [`Interval`](README.md#interval)

Enable execution.

###### Returns

[`Interval`](README.md#interval)

this

###### Defined In

[index.ts:333](https://github.com/kostixdev/intervaq/blob/148ec54/src/index.ts#L333)

***

##### execute

> **execute**(): `void`

Execute the `callback` function.

###### Returns

`void`

void

###### Defined In

[index.ts:291](https://github.com/kostixdev/intervaq/blob/148ec54/src/index.ts#L291)

***

##### pauseExecuting

> **pauseExecuting**(`pausedAtTime`): `void`

Set execution on pause.

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `pausedAtTime` | `number` | timestamp to set its `pausedAtTime` |

###### Returns

`void`

void

###### Defined In

[index.ts:302](https://github.com/kostixdev/intervaq/blob/148ec54/src/index.ts#L302)

***

##### restart

> **restart**(): [`Interval`](README.md#interval)

Restart execution.

###### Returns

[`Interval`](README.md#interval)

this

###### Defined In

[index.ts:346](https://github.com/kostixdev/intervaq/blob/148ec54/src/index.ts#L346)

***

### Intervaq

Main Intervaq class

#### Constructors

##### new Intervaq

> **new Intervaq**(): [`Intervaq`](README.md#intervaq)

Constructor

###### Returns

[`Intervaq`](README.md#intervaq)

###### Defined In

[index.ts:69](https://github.com/kostixdev/intervaq/blob/148ec54/src/index.ts#L69)

#### Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| `intervals` | [`Interval`](README.md#interval)[] | Array of Intervals |
| `pausedAt` | `null` \| `number` | null or timestamp when Intervaq is paused |
| `status` | [`StatusIntervaq`](README.md#statusintervaq) | Status value |
| `timeouts` | [`Timeout`](README.md#timeout)[] | Array of Timeouts |

#### Methods

##### checkToExecute

> **checkToExecute**(`timestamp`): `void`

Checking intervals and timeouts to execute.

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `timestamp` | `number` | timestamp (from `requestAnimationFrame`, etc) |

###### Returns

`void`

###### Defined In

[index.ts:139](https://github.com/kostixdev/intervaq/blob/148ec54/src/index.ts#L139)

***

##### clearInterval

> **clearInterval**(`interval`): `boolean`

clearInterval functionality.

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `interval` | [`Interval`](README.md#interval) | object of Interval |

###### Returns

`boolean`

- done state

###### Defined In

[index.ts:94](https://github.com/kostixdev/intervaq/blob/148ec54/src/index.ts#L94)

***

##### clearTimeout

> **clearTimeout**(`timeout`): `boolean`

clearTimeout functionality.

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `timeout` | [`Timeout`](README.md#timeout) | object of Timeout |

###### Returns

`boolean`

- done state

###### Defined In

[index.ts:125](https://github.com/kostixdev/intervaq/blob/148ec54/src/index.ts#L125)

***

##### continueProcessing

> **continueProcessing**(): `void`

Continue of intervals/timeouts to execute after paused

###### Returns

`void`

void

###### Defined In

[index.ts:177](https://github.com/kostixdev/intervaq/blob/148ec54/src/index.ts#L177)

***

##### pauseProcessing

> **pauseProcessing**(): `void`

Set intervals/timeouts paused to prevent its execution

###### Returns

`void`

void

###### Defined In

[index.ts:160](https://github.com/kostixdev/intervaq/blob/148ec54/src/index.ts#L160)

***

##### setInterval

> **setInterval**(`fnToExecute`, `timeInterval`): [`Interval`](README.md#interval)

setInterval functionality.

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `fnToExecute` | `Function` | function to execute |
| `timeInterval` | `number` | time of execution in Ms |

###### Returns

[`Interval`](README.md#interval)

- object of Interval

###### Defined In

[index.ts:79](https://github.com/kostixdev/intervaq/blob/148ec54/src/index.ts#L79)

***

##### setTimeout

> **setTimeout**(`fnToExecute`, `timeOut`): [`Timeout`](README.md#timeout)

setTimeout functionality.

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `fnToExecute` | `Function` | function to execute |
| `timeOut` | `number` | time of execution in Ms |

###### Returns

[`Timeout`](README.md#timeout)

- object of Timeout

###### Defined In

[index.ts:110](https://github.com/kostixdev/intervaq/blob/148ec54/src/index.ts#L110)

***

### Timeout

Timeout item class

#### Constructors

##### new Timeout

> **new Timeout**(
  `callback`,
  `timeOut`,
  `isPaused`): [`Timeout`](README.md#timeout)

Constructor

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `callback` | `Function` | Function to execute. |
| `timeOut` | `number` | timestamp to check for execution. |
| `isPaused` | `boolean` | is intervaq paused on setInterval call. |

###### Returns

[`Timeout`](README.md#timeout)

###### Defined In

[index.ts:423](https://github.com/kostixdev/intervaq/blob/148ec54/src/index.ts#L423)

#### Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| `_callback` | `Function` | `callback` function to execute. |
| `executeAtTime` | `null` \| `number` | timestamp of next execution iteration. |
| `pausedAtTime` | `null` \| `number` | null or timestamp when current interval is paused. |
| `prevTime` | `null` \| `number` | null (initial) or timestamp of its prev execution iteration. |
| `status` | [`StatusTimeout`](README.md#statustimeout) | Status value. |
| `timeOut` | `null` \| `number` | Int time in Ms of its timeout execution. |

#### Methods

##### checkTimeToExecute

> **checkTimeToExecute**(`timeToCheck`): `boolean`

Check its Timeout for execution.

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `timeToCheck` | `number` | timestamp to check for the execution |

###### Returns

`boolean`

done state

###### Defined In

[index.ts:446](https://github.com/kostixdev/intervaq/blob/148ec54/src/index.ts#L446)

***

##### continueExecuting

> **continueExecuting**(`continueAtTime`): `void`

Continue to execute after pause.

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `continueAtTime` | `number` | timestamp to calculate its downtime |

###### Returns

`void`

void

###### Defined In

[index.ts:483](https://github.com/kostixdev/intervaq/blob/148ec54/src/index.ts#L483)

***

##### destroy

> **destroy**(): `void`

Desctuctor functionality.

###### Returns

`void`

void

###### Defined In

[index.ts:525](https://github.com/kostixdev/intervaq/blob/148ec54/src/index.ts#L525)

***

##### disable

> **disable**(): [`Timeout`](README.md#timeout)

Disable execution.

###### Returns

[`Timeout`](README.md#timeout)

this

###### Defined In

[index.ts:495](https://github.com/kostixdev/intervaq/blob/148ec54/src/index.ts#L495)

***

##### enable

> **enable**(): [`Timeout`](README.md#timeout)

Enable execution.

###### Returns

[`Timeout`](README.md#timeout)

this

###### Defined In

[index.ts:504](https://github.com/kostixdev/intervaq/blob/148ec54/src/index.ts#L504)

***

##### execute

> **execute**(): `boolean`

Execute the `callback` function.

###### Returns

`boolean`

done state

###### Defined In

[index.ts:461](https://github.com/kostixdev/intervaq/blob/148ec54/src/index.ts#L461)

***

##### pauseExecuting

> **pauseExecuting**(`pausedAtTime`): `void`

Set execution on pause.

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `pausedAtTime` | `number` | timestamp to set its `pausedAtTime` |

###### Returns

`void`

void

###### Defined In

[index.ts:473](https://github.com/kostixdev/intervaq/blob/148ec54/src/index.ts#L473)

***

##### restart

> **restart**(): [`Timeout`](README.md#timeout)

Restart execution.

###### Returns

[`Timeout`](README.md#timeout)

this

###### Defined In

[index.ts:517](https://github.com/kostixdev/intervaq/blob/148ec54/src/index.ts#L517)

## Type Aliases

### Callback

> **Callback**: `Function`

`callback` type of function to execute.

#### Defined In

[index.ts:18](https://github.com/kostixdev/intervaq/blob/148ec54/src/index.ts#L18)

***

### Timestamp

> **Timestamp**: `number`

Timestamp type of datetime.

#### Defined In

[index.ts:22](https://github.com/kostixdev/intervaq/blob/148ec54/src/index.ts#L22)

## Functions

### dummyCallback

> **dummyCallback**(): `null`

Dummy callback to avoid calls on destruct.

#### Returns

`null`

- null

#### Defined In

[index.ts:13](https://github.com/kostixdev/intervaq/blob/148ec54/src/index.ts#L13)

***

### getTimestamp

> **getTimestamp**(): `number`

Returns timestamp.

#### Returns

`number`

- timestamp

#### Defined In

[index.ts:5](https://github.com/kostixdev/intervaq/blob/148ec54/src/index.ts#L5)
<!--/READMEQ:docsSection-->

## TODO:

  - [ ] apply some pattern... maybe...
  - [ ] modify some `checkToExecute` functionality
  - [ ] chck `clearInterval` \ `clearTimeout` on `executionInProcess`
  - [ ] try to keep pausing at its `Intervaq` class only
  - [ ] do smth with `destroy` method
  - [ ] check some scope executing
  - [ ] do smtn good with docs

---
© [kostix.dev][kostix-url]

[kostix-url]: https://kostix.dev
[threejs-url]: https://threejs.org
[requestAnimationFrame-url]: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
[gitflow-url]: https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow
[docs-url]: docs/README.md
[husky-url]: https://typicode.github.io/husky/

[license-url]: ./LICENSE
[license-image-url]: https://img.shields.io/npm/l/intervaq

[npm-url]: https://www.npmjs.com/package/intervaq
[npm-image-url]: https://img.shields.io/npm/v/intervaq?logo=npm
[npm-downloads-image-url]: https://img.shields.io/npm/dw/intervaq

***
Generated using [TypeDoc](https://typedoc.org/) and [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown)
