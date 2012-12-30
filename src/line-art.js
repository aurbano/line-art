$(document).ready(function(e) {
// VARIABLES
	var ctx,
		WIDTH,
		HEIGHT,
		canvasMinX,
		canvasMaxX,
		canvasMinY,
		canvasMaxY,
		ms = {x:0, y:0}, // Mouse speed
		mp = {x:0, y:0}, // Mouse position
		fps = 0, now, lastUpdate = (new Date)*1 - 1,
		fpsFilter = 100,
		points = 100,
		t = 0,
		outline = true;
	
	ctx = $('#bg')[0].getContext("2d");
	// Adaptamos a la ventana:
	ctx.canvas.width  = window.innerWidth;
  	ctx.canvas.height = window.innerHeight;
	
	// Actualizamos las variables:
	WIDTH = $("#bg").width();
  	HEIGHT = $("#bg").height();
	
	canvasMinX = $("#bg").offset().left;
  	canvasMaxX = canvasMinX + WIDTH;
	
	canvasMinY = $("#bg").offset().top;
  	canvasMaxY = canvasMinY + HEIGHT;
	
	// Funciones importantes:
	function clear() {
		ctx.clearRect(0, 0-HEIGHT/2, WIDTH, HEIGHT);
	}
	
	function circle(x,y,rad,color){
		// Circulo
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(x,y,rad,0,Math.PI*2,true);
		ctx.closePath();
		ctx.fill();
	}
	
	function resizeCanvas(e) {
		WIDTH = window.innerWidth;
		HEIGHT = window.innerHeight;
		
		$("#bg").attr('width',WIDTH);
		$("#bg").attr('height',HEIGHT);
		
		ctx.translate(0,HEIGHT/2);
	}
	
	function mouseMove(e) {
		ms.x = Math.max( Math.min( e.pageX - mp.x, 40 ), -40 );
		ms.y = Math.max( Math.min( e.pageY - mp.y, 40 ), -40 );
		
		mp.x = e.pageX - canvasMinX;
		mp.y = e.pageY - canvasMinY;
	}
	
	// Move 0,0 to the center of the screen
	function draw(e) {
		t = t+0.005;
		var xstep = WIDTH/points, p, y;
		// Styles
		ctx.lineWidth = 1;
		ctx.strokeStyle = '#fff';		
		// Sine method
		// Axis
		ctx.strokeStyle = 'rgba(255,0,0,0.2)';
		ctx.beginPath();
		ctx.moveTo(0,0);
		ctx.lineTo(WIDTH,0);
		ctx.moveTo(0,HEIGHT/2);
		ctx.lineTo(0,-HEIGHT/2);
		//ctx.lineTo(0,0);
		ctx.stroke();
		
		if(outline){
			// Draw sine wave
			ctx.strokeStyle = '#09F';
			for(p = 0; p < points;p++){
				// Draw the line
				ctx.beginPath();
				y = (HEIGHT/2-10)*Math.sin(2*Math.PI*(1/WIDTH)*p*xstep+t);
				ctx.moveTo(p*xstep,y);
				ctx.lineTo((p+1)*xstep,(HEIGHT/2-10)*Math.sin(2*Math.PI*(1/WIDTH)*(p+1)*xstep+t));
				//ctx.lineTo(0,0);
				ctx.stroke();
			}
		}
		
		// Draw grid
		ctx.strokeStyle = '#111';
		for(p = 0; p < points;p++){
			// Draw the line
			ctx.beginPath();
			ctx.moveTo(p*xstep,HEIGHT/2);
			ctx.lineTo(p*xstep,-HEIGHT/2);
			//ctx.lineTo(0,0);
			ctx.stroke();
			// Axis circles
			circle(p*xstep,0,3,'rgba(255,0,0,0.2)');
		}
		
		for(p = 0; p < points;p++){
			// Change color
			ctx.strokeStyle = 'rgba(255,255,255,'+(0.5*Math.sin(p*3*Math.PI/(2*points))+0.5)+')';
			// Draw the line
			ctx.beginPath();
			var y1 = (HEIGHT/2-10)*Math.sin(2*Math.PI*(1/WIDTH)*p*xstep+t),
			y2 = (HEIGHT/2-10)*Math.sin(2*Math.PI*(1/WIDTH)*(WIDTH/2+p*xstep)+t);
			ctx.moveTo(p*xstep,y1);
			ctx.lineTo(WIDTH/2+p*xstep,y2);
			ctx.stroke();
			circle(p*xstep,y1,3,'#09F');
			circle(WIDTH/2+p*xstep,y2,3,'#09F');
		}
	}
	
	function frame(){
		clear();
		draw();
		// Now calculate FPS
		var thisFrameFPS = 1000 / ((now=new Date) - lastUpdate);
		fps += (thisFrameFPS - fps) / fpsFilter;
		lastUpdate = now * 1 - 1;
	}
	
	// Display fps
	setInterval(function(){ $('#fps').text('FPS: '+fps.toFixed(0)); }, 500); 
	
	// Actualizadores
	resizeCanvas();
	$(window).resize(resizeCanvas);
	$(document).mousemove(mouseMove);
	drawInterval = setInterval( frame, 1 );
	draw();
	$('#config input').change(function(){
		switch($(this).attr('id')){
			case 'pointsNum':
				points = $(this).val();
				break;
			case 'outline':
				outline = $(this).attr('checked');
				break;
		}
		return true;
	});
});