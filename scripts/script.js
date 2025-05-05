let scene,
    camera,
    renderer,
    mixer,
    actions = [],
    currentModel = 'coca-cola',
    rotating = false;

const keyLight = new THREE.DirectionalLight(0xffffff, 3);
keyLight.position.set(5, 10, 10);
const fillLight = new THREE.DirectionalLight(0xffffff, 1.8);
fillLight.position.set(-5, 5, 10);
const backLight = new THREE.DirectionalLight(0xffffff, 2);
backLight.position.set(0, 5, -10);

const animationBtn = document.getElementById("btn");
const wireframeBtn = document.getElementById("wireframe-btn");
const switchModelBtn = document.getElementById("switch-model-btn");
const rotateBtn = document.getElementById("rotate-btn");

const loader = new THREE.GLTFLoader();
let model;

init();

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color('#f5f5f5');

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 3, 20);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const canvasContainer = document.getElementById("canvas-container");
    canvasContainer.appendChild(renderer.domElement);

    scene.add(keyLight, fillLight, backLight);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.5, 0);
    controls.update();

    addModel();
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    if (mixer) mixer.update(0.02);
    if (rotating && model) {
        model.rotation.y += 0.02;
    }
    renderer.render(scene, camera);
}

function onResize() {
    renderer.setSize(renderer.domElement.width, renderer.domElement.height);
    camera.updateProjectionMatrix();
}

function addModel() {
    let modelPath = currentModel === 'coca-cola' ? './assets/Parnship.glb' : '../assets/CocaCola Crash Can Video.glb';

    loader.load(modelPath, function (gltf) {
        if (model) scene.remove(model);
        model = gltf.scene;
        scene.add(model);

        mixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach(clip => {
            const action = mixer.clipAction(clip);
            actions.push(action);
        });

        animationBtn.innerText = currentModel === 'coca-cola' ? 'Open Can' : 'Crash Can';
    });
}

animationBtn.addEventListener('click', function () {
    actions.forEach(action => {
        action.reset();
        action.play();
        action.timeScale = 1.0;
    });
});

wireframeBtn.addEventListener('click', function () {
    model.traverse(child => {
        if (child.isMesh) {
            child.material.wireframe = !child.material.wireframe;
        }
    });
});

switchModelBtn.addEventListener('click', function () {
    currentModel = currentModel === 'coca-cola' ? 'crash-can' : 'coca-cola';
    addModel();
});

rotateBtn.addEventListener('click', function () {
    rotating = !rotating;
    rotateBtn.innerText = rotating ? 'Stop Rotation' : 'Rotate Model';
});
