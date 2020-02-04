
function Pid(kp, ki, kd, dt) {

    this.kP = kp;
    this.kI = ki;
    this.kD = kd;
    this.dt = dt;
    this.target = 0;

    this.cumulativeError = 0;
    this.previousError = 0;

    var self = this;

    this.update = function(value) {
        var error = self.target - value;
        self.cumulativeError = self.cumulativeError + error*self.dt

        // maybe use (-) change in value instead
        var dError = (error - self.previousError)/self.dt;
        self.previousError = error;

        return (self.kP*error) + (self.kI * self.cumulativeError) + (self.kD * dError);
    }

    this.reset = function() {
      self.cumulativeError = 0;
      self.previousError = 0;
    }

}

exports.Pid = Pid;
