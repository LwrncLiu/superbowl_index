import * as THREE from '../node_modules/three/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'
let camera, scene, renderer;


init().then(animate)

async function init() {
    camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 1000)
    camera.position.z = 15

    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x6e9b8e)

    renderer = new THREE.WebGLRenderer( {antialias: true })
    renderer.setPixelRatio( devicePixelRatio )
    renderer.setSize( innerWidth, innerHeight )
    document.body.appendChild( renderer.domElement )

    window.addEventListener('resize', () => {
            renderer.setSize(innerWidth, innerHeight)
            camera.aspect = innerWidth / innerHeight
            camera.updateProjectionMatrix()
        })

    const loader = new THREE.TextureLoader()
    const texture = await load_image(loader)
    console.log(texture)
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy

    const geometry = new THREE.PlaneGeometry(16, 9)
    const material = new THREE.MeshBasicMaterial({ map: texture })
    const plane = new THREE.Mesh(geometry, material)
    
    scene.add( plane )

    const texture_2 = await load_image_2(loader)
    console.log(texture)
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy

    const geometry_2 = new THREE.PlaneGeometry(16, 9)
    const material_2 = new THREE.MeshBasicMaterial({ map: texture_2 })
    const plane_2 = new THREE.Mesh(geometry_2, material_2)
    plane_2.position.set(18, 0, 4)
    plane_2.rotation.y = - Math.PI / 2


    scene.add( plane_2 )

    // const ambientLight = new THREE.AmbientLight(0x404040)
    // scene.add(ambientLight)

    const controls = new OrbitControls( camera, renderer.domElement )
    controls.update()

}

async function load_image(loader) {
    const texture = await loader.loadAsync( '../temp_img.jpg' )
    return texture
}

async function load_image_2(loader) {
    const texture = await loader.loadAsync( '../temp_img_2.jpg')
    return texture
}

function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}
