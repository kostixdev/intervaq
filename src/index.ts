/**
 * Returns timestamp.
 * @return {number} - timestamp
 */
const getTimestamp = (): Timestamp => {
  return (performance || Date).now();
};

/**
 * Dummy callback to avoid calls on destruct.
 * @return {null} - null
 */
const dummyCallback = () => null;

type Callback = Function;
type Timestamp = number;

/**
 * @module Intervaq
 * @example
 * const intervaq = new Intervaq();
 */

/**
 * Status of Intervaq
 * @enum {number}
 */
enum StatusIntervaq {
  /** paused */
  PAUSED = 0,
  /** in process */
  IN_PROCESS = 1,
}

/**
 * Main Intervaq class
 */
class Intervaq {
  /**
   * Array of Intervals
   * @type {Interval[]}
   */
  intervals: Interval[] = [];
  /**
   * Array of Timeouts
   * @type {Timeout[]}
   */
  timeouts: Timeout[] = [];
  /**
   * Status value
   * @type {StatusIntervaq}
   */
  status = StatusIntervaq.IN_PROCESS;
  /**
   * null or timestamp when Intervaq is paused
   * @type {(null|number)}
   */
  pausedAt: null | number = null;

  /**
   * Constructor
   */
  constructor() {
    // ...
  }

