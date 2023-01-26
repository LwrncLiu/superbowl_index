import * as THREE from '../node_modules/three/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'

class World {
    constuctor () {

    }

    async initialize() {
        // THREEJS INIT
        // scene 
        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(0x6e9b8e)

        // render
        this.renderer = new THREE.WebGLRenderer( {
            antialias: true, 
            canvas: document.querySelector('canvas')
        })
        this.renderer.setPixelRatio( devicePixelRatio )
        this.renderer.setSize( innerWidth, innerHeight )
        
        document.body.appendChild( this.renderer.domElement )
        
        // camera
        this.camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 1000)
        this.camera.position.z = 15

        // planes
        this.loader = new THREE.TextureLoader()
        this.texture = await this.load_image(this.loader)
        this.texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy
        this.geometry = new THREE.PlaneGeometry(16, 9)
        this.material = new THREE.MeshBasicMaterial({ map: this.texture })
        this.plane = new THREE.Mesh(this.geometry, this.material)

        this.scene.add(this.plane)

        this.controls = new OrbitControls( this.camera, this.renderer.domElement )
        this.controls.update()

        this.animate()
        
    }

    async load_image(loader) {
        const texture = await loader.loadAsync( '../temp_img.jpg' )
        return texture
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this))
        this.renderer.render(this.scene, this.camera)
    }
}

let APP = null 

window.addEventListener('DOMContentLoaded', async() => {
    APP = new World()
    APP.initialize()
})
