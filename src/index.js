/**
 * Returns Int datetime.
 * @return {number} - int datetime
 */
function getCurrentTime() {
  return (performance || Date).now();
}


/**
 * @module Intervaq
 * @example
 * const intervaq = new Intervaq();
 */


/**
 * Status of Intervaq
 * @enum {number}
 */
const StatusIntervaq = {
  /** paused */
  PAUSED: 0,
  /** in process */
  IN_PROCESS: 1,
};

/**
 * Main Intervaq class
 */
class Intervaq {
  /**
   * Constructor
   */
  constructor() {
    /**
     * Array of Intervals
     * @type {Interval[]}
     */
    this.intervals = [];
    /**
     * Array of Timeouts
     * @type {Timeout[]}
     */
    this.timeouts = [];
    /**
     * Status value
     * @type {StatusIntervaq}
     */
    this.status = StatusIntervaq.IN_PROCESS;
    /**
     * null or Int datetime when Intervaq is paused
     * @type {(null|number)}
     */
    this.pausedAt = null;
  }


  /**
   * setInterval functionality.
   * @param {callback} fnToExecute - function to execute
   * @param {number} timeInterval - time of execution in Ms
   * @return {Interval} - object of Interval
   */
  setInterval(fnToExecute, timeInterval) {
    const interval = new Interval(fnToExecute, timeInterval);
    this.intervals.push(interval);
    return interval;
  }