  /**
   * setInterval functionality.
   * @param {callback} fnToExecute - function to execute
   * @param {number} timeInterval - time of execution in Ms
   * @return {Interval} - object of Interval
   */
  setInterval(fnToExecute: Callback, timeInterval: number): Interval {
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
  clearInterval(interval: Interval): boolean {
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
  setTimeout(fnToExecute: Callback, timeOut: number): Timeout {
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
  clearTimeout(timeout: Timeout): boolean {
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
  checkToExecute(timestamp: Timestamp): void {
    if (this.status !== StatusIntervaq.IN_PROCESS) {
      return;
    }
    // - intervals execute
    this.intervals.forEach((interval: Interval) =>
      interval.checkTimeToExecute(timestamp)
    );
    // - timeouts execute
    this.timeouts.forEach((timeout: Timeout, index: number) => {
      if (timeout.checkTimeToExecute(timestamp)) {
        timeout.destroy();
        this.timeouts.splice(index, 1);
      }
    });
  }

  /**
   * Set intervals/timeouts paused to prevent its execution
   */
  pauseProcessing(): void {
    this.status = StatusIntervaq.PAUSED;
    this.pausedAt = getTimestamp();
    // - intervals pause
    this.intervals.forEach((interval: Interval) => {
      if (this.pausedAt) interval.pauseExecuting(this.pausedAt);
    });
    // - timeouts pause
    this.timeouts.forEach((timeout: Timeout) => {
      if (this.pausedAt) timeout.pauseExecuting(this.pausedAt);
    });
  }

  /**
   * Continue of intervals/timeouts to execute after paused
   */
  continueProcessing(): void {
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
enum StatusInterval {
  /** paused */
  PAUSED = 0,
  /** in process */
  IN_PROCESS = 1,
  /** disabled for execution */
  DISABLED = 2,
  /** execution is processing */
  EXECUTING = 3,
  /** execution done */
  DONE = 4,
}

/**
 * Interval item class
 */
class Interval {
  /**
   * timestamp of its prev execution iteration.
   * @type {number}
   */
  prevTime: null | number = getTimestamp();
  /**
   * `callback` function to execute.
   * @type {function}
   */
  _callback: Callback = dummyCallback;
  /**
   * Int time in Ms of its interval execution.
   * @type {number}
   */
  timeInterval: null | number = null;

  /**
   * timestamp of next execution iteration.
   * @type {number}
   */
  executeAtTime: null | Timestamp = null;

  /**
   * Status value.
   * @type { StatusInterval }
   */
  status: StatusInterval = StatusInterval.DISABLED;
  /**
   * null or timestamp when current interval is paused.
   * @type {(null|number)}
   */
  pausedAtTime: null | Timestamp = null;

  /**
   * Constructor.
   * @param {callback} callback - function to execute
   * @param {number} timeInterval - time of execution in Ms
   * @param {boolean} isPaused - is intervaq paused on setInterval call
   */
  constructor(callback: Callback, timeInterval: number, isPaused: boolean) {
    /**
     * timestamp of its prev execution iteration.
     * @type {number}
     */
    this.prevTime = getTimestamp();
    /**
     * `callback` function to execute.
     * @type {Callback}
     */
    this._callback = callback;
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
  checkTimeToExecute(timeToCheck: Timestamp): void {
    if (this.status !== StatusInterval.IN_PROCESS) {
      return;
    }
    if (
      this.timeInterval &&
      this.executeAtTime &&
      timeToCheck >= this.executeAtTime
    ) {
      this.execute();
      this.prevTime = timeToCheck;
      this.executeAtTime = timeToCheck + this.timeInterval;
    }
  }

  /**
   * Execute the `callback` function.
   */
  execute(): void {
    this.status = StatusInterval.EXECUTING;
    this._callback();
    this.status = StatusInterval.IN_PROCESS;
  }

  /**
   * Set execution on pause.
   * @param {number} pausedAtTime - timestamp to set its `pausedAtTime`.
   */
  pauseExecuting(pausedAtTime: Timestamp): void {
    this.status = StatusInterval.PAUSED;
    this.pausedAtTime = pausedAtTime;
  }

  /**
   * Continue to execute after pause.
   * @param {number} continueAtTime - timestamp to calculate its downtime.
   */
  continueExecuting(continueAtTime: Timestamp): void {
    if (this.executeAtTime && this.pausedAtTime) {
      this.executeAtTime += continueAtTime - this.pausedAtTime;
      this.pausedAtTime = null;
      this.status = StatusInterval.IN_PROCESS;
    }
  }

  /**
   * Disable execution.
   * @return {Interval} this.
   */
  disable(): Interval {
    this.status = StatusInterval.DISABLED;
    return this;
  }

  /**
   * Enable execution.
   * @return {Interval} this.
   */
  enable(): Interval {
    if (this.executeAtTime && this.timeInterval) {
      this.prevTime = getTimestamp();
      this.executeAtTime = this.prevTime + this.timeInterval;
      this.status = StatusInterval.IN_PROCESS;
    }
    return this;
  }

  /**
   * Restart execution.
   * @return {Interval} this.
   */
  restart(): Interval {
    return this.disable().enable();
  }

  /**
   * Desctuctor functionality.
   */
  destroy(): void {
    this.status = StatusInterval.DONE;
    this.prevTime = null;
    this._callback = dummyCallback;
    this.timeInterval = null;
    this.pausedAtTime = null;
  }
}

/**
 * Status of Timeout
 * @enum {number}
 */
enum StatusTimeout {
  /** paused */
  PAUSED = 0,
  /** in process */
  IN_PROCESS = 1,
  /** execution done */
  DONE = 2,
  /** disabled for execution */
  DISABLED = 3,
  /** execution is processing */
  EXECUTING = 4,
}

/**
 * Timeout item class
 */
class Timeout {
  /**
   * null (initial) or timestamp of its prev execution iteration.
   * @type {(null|number)}
   */
  prevTime: null | Timestamp = null;
  /**
   * `callback` function to execute.
   * @type {Callback}
   */
  _callback: Callback = dummyCallback;
  /**
   * Int time in Ms of its timeout execution.
   * @type {null|number}
   */
  timeOut: null | number = null;

  /**
   * timestamp of next execution iteration.
   * @type {null|number}
   */
  executeAtTime: null | Timestamp = null;

  /**
   * Status value.
   * @type { StatusTimeout }
   */
  status: StatusTimeout = StatusTimeout.DISABLED;
  /**
   * null or timestamp when current interval is paused.
   * @type {(null|number)}
   */
  pausedAtTime: null | Timestamp = null;

  /**
   * Constructor
   * @param {callback} callback - Function to execute.
   * @param {number} timeOut - timestamp to check for execution.
   * @param {boolean} isPaused - is intervaq paused on setInterval call.
   */
  constructor(callback: Callback, timeOut: number, isPaused: boolean) {
    this.prevTime = getTimestamp();

    this._callback = callback;

    this.timeOut = timeOut;

    this.executeAtTime = this.prevTime + timeOut;

    this.pausedAtTime = null;

    if (isPaused) {
      this.pauseExecuting(this.prevTime);
    }

    this.status = StatusTimeout.IN_PROCESS;
  }

  /**
   * Check its Timeout for execution.
   * @param {number} timeToCheck - timestamp to check for the execution.
   * @return {boolean} done state.
   */
  checkTimeToExecute(timeToCheck: Timestamp): boolean {
    if (
      this.executeAtTime &&
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
  execute(): boolean {
    this.status = StatusTimeout.EXECUTING;
    this._callback();
    this.status = StatusTimeout.DONE;
    return true;
  }

  /**
   * Set execution on pause.
   * @param {number} pausedAtTime - timestamp to set its `pausedAtTime`.
   */
  pauseExecuting(pausedAtTime: Timestamp): void {
    this.status = StatusTimeout.PAUSED;
    this.pausedAtTime = pausedAtTime;
  }

  /**
   * Continue to execute after pause.
   * @param {number} continueAtTime - timestamp to calculate its downtime.
   */
  continueExecuting(continueAtTime: Timestamp): void {
    if (this.executeAtTime && this.pausedAtTime) {
      this.executeAtTime += continueAtTime - this.pausedAtTime;
      this.pausedAtTime = null;
      this.status = StatusTimeout.IN_PROCESS;
    }
  }

  /**
   * Disable execution.
   * @return {Timeout} this.
   */
  disable(): Timeout {
    this.status = StatusTimeout.DISABLED;
    return this;
  }

  /**
   * Enable execution.
   * @return {Timeout} this.
   */
  enable(): Timeout {
    if (this.executeAtTime && this.timeOut) {
      this.prevTime = getTimestamp();
      this.executeAtTime = this.prevTime + this.timeOut;
      this.status = StatusTimeout.IN_PROCESS;
    }
    return this;
  }

  /**
   * Restart execution.
   * @return {Timeout} this.
   */
  restart(): Timeout {
    return this.disable().enable();
  }

  /**
   * Desctuctor functionality.
   */
  destroy(): void {
    this.status = StatusTimeout.DONE;
    this.prevTime = null;
    this._callback = dummyCallback;
    this.timeOut = null;
    this.executeAtTime = null;
    this.pausedAtTime = null;
  }
}

export {
  Intervaq,
  StatusIntervaq,
  Interval,
  StatusInterval,
  Timeout,
  StatusTimeout,
  getTimestamp,
  dummyCallback,
  Callback,
  Timestamp,
};
