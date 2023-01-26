import * as THREE from '../node_modules/three/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'

class World {
    constuctor () {
    }

    initialize() {
        this.current_plane = 0
        console.log(this.current_plane)
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
        this.spawn_planes()

        this.controls = new OrbitControls( this.camera, this.renderer.domElement )
        this.controls.update()

        document.addEventListener('keydown', this.onArrowUpClick)

        this.animate()
    }
    
    async spawn_planes(){
        // key an array of planes
        this.planes = []

        await this.spawn_plane()
        console.log(this.planes[0])
    }

    async spawn_plane() {
        const loader = new THREE.TextureLoader()
        const texture = await this.load_image(loader, '../temp_img.jpg')
        texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy
        const geometry = new THREE.PlaneGeometry(16, 9)
        const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
        const plane = new THREE.Mesh(geometry, material)

        this.planes.push(plane)
        this.scene.add(plane)
    }

    async load_image(loader, path) {
        const texture = await loader.loadAsync( path )
        return texture
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this))
        this.renderer.render(this.scene, this.camera)
        this.onWindowResize()
    }

    onWindowResize() {
        this.camera.aspect = innerWidth/innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(innerWidth, innerHeight)
    }

    onArrowUpClick(event) {
        if (event.keyCode == 38) {
            console.log('move all the planes down one')
            console.log('make transparent')
        }
        if (event.keyCode == 40) {
            console.log('move all the planes up one')
            console.log('make untransparent')
        }
    }


}

let APP = null 

window.addEventListener('DOMContentLoaded', async() => {
    APP = new World()
    APP.initialize()
})
