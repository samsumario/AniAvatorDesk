import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';

export class VrmModel {
    constructor(mainScene, path) {
        this.scene = mainScene;

        this.modelPath = path;
        this.initPose = {"head": {"rotation": [0.0, -0.08987854919801104, 0.0, 0.9959527330119943]}, "neck": {"rotation": [0.0, 0.0, -0.014999437506328097, 0.9998875021093592]}, "leftUpperArm": {"rotation": [-0.0, 0.0, -0.361615431964962, 0.9323273456060345]}, "rightUpperArm": {"rotation": [-0.08670732274264398, -0.25733165206217856, 0.3880401484331022, 0.8807310056048719]}, "leftLowerArm": {"rotation": [-0.0, 0.0, 0.034992854604336196, 0.9993875625234886]}, "rightLowerArm": {"rotation": [-0.0, 0.674287911628145, 0.0, 0.7384685587295879]}, "leftHand": {"rotation": [-0.0, 0.0, 0.0, 1.0]}, "rightHand": {"rotation": [-0.0, 0.0, 0.0, 1.0]}, "spine": {"rotation": [0.0, 0.0, 0.0, 1.0]}, "hips": {"rotation": [-0.0, 0.0, 0.0, 1.0]}, "p_hips": {"rotation": [-0.0, 0.0, 0.0, 1.0]}, "chest": {"rotation": [-0.0, 0.0, 0.07492970727274234, 0.9971888181122075]}, "upperChest": {"rotation": [-0.0, 0.0, 0.0, 1.0]}, "leftUpperLeg": {"rotation": [-0.0, 0.0, 0.0, 1.0]}, "rightUpperLeg": {"rotation": [-0.0, 0.0, 0.0, 1.0]}, "leftLowerLeg": {"rotation": [-0.0, 0.0, 0.0, 1.0]}, "rightLowerLeg": {"rotation": [-0.0, 0.0, 0.0, 1.0]}}
        
        // gltf and vrm
        this.avatar = undefined;
        this.loader = new GLTFLoader();
        this.loader.crossOrigin = 'anonymous';
        
        this.loader.register( ( parser ) => {
            // assigning `helperRoot` to options will make helpers appear
            return new VRMLoaderPlugin( parser );
        } );
    }
    
    async load() {
        await this.#_vrmModelLoad().then((vrm) => {
            this.avatar = vrm;
            this.avatar.humanoid.setNormalizedPose(this.initPose);
            this.scene.add(this.avatar.scene);
        }).catch(error => {
            console.error('An error occurred:', error);
        });
        
    }
    
    async #_vrmModelLoad() {
        return new Promise((resolve, reject) => {
            
            this.loader.load(
                
                // URL of the VRM you want to load
                this.modelPath,
                
                // called when the resource is loaded
                ( gltf ) => {
                    
                    const vrm = gltf.userData.vrm;
                    
                    // calling this function greatly improves the performance
                    VRMUtils.removeUnnecessaryVertices( gltf.scene );
                    VRMUtils.removeUnnecessaryJoints( gltf.scene );
                    
                    // Disable frustum culling
                    vrm.scene.traverse( ( obj ) => {
                        obj.frustumCulled = false;
                    } );
                    
                    console.log( vrm );
                    resolve(vrm)
                },
                
                // called while loading is progressing
                ( progress ) => console.log( 'Loading model...', 100.0 * ( progress.loaded / progress.total ), '%' ),
        
                // called when loading has errors
                ( error ) => resolve(error)
            );
        });
    }

    update( deltaTime, elapsedTime ){
        // rotation motion volume
        const randomRotation = 0.1 * Math.PI * Math.sin( Math.PI * elapsedTime );
        
        if(this.avatar){
            // set pose
            this.avatar.humanoid.getNormalizedBoneNode( 'spine' ).rotation.y = randomRotation*0.1;
            this.avatar.humanoid.getNormalizedBoneNode( 'neck' ).rotation.z = randomRotation*0.3;
            this.avatar.humanoid.getNormalizedBoneNode( 'head' ).rotation.z = randomRotation*-0.1;
            this.avatar.humanoid.getNormalizedBoneNode( 'leftLowerArm' ).rotation.y = randomRotation*0.3;
            this.avatar.humanoid.getNormalizedBoneNode( 'rightHand' ).rotation.z = randomRotation*0.2;
            this.avatar.update( deltaTime );
        }
    }
}