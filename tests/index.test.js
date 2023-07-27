/* eslint-disable no-undef */
import {Intervaq} from '../src';

const intervaq = new Intervaq();


let animateInterval = null;


beforeAll((done) => {
  // init requestAnimationFrame functionality analogue
  animateInterval = setInterval( () => {
    if (intervaq !== undefined) {
      intervaq.checkToExecute();
    }
  }, 1000 / 60); // 60fps by default
  done();
});


// test sample
const sum = (a, b) => {
  return a + b;
};
test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});


afterAll((done) => {
  clearInterval(animateInterval);
  done();
});
