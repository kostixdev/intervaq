/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import {
  Intervaq,
  getTimestamp,
  Timestamp,
  Callback,
  Interval,
  Timeout,
} from '../src';

type ResultInterval = {
  timeStart: Timestamp;
  timeExecution: Timestamp;
  intervalCount: number;
};
// type ResultIntervalCallback = (
//   error: Error,
//   data: ResultInterval
// ) => void;

type ResultTimeout = {
  timeStart: Timestamp;
  timeEnd: Timestamp;
};
// type ResultTimeoutCallback = (
//   error: Error,
//   data: ResultTimeout
// ) => void;

/**
 * Allowable timestamp inaccuracy in Ms, that can took place
 * more at https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp
 * Need for some cases where this kind of floating bug taking place.
 * For example:
 * expect(received).toBeLessThanOrEqual(expected)
 *     Expected: <= 516.6666666666666
 *     Received:    516.7950600385666
 * */
const timestampInaccuracy = 2; // of DOMHighResTimeStamp

/**
 * Max possible value of timestamp missmatch, where action can be executed
 * right after specified time.
 * For example:
 *     action for 1100Ms was executed in 1114.61428296566Ms
 */
const timestampMissmatch = 1000 / 60; // of 60fps

/**
 * Difference between two timestamps.
 * @param {number} t0 - 1st timestamp.
 * @param {number} t1 - 2nd timestamp.
 * @return {number} - difference value.
 */
const timestampDiff = (t0: Timestamp, t1: Timestamp): number => {
  return Math.abs(t0 - t1);
};

const intervaq = new Intervaq();

/**
 * To deal with `requestAnimationFrame`
 * @param {number} timestamp - timestamp indicator
 */
const animateAction = (timestamp?: Timestamp): void => {
  if (timestamp && intervaq !== undefined) {
    intervaq.checkToExecute(timestamp);
  }
  requestAnimationFrame(animateAction);
};

/** timeouts or intervals actions list for test cases */
// const timeCase: {[key: string]: Interval | Timeout} = {};
const intervalCase: {[key: string]: Interval} = {};
const timeoutCase: {[key: string]: Timeout} = {};

/**
 * @typedef {Object} timeoutTimeCaseCallbackData
 * @property {number} data.timeStart - timestamp added
 * @property {number} data.timeEnd - timestamp executed
 */

/**
 * Timeout callback function.
 * @callback timeoutTimeCaseCallback
 * @param {null|Error} error - null
 * @param {timeoutTimeCaseCallbackData} data - callbacks timing data
 */

/**
 * Basic setTimeout case for testing purposes via `intervaq`.
 * @param {string} caseName - namekey of timeCase.
 * @param {timeoutTimeCaseCallback} callback - function to be executed.
 * @param {number} timeOut - timeOut value.
 */
const setTimeoutTimeCase = (
  caseName: string,
  callback: Callback,
  timeOut: number
) => {
  const timeStart = getTimestamp();
  timeoutCase[caseName] = intervaq.setTimeout(() => {
    const timeEnd = getTimestamp();
    return callback(null, {
      timeStart,
      timeEnd,
    });
  }, timeOut);
};

/** @todo: can be bugs on parallel testing */
/** counters for intervals */
const intervalCount: {[key: string]: number} = {};

/**
 * @typedef {Object} intervalTimeCaseCallbackData
 * @property {number} data.timeStart - interval start timestamp.
 * @property {number} data.timeExecution - iteration execution timestamp.
 * @property {number} data.intervalCount - iteration execution count.
 */

/**
 * Interval callback function.
 * @callback intervalTimeCaseCallback
 * @param {null|Error} error - null
 * @param {intervalTimeCaseCallbackData} data - callbacks timing data
 */

/**
 * Basic setInterval case for testing purposes via `intervaq`.
 * @param {string} caseName - namekey of timeCase.
 * @param {intervalTimeCaseCallback} callback - function to be executed.
 * @param {number} timeInterval - timeInterval value.
 */
const setIntervalTimeCase = (
  caseName: string,
  callback: Callback,
  timeInterval: number
) => {
  const timeStart = getTimestamp();
  intervalCount[caseName] = 0;
  intervalCase[caseName] = intervaq.setInterval(() => {
    const timeExecution = getTimestamp();
    intervalCount[caseName]++;
    return callback(null, {
      timeStart,
      timeExecution,
      intervalCount: intervalCount[caseName],
    });
  }, timeInterval);
};

/**
 * @typedef {Object} IntervalTimesToTest
 * @property {number} data.timeExecutionDiff - diff between interval start
 * and latest iteration execution call.
 * @property {number} data.timeExecutionDiffToCheck - sum of times to check.
 * @property {number} data.timeDiff - diff of expected and executed.
 * @property {number} data.timeDiffToCheck - diff with missmatch and inaccuracy.
 */

/**
 * Calculate some basic data for jest `expect` purposes.
 * @param {number} timeStart - of interval added.
 * @param {number} timeExecution - of interval iteration execution call.
 * @param {number[]} times - list of times to calc.
 * @return {IntervalTimesToTest} calculated data.
 */
const calcBasicIntervalTimesValues = (
  timeStart: Timestamp,
  timeExecution: Timestamp,
  times: number[] = []
) => {
  const timeExecutionDiff = timeExecution - timeStart;
  const timeExecutionDiffToCheck = times.reduce((sum, value) => sum + value, 0);
  const timeExpectedDiff = times.reduce(
    (sum, value) => sum + value + timestampMissmatch,
    0
  );
  const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
  const timeDiffToCheck =
    (timestampMissmatch + timestampInaccuracy) * times.length;
  return {
    timeExecutionDiff,
    timeExecutionDiffToCheck,
    timeDiff,
    timeDiffToCheck,
  };
};

beforeAll(done => {
  animateAction();
  done();
});

