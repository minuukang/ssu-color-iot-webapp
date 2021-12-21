const GPIO = require('onoff').Gpio;

exports.createColorInterface = function createColorInterface (config, callback) {
  const led = new GPIO(config.led, 'out');
  const plusBtn = new GPIO(config.plus, 'in', 'both');
  const minusBtn = new GPIO(config.minus, 'in', 'both');
  plusBtn.watch((_, value) => {
    led.writeSync(value);
    if (value) {
      callback(1);
    }
  });
  minusBtn.watch((_, value) => {
    led.writeSync(value);
    if (value) {
      callback(-1);
    }
  });

  process.on('SIGINT', _ => {
    led.unexport();
    plusBtn.unexport();
    minusBtn.unexport();
  });
}