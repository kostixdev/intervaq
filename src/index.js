/**
 * Returns timestamp.
 * @return {number} - timestamp
 */
function getTimestamp() {
  return (performance || Date).now();
}

/**
 * Dummy callback to avoid calls on destruct.
 * @return {null} - null
 */
const dummyCallback = () => null;

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
     * null or timestamp when Intervaq is paused
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
    const interval = new Interval(
      fnToExecute,
      timeInterval,
      this.status === StatusIntervaq.PAUSED ? true : false
    );
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
    const timeout = new Timeout(
      fnToExecute,
      timeOut,
      this.status === StatusIntervaq.PAUSED ? true : false
    );
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
   * @param {number} timestamp - timestamp (from `requestAnimationFrame`, etc)
   */
  checkToExecute(timestamp) {
    if (this.status !== StatusIntervaq.IN_PROCESS) {
      return;
    }
    // - intervals execute
    this.intervals.forEach(interval => interval.checkTimeToExecute(timestamp));
    // - timeouts execute
    this.timeouts.forEach((timeout, index) => {
      if (timeout.checkTimeToExecute(timestamp)) {
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
    this.pausedAt = getTimestamp();
    // - intervals pause
    this.intervals.forEach(interval => interval.pauseExecuting(this.pausedAt));
    // - timeouts pause
    this.timeouts.forEach(timeout => timeout.pauseExecuting(this.pausedAt));
  }

  /**
   * Continue of intervals/timeouts to execute after paused
   */
  continueProcessing() {
    const continueAt = getTimestamp();
    // - intervals run
    this.intervals.forEach(interval => interval.continueExecuting(continueAt));
    // - timeouts run
    this.timeouts.forEach(timeout => timeout.continueExecuting(continueAt));
    // - continue after intervals/timeouts activate
    this.pausedAt = null;
    this.status = StatusIntervaq.IN_PROCESS;
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
  /** execution is processing */
  EXECUTING: 3,
  /** execution done */
  DONE: 4,
};

/**
 * Interval item class
 */
class Interval {
  /**
   * Constructor.
   * @param {callback} callback - function to execute
   * @param {number} timeInterval - time of execution in Ms
   * @param {boolean} isPaused - is intervaq paused on setInterval call
   */
  constructor(callback, timeInterval, isPaused) {
    /**
     * timestamp of its prev execution iteration.
     * @type {number}
     */
    this.prevTime = getTimestamp();
    /**
     * `callback` function to execute.
     * @type {function}
     */
    this._callback_ = callback;
    /**
     * Int time in Ms of its interval execution.
     * @type {number}
     */
    this.timeInterval = timeInterval;

    /**
     * timestamp of next execution iteration.
     * @type {number}
     */
    this.executeAtTime = this.prevTime + timeInterval;

    /**
     * Status value.
     * @type { StatusInterval }
     */
    this.status = StatusInterval.IN_PROCESS;
    /**
     * null or timestamp when current interval is paused.
     * @type {(null|number)}
     */
    this.pausedAtTime = null;

    if (isPaused) {
      this.pauseExecuting(this.prevTime);
    }
  }

  /**
   * Check its Interval for execution.
   * @param {number} timeToCheck - timestamp to check for execution.
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
    this.status = StatusInterval.EXECUTING;
    this._callback_.call();
    this.status = StatusInterval.IN_PROCESS;
  }

  /**
   * Set execution on pause.
   * @param {number} pausedAtTime - timestamp to set its `pausedAtTime`.
   */
  pauseExecuting(pausedAtTime) {
    this.status = StatusInterval.PAUSED;
    this.pausedAtTime = pausedAtTime;
  }

  /**
   * Continue to execute after pause.
   * @param {number} continueAtTime - timestamp to calculate its downtime.
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
    this.prevTime = getTimestamp();
    this.executeAtTime = this.prevTime + this.timeInterval;
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
    this.status = StatusInterval.DONE;
    this.prevTime = null;
    this._callback_ = dummyCallback;
    this.timeInterval = null;
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
  /** execution is processing */
  EXECUTING: 4,
};

/**
 * Timeout item class
 */
class Timeout {
  /**
   * Constructor
   * @param {callback} callback - Function to execute.
   * @param {number} timeOut - timestamp to check for execution.
   * @param {boolean} isPaused - is intervaq paused on setInterval call.
   */
  constructor(callback, timeOut, isPaused) {
    /**
     * null (initial) or timestamp of its prev execution iteration.
     * @type {(null|number)}
     */
    this.prevTime = getTimestamp();
    /**
     * `callback` function to execute.
     * @type {function}
     */
    this._callback_ = callback;
    /**
     * Int time in Ms of its timeout execution.
     * @type {number}
     */
    this.timeOut = timeOut;

    /**
     * timestamp of next execution iteration.
     * @type {number}
     */
    this.executeAtTime = this.prevTime + timeOut;

    /**
     * Status value.
     * @type { StatusTimeout }
     */
    this.status = StatusTimeout.IN_PROCESS;
    /**
     * null or timestamp when current interval is paused.
     * @type {(null|number)}
     */
    this.pausedAtTime = null;

    if (isPaused) {
      this.pauseExecuting(this.prevTime);
    }
  }

  /**
   * Check its Timeout for execution.
   * @param {number} timeToCheck - timestamp to check for the execution.
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
    this.status = StatusTimeout.EXECUTING;
    this._callback_.call();
    this.status = StatusTimeout.DONE;
    return true;
  }

  /**
   * Set execution on pause.
   * @param {number} pausedAtTime - timestamp to set its `pausedAtTime`.
   */
  pauseExecuting(pausedAtTime) {
    this.status = StatusTimeout.PAUSED;
    this.pausedAtTime = pausedAtTime;
  }

  /**
   * Continue to execute after pause.
   * @param {number} continueAtTime - timestamp to calculate its downtime.
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
    this.prevTime = getTimestamp();
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
    this.status = StatusTimeout.DONE;
    this.prevTime = null;
    this._callback_ = dummyCallback;
    this.timeOut = null;
    this.executeAtTime = null;
    this.pausedAtTime = null;
  }
}

export {Intervaq, Interval, Timeout, getTimestamp};