describe('basic setTimeout functionality', () => {
  test('setTimeout for 1000Ms', done => {
    const callback = (error: Error, data: ResultTimeout) => {
      if (error) {
        done(error);
        return;
      }
      try {
        const timeExecutionDiff = data.timeEnd - data.timeStart;
        const timeExpectedDiff = 1000 + timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(1000);
        expect(timeDiff).toBeLessThanOrEqual(
          timestampMissmatch + timestampInaccuracy
        );

        done();
      } catch (error) {
        done(error);
      }
    };
    setTimeoutTimeCase('setTimeout1000Ms', callback, 1000);
  });

  test('setTimeout for 100Ms', done => {
    const callback = (error: Error, data: ResultTimeout) => {
      if (error) {
        done(error);
        return;
      }
      try {
        const timeExecutionDiff = data.timeEnd - data.timeStart;
        const timeExpectedDiff = 100 + timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(100);
        expect(timeDiff).toBeLessThanOrEqual(
          timestampMissmatch + timestampInaccuracy
        );

        done();
      } catch (error) {
        done(error);
      }
    };
    setTimeoutTimeCase('setTimeout100Ms', callback, 100);
  });

  test('setTimeout for 10Ms', done => {
    const callback = (error: Error, data: ResultTimeout) => {
      if (error) {
        done(error);
        return;
      }
      try {
        const timeExecutionDiff = data.timeEnd - data.timeStart;
        const timeExpectedDiff = 10 + timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(10);
        expect(timeDiff).toBeLessThanOrEqual(
          timestampMissmatch + timestampInaccuracy
        );

        done();
      } catch (error) {
        done(error);
      }
    };
    setTimeoutTimeCase('setTimeout10Ms', callback, 10);
  });

  test('clearTimeout for 1000Ms in 150ms', done => {
    const callback1000 = (error: Error, data: ResultTimeout) => {
      if (error) {
        done(error);
        return;
      }
      try {
        const timeExecutionDiff = data.timeEnd - data.timeStart;
        done(`timeout 1000Ms finished in ${timeExecutionDiff}Ms error`);
      } catch (error) {
        done(error);
      }
    };
    const callback150 = (error: Error, data: ResultTimeout) => {
      if (error) {
        done(error);
        return;
      }
      try {
        const timeExecutionDiff = data.timeEnd - data.timeStart;
        const timeExpectedDiff = 150 + timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(150);
        expect(timeDiff).toBeLessThanOrEqual(
          timestampMissmatch + timestampInaccuracy
        );

        const clearedTrue = intervaq.clearTimeout(
          timeoutCase.clearTimeout1000Ms
        );
        expect(clearedTrue).toBe(true);
        const clearedFalse = intervaq.clearTimeout(
          timeoutCase.clearTimeout1000Ms
        );
        expect(clearedFalse).toBe(false);
        const index = intervaq.timeouts.indexOf(timeoutCase.clearTimeout1000Ms);
        expect(index).toBe(-1);

        done();
      } catch (error) {
        done(error);
      }
    };
    setTimeoutTimeCase('clearTimeout1000Ms', callback1000, 1000);
    setTimeoutTimeCase('clearTimeout150Ms', callback150, 150);
  });

  test('setTimeout for 100Ms disabled for 50ms after 70ms', done => {
    const callback100 = (error: Error, data: ResultTimeout) => {
      if (error) {
        done(error);
        return;
      }
      try {
        const timeExecutionDiff = data.timeEnd - data.timeStart;
        const timeExpectedDiff =
          70 +
          timestampMissmatch +
          50 +
          timestampMissmatch +
          100 +
          timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(70 + 50 + 100);
        expect(timeDiff).toBeLessThanOrEqual(
          timestampMissmatch +
            timestampInaccuracy +
            timestampMissmatch +
            timestampInaccuracy +
            timestampMissmatch +
            timestampInaccuracy
        );
        done();
      } catch (error) {
        done(error);
      }
    };
    const callback70 = (error: Error, data: ResultTimeout) => {
      if (error) {
        done(error);
        return;
      }
      try {
        const timeExecutionDiff = data.timeEnd - data.timeStart;
        const timeExpectedDiff = 70 + timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(70);
        expect(timeDiff).toBeLessThanOrEqual(
          timestampMissmatch + timestampInaccuracy
        );

        timeoutCase.setTimeout100MsToDisableEnable.disable();
        setTimeoutTimeCase('setTimeout50MsForEnable', callback50, 50);
        // done();
      } catch (error) {
        done(error);
      }
    };
    const callback50 = (error: Error, data: ResultTimeout) => {
      if (error) {
        done(error);
        return;
      }
      try {
        const timeExecutionDiff = data.timeEnd - data.timeStart;
        const timeExpectedDiff = 50 + timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(50);
        expect(timeDiff).toBeLessThanOrEqual(
          timestampMissmatch + timestampInaccuracy
        );

        timeoutCase.setTimeout100MsToDisableEnable.enable();
        // done();
      } catch (error) {
        done(error);
      }
    };
    setTimeoutTimeCase('setTimeout100MsToDisableEnable', callback100, 100);
    setTimeoutTimeCase('setTimeout70MsForDisable', callback70, 70);
  });

  test('setTimeout for 200Ms and restart after 500ms', done => {
    const callback200 = (error: Error, data: ResultTimeout) => {
      if (error) {
        done(error);
        return;
      }
      try {
        const timeExecutionDiff = data.timeEnd - data.timeStart;
        const timeExpectedDiff =
          100 + timestampMissmatch + 200 + timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(100 + 200);
        expect(timeDiff).toBeLessThanOrEqual(
          timestampMissmatch +
            timestampInaccuracy +
            timestampMissmatch +
            timestampInaccuracy
        );

        done();
      } catch (error) {
        done(error);
      }
    };
    const callback100 = (error: Error, data: ResultTimeout) => {
      if (error) {
        done(error);
        return;
      }
      try {
        const timeExecutionDiff = data.timeEnd - data.timeStart;
        const timeExpectedDiff = 100 + timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(100);
        expect(timeDiff).toBeLessThanOrEqual(
          timestampMissmatch + timestampInaccuracy
        );

        timeoutCase.setTimeout200MsToRestart.restart();
        // done();
      } catch (error) {
        done(error);
      }
    };
    setTimeoutTimeCase('setTimeout200MsToRestart', callback200, 200);
    setTimeoutTimeCase('setTimeout100MsForRestart', callback100, 100);
  });

  test('clearTimeout for setTimeout 100Ms return false', done => {
    const callback100 = (error: Error, data: ResultTimeout) => {
      if (error) {
        done(error);
        return;
      }
      try {
        const timeExecutionDiff = data.timeEnd - data.timeStart;
        const timeExpectedDiff = 100 + timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(100);
        expect(timeDiff).toBeLessThanOrEqual(
          timestampMissmatch + timestampInaccuracy
        );

        const clearedTrue = intervaq.clearTimeout(timeoutCase.setTimeout100Ms);
        expect(clearedTrue).toBe(true);
        const clearedFalse = intervaq.clearTimeout(timeoutCase.setTimeout100Ms);
        expect(clearedFalse).toBe(false);

        done();
      } catch (error) {
        done(error);
      }
    };
    setTimeoutTimeCase('setTimeout100Ms', callback100, 100);
  });
});

