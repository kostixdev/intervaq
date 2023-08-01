/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import {Intervaq, getTimestamp} from '../src';


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
const timestampDiff = (t0, t1) => {
  return Math.abs(t0 - t1);
};


const intervaq = new Intervaq();


const animateAction = (timestamp) => {
  if (intervaq !== undefined) {
    intervaq.checkToExecute(timestamp);
  }
  requestAnimationFrame(animateAction);
};


/** timeouts or intervals actions list for test cases */
const timeCase = {};

/** @todo: finish and refac */
// /**
//  * Callback for setTimeout via `intervaq`.
//  * @callback setTimeoutCallback
//  * @param {any} error - some error data.
//  * @param {any} data - some useful data:
//  */

// /**
//  * Basic setTimeout case for testing purposes via `intervaq`.
//  * @param {string} caseName - namekey of timeCase.
//  * @param {callback} callback - function to be executed.
//  * @param {number} timeOut - timeOut value.
//  * @callback callback
//  */
const setTimeoutTimeCase = (caseName, callback, timeOut) => {
  const timeStart = getTimestamp();
  timeCase[caseName] = intervaq.setTimeout(() => {
    const timeEnd = getTimestamp();
    return callback(null, [timeStart, timeEnd]);
  }, timeOut);
};


const intervalCount = {};

const setIntervalTimeCase = (caseName, callback, timeInterval) => {
  const timeStart = getTimestamp();
  intervalCount[caseName] = 0;
  timeCase[caseName] = intervaq.setInterval(() => {
    const timeExecution = getTimestamp();
    intervalCount[caseName]++;
    return callback(null, [timeStart, timeExecution, intervalCount[caseName]]);
  }, timeInterval);
};

const calcBasicIntervalTimesValues = (
    timeStart,
    timeExecution,
    times = []
) => {
  const timeExecutionDiff = timeExecution - timeStart;
  const timeExecutionDiffToCheck =
      times.reduce((sum, value) => sum + value, 0);
  const timeExpectedDiff =
      times.reduce(
          (sum, value) => sum + value + timestampMissmatch,
          0
      );
  const timeDiff =
      timestampDiff(timeExecutionDiff, timeExpectedDiff);
  const timeDiffToCheck =
      (timestampMissmatch + timestampInaccuracy) * times.length;
  return {
    timeExecutionDiff,
    timeExecutionDiffToCheck,
    timeDiff,
    timeDiffToCheck,
  };
};


beforeAll((done) => {
  animateAction();
  done();
});