  /**
   * clearInterval functionality.
   * @param {Interval} interval - object of Interval
   * @return {boolean} - done state
   */
  clearInterval(interval) {
    const index = this.intervals.indexOf(interval);
    if (index !== -1) {
      interval.destroy();
      this.intervals.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * setTimeout functionality.
   * @param {callback} fnToExecute - function to execute
   * @param {number} timeOut - time of execution in Ms
   * @return {Timeout} - object of Timeout
   */
  setTimeout(fnToExecute, timeOut) {
    const timeout = new Timeout(fnToExecute, timeOut);
    this.timeouts.push(timeout);
    return timeout;
  }

  /**
   * clearTimeout functionality.
   * @param {Timeout} timeout - object of Timeout
   * @return {boolean} - done state
   */
  clearTimeout(timeout) {
    const index = this.timeouts.indexOf(timeout);
    if (index !== -1) {
      timeout.destroy();
      this.timeouts.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Checking intervals and timeouts to execute
   */
  checkToExecute() {
    if (this.status !== StatusIntervaq.IN_PROCESS) {
      return;
    }
    const timeCurrent = getCurrentTime();
    // - intervals execute
    this.intervals.forEach((interval) =>
      interval.checkTimeToExecute(timeCurrent)
    );
    // - timeouts execute
    this.timeouts.forEach((timeout, index) => {
      if (timeout.checkTimeToExecute(timeCurrent)) {
        timeout.destroy();
        this.timeouts.splice(index, 1);
      }
    });
  }

  /**
   * Set intervals/timeouts paused to prevent its execution
   */
  pauseProcessing() {
    this.status = StatusIntervaq.PAUSED;
    this.pausedAt = getCurrentTime();
    // - intervals pause
    this.intervals.forEach(
        (interval) => interval.pauseExecuting(this.pausedAt)
    );
    // - timeouts pause
    this.timeouts.forEach( (timeout) => timeout.pauseExecuting(this.pausedAt) );
  }

  /**
   * Continue of intervals/timeouts to execute after paused
   */
  continueProcessing() {
    this.status = StatusIntervaq.IN_PROCESS;
    this.pausedAt = null;
    const runAt = getCurrentTime();
    // - intervals run
    this.intervals.forEach( (interval) => interval.continueExecuting(runAt) );
    // - timeouts run
    this.timeouts.forEach( (timeout) => timeout.continueExecuting(runAt) );
  }
}


/**
 * Status of Interval
 * @enum {number}
 */
const StatusInterval = {
  /** paused */
  PAUSED: 0,
  /** in process */
  IN_PROCESS: 1,
  /** disabled for execution */
  DISABLED: 2,
};

/**
 * Interval item class
 */
class Interval {
  /**
   * Constructor.
   * @param {callback} callback - function to execute
   * @param {number} timeInterval - time of execution in Ms
   */
  constructor(callback, timeInterval) {
    /**
     * Int datetime of its prev execution iteration.
     * @type {number}
     */
    this.prevTime = getCurrentTime();
    /**
     * `callback` function to execute.
     * @type {function}
     */
    this.callback = callback;
    /**
     * Int time in Ms of its interval execution.
     * @type {number}
     */
    this.timeInterval = timeInterval;

    /**
     * Int datetime of next execution iteration.
     * @type {number}
     */
    this.executeAtTime = this.prevTime + timeInterval;

    /**
     * Status value.
     * @type { StatusInterval }
     */
    this.status = StatusInterval.IN_PROCESS;
    /**
     * null or Int datetime when current interval is paused.
     * @type {(null|number)}
     */
    this.pausedAtTime = null;
  }

  /**
   * Check its Interval for execution.
   * @param {number} timeToCheck - Int datetime to check for execution.
   */
  checkTimeToExecute(timeToCheck) {
    if (this.status !== StatusInterval.IN_PROCESS) {
      return;
    }
    if (timeToCheck >= this.executeAtTime) {
      this.execute();
      this.prevTime = timeToCheck;
      this.executeAtTime = timeToCheck + this.timeInterval;
    }
  }

  /**
   * Execute the `callback` function.
   */
  execute() {
    this.callback.call();
  }

  /**
   * Set execution on pause.
   * @param {number} pausedAtTime - Int datetime to set its `pausedAtTime`.
   */
  pauseExecuting(pausedAtTime) {
    this.status = StatusInterval.PAUSED;
    this.pausedAtTime = pausedAtTime;
  }

  /**
   * Continue to execute after pause.
   * @param {number} continueAtTime - Int datetime to calculate its downtime.
   */
  continueExecuting(continueAtTime) {
    this.executeAtTime += continueAtTime - this.pausedAtTime;
    this.pausedAtTime = null;
    this.status = StatusInterval.IN_PROCESS;
  }

  /**
   * Disable execution.
   * @return {Interval} this.
   */
  disable() {
    this.status = StatusInterval.DISABLED;
    return this;
  }

  /**
   * Enable execution.
   * @return {Interval} this.
   */
  enable() {
    this.prevTime = getCurrentTime();
    this.executeAtTime = this.prevTime + this.timeOut;
    this.status = StatusInterval.IN_PROCESS;
    return this;
  }

  /**
   * Restart execution.
   * @return {Interval} this.
   */
  restart() {
    return this.disable().enable();
  }

  /**
   * Desctuctor functionality.
   */
  destroy() {
    this.prevTime = null;
    this.callback = () => null;
    this.timeInterval = null;
    this.status = null;
    this.pausedAtTime = null;
  }
}


/**
 * Status of Timeout
 * @enum {number}
 */
const StatusTimeout = {
  /** paused */
  PAUSED: 0,
  /** in process */
  IN_PROCESS: 1,
  /** execution done */
  DONE: 2,
  /** disabled for execution */
  DISABLED: 3,
};


/**
 * Timeout item class
 */
class Timeout {
  /**
   * Constructor
   * @param {callback} callback - Function to execute.
   * @param {number} timeOut - Int datetime to check for execution.
   */
  constructor(callback, timeOut) {
    /**
     * null (initial) or Int datetime of its prev execution iteration.
     * @type {(null|number)}
     */
    this.prevTime = getCurrentTime();
    /**
     * `callback` function to execute.
     * @type {function}
     */
    this.callback = callback;
    /**
     * Int time in Ms of its timeout execution.
     * @type {number}
     */
    this.timeOut = timeOut;

    /**
     * Int datetime of next execution iteration.
     * @type {number}
     */
    this.executeAtTime = this.prevTime + timeOut;

    /**
     * Status value.
     * @type { StatusTimeout }
     */
    this.status = StatusTimeout.IN_PROCESS;
    /**
     * null or Int datetime when current interval is paused.
     * @type {(null|number)}
     */
    this.pausedAtTime = null;
  }

  /**
   * Check its Timeout for execution.
   * @param {number} timeToCheck - Int datetime to check for the execution.
   * @return {boolean} done state.
   */
  checkTimeToExecute(timeToCheck) {
    if (
      timeToCheck >= this.executeAtTime &&
      this.status === StatusTimeout.IN_PROCESS
    ) {
      return this.execute();
    }
    return false;
  }

  /**
   * Execute the `callback` function.
   * @return {boolean} done state.
   */
  execute() {
    this.callback.call();
    this.status = StatusTimeout.DONE;
    return true;
  }

  /**
   * Set execution on pause.
   * @param {number} pausedAtTime - Int datetime to set its `pausedAtTime`.
   */
  pauseExecuting(pausedAtTime) {
    this.status = StatusTimeout.PAUSED;
    this.pausedAtTime = pausedAtTime;
  }

  /**
   * Continue to execute after pause.
   * @param {number} continueAtTime - Int datetime to calculate its downtime.
   */
  continueExecuting(continueAtTime) {
    this.executeAtTime += continueAtTime - this.pausedAtTime;
    this.pausedAtTime = null;
    this.status = StatusTimeout.IN_PROCESS;
  }

  /**
   * Disable execution.
   * @return {Timeout} this.
   */
  disable() {
    this.status = StatusTimeout.DISABLED;
    return this;
  }

  /**
   * Enable execution.
   * @return {Timeout} this.
   */
  enable() {
    this.prevTime = getCurrentTime();
    this.executeAtTime = this.prevTime + this.timeOut;
    this.status = StatusTimeout.IN_PROCESS;
    return this;
  }

  /**
   * Restart execution.
   * @return {Timeout} this.
   */
  restart() {
    return this.disable().enable();
  }

  /**
   * Desctuctor functionality.
   */
  destroy() {
    this.prevTime = null;
    this.callback = () => null;
    this.timeOut = null;
    this.executeAtTime = null;
    this.status = null;
    this.pausedAtTime = null;
  }
}


export {Intervaq, Interval, Timeout};