describe('basic setInterval functionality', () => {
  // - OK
  test('setInterval every 50ms for 5times', done => {
    let intervalCount = 0;
    const intervalTimes: number[] = [];
    const callback50 = (error: Error, data: ResultInterval) => {
      if (error) {
        done(error);
        return;
      }
      try {
        intervalCount = data.intervalCount;
        intervalTimes.push(50);
        const r = calcBasicIntervalTimesValues(
          data.timeStart,
          data.timeExecution,
          intervalTimes
        );
        expect(r.timeExecutionDiff).toBeGreaterThanOrEqual(
          r.timeExecutionDiffToCheck
        );
        expect(r.timeDiff).toBeLessThanOrEqual(r.timeDiffToCheck);

        if (intervalCount === 5) {
          const clearedTrue = intervaq.clearInterval(
            intervalCase.setInterval50Ms5
          );
          expect(clearedTrue).toBe(true);
          const clearedFalse = intervaq.clearInterval(
            intervalCase.setInterval50Ms5
          );
          expect(clearedFalse).toBe(false);

          done();
        } else if (intervalCount > 5) {
          done(`setInterval 50Ms 5times count #${intervalCount} > 5 error`);
        } else {
          // do nothing
        }
      } catch (error) {
        done(error);
      }
    };
    setIntervalTimeCase('setInterval50Ms5', callback50, 50);
  });

  // - OK
  test('setInterval every 50ms and clearInterval in 300ms', done => {
    let intervalCount = 0;
    const intervalTimes: number[] = [];
    const callback50 = (error: Error, data: ResultInterval) => {
      if (error) {
        done(error);
        return;
      }
      try {
        intervalCount = data.intervalCount;
        intervalTimes.push(50);
        const r = calcBasicIntervalTimesValues(
          data.timeStart,
          data.timeExecution,
          intervalTimes
        );
        expect(r.timeExecutionDiff).toBeGreaterThanOrEqual(
          r.timeExecutionDiffToCheck
        );
        expect(r.timeDiff).toBeLessThanOrEqual(r.timeDiffToCheck);

        expect(intervalCount).toBeLessThan(6);
      } catch (error) {
        done(error);
      }
    };
    const callback300 = (error: Error, data: ResultTimeout) => {
      if (error) {
        done(error);
        return;
      }
      try {
        intervaq.clearInterval(intervalCase.setInterval50Ms5ToClearIn300ms);
        const timeExecutionDiff = data.timeEnd - data.timeStart;
        const timeExpectedDiff = 300 + timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(300);
        expect(timeDiff).toBeLessThanOrEqual(
          timestampMissmatch + timestampInaccuracy
        );
      } catch (error) {
        done(error);
      }
    };
    const callback350 = (error: Error, data: ResultTimeout) => {
      if (error) {
        done(error);
        return;
      }
      try {
        const timeExecutionDiff = data.timeEnd - data.timeStart;
        const timeExpectedDiff = 350 + timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(350);
        expect(timeDiff).toBeLessThanOrEqual(
          timestampMissmatch + timestampInaccuracy
        );

        expect(intervalCount).toBe(5);

        done();
      } catch (error) {
        done(error);
      }
    };
    setIntervalTimeCase('setInterval50Ms5ToClearIn300ms', callback50, 50);
    setTimeoutTimeCase('setTimeout300ForClearInterval50Ms5', callback300, 300);
    setTimeoutTimeCase(
      'setTimeout350ForCheckClearInterval50Ms5',
      callback350,
      350
    );
  });

  // - OK
  test('setInterval every 200ms and clearInterval in 100ms', done => {
    let intervalCount = 0;
    const intervalTimes: number[] = [];
    const callback200 = (error: Error, data: ResultInterval) => {
      if (error) {
        done(error);
        return;
      }
      try {
        intervalCount = data.intervalCount;
        intervalTimes.push(200);
        const r = calcBasicIntervalTimesValues(
          data.timeStart,
          data.timeExecution,
          intervalTimes
        );
        expect(r.timeExecutionDiff).toBeGreaterThanOrEqual(
          r.timeExecutionDiffToCheck
        );
        expect(r.timeDiff).toBeLessThanOrEqual(r.timeDiffToCheck);
      } catch (error) {
        done(error);
      }
    };
    const callback100 = (error: Error, data: ResultTimeout) => {
      if (error) {
        done(error);
        return;
      }
      try {
        intervaq.clearInterval(intervalCase.setInterval200MsToClearIn100ms);
        const timeExecutionDiff = data.timeEnd - data.timeStart;
        const timeExpectedDiff = 100 + timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(100);
        expect(timeDiff).toBeLessThanOrEqual(
          timestampMissmatch + timestampInaccuracy
        );
      } catch (error) {
        done(error);
      }
    };
    const callback350 = (error: Error, data: ResultTimeout) => {
      if (error) {
        done(error);
        return;
      }
      try {
        const timeExecutionDiff = data.timeEnd - data.timeStart;
        const timeExpectedDiff = 350 + timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(350);
        expect(timeDiff).toBeLessThanOrEqual(
          timestampMissmatch + timestampInaccuracy
        );
        expect(intervalCount).toBe(0);
        done();
      } catch (error) {
        done(error);
      }
    };
    setIntervalTimeCase('setInterval200MsToClearIn100ms', callback200, 200);
    setTimeoutTimeCase('setTimeout100ForClearInterval200Ms', callback100, 100);
    setTimeoutTimeCase(
      'setTimeout350ForCheckClearInterval200Ms',
      callback350,
      350
    );
  });

  // - OK
  test('setInterval every 100Ms disabled for 200ms after 150ms', done => {
    let intervalCount = 0;
    const callback100 = (error: Error, data: ResultInterval) => {
      if (error) {
        done(error);
        return;
      }
      try {
        intervalCount = data.intervalCount;
        switch (intervalCount) {
          case 1: {
            const r = calcBasicIntervalTimesValues(
              data.timeStart,
              data.timeExecution,
              [100]
            );
            expect(r.timeExecutionDiff).toBeGreaterThanOrEqual(
              r.timeExecutionDiffToCheck
            );
            expect(r.timeDiff).toBeLessThanOrEqual(r.timeDiffToCheck);
            break;
          }
          case 2: {
            const r = calcBasicIntervalTimesValues(
              data.timeStart,
              data.timeExecution,
              [100, 50, 200, 100]
            );
            expect(r.timeExecutionDiff).toBeGreaterThanOrEqual(
              r.timeExecutionDiffToCheck
            );
            expect(r.timeDiff).toBeLessThanOrEqual(r.timeDiffToCheck);
            break;
          }
        }
        expect(intervalCount).toBeLessThan(3);
      } catch (error) {
        done(error);
      }
    };
    const callback150 = (error: Error, data: ResultTimeout) => {
      if (error) {
        done(error);
        return;
      }
      try {
        intervalCase.setInterval100MsToDisableEnable.disable();
        const timeExecutionDiff = data.timeEnd - data.timeStart;
        const timeExpectedDiff = 150 + timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(150);
        expect(timeDiff).toBeLessThanOrEqual(
          timestampMissmatch + timestampInaccuracy
        );
        expect(intervalCount).toBe(1);
        // next action to enable
        setTimeoutTimeCase(
          'setTimeout200MsForEnableSetInterval100Ms',
          callback200,
          200
        );
        // done();
      } catch (error) {
        done(error);
      }
    };
    const callback200 = (error: Error, data: ResultTimeout) => {
      if (error) {
        done(error);
        return;
      }
      try {
        intervalCase.setInterval100MsToDisableEnable.enable();
        const timeExecutionDiff = data.timeEnd - data.timeStart;
        const timeExpectedDiff = 200 + timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(200);
        expect(timeDiff).toBeLessThanOrEqual(
          timestampMissmatch + timestampInaccuracy
        );
        expect(intervalCount).toBe(1);
        // done();
      } catch (error) {
        done(error);
      }
    };
    const callback500 = (error: Error, data: ResultTimeout) => {
      if (error) {
        done(error);
        return;
      }
      try {
        intervaq.clearInterval(intervalCase.setInterval100MsToDisableEnable);
        const timeExecutionDiff = data.timeEnd - data.timeStart;
        const timeExpectedDiff = 500 + timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(500);
        expect(timeDiff).toBeLessThanOrEqual(
          timestampMissmatch + timestampInaccuracy
        );
        expect(intervalCount).toBe(2);
        done();
      } catch (error) {
        done(error);
      }
    };
    setIntervalTimeCase('setInterval100MsToDisableEnable', callback100, 100);
    setTimeoutTimeCase(
      'setTimeout150MsForDisableSetInterval100Ms',
      callback150,
      150
    );
    setTimeoutTimeCase(
      'setTimeout500MsForClearSetInterval100Ms',
      callback500,
      500
    );
  });

  // - OK
  test('setInterval every 100Ms for 3times to restart after 150ms', done => {
    let intervalCount = 0;
    const callback100 = (error: Error, data: ResultInterval) => {
      if (error) {
        done(error);
        return;
      }
      try {
        intervalCount = data.intervalCount;
        switch (intervalCount) {
          case 1: {
            const r = calcBasicIntervalTimesValues(
              data.timeStart,
              data.timeExecution,
              [100]
            );
            expect(r.timeExecutionDiff).toBeGreaterThanOrEqual(
              r.timeExecutionDiffToCheck
            );
            expect(r.timeDiff).toBeLessThanOrEqual(r.timeDiffToCheck);
            break;
          }
          case 2: {
            const r = calcBasicIntervalTimesValues(
              data.timeStart,
              data.timeExecution,
              [100, 50, 100]
            );
            expect(r.timeExecutionDiff).toBeGreaterThanOrEqual(
              r.timeExecutionDiffToCheck
            );
            expect(r.timeDiff).toBeLessThanOrEqual(r.timeDiffToCheck);
            break;
          }
          case 3: {
            const r = calcBasicIntervalTimesValues(
              data.timeStart,
              data.timeExecution,
              [100, 50, 100, 100]
            );
            expect(r.timeExecutionDiff).toBeGreaterThanOrEqual(
              r.timeExecutionDiffToCheck
            );
            expect(r.timeDiff).toBeLessThanOrEqual(r.timeDiffToCheck);
            // is last iteration
            const clearedTrue = intervaq.clearInterval(
              intervalCase.setInterval100MsToRestart
            );
            expect(clearedTrue).toBe(true);
            const clearedFalse = intervaq.clearInterval(
              intervalCase.setInterval100MsToRestart
            );
            expect(clearedFalse).toBe(false);

            done();
            break;
          }
        }
      } catch (error) {
        done(error);
      }
    };
    const callback150 = (error: Error, data: ResultTimeout) => {
      if (error) {
        done(error);
        return;
      }
      try {
        const timeExecutionDiff = data.timeEnd - data.timeStart;
        const timeExpectedDiff = 150 + timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(150);
        expect(timeDiff).toBeLessThanOrEqual(
          timestampMissmatch + timestampInaccuracy
        );

        intervalCase.setInterval100MsToRestart.restart();
        // done();
      } catch (error) {
        done(error);
      }
    };
    setIntervalTimeCase('setInterval100MsToRestart', callback100, 100);
    setTimeoutTimeCase('setTimeout150MsForRestart', callback150, 150);
  });

  // - OK
  test('clearInterval for setInterval 100Ms return false', done => {
    let intervalCount = 0;
    const callback100 = (error: Error, data: ResultInterval) => {
      if (error) {
        done(error);
        return;
      }
      try {
        intervalCount = data.intervalCount;
        if (intervalCount > 1) {
          done(`setInterval every 100ms iteration #${intervalCount} error`);
          // return;
        }
        const r = calcBasicIntervalTimesValues(
          data.timeStart,
          data.timeExecution,
          [100]
        );
        expect(r.timeExecutionDiff).toBeGreaterThanOrEqual(
          r.timeExecutionDiffToCheck
        );
        expect(r.timeDiff).toBeLessThanOrEqual(r.timeDiffToCheck);

        const clearedTrue = intervaq.clearInterval(
          intervalCase.setInterval100Ms
        );
        expect(clearedTrue).toBe(true);
        const clearedFalse = intervaq.clearInterval(
          intervalCase.setInterval100Ms
        );
        expect(clearedFalse).toBe(false);

        done();
      } catch (error) {
        done(error);
      }
    };
    setIntervalTimeCase('setInterval100Ms', callback100, 100);
  });
});