describe('basic setTimeout functionality', () => {
  test('setTimeout for 1000Ms', (done) => {
    const callback = (error, data) => {
      if (error) {
        done(error);
        return;
      }
      try {
        const timeExecutionDiff = data[1] - data[0];
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

  test('setTimeout for 100Ms', (done) => {
    const callback = (error, data) => {
      if (error) {
        done(error);
        return;
      }
      try {
        const timeExecutionDiff = data[1] - data[0];
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

  test('setTimeout for 10Ms', (done) => {
    const callback = (error, data) => {
      if (error) {
        done(error);
        return;
      }
      try {
        const timeExecutionDiff = data[1] - data[0];
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

  test('clearTimeout for 1000Ms in 500ms', (done) => {
    const callback1000 = (error, data) => {
      if (error) {
        done(error);
        return;
      }
      try {
        const timeExecutionDiff = data[1] - data[0];
        done(`timeout 1000Ms finished in ${timeExecutionDiff}Ms error`);
      } catch (error) {
        done(error);
      }
    };
    const callback500 = (error, data) => {
      if (error) {
        done(error);
        return;
      }
      try {
        const timeExecutionDiff = data[1] - data[0];
        const timeExpectedDiff = 500 + timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(500);
        expect(timeDiff).toBeLessThanOrEqual(
            timestampMissmatch + timestampInaccuracy
        );

        const clearedTrue = intervaq.clearTimeout(timeCase.clearTimeout1000Ms);
        expect(clearedTrue).toBe(true);
        const clearedFalse = intervaq.clearTimeout(timeCase.clearTimeout1000Ms);
        expect(clearedFalse).toBe(false);
        const index = intervaq.timeouts.indexOf(timeCase.clearTimeout1000Ms);
        expect(index).toBe(-1);

        done();
      } catch (error) {
        done(error);
      }
    };
    setTimeoutTimeCase('clearTimeout1000Ms', callback1000, 1000);
    setTimeoutTimeCase('clearTimeout500Ms', callback500, 500);
  });

  test('setTimeout for 1000Ms disabled for 500ms after 200ms', (done) => {
    const callback1000 = (error, data) => {
      if (error) {
        done(error);
        return;
      }
      try {
        const timeExecutionDiff = data[1] - data[0];
        const timeExpectedDiff =
            200 + timestampMissmatch +
            500 + timestampMissmatch +
            1000 + timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(
            200 + 500 + 1000
        );
        expect(timeDiff).toBeLessThanOrEqual(
            timestampMissmatch + timestampInaccuracy +
            timestampMissmatch + timestampInaccuracy +
            timestampMissmatch + timestampInaccuracy
        );
        done();
      } catch (error) {
        done(error);
      }
    };
    const callback200 = (error, data) => {
      if (error) {
        done(error);
        return;
      }
      try {
        const timeExecutionDiff = data[1] - data[0];
        const timeExpectedDiff = 200 + timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(200);
        expect(timeDiff).toBeLessThanOrEqual(
            timestampMissmatch + timestampInaccuracy
        );

        timeCase.setTimeout1000MsToDisableEnable.disable();
        setTimeoutTimeCase(
            'setTimeout500MsForEnable',
            callback500,
            500);
        // done();
      } catch (error) {
        done(error);
      }
    };
    const callback500 = (error, data) => {
      if (error) {
        done(error);
        return;
      }
      try {
        const timeExecutionDiff = data[1] - data[0];
        const timeExpectedDiff = 500 + timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(500);
        expect(timeDiff).toBeLessThanOrEqual(
            timestampMissmatch + timestampInaccuracy
        );

        timeCase.setTimeout1000MsToDisableEnable.enable();
        // done();
      } catch (error) {
        done(error);
      }
    };
    setTimeoutTimeCase('setTimeout1000MsToDisableEnable', callback1000, 1000);
    setTimeoutTimeCase('setTimeout200MsForDisable', callback200, 200);
  });

  test('setTimeout for 1000Ms and restart after 500ms', (done) => {
    const callback1000 = (error, data) => {
      if (error) {
        done(error);
        return;
      }
      try {
        const timeExecutionDiff = data[1] - data[0];
        const timeExpectedDiff =
            500 + timestampMissmatch +
            1000 + timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(
            500 + 1000
        );
        expect(timeDiff).toBeLessThanOrEqual(
            timestampMissmatch + timestampInaccuracy +
            timestampMissmatch + timestampInaccuracy
        );

        done();
      } catch (error) {
        done(error);
      }
    };
    const callback500 = (error, data) => {
      if (error) {
        done(error);
        return;
      }
      try {
        const timeExecutionDiff = data[1] - data[0];
        const timeExpectedDiff = 500 + timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(500);
        expect(timeDiff).toBeLessThanOrEqual(
            timestampMissmatch + timestampInaccuracy
        );

        timeCase.setTimeout1000MsToRestart.restart();
        // done();
      } catch (error) {
        done(error);
      }
    };
    setTimeoutTimeCase('setTimeout1000MsToRestart', callback1000, 1000);
    setTimeoutTimeCase('setTimeout500MsForRestart', callback500, 500);
  });

  test('clearTimeout for setTimeout 500Ms return false', (done) => {
    const callback500 = (error, data) => {
      if (error) {
        done(error);
        return;
      }
      try {
        const timeExecutionDiff = data[1] - data[0];
        const timeExpectedDiff = 500 + timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(500);
        expect(timeDiff).toBeLessThanOrEqual(
            timestampMissmatch + timestampInaccuracy
        );

        const clearedTrue = intervaq.clearTimeout(timeCase.setTimeout500Ms);
        expect(clearedTrue).toBe(true);
        const clearedFalse = intervaq.clearTimeout(timeCase.setTimeout500Ms);
        expect(clearedFalse).toBe(false);

        done();
      } catch (error) {
        done(error);
      }
    };
    setTimeoutTimeCase('setTimeout500Ms', callback500, 500);
  });
});


describe('basic setInterval functionality', () => {
  // - OK
  test('setInterval every 200ms for 5times', (done) => {
    let intervalCount = 0;
    const intervalTimes = [];
    const callback200 = (error, data) => {
      if (error) {
        done(error);
        return;
      }
      try {
        intervalCount = data[2];
        intervalTimes.push(200);
        const {
          timeExecutionDiff,
          timeExecutionDiffToCheck,
          timeDiff,
          timeDiffToCheck,
        } = calcBasicIntervalTimesValues(data[0], data[1], intervalTimes);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(
            timeExecutionDiffToCheck
        );
        expect(timeDiff).toBeLessThanOrEqual(
            timeDiffToCheck
        );

        if (intervalCount == 5) {
          const clearedTrue = intervaq.clearInterval(
              timeCase.setInterval200Ms5
          );
          expect(clearedTrue).toBe(true);
          const clearedFalse = intervaq.clearInterval(
              timeCase.setInterval200Ms5
          );
          expect(clearedFalse).toBe(false);

          done();
        } else if (intervalCount > 5) {
          done(`setInterval 200Ms 5times count #${data[2]} > 5 error`);
        } else {
          // do nothing
        }
      } catch (error) {
        done(error);
      }
    };
    setIntervalTimeCase('setInterval200Ms5', callback200, 200);
  });

  // - OK
  test('setInterval every 200ms and clearInterval in 1100ms', (done) => {
    let intervalCount = 0;
    const intervalTimes = [];
    const callback200 = (error, data) => {
      if (error) {
        done(error);
        return;
      }
      try {
        intervalCount = data[2];
        intervalTimes.push(200);
        const {
          timeExecutionDiff,
          timeExecutionDiffToCheck,
          timeDiff,
          timeDiffToCheck,
        } = calcBasicIntervalTimesValues(data[0], data[1], intervalTimes);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(
            timeExecutionDiffToCheck
        );
        expect(timeDiff).toBeLessThanOrEqual(
            timeDiffToCheck
        );

        expect(data[2]).toBeLessThan(6);
      } catch (error) {
        done(error);
      }
    };
    const callback1100 = (error, data) => {
      if (error) {
        done(error);
        return;
      }
      try {
        intervaq.clearInterval(timeCase.setInterval200Ms5ToClearIn1100ms);
        const timeExecutionDiff = data[1] - data[0];
        const timeExpectedDiff = 1100 + timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(1100);
        expect(timeDiff).toBeLessThanOrEqual(
            timestampMissmatch + timestampInaccuracy
        );
      } catch (error) {
        done(error);
      }
    };
    const callback1300 = (error, data) => {
      if (error) {
        done(error);
        return;
      }
      try {
        const timeExecutionDiff = data[1] - data[0];
        const timeExpectedDiff = 1300 + timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(1300);
        expect(timeDiff).toBeLessThanOrEqual(
            timestampMissmatch + timestampInaccuracy
        );

        expect(intervalCount).toBe(5);

        done();
      } catch (error) {
        done(error);
      }
    };
    setIntervalTimeCase(
        'setInterval200Ms5ToClearIn1100ms', callback200, 200);
    setTimeoutTimeCase(
        'setTimeout1100ForClearInterval200Ms5', callback1100, 1100);
    setTimeoutTimeCase(
        'setTimeout1300ForCheckClearInterval200Ms5', callback1300, 1300);
  });

  // - OK
  test('setInterval every 1000ms and clearInterval in 500ms', (done) => {
    let intervalCount = 0;
    const intervalTimes = [];
    const callback1000 = (error, data) => {
      if (error) {
        done(error);
        return;
      }
      try {
        intervalCount = data[2];
        intervalTimes.push(1000);
        const {
          timeExecutionDiff,
          timeExecutionDiffToCheck,
          timeDiff,
          timeDiffToCheck,
        } = calcBasicIntervalTimesValues(data[0], data[1], intervalTimes);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(
            timeExecutionDiffToCheck
        );
        expect(timeDiff).toBeLessThanOrEqual(
            timeDiffToCheck
        );
      } catch (error) {
        done(error);
      }
    };
    const callback500 = (error, data) => {
      if (error) {
        done(error);
        return;
      }
      try {
        intervaq.clearInterval(timeCase.setInterval1000MsToClearIn500ms);
        const timeExecutionDiff = data[1] - data[0];
        const timeExpectedDiff = 500 + timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(500);
        expect(timeDiff).toBeLessThanOrEqual(
            timestampMissmatch + timestampInaccuracy
        );
      } catch (error) {
        done(error);
      }
    };
    const callback1200 = (error, data) => {
      if (error) {
        done(error);
        return;
      }
      try {
        const timeExecutionDiff = data[1] - data[0];
        const timeExpectedDiff = 1200 + timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(1200);
        expect(timeDiff).toBeLessThanOrEqual(
            timestampMissmatch + timestampInaccuracy
        );
        expect(intervalCount).toBe(0);
        done();
      } catch (error) {
        done(error);
      }
    };
    setIntervalTimeCase(
        'setInterval1000MsToClearIn500ms', callback1000, 1000);
    setTimeoutTimeCase(
        'setTimeout500ForClearInterval1000Ms', callback500, 500);
    setTimeoutTimeCase(
        'setTimeout1200ForCheckClearInterval1000Ms', callback1200, 1200);
  });

  // - OK
  test('setInterval every 200Ms disabled for 500ms after 300ms', (done) => {
    let intervalCount = 0;
    const callback200 = (error, data) => {
      if (error) {
        done(error);
        return;
      }
      try {
        intervalCount = data[2];
        const timeExecutionDiff = data[1] - data[0];
        switch (intervalCount) {
          case 1: {
            const {
              timeExecutionDiff,
              timeExecutionDiffToCheck,
              timeDiff,
              timeDiffToCheck,
            } = calcBasicIntervalTimesValues(data[0], data[1], [200]);
            expect(timeExecutionDiff).toBeGreaterThanOrEqual(
                timeExecutionDiffToCheck
            );
            expect(timeDiff).toBeLessThanOrEqual(
                timeDiffToCheck
            );
            break;
          }
          case 2: {
            const {
              timeExecutionDiff,
              timeExecutionDiffToCheck,
              timeDiff,
              timeDiffToCheck,
            } = calcBasicIntervalTimesValues(
                data[0], data[1], [200, 100, 500, 200]
            );
            expect(timeExecutionDiff).toBeGreaterThanOrEqual(
                timeExecutionDiffToCheck
            );
            expect(timeDiff).toBeLessThanOrEqual(
                timeDiffToCheck
            );
            break;
          }
        }
        expect(intervalCount).toBeLessThan(3);
      } catch (error) {
        done(error);
      }
    };
    const callback300 = (error, data) => {
      if (error) {
        done(error);
        return;
      }
      try {
        timeCase.setInterval200MsToDisableEnable.disable();
        const timeExecutionDiff = data[1] - data[0];
        const timeExpectedDiff = 300 + timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(300);
        expect(timeDiff).toBeLessThanOrEqual(
            timestampMissmatch + timestampInaccuracy
        );
        expect(intervalCount).toBe(1);
        // next action to enable
        setTimeoutTimeCase(
            'setTimeout500MsForEnableSetInterval200Ms',
            callback500,
            500);
        // done();
      } catch (error) {
        done(error);
      }
    };
    const callback500 = (error, data) => {
      if (error) {
        done(error);
        return;
      }
      try {
        timeCase.setInterval200MsToDisableEnable.enable();
        const timeExecutionDiff = data[1] - data[0];
        const timeExpectedDiff = 500 + timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(500);
        expect(timeDiff).toBeLessThanOrEqual(
            timestampMissmatch + timestampInaccuracy
        );
        expect(intervalCount).toBe(1);
        // done();
      } catch (error) {
        done(error);
      }
    };
    const callback1100 = (error, data) => {
      if (error) {
        done(error);
        return;
      }
      try {
        intervaq.clearInterval(timeCase.setInterval200MsToDisableEnable);
        const timeExecutionDiff = data[1] - data[0];
        const timeExpectedDiff = 1100 + timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(1100);
        expect(timeDiff).toBeLessThanOrEqual(
            timestampMissmatch + timestampInaccuracy
        );
        expect(intervalCount).toBe(2);
        done();
      } catch (error) {
        done(error);
      }
    };
    setIntervalTimeCase(
        'setInterval200MsToDisableEnable', callback200, 200);
    setTimeoutTimeCase(
        'setTimeout300MsForDisableSetInterval200Ms', callback300, 300);
    setTimeoutTimeCase(
        'setTimeout1100MsForClearSetInterval200Ms', callback1100, 1100);
  });

  // - OK
  test('setInterval every 200Ms for 3times to restart after 300ms', (done) => {
    let intervalCount = 0;
    const callback200 = (error, data) => {
      if (error) {
        done(error);
        return;
      }
      try {
        intervalCount = data[2];
        switch (intervalCount) {
          case 1: {
            const {
              timeExecutionDiff,
              timeExecutionDiffToCheck,
              timeDiff,
              timeDiffToCheck,
            } = calcBasicIntervalTimesValues(
                data[0], data[1], [200]
            );
            expect(timeExecutionDiff).toBeGreaterThanOrEqual(
                timeExecutionDiffToCheck
            );
            expect(timeDiff).toBeLessThanOrEqual(
                timeDiffToCheck
            );
            break;
          }
          case 2: {
            const {
              timeExecutionDiff,
              timeExecutionDiffToCheck,
              timeDiff,
              timeDiffToCheck,
            } = calcBasicIntervalTimesValues(
                data[0], data[1], [200, 100, 200]
            );
            expect(timeExecutionDiff).toBeGreaterThanOrEqual(
                timeExecutionDiffToCheck
            );
            expect(timeDiff).toBeLessThanOrEqual(
                timeDiffToCheck
            );
            break;
          }
          case 3: {
            const {
              timeExecutionDiff,
              timeExecutionDiffToCheck,
              timeDiff,
              timeDiffToCheck,
            } = calcBasicIntervalTimesValues(
                data[0], data[1], [200, 100, 200, 200]
            );
            expect(timeExecutionDiff).toBeGreaterThanOrEqual(
                timeExecutionDiffToCheck
            );
            expect(timeDiff).toBeLessThanOrEqual(
                timeDiffToCheck
            );
            // is last iteration
            const clearedTrue = intervaq.clearInterval(
                timeCase.setInterval200MsToRestart
            );
            expect(clearedTrue).toBe(true);
            const clearedFalse = intervaq.clearInterval(
                timeCase.setInterval200MsToRestart
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
    const callback300 = (error, data) => {
      if (error) {
        done(error);
        return;
      }
      try {
        const timeExecutionDiff = data[1] - data[0];
        const timeExpectedDiff = 300 + timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(300);
        expect(timeDiff).toBeLessThanOrEqual(
            timestampMissmatch + timestampInaccuracy
        );

        timeCase.setInterval200MsToRestart.restart();
        // done();
      } catch (error) {
        done(error);
      }
    };
    setIntervalTimeCase('setInterval200MsToRestart', callback200, 200);
    setTimeoutTimeCase('setTimeout300MsForRestart', callback300, 300);
  });

  // - OK
  test('clearInterval for setInterval 500Ms return false', (done) => {
    let intervalCount = 0;
    const callback500 = (error, data) => {
      if (error) {
        done(error);
        return;
      }
      try {
        intervalCount = data[2];
        if (intervalCount > 1) {
          done(`setInterval every 500ms iteration #${intervalCount} error`);
          // return;
        }
        const {
          timeExecutionDiff,
          timeExecutionDiffToCheck,
          timeDiff,
          timeDiffToCheck,
        } = calcBasicIntervalTimesValues(
            data[0], data[1], [500]
        );
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(
            timeExecutionDiffToCheck
        );
        expect(timeDiff).toBeLessThanOrEqual(
            timeDiffToCheck
        );

        const clearedTrue = intervaq.clearInterval(timeCase.setInterval500Ms);
        expect(clearedTrue).toBe(true);
        const clearedFalse = intervaq.clearInterval(timeCase.setInterval500Ms);
        expect(clearedFalse).toBe(false);

        done();
      } catch (error) {
        done(error);
      }
    };
    setIntervalTimeCase('setInterval500Ms', callback500, 500);
  });
});


describe('global intervaq functionality', () => {
  // - OK
  test('set timeouts 500Ms/600ms/800ms pause on 300Ms for 200ms', (done) => {
    const callback500 = (error, data) => {
      if (error) {
        done(error);
        return;
      }
      try {
        const timeExecutionDiff = data[1] - data[0];
        const timeExpectedDiff =
            300 + timestampMissmatch +
            200 + timestampMissmatch +
            200 + timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(500 + 200);
        expect(timeDiff).toBeLessThanOrEqual(
            timestampMissmatch + timestampInaccuracy +
            timestampMissmatch + timestampInaccuracy +
            timestampMissmatch + timestampInaccuracy
        );
        // done();
      } catch (error) {
        done(error);
      }
    };
    const callback600 = (error, data) => {
      if (error) {
        done(error);
        return;
      }
      try {
        const timeExecutionDiff = data[1] - data[0];
        const timeExpectedDiff =
            300 + timestampMissmatch +
            200 + timestampMissmatch +
            300 + timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(600 + 200);
        expect(timeDiff).toBeLessThanOrEqual(
            timestampMissmatch + timestampInaccuracy +
            timestampMissmatch + timestampInaccuracy +
            timestampMissmatch + timestampInaccuracy
        );
        // done();
      } catch (error) {
        done(error);
      }
    };
    const callback800 = (error, data) => {
      if (error) {
        done(error);
        return;
      }
      try {
        const timeExecutionDiff = data[1] - data[0];
        const timeExpectedDiff =
            300 + timestampMissmatch +
            200 + timestampMissmatch +
            500 + timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(800 + 200);
        expect(timeDiff).toBeLessThanOrEqual(
            timestampMissmatch + timestampInaccuracy +
            timestampMissmatch + timestampInaccuracy +
            timestampMissmatch + timestampInaccuracy
        );
        // done();
      } catch (error) {
        done(error);
      }
    };
    setTimeoutTimeCase('setTimeout500Ms', callback500, 500);
    setTimeoutTimeCase('setTimeout600Ms', callback600, 600);
    setTimeoutTimeCase('setTimeout800Ms', callback800, 800);
    /** @todo: using another timing system as trigger from outside */
    setTimeout(() => {
      intervaq.pauseProcessing();
      setTimeout(() => {
        intervaq.continueProcessing();
        setTimeout(() => {
          /** @todo: gen and check results to done() */
          done();
        }, 1500);
      }, 200);
    }, 300);
  });

  // - OK
  test('set intervals 200ms/300ms/500ms pause on 300Ms for 300ms', (done) => {
    let intervalCount200 = 0;
    let intervalCount300 = 0;
    let intervalCount500 = 0;
    const callback200 = (error, data) => {
      if (error) {
        done(error);
        return;
      }
      try {
        intervalCount200 = data[2];
        switch (intervalCount200) {
          case 1: {
            const {
              timeExecutionDiff,
              timeExecutionDiffToCheck,
              timeDiff,
              timeDiffToCheck,
            } = calcBasicIntervalTimesValues(data[0], data[1], [200]);
            expect(timeExecutionDiff).toBeGreaterThanOrEqual(
                timeExecutionDiffToCheck
            );
            expect(timeDiff).toBeLessThanOrEqual(
                timeDiffToCheck
            );
            break;
          }
          case 2: {
            const {
              timeExecutionDiff,
              timeExecutionDiffToCheck,
              timeDiff,
              timeDiffToCheck,
            } = calcBasicIntervalTimesValues(
                data[0], data[1], [200, 100, 300, 100]);
            expect(timeExecutionDiff).toBeGreaterThanOrEqual(
                timeExecutionDiffToCheck
            );
            expect(timeDiff).toBeLessThanOrEqual(
                timeDiffToCheck
            );
            break;
          }
          case 3: {
            const {
              timeExecutionDiff,
              timeExecutionDiffToCheck,
              timeDiff,
              timeDiffToCheck,
            } = calcBasicIntervalTimesValues(
                data[0], data[1], [200, 100, 300, 100, 200]);
            expect(timeExecutionDiff).toBeGreaterThanOrEqual(
                timeExecutionDiffToCheck
            );
            expect(timeDiff).toBeLessThanOrEqual(
                timeDiffToCheck
            );
            // is last iteration
            const clearedTrue = intervaq.clearInterval(
                timeCase.setInterval200MsToPause
            );
            expect(clearedTrue).toBe(true);
            const clearedFalse = intervaq.clearInterval(
                timeCase.setInterval200MsToPause
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

    /** @todo: check executing on pause 300Ms to be 1st or 2nd */

    const callback300 = (error, data) => {
      if (error) {
        done(error);
        return;
      }
      try {
        intervalCount300 = data[2];
        switch (intervalCount300) {
          case 1: {
            const {
              timeExecutionDiff,
              timeExecutionDiffToCheck,
              timeDiff,
              timeDiffToCheck,
            } = calcBasicIntervalTimesValues(data[0], data[1], [300, 300]);
            expect(timeExecutionDiff).toBeGreaterThanOrEqual(
                timeExecutionDiffToCheck
            );
            expect(timeDiff).toBeLessThanOrEqual(
                timeDiffToCheck
            );
            break;
          }
          case 2: {
            const {
              timeExecutionDiff,
              timeExecutionDiffToCheck,
              timeDiff,
              timeDiffToCheck,
            } = calcBasicIntervalTimesValues(
                data[0], data[1], [300, 300, 300]
            ); // 300Ms pause at 2nd
            expect(timeExecutionDiff).toBeGreaterThanOrEqual(
                timeExecutionDiffToCheck
            );
            expect(timeDiff).toBeLessThanOrEqual(
                timeDiffToCheck
            );
            break;
          }
          case 3: {
            const {
              timeExecutionDiff,
              timeExecutionDiffToCheck,
              timeDiff,
              timeDiffToCheck,
            } = calcBasicIntervalTimesValues(
                data[0], data[1], [300, 300, 300, 300]
            ); // 300Ms pause at 2nd
            expect(timeExecutionDiff).toBeGreaterThanOrEqual(
                timeExecutionDiffToCheck
            );
            expect(timeDiff).toBeLessThanOrEqual(
                timeDiffToCheck
            );
            // is last iteration
            const clearedTrue = intervaq.clearInterval(
                timeCase.setInterval300MsToPause
            );
            expect(clearedTrue).toBe(true);
            const clearedFalse = intervaq.clearInterval(
                timeCase.setInterval300MsToPause
            );
            expect(clearedFalse).toBe(false);

            // done();
            break;
          }
          default: {
            done(`setInterval 300ms execution #${intervalCount300} error`);
            break;
          }
        }
      } catch (error) {
        done(error);
      }
    };
    const callback500 = (error, data) => {
      if (error) {
        done(error);
        return;
      }
      try {
        intervalCount500 = data[2];
        switch (intervalCount500) {
          case 1: {
            const {
              timeExecutionDiff,
              timeExecutionDiffToCheck,
              timeDiff,
              timeDiffToCheck,
            } = calcBasicIntervalTimesValues(
                data[0], data[1], [300, 300, 200]
            ); // 300ms pause at 2nd
            expect(timeExecutionDiff).toBeGreaterThanOrEqual(
                timeExecutionDiffToCheck
            );
            expect(timeDiff).toBeLessThanOrEqual(
                timeDiffToCheck
            );
            break;
          }
          case 2: {
            const {
              timeExecutionDiff,
              timeExecutionDiffToCheck,
              timeDiff,
              timeDiffToCheck,
            } = calcBasicIntervalTimesValues(
                data[0], data[1], [300, 300, 200, 500]
            ); // 300Ms pause at 2nd
            expect(timeExecutionDiff).toBeGreaterThanOrEqual(
                timeExecutionDiffToCheck
            );
            expect(timeDiff).toBeLessThanOrEqual(
                timeDiffToCheck
            );
            break;
          }
          case 3: {
            const {
              timeExecutionDiff,
              timeExecutionDiffToCheck,
              timeDiff,
              timeDiffToCheck,
            } = calcBasicIntervalTimesValues(
                data[0], data[1], [300, 300, 200, 500, 500]
            ); // 300Ms pause at 2nd
            expect(timeExecutionDiff).toBeGreaterThanOrEqual(
                timeExecutionDiffToCheck
            );
            expect(timeDiff).toBeLessThanOrEqual(
                timeDiffToCheck
            );
            // is last iteration
            const clearedTrue = intervaq.clearInterval(
                timeCase.setInterval500MsToPause
            );
            expect(clearedTrue).toBe(true);
            const clearedFalse = intervaq.clearInterval(
                timeCase.setInterval500MsToPause
            );
            expect(clearedFalse).toBe(false);

            done(); // because of latest one
            break;
          }
          default: {
            done(`setInterval 500ms execution #${intervalCount500} error`);
            break;
          }
        }
      } catch (error) {
        done(error);
      }
    };
    setIntervalTimeCase('setInterval200MsToPause', callback200, 200);
    setIntervalTimeCase('setInterval300MsToPause', callback300, 300);
    setIntervalTimeCase('setInterval500MsToPause', callback500, 500);
    setTimeout(() => {
      intervaq.pauseProcessing();
      setTimeout(() => {
        intervaq.continueProcessing();
      }, 300);
    }, 300);
  });

  // - OK
  test('set both for 200Ms/500Ms pause on 300Ms for 200ms', (done) => {
    let intervalCount200 = 0;
    let intervalCount500 = 0;
    const callback200interval = (error, data) => {
      if (error) {
        done(error);
        return;
      }
      try {
        intervalCount200 = data[2];
        switch (intervalCount200) {
          case 1: {
            const {
              timeExecutionDiff,
              timeExecutionDiffToCheck,
              timeDiff,
              timeDiffToCheck,
            } = calcBasicIntervalTimesValues(data[0], data[1], [200]);
            expect(timeExecutionDiff).toBeGreaterThanOrEqual(
                timeExecutionDiffToCheck
            );
            expect(timeDiff).toBeLessThanOrEqual(
                timeDiffToCheck
            );
            break;
          }
          case 2: {
            const {
              timeExecutionDiff,
              timeExecutionDiffToCheck,
              timeDiff,
              timeDiffToCheck,
            } = calcBasicIntervalTimesValues(
                data[0], data[1], [200, 100, 200, 100]);
            expect(timeExecutionDiff).toBeGreaterThanOrEqual(
                timeExecutionDiffToCheck
            );
            expect(timeDiff).toBeLessThanOrEqual(
                timeDiffToCheck
            );
            break;
          }
          case 3: {
            const {
              timeExecutionDiff,
              timeExecutionDiffToCheck,
              timeDiff,
              timeDiffToCheck,
            } = calcBasicIntervalTimesValues(
                data[0], data[1], [200, 100, 200, 100, 200]);
            expect(timeExecutionDiff).toBeGreaterThanOrEqual(
                timeExecutionDiffToCheck
            );
            expect(timeDiff).toBeLessThanOrEqual(
                timeDiffToCheck
            );
            // is last iteration
            const clearedTrue = intervaq.clearInterval(
                timeCase.setInterval200MsPauseBoth
            );
            expect(clearedTrue).toBe(true);
            const clearedFalse = intervaq.clearInterval(
                timeCase.setInterval200MsPauseBoth
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
    const callback500interval = (error, data) => {
      if (error) {
        done(error);
        return;
      }
      try {
        intervalCount500 = data[2];
        switch (intervalCount500) {
          case 1: {
            const {
              timeExecutionDiff,
              timeExecutionDiffToCheck,
              timeDiff,
              timeDiffToCheck,
            } = calcBasicIntervalTimesValues(
                data[0], data[1], [300, 200, 200]
            ); // 300ms pause at 2nd
            expect(timeExecutionDiff).toBeGreaterThanOrEqual(
                timeExecutionDiffToCheck
            );
            expect(timeDiff).toBeLessThanOrEqual(
                timeDiffToCheck
            );
            break;
          }
          case 2: {
            const {
              timeExecutionDiff,
              timeExecutionDiffToCheck,
              timeDiff,
              timeDiffToCheck,
            } = calcBasicIntervalTimesValues(
                data[0], data[1], [300, 200, 200, 500]
            ); // 300Ms pause at 2nd
            expect(timeExecutionDiff).toBeGreaterThanOrEqual(
                timeExecutionDiffToCheck
            );
            expect(timeDiff).toBeLessThanOrEqual(
                timeDiffToCheck
            );
            break;
          }
          case 3: {
            const {
              timeExecutionDiff,
              timeExecutionDiffToCheck,
              timeDiff,
              timeDiffToCheck,
            } = calcBasicIntervalTimesValues(
                data[0], data[1], [300, 200, 200, 500, 500]
            ); // 300Ms pause at 2nd
            expect(timeExecutionDiff).toBeGreaterThanOrEqual(
                timeExecutionDiffToCheck
            );
            expect(timeDiff).toBeLessThanOrEqual(
                timeDiffToCheck
            );
            // is last iteration
            const clearedTrue = intervaq.clearInterval(
                timeCase.setInterval500MsPauseBoth
            );
            expect(clearedTrue).toBe(true);
            const clearedFalse = intervaq.clearInterval(
                timeCase.setInterval500MsPauseBoth
            );
            expect(clearedFalse).toBe(false);

            // done();
            break;
          }
          default: {
            done(`setInterval 500ms execution #${intervalCount500} error`);
            break;
          }
        }
      } catch (error) {
        done(error);
      }
    };

    const callback200timeout = (error, data) => {
      if (error) {
        done(error);
        return;
      }
      try {
        const timeExecutionDiff = data[1] - data[0];
        const timeExpectedDiff =
            200 + timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(200);
        expect(timeDiff).toBeLessThanOrEqual(
            timestampMissmatch + timestampInaccuracy
        );
        // done();
      } catch (error) {
        done(error);
      }
    };
    const callback500timeout = (error, data) => {
      if (error) {
        done(error);
        return;
      }
      try {
        const timeExecutionDiff = data[1] - data[0];
        const timeExpectedDiff =
            300 + timestampMissmatch +
            200 + timestampMissmatch +
            200 + timestampMissmatch;
        const timeDiff = timestampDiff(timeExecutionDiff, timeExpectedDiff);
        expect(timeExecutionDiff).toBeGreaterThanOrEqual(300 + 200 + 200);
        expect(timeDiff).toBeLessThanOrEqual(
            timestampMissmatch + timestampInaccuracy +
            timestampMissmatch + timestampInaccuracy +
            timestampMissmatch + timestampInaccuracy
        );
        // done();
      } catch (error) {
        done(error);
      }
    };

    setIntervalTimeCase('setInterval200MsPauseBoth', callback200interval, 200);
    setIntervalTimeCase('setInterval500MsPauseBoth', callback500interval, 500);
    setTimeoutTimeCase('setTimeout200MsPauseBoth', callback200timeout, 200);
    setTimeoutTimeCase('setTimeout500MsPauseBoth', callback500timeout, 500);
    /** @todo: using another timing system as trigger from outside */
    setTimeout(() => {
      intervaq.pauseProcessing();
      setTimeout(() => {
        intervaq.continueProcessing();
        setTimeout(() => {
          /** @todo: gen and check results to done() */
          done();
        }, 2000);
      }, 200);
    }, 300);
  });

  /** @todo: need more cases */
  // set on paused
});


afterAll((done) => {
  done();
});
