# Modules

<dl>
<dt><a href="#module_Intervaq">Intervaq</a></dt>
<dd></dd>
</dl>

# Functions

<dl>
<dt><a href="#getCurrentTime">getCurrentTime()</a> ⇒ <code>number</code></dt>
<dd><p>Returns Int datetime.</p>
</dd>
</dl>

<a name="module_Intervaq"></a>

# Intervaq
**Example**  
```js
const intervaq = new Intervaq();
```

* [Intervaq](#module_Intervaq)
    * [~Intervaq](#module_Intervaq..Intervaq)
        * [new Intervaq()](#new_module_Intervaq..Intervaq_new)
        * [.intervals](#module_Intervaq..Intervaq+intervals) : <code>Array.&lt;Interval&gt;</code>
        * [.timeouts](#module_Intervaq..Intervaq+timeouts) : <code>Array.&lt;Timeout&gt;</code>
        * [.status](#module_Intervaq..Intervaq+status) : <code>StatusIntervaq</code>
        * [.pausedAt](#module_Intervaq..Intervaq+pausedAt) : <code>null</code> \| <code>number</code>
        * [.setInterval(fnToExecute, timeInterval)](#module_Intervaq..Intervaq+setInterval) ⇒ <code>Interval</code>
        * [.clearInterval(interval)](#module_Intervaq..Intervaq+clearInterval) ⇒ <code>boolean</code>
        * [.setTimeout(fnToExecute, timeInterval)](#module_Intervaq..Intervaq+setTimeout) ⇒ <code>Timeout</code>
        * [.clearTimeout(timeout)](#module_Intervaq..Intervaq+clearTimeout) ⇒ <code>boolean</code>
        * [.checkToExecute()](#module_Intervaq..Intervaq+checkToExecute)
        * [.pauseProcessing()](#module_Intervaq..Intervaq+pauseProcessing)
        * [.continueProcessing()](#module_Intervaq..Intervaq+continueProcessing)
    * [~Interval](#module_Intervaq..Interval)
        * [new Interval(callback, timeInterval)](#new_module_Intervaq..Interval_new)
        * [.prevTime](#module_Intervaq..Interval+prevTime) : <code>null</code> \| <code>number</code>
        * [.callback](#module_Intervaq..Interval+callback) : <code>function</code>
        * [.timeInterval](#module_Intervaq..Interval+timeInterval) : <code>null</code> \| <code>number</code>
        * [.executeAtTime](#module_Intervaq..Interval+executeAtTime) : <code>null</code> \| <code>number</code>
        * [.status](#module_Intervaq..Interval+status) : <code>StatusInterval</code>
        * [.pausedAtTime](#module_Intervaq..Interval+pausedAtTime) : <code>null</code> \| <code>number</code>
        * [.checkTimeToExecute(timeToCheck)](#module_Intervaq..Interval+checkTimeToExecute)
        * [.execute()](#module_Intervaq..Interval+execute)
        * [.pauseExecuting(pausedAtTime)](#module_Intervaq..Interval+pauseExecuting)
        * [.continueExecuting(continueAtTime)](#module_Intervaq..Interval+continueExecuting)
        * [.disable()](#module_Intervaq..Interval+disable)
        * [.enable()](#module_Intervaq..Interval+enable)
        * [.restart()](#module_Intervaq..Interval+restart)
        * [.destroy()](#module_Intervaq..Interval+destroy)
    * [~Timeout](#module_Intervaq..Timeout)
        * [new Timeout(callback, timeOut)](#new_module_Intervaq..Timeout_new)
        * [.prevTime](#module_Intervaq..Timeout+prevTime) : <code>null</code> \| <code>number</code>
        * [.callback](#module_Intervaq..Timeout+callback) : <code>function</code>
        * [.timeOut](#module_Intervaq..Timeout+timeOut) : <code>null</code> \| <code>number</code>
        * [.executeAtTime](#module_Intervaq..Timeout+executeAtTime) : <code>null</code> \| <code>number</code>
        * [.status](#module_Intervaq..Timeout+status) : <code>StatusTimeout</code>
        * [.pausedAtTime](#module_Intervaq..Timeout+pausedAtTime) : <code>null</code> \| <code>number</code>
        * [.checkTimeToExecute(timeToCheck)](#module_Intervaq..Timeout+checkTimeToExecute) ⇒ <code>boolean</code>
        * [.execute()](#module_Intervaq..Timeout+execute)
        * [.pauseExecuting(pausedAtTime)](#module_Intervaq..Timeout+pauseExecuting)
        * [.continueExecuting(continueAtTime)](#module_Intervaq..Timeout+continueExecuting)
        * [.disable()](#module_Intervaq..Timeout+disable)
        * [.enable()](#module_Intervaq..Timeout+enable)
        * [.restart()](#module_Intervaq..Timeout+restart)
        * [.destroy()](#module_Intervaq..Timeout+destroy)
    * [~StatusIntervaq](#module_Intervaq..StatusIntervaq) : <code>enum</code>
    * [~StatusInterval](#module_Intervaq..StatusInterval) : <code>enum</code>
    * [~StatusTimeout](#module_Intervaq..StatusTimeout) : <code>enum</code>

<a name="module_Intervaq..Intervaq"></a>

## Intervaq~Intervaq
Main Intervaq class

**Kind**: inner class of [<code>Intervaq</code>](#module_Intervaq)  

* [~Intervaq](#module_Intervaq..Intervaq)
    * [new Intervaq()](#new_module_Intervaq..Intervaq_new)
    * [.intervals](#module_Intervaq..Intervaq+intervals) : <code>Array.&lt;Interval&gt;</code>
    * [.timeouts](#module_Intervaq..Intervaq+timeouts) : <code>Array.&lt;Timeout&gt;</code>
    * [.status](#module_Intervaq..Intervaq+status) : <code>StatusIntervaq</code>
    * [.pausedAt](#module_Intervaq..Intervaq+pausedAt) : <code>null</code> \| <code>number</code>
    * [.setInterval(fnToExecute, timeInterval)](#module_Intervaq..Intervaq+setInterval) ⇒ <code>Interval</code>
    * [.clearInterval(interval)](#module_Intervaq..Intervaq+clearInterval) ⇒ <code>boolean</code>
    * [.setTimeout(fnToExecute, timeInterval)](#module_Intervaq..Intervaq+setTimeout) ⇒ <code>Timeout</code>
    * [.clearTimeout(timeout)](#module_Intervaq..Intervaq+clearTimeout) ⇒ <code>boolean</code>
    * [.checkToExecute()](#module_Intervaq..Intervaq+checkToExecute)
    * [.pauseProcessing()](#module_Intervaq..Intervaq+pauseProcessing)
    * [.continueProcessing()](#module_Intervaq..Intervaq+continueProcessing)

<a name="new_module_Intervaq..Intervaq_new"></a>

### new Intervaq()
Constructor (empty)

<a name="module_Intervaq..Intervaq+intervals"></a>

### intervaq.intervals : <code>Array.&lt;Interval&gt;</code>
Array of Intervals

**Kind**: instance property of [<code>Intervaq</code>](#module_Intervaq..Intervaq)  
<a name="module_Intervaq..Intervaq+timeouts"></a>

### intervaq.timeouts : <code>Array.&lt;Timeout&gt;</code>
Array of Timeouts

**Kind**: instance property of [<code>Intervaq</code>](#module_Intervaq..Intervaq)  
<a name="module_Intervaq..Intervaq+status"></a>

### intervaq.status : <code>StatusIntervaq</code>
Status value

**Kind**: instance property of [<code>Intervaq</code>](#module_Intervaq..Intervaq)  
<a name="module_Intervaq..Intervaq+pausedAt"></a>

### intervaq.pausedAt : <code>null</code> \| <code>number</code>
null or Int datetime when Intervaq is paused

**Kind**: instance property of [<code>Intervaq</code>](#module_Intervaq..Intervaq)  
<a name="module_Intervaq..Intervaq+setInterval"></a>

### intervaq.setInterval(fnToExecute, timeInterval) ⇒ <code>Interval</code>
setInterval functionality.

**Kind**: instance method of [<code>Intervaq</code>](#module_Intervaq..Intervaq)  
**Returns**: <code>Interval</code> - - object of Interval  

| Param | Type | Description |
| --- | --- | --- |
| fnToExecute | <code>callback</code> | function to execute |
| timeInterval | <code>number</code> | time of execution in Ms |

<a name="module_Intervaq..Intervaq+clearInterval"></a>

### intervaq.clearInterval(interval) ⇒ <code>boolean</code>
clearInterval functionality.

**Kind**: instance method of [<code>Intervaq</code>](#module_Intervaq..Intervaq)  
**Returns**: <code>boolean</code> - - done status  

| Param | Type | Description |
| --- | --- | --- |
| interval | <code>Interval</code> | object of Interval |

<a name="module_Intervaq..Intervaq+setTimeout"></a>

### intervaq.setTimeout(fnToExecute, timeInterval) ⇒ <code>Timeout</code>
setTimeout functionality.

**Kind**: instance method of [<code>Intervaq</code>](#module_Intervaq..Intervaq)  
**Returns**: <code>Timeout</code> - - object of Timeout  

| Param | Type | Description |
| --- | --- | --- |
| fnToExecute | <code>callback</code> | function to execute |
| timeInterval | <code>number</code> | time of execution in Ms |

<a name="module_Intervaq..Intervaq+clearTimeout"></a>

### intervaq.clearTimeout(timeout) ⇒ <code>boolean</code>
clearTimeout functionality.

**Kind**: instance method of [<code>Intervaq</code>](#module_Intervaq..Intervaq)  
**Returns**: <code>boolean</code> - - done status  

| Param | Type | Description |
| --- | --- | --- |
| timeout | <code>Timeout</code> | object of Timeout |

<a name="module_Intervaq..Intervaq+checkToExecute"></a>

### intervaq.checkToExecute()
Checking intervals and timeouts to execute

**Kind**: instance method of [<code>Intervaq</code>](#module_Intervaq..Intervaq)  
<a name="module_Intervaq..Intervaq+pauseProcessing"></a>

### intervaq.pauseProcessing()
Set intervals/timeouts paused to prevent its execution

**Kind**: instance method of [<code>Intervaq</code>](#module_Intervaq..Intervaq)  
<a name="module_Intervaq..Intervaq+continueProcessing"></a>

### intervaq.continueProcessing()
Continue of intervals/timeouts to execute after paused

**Kind**: instance method of [<code>Intervaq</code>](#module_Intervaq..Intervaq)  
<a name="module_Intervaq..Interval"></a>

## Intervaq~Interval
Interval item class

**Kind**: inner class of [<code>Intervaq</code>](#module_Intervaq)  

* [~Interval](#module_Intervaq..Interval)
    * [new Interval(callback, timeInterval)](#new_module_Intervaq..Interval_new)
    * [.prevTime](#module_Intervaq..Interval+prevTime) : <code>null</code> \| <code>number</code>
    * [.callback](#module_Intervaq..Interval+callback) : <code>function</code>
    * [.timeInterval](#module_Intervaq..Interval+timeInterval) : <code>null</code> \| <code>number</code>
    * [.executeAtTime](#module_Intervaq..Interval+executeAtTime) : <code>null</code> \| <code>number</code>
    * [.status](#module_Intervaq..Interval+status) : <code>StatusInterval</code>
    * [.pausedAtTime](#module_Intervaq..Interval+pausedAtTime) : <code>null</code> \| <code>number</code>
    * [.checkTimeToExecute(timeToCheck)](#module_Intervaq..Interval+checkTimeToExecute)
    * [.execute()](#module_Intervaq..Interval+execute)
    * [.pauseExecuting(pausedAtTime)](#module_Intervaq..Interval+pauseExecuting)
    * [.continueExecuting(continueAtTime)](#module_Intervaq..Interval+continueExecuting)
    * [.disable()](#module_Intervaq..Interval+disable)
    * [.enable()](#module_Intervaq..Interval+enable)
    * [.restart()](#module_Intervaq..Interval+restart)
    * [.destroy()](#module_Intervaq..Interval+destroy)

<a name="new_module_Intervaq..Interval_new"></a>

### new Interval(callback, timeInterval)
Constructor.


| Param | Type | Description |
| --- | --- | --- |
| callback | <code>callback</code> | function to execute |
| timeInterval | <code>number</code> | time of execution in Ms |

<a name="module_Intervaq..Interval+prevTime"></a>

### interval.prevTime : <code>null</code> \| <code>number</code>
null (initial) or Int datetime of its prev execution iteration.

**Kind**: instance property of [<code>Interval</code>](#module_Intervaq..Interval)  
<a name="module_Intervaq..Interval+callback"></a>

### interval.callback : <code>function</code>
`callback` function to execute.

**Kind**: instance property of [<code>Interval</code>](#module_Intervaq..Interval)  
<a name="module_Intervaq..Interval+timeInterval"></a>

### interval.timeInterval : <code>null</code> \| <code>number</code>
null (initial) or Int time in Ms of its interval execution.

**Kind**: instance property of [<code>Interval</code>](#module_Intervaq..Interval)  
<a name="module_Intervaq..Interval+executeAtTime"></a>

### interval.executeAtTime : <code>null</code> \| <code>number</code>
null (initial) or Int datetime of next execution iteration.

**Kind**: instance property of [<code>Interval</code>](#module_Intervaq..Interval)  
<a name="module_Intervaq..Interval+status"></a>

### interval.status : <code>StatusInterval</code>
Status value.

**Kind**: instance property of [<code>Interval</code>](#module_Intervaq..Interval)  
<a name="module_Intervaq..Interval+pausedAtTime"></a>

### interval.pausedAtTime : <code>null</code> \| <code>number</code>
null or Int datetime when current interval is paused.

**Kind**: instance property of [<code>Interval</code>](#module_Intervaq..Interval)  
<a name="module_Intervaq..Interval+checkTimeToExecute"></a>

### interval.checkTimeToExecute(timeToCheck)
Check its Interval for execution.

**Kind**: instance method of [<code>Interval</code>](#module_Intervaq..Interval)  

| Param | Type | Description |
| --- | --- | --- |
| timeToCheck | <code>number</code> | Int datetime to check for next execution iteration. |

<a name="module_Intervaq..Interval+execute"></a>

### interval.execute()
Execute the `callback` function.

**Kind**: instance method of [<code>Interval</code>](#module_Intervaq..Interval)  
<a name="module_Intervaq..Interval+pauseExecuting"></a>

### interval.pauseExecuting(pausedAtTime)
Set execution on pause.

**Kind**: instance method of [<code>Interval</code>](#module_Intervaq..Interval)  

| Param | Type | Description |
| --- | --- | --- |
| pausedAtTime | <code>number</code> | Int datetime to set its `pausedAtTime`. |

<a name="module_Intervaq..Interval+continueExecuting"></a>

### interval.continueExecuting(continueAtTime)
Continue to execute after pause.

**Kind**: instance method of [<code>Interval</code>](#module_Intervaq..Interval)  

| Param | Type | Description |
| --- | --- | --- |
| continueAtTime | <code>number</code> | Int datetime to calculate downtime for the next execution iteration. |

<a name="module_Intervaq..Interval+disable"></a>

### interval.disable()
Disable execution.

**Kind**: instance method of [<code>Interval</code>](#module_Intervaq..Interval)  
<a name="module_Intervaq..Interval+enable"></a>

### interval.enable()
Enable execution.

**Kind**: instance method of [<code>Interval</code>](#module_Intervaq..Interval)  
<a name="module_Intervaq..Interval+restart"></a>

### interval.restart()
Restart execution.

**Kind**: instance method of [<code>Interval</code>](#module_Intervaq..Interval)  
<a name="module_Intervaq..Interval+destroy"></a>

### interval.destroy()
Desctuctor functionality.

**Kind**: instance method of [<code>Interval</code>](#module_Intervaq..Interval)  
<a name="module_Intervaq..Timeout"></a>

## Intervaq~Timeout
Timeout item class

**Kind**: inner class of [<code>Intervaq</code>](#module_Intervaq)  

* [~Timeout](#module_Intervaq..Timeout)
    * [new Timeout(callback, timeOut)](#new_module_Intervaq..Timeout_new)
    * [.prevTime](#module_Intervaq..Timeout+prevTime) : <code>null</code> \| <code>number</code>
    * [.callback](#module_Intervaq..Timeout+callback) : <code>function</code>
    * [.timeOut](#module_Intervaq..Timeout+timeOut) : <code>null</code> \| <code>number</code>
    * [.executeAtTime](#module_Intervaq..Timeout+executeAtTime) : <code>null</code> \| <code>number</code>
    * [.status](#module_Intervaq..Timeout+status) : <code>StatusTimeout</code>
    * [.pausedAtTime](#module_Intervaq..Timeout+pausedAtTime) : <code>null</code> \| <code>number</code>
    * [.checkTimeToExecute(timeToCheck)](#module_Intervaq..Timeout+checkTimeToExecute) ⇒ <code>boolean</code>
    * [.execute()](#module_Intervaq..Timeout+execute)
    * [.pauseExecuting(pausedAtTime)](#module_Intervaq..Timeout+pauseExecuting)
    * [.continueExecuting(continueAtTime)](#module_Intervaq..Timeout+continueExecuting)
    * [.disable()](#module_Intervaq..Timeout+disable)
    * [.enable()](#module_Intervaq..Timeout+enable)
    * [.restart()](#module_Intervaq..Timeout+restart)
    * [.destroy()](#module_Intervaq..Timeout+destroy)

<a name="new_module_Intervaq..Timeout_new"></a>

### new Timeout(callback, timeOut)
Constructor


| Param | Type | Description |
| --- | --- | --- |
| callback | <code>callback</code> | Int datetime to check for next execution iteration. |
| timeOut | <code>number</code> | Int datetime to check for next execution iteration. |

<a name="module_Intervaq..Timeout+prevTime"></a>

### timeout.prevTime : <code>null</code> \| <code>number</code>
null (initial) or Int datetime of its prev execution iteration.

**Kind**: instance property of [<code>Timeout</code>](#module_Intervaq..Timeout)  
<a name="module_Intervaq..Timeout+callback"></a>

### timeout.callback : <code>function</code>
`callback` function to execute.

**Kind**: instance property of [<code>Timeout</code>](#module_Intervaq..Timeout)  
<a name="module_Intervaq..Timeout+timeOut"></a>

### timeout.timeOut : <code>null</code> \| <code>number</code>
null (initial) or Int time in Ms of its timeout execution.

**Kind**: instance property of [<code>Timeout</code>](#module_Intervaq..Timeout)  
<a name="module_Intervaq..Timeout+executeAtTime"></a>

### timeout.executeAtTime : <code>null</code> \| <code>number</code>
null (initial) or Int datetime of next execution iteration.

**Kind**: instance property of [<code>Timeout</code>](#module_Intervaq..Timeout)  
<a name="module_Intervaq..Timeout+status"></a>

### timeout.status : <code>StatusTimeout</code>
Status value.

**Kind**: instance property of [<code>Timeout</code>](#module_Intervaq..Timeout)  
<a name="module_Intervaq..Timeout+pausedAtTime"></a>

### timeout.pausedAtTime : <code>null</code> \| <code>number</code>
null or Int datetime when current interval is paused.

**Kind**: instance property of [<code>Timeout</code>](#module_Intervaq..Timeout)  
<a name="module_Intervaq..Timeout+checkTimeToExecute"></a>

### timeout.checkTimeToExecute(timeToCheck) ⇒ <code>boolean</code>
Check its Timeout for execution.

**Kind**: instance method of [<code>Timeout</code>](#module_Intervaq..Timeout)  
**Returns**: <code>boolean</code> - done status.  

| Param | Type | Description |
| --- | --- | --- |
| timeToCheck | <code>number</code> | Int datetime to check for the execution. |

<a name="module_Intervaq..Timeout+execute"></a>

### timeout.execute()
Execute the `callback` function.

**Kind**: instance method of [<code>Timeout</code>](#module_Intervaq..Timeout)  
<a name="module_Intervaq..Timeout+pauseExecuting"></a>

### timeout.pauseExecuting(pausedAtTime)
Set execution on pause.

**Kind**: instance method of [<code>Timeout</code>](#module_Intervaq..Timeout)  

| Param | Type | Description |
| --- | --- | --- |
| pausedAtTime | <code>number</code> | Int datetime to set its `pausedAtTime`. |

<a name="module_Intervaq..Timeout+continueExecuting"></a>

### timeout.continueExecuting(continueAtTime)
Continue to execute after pause.

**Kind**: instance method of [<code>Timeout</code>](#module_Intervaq..Timeout)  

| Param | Type | Description |
| --- | --- | --- |
| continueAtTime | <code>number</code> | Int datetime to calculate downtime for the timeout iteration. |

<a name="module_Intervaq..Timeout+disable"></a>

### timeout.disable()
Disable execution.

**Kind**: instance method of [<code>Timeout</code>](#module_Intervaq..Timeout)  
<a name="module_Intervaq..Timeout+enable"></a>

### timeout.enable()
Enable execution.

**Kind**: instance method of [<code>Timeout</code>](#module_Intervaq..Timeout)  
<a name="module_Intervaq..Timeout+restart"></a>

### timeout.restart()
Restart execution.

**Kind**: instance method of [<code>Timeout</code>](#module_Intervaq..Timeout)  
<a name="module_Intervaq..Timeout+destroy"></a>

### timeout.destroy()
Desctuctor functionality.

**Kind**: instance method of [<code>Timeout</code>](#module_Intervaq..Timeout)  
<a name="module_Intervaq..StatusIntervaq"></a>

## Intervaq~StatusIntervaq : <code>enum</code>
Status of Intervaq

**Kind**: inner enum of [<code>Intervaq</code>](#module_Intervaq)  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| PAUSED | <code>number</code> | <code>0</code> | paused |
| IN_PROCESS | <code>number</code> | <code>1</code> | in process |

<a name="module_Intervaq..StatusInterval"></a>

## Intervaq~StatusInterval : <code>enum</code>
Status of Interval

**Kind**: inner enum of [<code>Intervaq</code>](#module_Intervaq)  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| PAUSED | <code>number</code> | <code>0</code> | paused |
| IN_PROCESS | <code>number</code> | <code>1</code> | in process |
| DISABLED | <code>number</code> | <code>2</code> | disabled for execution |

<a name="module_Intervaq..StatusTimeout"></a>

## Intervaq~StatusTimeout : <code>enum</code>
Status of Timeout

**Kind**: inner enum of [<code>Intervaq</code>](#module_Intervaq)  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| PAUSED | <code>number</code> | <code>0</code> | paused |
| IN_PROCESS | <code>number</code> | <code>1</code> | in process |
| DONE | <code>number</code> | <code>2</code> | execution done |
| DISABLED | <code>number</code> | <code>3</code> | disabled for execution |

<a name="getCurrentTime"></a>

# getCurrentTime() ⇒ <code>number</code>
Returns Int datetime.

**Kind**: global function  
**Returns**: <code>number</code> - - int datetime  