describe('global intervaq functionality', () => {
  // - OK
  test('set timeouts 100Ms/150ms/200ms pause on 50Ms for 100ms', done => {
    const callback100 = (error: Error, data: ResultTimeout) => {
      if (error) {
        done(error);
        return;
      }
      try {
        const timeExecutionDiff = data.timeEnd - data.timeStart;
        const timeExpectedDiff =
          50 +
          timestampMissmatch +
          100 +
          timestampMissmatch +
          50 +
          timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(100 + 50);
        expect(timeDiff).toBeLessThanOrEqual(
          timestampMissmatch +
            timestampInaccuracy +
            timestampMissmatch +
            timestampInaccuracy +
            timestampMissmatch +
            timestampInaccuracy
        );
        // done();
      } catch (error) {
        done(error);
      }
    };
    const callback150 = (error: Error, data: ResultTimeout) => {
      if (error) {
        done(error);
        return;
      }
      try {
        const timeExecutionDiff = data.timeEnd - data.timeStart;
        const timeExpectedDiff =
          50 +
          timestampMissmatch +
          100 +
          timestampMissmatch +
          100 +
          timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(150 + 50);
        expect(timeDiff).toBeLessThanOrEqual(
          timestampMissmatch +
            timestampInaccuracy +
            timestampMissmatch +
            timestampInaccuracy +
            timestampMissmatch +
            timestampInaccuracy
        );
        // done();
      } catch (error) {
        done(error);
      }
    };
    const callback200 = (error: Error, data: ResultTimeout) => {
      if (error) {
        done(error);
        return;
      }
      try {
        const timeExecutionDiff = data.timeEnd - data.timeStart;
        const timeExpectedDiff =
          50 +
          timestampMissmatch +
          100 +
          timestampMissmatch +
          150 +
          timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(200 + 50);
        expect(timeDiff).toBeLessThanOrEqual(
          timestampMissmatch +
            timestampInaccuracy +
            timestampMissmatch +
            timestampInaccuracy +
            timestampMissmatch +
            timestampInaccuracy
        );
        // done();
      } catch (error) {
        done(error);
      }
    };
    setTimeoutTimeCase('setTimeout100Ms', callback100, 100);
    setTimeoutTimeCase('setTimeout150Ms', callback150, 150);
    setTimeoutTimeCase('setTimeout200Ms', callback200, 200);

    /** @todo: using another timing system as trigger from outside */
    setTimeout(() => {
      intervaq.pauseProcessing();
      setTimeout(() => {
        intervaq.continueProcessing();
        setTimeout(() => {
          /** @todo: gen and check results to done() */
          done();
        }, 300);
      }, 100);
    }, 50);
  });

  // - OK
  test('set intervals 100ms/150ms/200ms pause on 50Ms for 100ms', done => {
    let intervalCount100 = 0;
    let intervalCount150 = 0;
    let intervalCount200 = 0;
    const callback100 = (error: Error, data: ResultInterval) => {
      if (error) {
        done(error);
        return;
      }
      try {
        intervalCount100 = data.intervalCount;
        switch (intervalCount100) {
          case 1: {
            const r = calcBasicIntervalTimesValues(
              data.timeStart,
              data.timeExecution,
              [50, 100, 50]
            );
            expect(r.timeExecutionDiff).toBeGreaterThanOrEqual(
              r.timeExecutionDiffToCheck
            );
            expect(r.timeDiff).toBeLessThanOrEqual(r.timeDiffToCheck);
            break;
          }
          case 2: {
            const r = calcBasicIntervalTimesValues(
              data.timeStart,
              data.timeExecution,
              [50, 100, 50, 100]
            );
            expect(r.timeExecutionDiff).toBeGreaterThanOrEqual(
              r.timeExecutionDiffToCheck
            );
            expect(r.timeDiff).toBeLessThanOrEqual(r.timeDiffToCheck);
            break;
          }
          case 3: {
            const r = calcBasicIntervalTimesValues(
              data.timeStart,
              data.timeExecution,
              [50, 100, 50, 100, 100]
            );
            expect(r.timeExecutionDiff).toBeGreaterThanOrEqual(
              r.timeExecutionDiffToCheck
            );
            expect(r.timeDiff).toBeLessThanOrEqual(r.timeDiffToCheck);
            // is last iteration
            const clearedTrue = intervaq.clearInterval(
              intervalCase.setInterval100MsToPause
            );
            expect(clearedTrue).toBe(true);
            const clearedFalse = intervaq.clearInterval(
              intervalCase.setInterval100MsToPause
            );
            expect(clearedFalse).toBe(false);

            // done();
            break;
          }
          default: {
            done(`setInterval 100ms execution #${intervalCount100} error`);
            break;
          }
        }
      } catch (error) {
        done(error);
      }
    };
    const callback150 = (error: Error, data: ResultInterval) => {
      if (error) {
        done(error);
        return;
      }
      try {
        intervalCount150 = data.intervalCount;
        switch (intervalCount150) {
          case 1: {
            const r = calcBasicIntervalTimesValues(
              data.timeStart,
              data.timeExecution,
              [50, 100, 100]
            );
            expect(r.timeExecutionDiff).toBeGreaterThanOrEqual(
              r.timeExecutionDiffToCheck
            );
            expect(r.timeDiff).toBeLessThanOrEqual(r.timeDiffToCheck);
            break;
          }
          case 2: {
            const r = calcBasicIntervalTimesValues(
              data.timeStart,
              data.timeExecution,
              [50, 100, 100, 150]
            ); // 100Ms pause at 2nd
            expect(r.timeExecutionDiff).toBeGreaterThanOrEqual(
              r.timeExecutionDiffToCheck
            );
            expect(r.timeDiff).toBeLessThanOrEqual(r.timeDiffToCheck);
            break;
          }
          case 3: {
            const r = calcBasicIntervalTimesValues(
              data.timeStart,
              data.timeExecution,
              [50, 100, 100, 150, 150]
            ); // 100Ms pause at 2nd
            expect(r.timeExecutionDiff).toBeGreaterThanOrEqual(
              r.timeExecutionDiffToCheck
            );
            expect(r.timeDiff).toBeLessThanOrEqual(r.timeDiffToCheck);
            // is last iteration
            const clearedTrue = intervaq.clearInterval(
              intervalCase.setInterval150MsToPause
            );
            expect(clearedTrue).toBe(true);
            const clearedFalse = intervaq.clearInterval(
              intervalCase.setInterval150MsToPause
            );
            expect(clearedFalse).toBe(false);

            // done();
            break;
          }
          default: {
            done(`setInterval 150ms execution #${intervalCount150} error`);
            break;
          }
        }
      } catch (error) {
        done(error);
      }
    };
    const callback200 = (error: Error, data: ResultInterval) => {
      if (error) {
        done(error);
        return;
      }
      try {
        intervalCount200 = data.intervalCount;
        switch (intervalCount200) {
          case 1: {
            const r = calcBasicIntervalTimesValues(
              data.timeStart,
              data.timeExecution,
              [50, 100, 150]
            ); // 100ms pause at 2nd
            expect(r.timeExecutionDiff).toBeGreaterThanOrEqual(
              r.timeExecutionDiffToCheck
            );
            expect(r.timeDiff).toBeLessThanOrEqual(r.timeDiffToCheck);
            break;
          }
          case 2: {
            const r = calcBasicIntervalTimesValues(
              data.timeStart,
              data.timeExecution,
              [50, 100, 150, 200]
            ); // 100Ms pause at 2nd
            expect(r.timeExecutionDiff).toBeGreaterThanOrEqual(
              r.timeExecutionDiffToCheck
            );
            expect(r.timeDiff).toBeLessThanOrEqual(r.timeDiffToCheck);
            break;
          }
          case 3: {
            const r = calcBasicIntervalTimesValues(
              data.timeStart,
              data.timeExecution,
              [50, 100, 150, 200, 200]
            ); // 100Ms pause at 2nd
            expect(r.timeExecutionDiff).toBeGreaterThanOrEqual(
              r.timeExecutionDiffToCheck
            );
            expect(r.timeDiff).toBeLessThanOrEqual(r.timeDiffToCheck);
            // is last iteration
            const clearedTrue = intervaq.clearInterval(
              intervalCase.setInterval200MsToPause
            );
            expect(clearedTrue).toBe(true);
            const clearedFalse = intervaq.clearInterval(
              intervalCase.setInterval200MsToPause
            );
            expect(clearedFalse).toBe(false);

            done(); // because of latest one
            break;
          }
          default: {
            done(`setInterval 200ms execution #${intervalCount200} error`);
            break;
          }
        }
      } catch (error) {
        done(error);
      }
    };

    setIntervalTimeCase('setInterval100MsToPause', callback100, 100);
    setIntervalTimeCase('setInterval150MsToPause', callback150, 150);
    setIntervalTimeCase('setInterval200MsToPause', callback200, 200);

    /** @todo: using another timing system as trigger from outside */
    setTimeout(() => {
      intervaq.pauseProcessing();
      setTimeout(() => {
        intervaq.continueProcessing();
      }, 100);
    }, 50);
  });

  // - OK
  test('set both for 150Ms/200Ms pause on 100Ms for 100ms', done => {
    let intervalCount150 = 0;
    let intervalCount200 = 0;
    const callback150interval = (error: Error, data: ResultInterval) => {
      if (error) {
        done(error);
        return;
      }
      try {
        intervalCount150 = data.intervalCount;
        switch (intervalCount150) {
          case 1: {
            const r = calcBasicIntervalTimesValues(
              data.timeStart,
              data.timeExecution,
              [100, 100, 50]
            );
            expect(r.timeExecutionDiff).toBeGreaterThanOrEqual(
              r.timeExecutionDiffToCheck
            );
            expect(r.timeDiff).toBeLessThanOrEqual(r.timeDiffToCheck);
            break;
          }
          case 2: {
            const r = calcBasicIntervalTimesValues(
              data.timeStart,
              data.timeExecution,
              [100, 100, 50, 150]
            );
            expect(r.timeExecutionDiff).toBeGreaterThanOrEqual(
              r.timeExecutionDiffToCheck
            );
            expect(r.timeDiff).toBeLessThanOrEqual(r.timeDiffToCheck);
            break;
          }
          case 3: {
            const r = calcBasicIntervalTimesValues(
              data.timeStart,
              data.timeExecution,
              [100, 100, 50, 150, 150]
            );
            expect(r.timeExecutionDiff).toBeGreaterThanOrEqual(
              r.timeExecutionDiffToCheck
            );
            expect(r.timeDiff).toBeLessThanOrEqual(r.timeDiffToCheck);
            // is last iteration
            const clearedTrue = intervaq.clearInterval(
              intervalCase.setInterval150MsPauseBoth
            );
            expect(clearedTrue).toBe(true);
            const clearedFalse = intervaq.clearInterval(
              intervalCase.setInterval150MsPauseBoth
            );
            expect(clearedFalse).toBe(false);

            // done();
            break;
          }
          default: {
            done(`setInterval 150ms execution #${intervalCount150} error`);
            break;
          }
        }
      } catch (error) {
        done(error);
      }
    };
    const callback200interval = (error: Error, data: ResultInterval) => {
      if (error) {
        done(error);
        return;
      }
      try {
        intervalCount200 = data.intervalCount;
        switch (intervalCount200) {
          case 1: {
            const r = calcBasicIntervalTimesValues(
              data.timeStart,
              data.timeExecution,
              [100, 100, 100]
            );
            expect(r.timeExecutionDiff).toBeGreaterThanOrEqual(
              r.timeExecutionDiffToCheck
            );
            expect(r.timeDiff).toBeLessThanOrEqual(r.timeDiffToCheck);
            break;
          }
          case 2: {
            const r = calcBasicIntervalTimesValues(
              data.timeStart,
              data.timeExecution,
              [100, 100, 100, 200]
            );
            expect(r.timeExecutionDiff).toBeGreaterThanOrEqual(
              r.timeExecutionDiffToCheck
            );
            expect(r.timeDiff).toBeLessThanOrEqual(r.timeDiffToCheck);
            break;
          }
          case 3: {
            const r = calcBasicIntervalTimesValues(
              data.timeStart,
              data.timeExecution,
              [100, 100, 100, 200, 200]
            );
            expect(r.timeExecutionDiff).toBeGreaterThanOrEqual(
              r.timeExecutionDiffToCheck
            );
            expect(r.timeDiff).toBeLessThanOrEqual(r.timeDiffToCheck);
            // is last iteration
            const clearedTrue = intervaq.clearInterval(
              intervalCase.setInterval200MsPauseBoth
            );
            expect(clearedTrue).toBe(true);
            const clearedFalse = intervaq.clearInterval(
              intervalCase.setInterval200MsPauseBoth
            );
            expect(clearedFalse).toBe(false);

            // done();
            break;
          }
          default: {
            done(`setInterval 200ms execution #${intervalCount200} error`);
            break;
          }
        }
      } catch (error) {
        done(error);
      }
    };

    const callback150timeout = (error: Error, data: ResultTimeout) => {
      if (error) {
        done(error);
        return;
      }
      try {
        const timeExecutionDiff = data.timeEnd - data.timeStart;
        const timeExpectedDiff =
          100 +
          timestampMissmatch +
          100 +
          timestampMissmatch +
          50 +
          timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(100 + 100 + 50);
        expect(timeDiff).toBeLessThanOrEqual(
          timestampMissmatch +
            timestampInaccuracy +
            timestampMissmatch +
            timestampInaccuracy +
            timestampMissmatch +
            timestampInaccuracy
        );
        // done();
      } catch (error) {
        done(error);
      }
    };
    const callback200timeout = (error: Error, data: ResultTimeout) => {
      if (error) {
        done(error);
        return;
      }
      try {
        const timeExecutionDiff = data.timeEnd - data.timeStart;
        const timeExpectedDiff =
          100 +
          timestampMissmatch +
          100 +
          timestampMissmatch +
          100 +
          timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(100 + 100 + 100);
        expect(timeDiff).toBeLessThanOrEqual(
          timestampMissmatch +
            timestampInaccuracy +
            timestampMissmatch +
            timestampInaccuracy +
            timestampMissmatch +
            timestampInaccuracy
        );
        // done();
      } catch (error) {
        done(error);
      }
    };

    setIntervalTimeCase('setInterval150MsPauseBoth', callback150interval, 150);
    setIntervalTimeCase('setInterval200MsPauseBoth', callback200interval, 200);
    setTimeoutTimeCase('setTimeout150MsPauseBoth', callback150timeout, 150);
    setTimeoutTimeCase('setTimeout200MsPauseBoth', callback200timeout, 200);

    /** @todo: using another timing system as trigger from outside */
    setTimeout(() => {
      intervaq.pauseProcessing();
      setTimeout(() => {
        intervaq.continueProcessing();
        setTimeout(() => {
          /** @todo: gen and check results to done() */
          done();
        }, 400);
      }, 100);
    }, 100);
  });

  // - OK
  test(`set both 100Ms while intervaq is paused
    on 150Ms for 100Ms at its 50Ms`, done => {
    let intervalCount100 = 0;
    let intervalCount100OnPaused = 0;
    const callback100interval = (error: Error, data: ResultInterval) => {
      if (error) {
        done(error);
        return;
      }
      try {
        intervalCount100 = data.intervalCount;
        switch (intervalCount100) {
          case 1: {
            const r = calcBasicIntervalTimesValues(
              data.timeStart,
              data.timeExecution,
              [100]
            );
            expect(r.timeExecutionDiff).toBeGreaterThanOrEqual(
              r.timeExecutionDiffToCheck
            );
            expect(r.timeDiff).toBeLessThanOrEqual(r.timeDiffToCheck);
            break;
          }
          case 2: {
            const r = calcBasicIntervalTimesValues(
              data.timeStart,
              data.timeExecution,
              [100, 50, 100, 50]
            );
            expect(r.timeExecutionDiff).toBeGreaterThanOrEqual(
              r.timeExecutionDiffToCheck
            );
            expect(r.timeDiff).toBeLessThanOrEqual(r.timeDiffToCheck);
            break;
          }
          case 3: {
            const r = calcBasicIntervalTimesValues(
              data.timeStart,
              data.timeExecution,
              [100, 50, 100, 50, 100]
            );
            expect(r.timeExecutionDiff).toBeGreaterThanOrEqual(
              r.timeExecutionDiffToCheck
            );
            expect(r.timeDiff).toBeLessThanOrEqual(r.timeDiffToCheck);
            // is last iteration
            const clearedTrue = intervaq.clearInterval(
              intervalCase.setInterval100MsToPausedBoth
            );
            expect(clearedTrue).toBe(true);
            const clearedFalse = intervaq.clearInterval(
              intervalCase.setInterval100MsToPausedBoth
            );
            expect(clearedFalse).toBe(false);

            // done();
            break;
          }
          default: {
            done(`setInterval 100ms execution #${intervalCount100} error`);
            break;
          }
        }
      } catch (error) {
        done(error);
      }
    };
    const callback100intervalOnPaused = (
      error: Error,
      data: ResultInterval
    ) => {
      if (error) {
        done(error);
        return;
      }
      try {
        intervalCount100OnPaused = data.intervalCount;
        switch (intervalCount100OnPaused) {
          case 1: {
            const r = calcBasicIntervalTimesValues(
              data.timeStart,
              data.timeExecution,
              [50, 100]
            );
            expect(r.timeExecutionDiff).toBeGreaterThanOrEqual(
              r.timeExecutionDiffToCheck
            );
            expect(r.timeDiff).toBeLessThanOrEqual(r.timeDiffToCheck);
            break;
          }
          case 2: {
            const r = calcBasicIntervalTimesValues(
              data.timeStart,
              data.timeExecution,
              [50, 100, 100]
            );
            expect(r.timeExecutionDiff).toBeGreaterThanOrEqual(
              r.timeExecutionDiffToCheck
            );
            expect(r.timeDiff).toBeLessThanOrEqual(r.timeDiffToCheck);
            break;
          }
          case 3: {
            const r = calcBasicIntervalTimesValues(
              data.timeStart,
              data.timeExecution,
              [50, 100, 100, 100]
            );
            expect(r.timeExecutionDiff).toBeGreaterThanOrEqual(
              r.timeExecutionDiffToCheck
            );
            expect(r.timeDiff).toBeLessThanOrEqual(r.timeDiffToCheck);
            // is last iteration
            const clearedTrue = intervaq.clearInterval(
              intervalCase.setInterval100MsOnPausedBoth
            );
            expect(clearedTrue).toBe(true);
            const clearedFalse = intervaq.clearInterval(
              intervalCase.setInterval100MsOnPausedBoth
            );
            expect(clearedFalse).toBe(false);

            // done();
            break;
          }
          default: {
            done(
              `setInterval on paused 100ms execution
                #${intervalCount100OnPaused} error`
            );
            break;
          }
        }
      } catch (error) {
        done(error);
      }
    };

    const callback100timeout = (error: Error, data: ResultTimeout) => {
      if (error) {
        done(error);
        return;
      }
      try {
        const timeExecutionDiff = data.timeEnd - data.timeStart;
        const timeExpectedDiff = 100 + timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(100);
        expect(timeDiff).toBeLessThanOrEqual(
          timestampMissmatch + timestampInaccuracy
        );
        // done();
      } catch (error) {
        done(error);
      }
    };

    const callback100timeoutOnPaused = (error: Error, data: ResultTimeout) => {
      if (error) {
        done(error);
        return;
      }
      try {
        const timeExecutionDiff = data.timeEnd - data.timeStart;
        const timeExpectedDiff =
          50 + timestampMissmatch + 100 + timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(100);
        expect(timeDiff).toBeLessThanOrEqual(
          timestampMissmatch +
            timestampInaccuracy +
            timestampMissmatch +
            timestampInaccuracy
        );
        // done();
      } catch (error) {
        done(error);
      }
    };

    setIntervalTimeCase(
      'setInterval100MsToPausedBoth',
      callback100interval,
      100
    );
    setTimeoutTimeCase('setTimeout100MsToPausedBoth', callback100timeout, 100);

    /** @todo: using another timing system as trigger from outside */
    setTimeout(() => {
      intervaq.pauseProcessing();
      setTimeout(() => {
        setIntervalTimeCase(
          'setInterval100MsOnPausedBoth',
          callback100intervalOnPaused,
          100
        );
        setTimeoutTimeCase(
          'setTimeout100MsOnPausedBoth',
          callback100timeoutOnPaused,
          100
        );
        setTimeout(() => {
          intervaq.continueProcessing();
          setTimeout(() => {
            /** @todo: gen and check results to done() */
            done();
          }, 400);
        }, 50);
      }, 50);
    }, 150);
  });
});

afterAll(done => {
  done();
});
