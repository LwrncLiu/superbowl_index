import * as THREE from '../node_modules/three/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'

class World {
    constuctor () {
    }

    async initialize() {
        // THREEJS INIT
        // scene 
        this.scene = new THREE.Scene()
        // this.scene.background = new THREE.Color(0x6e9b8e)

        // render
        this.renderer = new THREE.WebGLRenderer( {
            antialias: true, 
            canvas: document.querySelector('canvas'),
            alpha: true 
        })

        // camera
        this.camera = new THREE.PerspectiveCamera(70, 2, 0.1, 1000)
        this.camera.position.z = 12

        // planes
        this.planes = []
        this.plane_current_index = 0
        this.commercials = await this.getCommercials()
        this.spawn_planes()
        this.setText()

        // this.controls = new OrbitControls( this.camera, this.renderer.domElement )
        // this.controls.update()

        document.getElementById('next').addEventListener("click", this.onClickNext.bind(this))
        document.getElementById('previous').addEventListener("click", this.onClickPrevious.bind(this))
        this.animate()
    }
    
    async spawn_planes(){

        console.log(this.commercials.length)
        for (let i = 0; i < 7; i ++) {
            await this.spawn_plane(i)
        }
    }

    async spawn_plane(i) {
        const w = 16	// width
        const h = 9 	// height
        const r = 1 	// radius corner
        const s = 18	// smoothness

        // helper const's
        const wi = w / 2 - r
        const hi = h / 2 - r
        const w2 = w / 2
        const h2 = h / 2
        const ul = r / w
        const ur = ( w - r ) / w
        const vl = r / h
        const vh = ( h - r ) / h

        let positions = [
            -wi, -h2, 0,  wi, -h2, 0,  wi, h2, 0,
            -wi, -h2, 0,  wi,  h2, 0, -wi, h2, 0,	
            -w2, -hi, 0, -wi, -hi, 0, -wi, hi, 0,
            -w2, -hi, 0, -wi,  hi, 0, -w2, hi, 0,	
            wi, -hi, 0,  w2, -hi, 0,  w2, hi, 0,
            wi, -hi, 0,  w2,  hi, 0,  wi, hi, 0
        ]

        let uvs = [
            ul,  0, ur,  0, ur,  1,
            ul,  0, ur,  1, ul,  1,
            0, vl, ul, vl, ul, vh,
            0, vl, ul, vh,  0, vh,
            ur, vl,  1, vl,  1, vh,
            ur, vl,  1, vh,	ur, vh 
        ]

        
        let phia = 0
        let phib, xc, yc, uc, vc

        for ( let i = 0; i < s * 4; i ++ ) {

            phib = Math.PI * 2 * ( i + 1 ) / ( 4 * s )
            
            
            xc = i < s || i >= 3 * s ? wi : - wi
            yc = i < 2 * s ? hi : -hi

            positions.push( xc, yc, 0, xc + r * Math.cos( phia ), yc + r * Math.sin( phia ), 0,  xc + r * Math.cos( phib ), yc + r * Math.sin( phib ), 0 )
            
            uc = xc = i < s || i >= 3 * s ? ur : ul
            vc = i < 2 * s ? vh : vl
            
            uvs.push( uc, vc, uc + ul * Math.cos( phia ), vc + vl * Math.sin( phia ), uc + ul * Math.cos( phib ), vc + vl * Math.sin( phib ) )
            
            phia = phib
                
        }

        const loader = new THREE.TextureLoader()
        const imageTexture = await this.load_image(loader, '../static/' + this.commercials[i].imageLoc)
        imageTexture.minFilter = THREE.LinearFilter;
        imageTexture.magFilter = THREE.LinearFilter;
        imageTexture.format = THREE.RGBAFormat;
        
        const material = new THREE.MeshBasicMaterial( { map: imageTexture, wireframe: false } );
        
        const geometry = new THREE.BufferGeometry( );
        geometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array( positions ), 3 ) );
        geometry.setAttribute( 'uv', new THREE.BufferAttribute( new Float32Array( uvs ), 2 ) );
        const plane = new THREE.Mesh( geometry, material );
        
        // position set 
        plane.position.x = -this.movePlaneX() * i
        plane.position.y = this.movePlaneY() * i - 2
        plane.position.z = -this.movePlaneZ() * i

        // rotation set
        plane.rotation.x = -0.175 * i
        plane.rotation.y = -0.175 * i

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
        this.resizeCanvasToDisplaySize()
        requestAnimationFrame(this.animate.bind(this))
        this.renderer.render(this.scene, this.camera)
        // this.onWindowResize()
    }

    resizeCanvasToDisplaySize() {
        const canvasContainer = document.querySelector('.canvasContainer')
        const canvasWidth = canvasContainer.offsetWidth
        const canvasHeight = canvasContainer.offsetHeight
        const canvas = this.renderer.domElement
        const width = canvas.clientWidth
        const height = canvas.clientHeight

        if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
            this.renderer.setSize(canvasWidth, canvasHeight, false)
            this.camera.aspect = canvasWidth / canvasHeight
            this.camera.updateProjectionMatrix()
        }
    }

    onClickNext(event) {
        console.log('clicked')
        if (this.plane_current_index < this.planes.length - 1) {
            this.plane_current_index += 1
            this.setText()
            for (let i = this.planes.length - 1; i >=0; i --)  {
                let plane = this.planes[i]
                if (i == this.plane_current_index) {
                    gsap.to(plane.material, {
                        duration: 0.3,
                        opacity: 1
                    })
                } else {
                    gsap.to(plane.material, {
                        duration: 0.3,
                        opacity: 0.3
                    })
                }

                // position and rotation change
                if (i < this.plane_current_index) {
                    // position
                    gsap.to(plane.position, {
                        duration: 0.3,
                        x: "+=10",
                        y: "+=8",
                        z: "-=8"
                    })
                    // rotation
                    gsap.to(plane.rotation, {
                        duration: 0.3,
                        x: "-=0.175",
                        y: "+=0.175"
                    })
                } else {
                    // position
                    gsap.to(plane.position, {
                        duration: 0.3,
                        x: "+=10",
                        y: "-=8",
                        z: "+=8"
                    })
                    // rotation
                    gsap.to(plane.rotation, {
                        duration: 0.3,
                        x: "+=0.175",
                        y: "+=0.175"
                    })
                }
            }
        }
    }

    onClickPrevious(event) {
        if (this.plane_current_index > 0) {
            this.plane_current_index -= 1
            this.setText()
            for (let i = this.planes.length - 1; i >=0; i --) {
                let plane = this.planes[i]
                if (i == this.plane_current_index) {
                    gsap.to(plane.material, {
                        duration: 0.3,
                        opacity: 1
                    })
                } else {
                    gsap.to(plane.material, {
                        duration: 0.3,
                        opacity: 0.3
                    })
                }

                // position and rotation change
                if (i > this.plane_current_index) {
                    // position
                    gsap.to(plane.position, {
                        duration: 0.3,
                        x: "-=10",
                        y: "+=8",
                        z: "-=8"
                    })
                    // rotation
                    gsap.to(plane.rotation, {
                        duration: 0.3,
                        x: "-=0.175",
                        y: "-=0.175"
                    })
                } else {
                    // position
                    gsap.to(plane.position, {
                        duration: 0.3,
                        x: "-=10",
                        y: "-=8",
                        z: "+=8"
                    })
                    // rotation
                    gsap.to(plane.rotation, {
                        duration: 0.3,
                        x: "+=0.175",
                        y: "-=0.175"
                    })
                }
            }
        }
    }

    async getCommercials() {
        const response = await fetch('../static/commercials.json')
        const data = await response.json()
        return data.commercials
    }

    setText() {
        const currentCommercial = this.commercials[this.plane_current_index]

        document.querySelector("#commercialName").textContent = currentCommercial.commercialName
        document.querySelector('#oneYearReturn').textContent = currentCommercial.ticker+ ': ' + currentCommercial.oneYearReturn
        document.querySelector("#commentary").textContent = currentCommercial.commentary 
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
