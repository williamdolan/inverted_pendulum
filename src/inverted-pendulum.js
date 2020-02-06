var controller = require('./pid')

function InvertedPendulum() {

  this.theta = 0.1; // angle of pendulum from vertical
  this.thetad = 0;
  this.x = 0; // position of platform
  this.xd = 0;
  this.dt = 5.0;  //0.020; // interval
  this.state = "STOPPED";
  this.wind_factor = 0;
  this.max_accel = 0.5;
  this.threshold = 1.0; //distance from neighbour
  this.neighbourA = null;
  this.neighbourB = null;
  //
  this.mass_cart = 10;
  this.mass_pendulum = 1;
  this.length_pendulum = 1;
  this.J = (this.mass_pendulum * this.length_pendulum * this.length_pendulum) / 3.0;
  this.pid = null;
  this.kd = -100;
  this.kp = -100;
  this.ki = 100;

  var self = this;

  this.config = function(config) {
    if (self.state == "STOPPED")
    {
      console.log("config");
      self.kd = config.pid.kd;
      self.kp = config.pid.kp;
      self.ki = config.pid.ki;
      self.x  = config.position;
      self.theta = config.angle;
      self.wind_factor = config.wind_factor;
      self.max_accel = config.max_accel;
      self.dt = config.time_step;
      self.neighbourA = config.neighbourA;
      self.neighbourB = config.neighbourB;
      self.threshold = config.threshold;
    }
  }

  this.start = function() {
    // configure coefficients
    console.log("start");
    self.pid = new controller.Pid(self.kp, self.ki, self.kd, self.dt );
    console.log(self.dt);
    self.interval = setInterval(self.update, self.dt * 1000);
    self.state = "RUNNING";
  }

  this.stop = function() {
    clearInterval(this.interval);
    this.state = "STOPPED";
    //delete this.pid;
  }

  // called from timer callback -- use self
  this.update = function() {
    var force = self.pid.update(self.theta);
    self.calculateState(force);
  }

  // called from timer callback -- use self
  this.calculateState = function(force) {
    var J = self.J;
    var m = self.mass_pendulum;
    var M = self.mass_cart;
    var l = self.length_pendulum;
    var g = 9.81;
    var theta = self.theta;
    //console.log("force " + force);
    var xdd = ((J + m * l*l)*force - (m*m * l*l * g * theta)) /
              (J * (M + m) + (m * M *l*l));//
    //console.log("xdd " + xdd);
    if (Math.abs(xdd) > self.max_accel)
    {
      console.log("max_accel exceeded " + xdd);
      xdd = Math.sign(xdd) * self.max_accel;
      //console.log("xdd = " + xdd);
    }
    self.xd = self.xd + xdd * self.dt;
    //console.log("self.xd " + self.xd);
    self.x = self.x + self.xd * self.dt;
    //console.log("self.x " + self.x);
    var wind_effect = self.wind_factor * Math.random() * 0.001;
    //console.log("wind effect " + wind_effect);
    var thetadd = ((M + m)*m*l*g*theta - m*l*force) /
                  (J * (M + m)+ (m * M * l*l)) + wind_effect;//
    //console.log("thetadd " + thetadd);
    self.thetad = self.thetad + thetadd * self.dt;
    //console.log("self.thetad " + self.thetad);
    self.theta = self.theta + self.thetad * self.dt;
    //console.log("theta = " + self.theta + " x = " + self.x);
  }

  this.getAngle = function() {
    return self.theta;
  }

  this.getAngularVelocity = function() {
    return self.thetad;
  }

  this.getPlatformPosition = function() {
    return self.x;
  }

  this.getPlatformVelocity = function() {
    return self.xd;
  }

  this.getState = function() {
    return self.state;
  }

  this.checkNeighbour = function(neighbour) {
    console.log("threshold = " + self.threshold);
    console.log("neighbour = " + neighbour);
    console.log("self.x = " + self.x);
    if (neighbour && (Math.abs(self.x - neighbour) < self.threshold))
    {
      console.log("Neighbour is too close");
      return true;
    }
    else {
      return false;
    }
  }

  this.getNeighbours = function() {
    return { A: self.neighbourA, B: self.neighbourB};
  }

}

exports.InvertedPendulum = InvertedPendulum;
