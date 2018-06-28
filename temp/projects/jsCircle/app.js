
/*
    Cricle {
        html_id,
        info,
        initialize,
        update
    }
*/
function Circle(cx, cy, html_id, radius){
    this.html_id = html_id;
    this.info = { cx: cx,  cy: cy, radius: radius };

    //private function that generates a random number
    var randomNumberBetween = function(min, max){
        return Math.random()*(max-min) + min;
    }

    //private function that generates a random color
    //#928702 - Hex color 
    var makeColor = function(){
        return "#" + Math.floor(randomNumberBetween(0,9)) 
                    + Math.floor(randomNumberBetween(0,9)) 
                    + Math.floor(randomNumberBetween(0,9))
                    + Math.floor(randomNumberBetween(0,9)) 
                    + Math.floor(randomNumberBetween(0,9)) 
                    + Math.floor(randomNumberBetween(0,9)) ;
    }

    this.initialize = function(){
        //give a random velocity for the circle
        this.info.velocity = {
            x: randomNumberBetween(-3, 3),
            y: randomNumberBetween(-3, 3)
        }

        //create a circle
        var circle = makeSVG('circle',
            { 	cx: this.info.cx,
                cy: this.info.cy,
                r:  this.info.radius,
                id: html_id,
                style: "fill: " + makeColor()
            });
        document.getElementById('svg').appendChild(circle);
    }

    this.update = function(time){
        var el = document.getElementById(html_id);

        //see if the circle is going outside the browser. if it is, reverse the velocity
        if ((this.info.cx + this.info.radius + this.info.velocity.x)  > document.body.firstElementChild.clientWidth 
                || (this.info.cx - this.info.radius + this.info.velocity.x) < 0){
            this.info.velocity.x = this.info.velocity.x * -1;
            el.setAttribute("style", "fill: " + makeColor());
        }

        if ((this.info.cy + this.info.radius + this.info.velocity.y) >= document.body.firstElementChild.clientHeight 
                || (this.info.cy - this.info.radius + this.info.velocity.y) < 0){
            
            //console.log(this);
            this.info.velocity.y = this.info.velocity.y * -1;
            el.setAttribute("style", "fill: " + makeColor());
        }

        this.info.cx = this.info.cx + this.info.velocity.x*time;
        this.info.cy = this.info.cy + this.info.velocity.y*time;

        el.setAttribute("cx", this.info.cx);
        el.setAttribute("cy", this.info.cy);
        // el.setAttribute("style", "fill: green");
    }

    //creates the SVG element and returns it
    var makeSVG = function(tag, attrs) {
        var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (var k in attrs)
        {
            el.setAttribute(k, attrs[k]);
        }
        return el;
    }

    this.initialize();
}

function PlayGround(){
    var counter = 0;  //counts the number of circles created
    var circles = [ ]; //array that will hold all the circles created in the app

    //a loop that updates the circle's position on the screen
    this.loop = function(){
        for(circle in circles)
        {
            circles[circle].update(1);
            var circle2 = isCollide(circles[circle]);
            if (circle2 !== false) {
                // big balls eat small balls
                if (circle2.info.radius > circles[circle].info.radius) {
                    document.getElementById(circles[circle].html_id).remove();
                    circles.splice(circle, 1);
                } else if (circle2.info.radius < circles[circle].info.radius) {
                    //remove circle 2, keep circle 1
                    document.getElementById(circle2.html_id).remove();
                    removeCircle(circle2.html_id);
                }
                
                //document.getElementById('svg').removeChild(document.getElementById('svg').childNodes[circle]);
                
            }
        }
    }

    //private function to remove the circle by html_id
    var removeCircle = function(html_id) {
        for (var c in circles) {
            if (circles[c].html_id === html_id) {
                circles.splice(c, 1);
                return c;
            }
        }
        return -1;
    }
    //private function to detect Circle Collision
    //return the collided circle otherwise return false
    var isCollide = function(circle1) {
        for(var otherCircle in circles) {
            if (circle1.html_id !== circles[otherCircle].html_id) {
                var circle2 = circles[otherCircle];
                var dx = circle1.info.cx - circle2.info.cx;
                var dy = circle1.info.cy - circle2.info.cy;
                var distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < circle1.info.radius + circle2.info.radius) {
                    // collision detected!
                    console.log("boom");
                    return circle2;
                    //delete from array
                    // circles.splice(circle,1);
                    //delete from stage
                    // document.getElementById('svg').removeChild(document.getElementById('svg').childNodes[circle]);
                }
            }
        }
        return false;
    }

    this.createNewCircle = function(x, y, radius){
        var new_circle = new Circle(x, y, counter++, radius);
        circles.push(new_circle);
        // console.log('created a new circle!', new_circle);
    }

    //create one circle when the game starts
    this.createNewCircle(document.body.clientWidth/2, document.body.clientHeight/2, 10);
}

if (document.readyState) {
    document.getElementById('svg').setAttribute("width", window.innerWidth + "px");
    document.getElementById('svg').setAttribute("height", window.innerHeight + "px");
 
    var playground = new PlayGround();
    setInterval(playground.loop, 15); // Call the loop very 15ms

    document.onclick = function(e) {
        var radius = 10 + Math.floor(time_pressed / 500) * 10; // +10 radius every 0.5 second
        playground.createNewCircle(e.x, e.y, radius);
    }

    var mousedown_time, time_pressed;
    function getTime(){
        var date = new Date();
        return date.getTime();
    }
    document.onmousedown = function(e){
        mousedown_time = getTime();
    }
    document.onmouseup = function(e){
        time_pressed = getTime() - mousedown_time;
    }
}

