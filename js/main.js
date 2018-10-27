var camera, scene, controls, raycaster, mouse, geometry,renderer2D,renderer3D;
var obj = [];
var prevScene;


init();
animate();


function init(){
	var canvas3D = document.getElementById('canvas3D');
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	raycaster = new THREE.Raycaster();
	renderer3D = new THREE.WebGLRenderer();
	controls = new THREE.OrbitControls( camera, renderer3D.domElement );
	mouse = new THREE.Vector2();

	renderer3D.setSize( window.innerWidth, window.innerHeight );
	renderer3D.setClearColor( 0xffffff, 1);
	document.body.appendChild( renderer3D.domElement );
	
	geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
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
				cube.position.z = 2*I;
				cube.position.x = 2*J;
				cube.position.y = 2*Z;
				cube.levelNumber = depth;
				cube.mat = material;
			}
		}	
		depth = depth - 2;
	}
	
	camera.position.z = 50
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

    mouse.x = (event.clientX / renderer3D.domElement.clientWidth) * 2 - 1;
    mouse.y =  - (event.clientY / renderer3D.domElement.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

     
    var intersects = raycaster.intersectObjects(obj);

    if (intersects.length > 0) {
        intersects[0].object.callback(intersects[0].object.levelNumber,intersects[0].object.mat);
    }

}
document.addEventListener('mousedown', onDocumentMouseDown, false);
