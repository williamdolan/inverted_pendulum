var pendulums = [ {x: 200, theta: 0}, {x: 400, theta:0} ];
var r = 100;

(function poll() {
    setTimeout(function() {
        $.ajax({
            url: "http://localhost:8080/position",
            type: "GET",
            success: function(data) {
                console.log("got from p1 " + data.position + " " + data.theta);
                pendulums[0].x = data.position;
                pendulums[0].theta = data.theta;
            },
            dataType: "json",
            complete: poll,
            timeout: 500
        })
    }, 1000);
})();

(function poll() {
    setTimeout(function() {
        $.ajax({
            url: "http://localhost:8081/position",
            type: "GET",
            success: function(data) {
                console.log("got from p2 " + data.position + " " + data.theta);
                pendulums[1].x = data.position;
                pendulums[1].theta = data.theta;
            },
            dataType: "json",
            complete: poll,
            timeout: 500
        })
    }, 1000);
})();


function setup()  {
  createCanvas(600,300);
  // Make a new Pendulum with an origin position and armlength
  //p = new Pendulum(createVector(width/2,200),175);

}

function draw() {
  background(51);
  display();
}

display = function() {

  pendulums.forEach(function(entry) {
    //console.log(entry);
    var p = createVector(r*sin(entry.theta), -r*cos(entry.theta));
    var o = createVector(entry.x, 150);
    p.add(o);
    stroke(255);
    strokeWeight(2);
    line(o.x, o.y, p.x, p.y);
    line(o.x - 50, o.y, o.x + 50, o.y);
  }
  );
};
