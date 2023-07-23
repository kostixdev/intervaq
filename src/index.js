/**
 * Returns Int datetime.
 * @returns {number} - int datetime
 */
function getCurrentTime() {
  return (performance || Date).now();
}

const STATUS_INTERVAQ_PAUSED = 0;
const STATUS_INTERVAQ_IN_PROCESS = 1;

/**
 * @module Intervaq
 * @example
 * const intervaq = new Intervaq();
 */



/**
 * Main Intervaq class
 */
class Intervaq {
  /**
   * Array of Intervals
   */
  intervals = [];
  /**
   * Array of Timeouts
   */
  timeouts = [];
  /**
   * Status value
   */
  status = STATUS_INTERVAQ_IN_PROCESS;
  /**
   * null or datetime when Intervaq is paused
   */
  pausedAt = null;
  /**
   * Constructor (empty)
   */
  constructor() {
  }



  /**
   * setInterval functionality.
   *
   * @param .....
   */
  setInterval(fnToExecute, timeInterval) {
    const interval = new Interval(fnToExecute, timeInterval);
    this.intervals.push(interval);
    return interval;
  }

  clearInterval(interval) {
    const index = this.intervals.indexOf(interval);
    if (index !== -1) {
      interval.destroy();
      this.intervals.splice(index, 1);
      return true;
    }
    return false;
  }

  setTimeout(fnToExecute, timeOut) {
    const timeout = new Timeout(fnToExecute, timeOut);
    this.timeouts.push(timeout);
    return timeout;
  }

  clearTimeout(timeout) {
    const index = this.timeouts.indexOf(timeout);
    if (index !== -1) {
      timeout.destroy();
      this.timeouts.splice(index, 1);
      return true;
    }
    return false;
  }

  checkToExecute() {
    if (this.status !== STATUS_INTERVAQ_IN_PROCESS) {
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

  pauseProcessing() {
    this.status = STATUS_INTERVAQ_PAUSED;
    this.pausedAt = getCurrentTime();
    // - intervals pause
    this.intervals.forEach( interval => interval.pauseExecuting(this.pausedAt) );
    // - timeouts pause
    this.timeouts.forEach( timeout => timeout.pauseExecuting(this.pausedAt) );
  }

  continueProcessing() {
    this.status = STATUS_INTERVAQ_IN_PROCESS;
    this.pausedAt = null;
    const runAt = getCurrentTime();
    // - intervals run
    this.intervals.forEach( interval => interval.continueExecuting(runAt) );
    // - timeouts run
    this.timeouts.forEach( timeout => timeout.continueExecuting(runAt) );
  }
}



const STATUS_INTERVAL_PAUSED = 0;
const STATUS_INTERVAL_IN_PROCESS = 1;
const STATUS_INTERVAL_DISABLED = 3;

/**
 * Interval item class
 */
class Interval {
  prevTime = null;
  callback = () => null;
  timeInterval = null;

  executeAtTime = null;

  status = STATUS_INTERVAL_IN_PROCESS;
  pausedAtTime = null;

  constructor(callback, timeInterval) {
    this.prevTime = getCurrentTime();
    this.callback = callback;
    this.timeInterval = timeInterval;
    this.executeAtTime = this.prevTime + timeInterval;
  }

  checkTimeToExecute(timeToCheck) {
    if (this.status !== STATUS_INTERVAL_IN_PROCESS) {
      return;
    }
    if (timeToCheck >= this.executeAtTime) {
      this.execute();
      this.prevTime = timeToCheck;
      this.executeAtTime = timeToCheck + this.timeInterval;
    }
  }

  execute() {
    this.callback.call();
  }

  pauseExecuting(pausedAtTime) {
    this.status = STATUS_INTERVAL_PAUSED;
    this.pausedAtTime = pausedAtTime;
  }

  continueExecuting(continueAtTime) {
    this.executeAtTime += continueAtTime - this.pausedAtTime;
    this.pausedAtTime = null;
    this.status = STATUS_INTERVAL_IN_PROCESS;
  }

  disable() {
    this.status = STATUS_INTERVAL_DISABLED;
    return this;
  }

  enable() {
    this.prevTime = getCurrentTime();
    this.executeAtTime = this.prevTime + this.timeOut;
    this.status = STATUS_INTERVAL_IN_PROCESS;
    return this;
  }

  restart() {
    this.disable();
    this.enable();
    return this;
  }

  destroy() {
    this.prevTime = null;
    this.callback = () => null;
    this.timeInterval = null;
    this.status = null;
    this.pausedAtTime = null;
  }
}



const STATUS_TIMEOUT_PAUSED = 0;
const STATUS_TIMEOUT_IN_PROCESS = 1;
const STATUS_TIMEOUT_DONE = 2;
const STATUS_TIMEOUT_DISABLED = 3;

/**
 * Timeout item class
 */
class Timeout {
  prevTime = null;
  callback = () => null;
  timeOut = null;

  executeAtTime = null;

  status = STATUS_TIMEOUT_IN_PROCESS;
  pausedAtTime = null;

  constructor(callback, timeOut) {
    this.prevTime = getCurrentTime();
    this.callback = callback;
    this.timeOut = timeOut;
    this.executeAtTime = this.prevTime + this.timeOut;
  }

  checkTimeToExecute(timeToCheck) {
    if (
      timeToCheck >= this.executeAtTime &&
      this.status === STATUS_TIMEOUT_IN_PROCESS
    ) {
      return this.execute();
    }
    return false;
  }

  execute() {
    this.callback.call();
    this.status = STATUS_TIMEOUT_DONE;
    return true;
  }

  pauseExecuting(pausedAtTime) {
    this.status = STATUS_TIMEOUT_PAUSED;
    this.pausedAtTime = pausedAtTime;
  }

  continueExecuting(continueAtTime) {
    this.executeAtTime += continueAtTime - this.pausedAtTime;
    this.pausedAtTime = null;
    this.status = STATUS_TIMEOUT_IN_PROCESS;
  }

  disable() {
    this.status = STATUS_TIMEOUT_DISABLED;
    return this;
  }

  enable() {
    this.prevTime = getCurrentTime();
    this.executeAtTime = this.prevTime + this.timeOut;
    this.status = STATUS_TIMEOUT_IN_PROCESS;
    return this;
  }

  restart() {
    this.disable();
    this.enable();
    return this;
  }

  destroy() {
    this.prevTime = null;
    this.callback = () => null;
    this.timeOut = null;
    this.executeAtTime = null;
    this.status = null;
    this.pausedAtTime = null;
  }
}



export { Intervaq, Interval, Timeout };
