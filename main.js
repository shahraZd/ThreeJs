import * as THREE from "three";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";

//scene
const scene = new THREE.Scene();

//sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//create an object
const geometry = new THREE.SphereGeometry(1, 50, 50); //(radius(size), segments, segments)
const material = new THREE.MeshStandardMaterial({
  color: "#00ff83",
});

// Get Eth price
// let r = Math.sqrt(A/(4*Math.PI))
let eth;
let prevEth = 0;
// let diff = 0;

const getEth = async () =>
  await fetch(`https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=usd`)
    .then((res) => res.json())
    .then((data) => {
      eth = data.USD;
    });

setInterval(async () => {
  await getEth();
 const diff = eth - prevEth;
  console.log("eth:", eth);
  console.log("diff:", diff);
  prevEth = eth;
  console.log("prevEth:", prevEth);
  geometry.scale(diff, diff, diff);
  // const sc = eth / 1700;
  // console.log("third", sc);
}, 10000);

// console.log("sec", Math.sqrt(eth / (4 * Math.PI)));

const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

//Lights
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 10, 10);
// scene.add(light)

//Camera
const camera = new THREE.PerspectiveCamera(
  45 /*radius that camera covers*/,
  sizes.width / sizes.height /*aspect ratio */
);
console.log(sizes.width, sizes.height);
camera.position.z = 15;

//add elements to the scene
scene.add(camera, mesh, light);

//Render the scene
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });

renderer.setSize(sizes.width, sizes.height);
// renderer.setPixelRatio(3);

renderer.render(scene, camera);

//controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
// controls.autoRotateSpeed = 5

//resize
window.addEventListener("resize", () => {
  //Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  //Update Camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

//Rerender the canvas after resizing
const loop = () => {
  controls.update();
  // mesh.rotate.x += 0.1
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};
loop();

//Timeline
const tl = gsap.timeline({ defaults: { duration: 1 } });
tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
tl.fromTo("nav", { y: "-100%" }, { y: "0%" });
tl.fromTo(".title", { opacity: 0 }, { opacity: 1 });

//Mouse animation color
let rgb = [];
let mouseDown = false;
window.addEventListener("mousedown", () => (mouseDown = true));
window.addEventListener("mouseup", () => (mouseDown = false));

window.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.height) * 255),
      150,
    ];

    //Let's animate
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
    new THREE.Color(`rgb(0,100,150)`);
    gsap.to(mesh.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    });
  }
});

//Get API value

/*request.get("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,EUR,CNY,JPY,GBP", function(error, response, body) {
    if (error)
        throw error;
    else if (!response)
        throw new Error("no response");
    else if (response.statusCode != 200)
        throw new Error("bad response");
    else
        console.log(JSON.stringify(JSON.parse(body), null, 4));
});*/

//r = √(A/(4π))
/*

  let r = Math.sqrt(A/(4*Math.PI))

*/
