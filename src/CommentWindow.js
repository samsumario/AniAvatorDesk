import * as THREE from 'three';

export class CommentWindow {
    constructor(mainScene) {
        this.scene = mainScene;
        this.contenar = new THREE.Group();
        this.scene.add(this.contenar);
    }

    async load() {
        this._createBackImg().then( plane => {
            plane.position.set(0.3, 1.5, -1);
            this.backBoard = plane;
            this.backBoard.visible = false;
            this.contenar.add(this.backBoard);
        }).catch(error => {
            console.error('An error occurred:', error);
        });

        this._createTextPlane();
        this.textPlane.position.set(0.3, 1.5, -0.9);
        this.contenar.add(this.textPlane);

    }

    async _createBackImg() {
        return new Promise((resolve, reject) => {
            var texture = new THREE.TextureLoader().load('res/img/comment_window.png',
                (tex) => {
                    // risize
                    const w = 1;
                    const h = tex.image.height / (tex.image.width / w);

                    // set texture
                    const geometry = new THREE.PlaneGeometry(1, 1);
                    const material = new THREE.MeshPhongMaterial({ map: texture, transparent: true });
                    const plane = new THREE.Mesh(geometry, material);
                    plane.scale.set(w, h, 1);
                    resolve(plane);
                },
                undefined,
                (err) => {
                    reject(err);
                }
            );
        });
    }

    _createTextPlane() {
        // set canvas
        this.textCanvas = document.createElement('canvas');
        this.textCanvas.width = 600;
        this.textCanvas.height = 200;
        
        // set textStyle
        this.comment = this.textCanvas.getContext('2d');
        this.comment.fillStyle = '#FFFFFF'; // 白色
        this.comment.font = '32px Arial';
        this.comment.textAlign = 'center';
        this.comment.textBaseline = 'middle';

        // textPlane
        this.textTexture = new THREE.Texture(this.textCanvas);
        this.textTexture.needsUpdate = true;
        
        // createMesh
        const textMaterial = new THREE.MeshBasicMaterial({ map: this.textTexture, transparent: true });
        const textGeometry = new THREE.PlaneGeometry(2, 1);
        this.textPlane = new THREE.Mesh(textGeometry, textMaterial);
    }
    
    update() {
        /*
        TODO set text update logic
        this.comment.clearRect(0, 0, this.textCanvas.width, this.textCanvas.height);
        this.comment.fillText("update", 600 / 2, 200 / 2);
        this.textTexture.needsUpdate = true;
        */

        //TODO backBoard.visible logic
        // this.contenar.position.x -= ;
    }
}
