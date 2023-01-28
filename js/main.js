import * as THREE from '../node_modules/three/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'

class World {
    constuctor () {
    }

    initialize() {
        // THREEJS INIT
        // scene 
        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(0x6e9b8e)

        // render
        this.renderer = new THREE.WebGLRenderer( {
            antialias: true, 
            canvas: document.querySelector('canvas')
        })

        this.canvasContainer = document.querySelector('#canvasContainer')
        this.canvasWidth = this.canvasContainer.offsetWidth
        this.canvasHeight = this.canvasContainer.offsetHeight
        console.log(this.canvasWidth, this.canvasHeight)
        this.renderer.setPixelRatio( this.canvasWidth / this.canvasHeight )
        this.renderer.setSize( this.canvasWidth, this.canvasHeight )
                
        // camera
        this.camera = new THREE.PerspectiveCamera(70, this.canvasWidth / this.canvasHeight, 0.1, 1000)
        this.camera.position.z = 15

        // planes
        this.planes = []
        this.plane_current_index = 0
        this.spawn_planes()

        this.controls = new OrbitControls( this.camera, this.renderer.domElement )
        this.controls.update()

        document.addEventListener('keydown', this.onArrowClick.bind(this))

        this.animate()
    }
    
    async spawn_planes(){

        for (let i = 0; i < 10; i ++) {
            await this.spawn_plane(i)
        }
    }

    async spawn_plane(i) {
        let x = -8
        let y = -4
        let width = 16
        let height = 9
        let radius = 1

        let shape = new THREE.Shape()
        shape.moveTo(x, y + radius)
        shape.lineTo(x, y + height - radius)
        shape.quadraticCurveTo(x, y + height, x + radius, y + height)
        shape.lineTo(x + width - radius, y + height)
        shape.quadraticCurveTo(x + width, y + height, x + width, y + height - radius)
        shape.lineTo(x + width, y + radius)
        shape.quadraticCurveTo(x + width, y, x + width - radius, y)
        shape.lineTo(x + radius, y)
        shape.quadraticCurveTo(x, y, x, y + radius)

        let geometry2 = new THREE.ShapeBufferGeometry( shape )

        const loader = new THREE.TextureLoader()
        const texture = await this.load_image(loader, '../temp_img.jpg')
        texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy
        // const geometry = new THREE.PlaneGeometry(16, 9)
        const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
        const plane = new THREE.Mesh(geometry2, material)
        
        // position set 
        plane.position.x = this.movePlaneX() * i
        plane.position.y = this.movePlaneY() * i + 4
        plane.position.z = -this.movePlaneZ() * i

        // rotation set
        plane.rotation.x = -0.175 * i
        plane.rotation.y = 0.175 * i

        plane.material.transparent = true
        if (i != this.plane_current_index) {
            plane.material.opacity = 0.3
        }

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

    onArrowClick(event) {
        if (event.keyCode == 37 && this.plane_current_index < this.planes.length - 1) {
            this.plane_current_index += 1
            for (let i = 0; i < this.planes.length; i ++) {
                let plane = this.planes[i]
                if (i == this.plane_current_index) {
                    gsap.to(plane.material, {
                        duration: 0.5,
                        opacity: 1
                    })
                } else {
                    gsap.to(plane.material, {
                        duration: 1,
                        opacity: 0.3
                    })
                }

                // position and rotation change
                if (i < this.plane_current_index) {
                    // position
                    gsap.to(plane.position, {
                        duration: 0.5,
                        x: "-=10",
                        y: "+=8",
                        z: "-=8"
                    })
                    // rotation
                    gsap.to(plane.rotation, {
                        duration: 0.5,
                        x: "-=0.175",
                        y: "-=0.175"
                    })
                } else {
                    // position
                    gsap.to(plane.position, {
                        duration: 0.5,
                        x: "-=10",
                        y: "-=8",
                        z: "+=8"
                    })
                    // rotation
                    gsap.to(plane.rotation, {
                        duration: 0.5,
                        x: "+=0.175",
                        y: "-=0.175"
                    })
                }
            }
        }
        if (event.keyCode == 39 && this.plane_current_index > 0) {
            this.plane_current_index -= 1
            for (let i = this.planes.length - 1; i >=0; i --) {
                let plane = this.planes[i]
                if (i == this.plane_current_index) {
                    gsap.to(plane.material, {
                        duration: 0.5,
                        opacity: 1
                    })
                } else {
                    gsap.to(plane.material, {
                        duration: 1,
                        opacity: 0.3
                    })
                }

                // position and rotation change
                if (i > this.plane_current_index) {
                    // position
                    gsap.to(plane.position, {
                        duration: 0.5,
                        x: "+=10",
                        y: "+=8",
                        z: "-=8"
                    })
                    // rotation
                    gsap.to(plane.rotation, {
                        duration: 0.5,
                        x: "-=0.175",
                        y: "+=0.175"
                    })
                } else {
                    // position
                    gsap.to(plane.position, {
                        duration: 0.5,
                        x: "+=10",
                        y: "-=8",
                        z: "+=8"
                    })
                    // rotation
                    gsap.to(plane.rotation, {
                        duration: 0.5,
                        x: "+=0.175",
                        y: "+=0.175"
                    })
                }
            }
        }
    }
    movePlaneX() {
        return 10
    }

    movePlaneY() {
        return 8
    }

    movePlaneZ() {
        return 8
    }


}

let APP = null 

window.addEventListener('DOMContentLoaded', async() => {
    APP = new World()
    APP.initialize()
})
