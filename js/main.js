var camera1,camera2, scene1, scene2, controls, raycaster1,raycaster2, mouse, geometry,renderer3D,renderer3D2;
var obj = [], obj2 = [];
var prevScene;
var CANVAS_WIDTH = 500, CANVAS_HEIGHT = 500;

mouse = new THREE.Vector2();
init();
animate();



function init(){

	info = document.createElement( 'div' );
	info.style.position = 'absolute';
	info.style.top = '30px';
	info.style.width = '100%';
	info.style.textAlign = 'center';
	info.style.color = '#f00';
	info.style.backgroundColor = 'transparent';
	info.style.zIndex = '1';
	info.style.fontFamily = 'Monospace';
	info.style.userSelect = "none";
	info.style.webkitUserSelect = "none";
	info.style.MozUserSelect = "none";
	document.body.appendChild( info );

	container1 = document.getElementById('canvas1');
	document.body.appendChild( container1 );

	container2 = document.getElementById('canvas2');
	document.body.appendChild( container2 );

	scene1 = new THREE.Scene();
	scene2 = new THREE.Scene();

	camera1 = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	raycaster1 = new THREE.Raycaster();
	renderer3D = new THREE.WebGLRenderer();
	renderer3D.setSize( CANVAS_WIDTH, CANVAS_HEIGHT );
	container1.appendChild( renderer3D.domElement );

	camera2 = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	raycaster2 = new THREE.Raycaster();
	renderer3D2 = new THREE.WebGLRenderer();
	renderer3D2.setSize( CANVAS_WIDTH, CANVAS_HEIGHT );
	container2.appendChild( renderer3D2.domElement );


	controls = new THREE.OrbitControls( camera1, renderer3D.domElement );

	scene1.add( new THREE.AmbientLight( 0x222222 ) );
	scene2.add( new THREE.AmbientLight( 0x222222 ) );

	var light = new THREE.PointLight( 0xffffff, 1 );
	camera1.add( light );
	camera2.add( light );
		

	renderer3D.setClearColor( 0x666666, 1);
	renderer3D2.setClearColor( 0x666666, 1);
	
	geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
	drawPyramid(scene1,0,0,0);

	camera1.position.x =  16.001956358357106;
	camera1.position.y = 16.425063447751537;
	camera1.position.z = 14.28731060380158;


	camera2.position.z = 14.28731060380158;


}


function drawPyramid(scene, x, y, z){
	var depth = 19;
	for (var Z = -4; Z <= 5; Z++){
		var material1 = new THREE.MeshLambertMaterial( { color: randomRGB(), emissive : randomRGB() } );
		var material2 = new THREE.MeshLambertMaterial( { color: randomRGB(), emissive : randomRGB() } );
		
		h = parseInt(depth / 2);
		for (var I = -h; I <= h ; I++) { 
			for (var J= -h; J <= h; J++){
				if ((I+J) % 2 == 0){
					var cube = new THREE.Mesh(geometry, material1);
				}else{
					var cube = new THREE.Mesh(geometry, material2);
				}
				
				cube.callback = objectClickHandler;
				scene.add(cube);
				obj.push(cube);
				cube.position.z = 1*I + z;
				cube.position.x = 1*J + x;
				cube.position.y = 1.5*Z + y;
				cube.levelNumber = depth;
				cube.mat1 = material1;
				cube.mat2 = material2;
			}
		}	
		depth = depth - 2;
	}
}

function rand(){
	var min=0; 
    var max=255;  
    var random =Math.floor(Math.random() * (+max - +min)) + +min; 
    return random; 
}

function randomRGB() {
  var res = "rgb("+rand().toString()+","+rand().toString()+","+rand().toString()+")";
  return new THREE.Color(res);
}


function animate() {
   requestAnimationFrame( animate );
   controls.update();
   renderer3D.render( scene1, camera1 );
   renderer3D2.render( scene2, camera2 );
}


function clearScene(){
	for(var I=0;I<obj2.length;I++){2
		scene2.remove(obj2[I]); 
		geometry.dispose();
	}
	obj2 = []
	renderer3D2.clear();
	renderer3D2.renderLists.dispose();
}

function drawSquare(depth,material1,material2){
	h = parseInt(depth/2);
	for (var I = -h; I <= h ; I++) { 
		for (var J= -h; J <= h; J++){
			if ((I+J) % 2 == 0){
				var cube = new THREE.Mesh(geometry, material1);
			}else{
				var cube = new THREE.Mesh(geometry, material2);
			}
			cube.callback = showThirukural;
			scene2.add(cube);
			cube.position.y = 1*I;
			cube.position.x = 1*J;
			obj2.push(cube);
		}
	}	
	/*
	camera.position.x = 0.9977996480488888;
	camera.position.y = 5.395765128893392;
	camera.position.z = 26.454917792030614;*/
}

function objectClickHandler(depth, material1,material2) {
	clearScene();
	drawSquare(depth,material1,material2);
    renderer3D.render(scene1, camera1 );
    renderer3D2.render(scene2, camera2 );
}

function showThirukural(a,b){
	clearScene();
	var canvas1 = document.createElement('canvas');
    var context1 = canvas1.getContext('2d');
    context1.font = "Bold 30px Arial";
    context1.fillStyle = "rgba(255,0,0,0.95)";
    context1.fillText("Hello word", 0, 50);

    var texture1 = new THREE.Texture(canvas1);
    texture1.needsUpdate = true;
    texture1.minFilter = THREE.LinearFilter

    var material1 = new THREE.MeshBasicMaterial( { map: texture1, side:THREE.DoubleSide } );
    material1.transparent = true;

    var mesh1 = new THREE.Mesh(
        new THREE.PlaneGeometry(canvas1.width, canvas1.height),
        material1
    );

    mesh1.position.set(0,-10,0);
    camera.position.z = 250
    scene.add( mesh1 );
}


function onDocumentMouseDown(event) {
    event.preventDefault();

	mouse.x = ( ( event.clientX - renderer3D.domElement.offsetLeft ) / renderer3D.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( ( event.clientY - renderer3D.domElement.offsetTop ) / renderer3D.domElement.clientHeight ) * 2 + 1;
    raycaster1.setFromCamera(mouse, camera1);

     
    var intersects = raycaster1.intersectObjects(obj);


    if ( intersects.length > 0 ) {
	    intersects[0].object.callback(intersects[0].object.levelNumber,intersects[0].object.mat1,intersects[0].object.mat2); 
   	} 
}
document.addEventListener('mousedown', onDocumentMouseDown, false);
