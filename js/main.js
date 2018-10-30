var camera, scene, controls, raycaster, mouse, geometry,renderer2D,renderer3D;
var obj = [];
var prevScene;
var CANVAS_WIDTH = 1000, CANVAS_HEIGHT = 500;

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

	container = document.getElementById( 'canvas' );
	document.body.appendChild( container );

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	raycaster = new THREE.Raycaster();
	renderer3D = new THREE.WebGLRenderer();
	renderer3D.setSize( CANVAS_WIDTH, CANVAS_HEIGHT );
	container.appendChild( renderer3D.domElement );

	controls = new THREE.OrbitControls( camera, renderer3D.domElement );
	

	renderer3D.setClearColor( 0xffffff, 1);
	
	geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
	drawPyramid(0,0,0);
	
	camera.position.x =  29.171791366717322;
	camera.position.y = 25.181160081788118;
	camera.position.z = 31.857742628630625;
}


function drawPyramid(x, y, z){
	var depth = 19;
	for (var Z = -4; Z <= 5; Z++){
		var material = new THREE.MeshLambertMaterial( { color: randomRGB(), emissive : randomRGB() } );
		h = parseInt(depth / 2);
		for (var I = -h; I <= h ; I++) { 
			for (var J= -h; J <= h; J++){
				var cube = new THREE.Mesh(geometry, material);

				cube.callback = objectClickHandler;
				scene.add(cube);
				obj.push(cube);
				cube.position.z = 1*I + z;
				cube.position.x = 1*J + x;
				cube.position.y = 2*Z + y;
				cube.levelNumber = depth;
				cube.mat = material;
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
   renderer3D.render( scene, camera );
}


function clearScene(){
	for(var I=0;I<obj.length;I++){2
		scene.remove(obj[I]); 
		geometry.dispose();
	}
	obj = []
	renderer3D.clear();
	renderer3D.renderLists.dispose();
}

function objectClickHandler(depth, material) {
	clearScene();
	h = parseInt(depth/2);
	for (var I = -h; I <= h ; I++) { 
		for (var J= -h; J <= h; J++){
			var cube = new THREE.Mesh(geometry, material);
			cube.callback = showThirukural;
			scene.add(cube);
			cube.position.y = 2*I;
			cube.position.x = 2*J;
			obj.push(cube);
		}
	}	
    renderer3D.render(scene, camera );
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
    raycaster.setFromCamera(mouse, camera);

     
    var intersects = raycaster.intersectObjects(obj);


    if ( intersects.length > 0 ) {
	    intersects[0].object.callback(intersects[0].object.levelNumber,intersects[0].object.mat); 
   	} 
}
document.addEventListener('mousedown', onDocumentMouseDown, false);
