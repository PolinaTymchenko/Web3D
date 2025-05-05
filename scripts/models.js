let scene, camera, renderer, mixer;
let model;
let actions = [];
let rotating = false;

const loader = new THREE.GLTFLoader();

const container = document.getElementById("canvas-container");
const modelPath = container.dataset.model;
const bgColor = container.dataset.bg || '#3a2f2b';
const camX = parseFloat(container.dataset.camX) || 0;
const camY = parseFloat(container.dataset.camY) || 3;
const camZ = parseFloat(container.dataset.camZ) || 20;
const lightTop = parseFloat(container.dataset.lightTop) || 1.5;
const lightBottom = parseFloat(container.dataset.lightBottom) || 0.5;
const modelName = modelPath.toLowerCase();

const animationBtn = document.getElementById("btn");
const wireframeBtn = document.getElementById("wireframe-btn");
const rotateBtn = document.getElementById("rotate-btn");

let lights = [];

if (modelName.includes('chest')) {
    const pointLight = new THREE.PointLight(0xffffff, 1.2, 100, 2);
    pointLight.position.set(0, 6, 4);
    pointLight.castShadow = false;

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-4, 3, 3);

    const frontTopLight = new THREE.DirectionalLight(0xffffff, 0.8);
    frontTopLight.position.set(0, 7, 5);
    frontTopLight.target.position.set(0, 1.5, 0);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);

    lights.push(pointLight, fillLight, frontTopLight, ambientLight);


} else {
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, lightTop);
    hemiLight.position.set(0, 20, 0);
    const ambientLight = new THREE.AmbientLight(0xffffff, lightBottom);

    lights.push(hemiLight, ambientLight);
}

init();

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(bgColor);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(camX, camY, camZ);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    container.appendChild(renderer.domElement);

    lights.forEach(light => scene.add(light));

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.5, 0);
    controls.update();

    addModel();
    animate();
}

function addModel() {
    loader.load(modelPath, gltf => {
        if (model) scene.remove(model);

        model = gltf.scene;
        scene.add(model);

        mixer = new THREE.AnimationMixer(model);
        actions = gltf.animations.map(clip => mixer.clipAction(clip));
    });
}

function animate() {
    requestAnimationFrame(animate);

    if (mixer) mixer.update(0.02);
    if (rotating && model) model.rotation.y += 0.02;

    renderer.render(scene, camera);
}

animationBtn?.addEventListener('click', () => {
    actions.forEach(action => {
        action.reset();
        action.play();
        action.timeScale = 1.0;
    });
});

wireframeBtn?.addEventListener('click', () => {
    model?.traverse(child => {
        if (child.isMesh) {
            child.material.wireframe = !child.material.wireframe;
        }
    });
});

rotateBtn?.addEventListener('click', () => {
    rotating = !rotating;
    rotateBtn.innerText = rotating ? 'Stop Rotation' : 'Rotate Model';
});
