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
        * [.intervals](#module_Intervaq..Intervaq+intervals)
        * [.timeouts](#module_Intervaq..Intervaq+timeouts)
        * [.status](#module_Intervaq..Intervaq+status)
        * [.pausedAt](#module_Intervaq..Intervaq+pausedAt)
        * [.setInterval()](#module_Intervaq..Intervaq+setInterval)
    * [~Interval](#module_Intervaq..Interval)
    * [~Timeout](#module_Intervaq..Timeout)

<a name="module_Intervaq..Intervaq"></a>

## Intervaq~Intervaq
Main Intervaq class

**Kind**: inner class of [<code>Intervaq</code>](#module_Intervaq)  

* [~Intervaq](#module_Intervaq..Intervaq)
    * [new Intervaq()](#new_module_Intervaq..Intervaq_new)
    * [.intervals](#module_Intervaq..Intervaq+intervals)
    * [.timeouts](#module_Intervaq..Intervaq+timeouts)
    * [.status](#module_Intervaq..Intervaq+status)
    * [.pausedAt](#module_Intervaq..Intervaq+pausedAt)
    * [.setInterval()](#module_Intervaq..Intervaq+setInterval)

<a name="new_module_Intervaq..Intervaq_new"></a>

### new Intervaq()
Constructor (empty)

<a name="module_Intervaq..Intervaq+intervals"></a>

### intervaq.intervals
Array of Intervals

**Kind**: instance property of [<code>Intervaq</code>](#module_Intervaq..Intervaq)  
<a name="module_Intervaq..Intervaq+timeouts"></a>

### intervaq.timeouts
Array of Timeouts

**Kind**: instance property of [<code>Intervaq</code>](#module_Intervaq..Intervaq)  
<a name="module_Intervaq..Intervaq+status"></a>

### intervaq.status
Status value

**Kind**: instance property of [<code>Intervaq</code>](#module_Intervaq..Intervaq)  
<a name="module_Intervaq..Intervaq+pausedAt"></a>

### intervaq.pausedAt
null or datetime when Intervaq is paused

**Kind**: instance property of [<code>Intervaq</code>](#module_Intervaq..Intervaq)  
<a name="module_Intervaq..Intervaq+setInterval"></a>

### intervaq.setInterval()
setInterval functionality.

**Kind**: instance method of [<code>Intervaq</code>](#module_Intervaq..Intervaq)  

| Param |
| --- |
| ..... | 

<a name="module_Intervaq..Interval"></a>

## Intervaq~Interval
Interval item class

**Kind**: inner class of [<code>Intervaq</code>](#module_Intervaq)  
<a name="module_Intervaq..Timeout"></a>

## Intervaq~Timeout
Timeout item class

**Kind**: inner class of [<code>Intervaq</code>](#module_Intervaq)  
<a name="getCurrentTime"></a>

# getCurrentTime() ⇒ <code>number</code>
Returns Int datetime.

**Kind**: global function  
**Returns**: <code>number</code> - - int datetime  
