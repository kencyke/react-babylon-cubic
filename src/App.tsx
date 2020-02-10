import React from 'react';
import { Engine, Scene, SceneEventArgs, withBabylonJS } from 'react-babylonjs'
import { 
  Vector3,
  ArcRotateCamera,
  Viewport,
  Color3,
  Color4,
  Scalar,
  PointerInfo,
  Scene as BabylonJSScene,
  Nullable,
  AbstractMesh,
  Camera,
  Mesh,
  StandardMaterial,
  BoundingBoxGizmo,
  Quaternion,
  PointerDragBehavior,
  GizmoManager,
  UtilityLayerRenderer
} from '@babylonjs/core';
import { Layout, Menu, Icon } from 'antd';
import './App.css';
import { BoundingBoxGizmoXY } from './boundingBoxGizmoXY';
import { BoundingBoxGizmo2D, Surface } from './boundingBoxGizmo2D';

function onSceneMount(e: SceneEventArgs) {
  const { canvas, scene } = e;

  scene.clearColor = new Color4(0,0,0,0.0000000000000001);
  
  let camera1 = new ArcRotateCamera("camera1",  3 * Math.PI / 8, 3 * Math.PI / 8, 10, new Vector3(0, 1, 0), scene);
  camera1.attachControl(canvas, true);
  
  let camera2 = new ArcRotateCamera("camera2",  7 * Math.PI / 8, 7 * Math.PI / 8, 10, new Vector3(0, 1, 0), scene);
	camera2.attachControl(canvas, true);

  camera1.viewport = new Viewport(0, 0.5, 1, 0.5);
  camera2.viewport = new Viewport(0, 0, 1, 0.5);
    
  scene.activeCameras.push(camera1);
  scene.activeCameras.push(camera2);

  const boxSize = 4;
  let box = Mesh.CreateBox("box1", boxSize, scene);
  box.enableEdgesRendering();
  box.showBoundingBox = true;
  box.position = new Vector3(0, boxSize / 2, 0);
  box.edgesWidth = 4;
  box.edgesColor = Color4.FromColor3(Color3.Red());
  let material = new StandardMaterial("box1-mat", scene);
  material.diffuseColor = new Color3(0.7, 0, 0.2);
  box.material = material;

  let boundingBox = BoundingBoxGizmo.MakeNotPickableAndWrapInBoundingBox(box);
  boundingBox.rotationQuaternion = new Quaternion()
 
  let pointerDragBehavior = new PointerDragBehavior();
  pointerDragBehavior.attach(boundingBox);
  
  let gizmo = new BoundingBoxGizmo2D(Surface.ZX, Color3.Red());
  gizmo.scaleBoxSize = 0.2;
  //gizmo.rotationSphereSize = 0.2;
  gizmo.attachedMesh = boundingBox;
  // gizmo.onRotationSphereDragEndObservable.add(()=>{
  //   console.log("try to rotate");

  //   if (boundingBox.rotationQuaternion) {
  //     const euler = boundingBox.rotationQuaternion.toEulerAngles()
  //     console.log("rotation: "+euler)
  //   }
  // });
  
  scene.getEngine().runRenderLoop(() => {
      if (scene) {
          scene.render();
      }
  });
}

const { Header, Content, Footer, Sider } = Layout;

const App: React.FC = () => {
  const EngineWithContext = withBabylonJS(Engine);
  
  const theme = "light";

  return (
    <div>
      <Layout>
        <Sider theme={theme} collapsed={true}>
          <Menu theme={theme} mode="inline" defaultSelectedKeys={['1']} >
            <Menu.Item key="1">
              <Icon type="home" />
              <span className="nav-text">Home</span>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="2">
              <Icon type="project" />
              <span className="nav-text">Edit</span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="play-square" />
              <span className="nav-text">Preview</span>
            </Menu.Item>
            <Menu.Item key="4">
              <Icon type="download" />
              <span className="nav-text">Download</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Content>
          <EngineWithContext antialias={true} adaptToDeviceRatio={true} canvasId="renderCanvas" 
            engineOptions={{ preserveDrawingBuffer: true, stencil: true }}>
            <Scene onSceneMount={onSceneMount}>
              <hemisphericLight name="light1" intensity={0.7} direction={new Vector3(1, 0.5, 0)} />
              <hemisphericLight name="light2" intensity={0.8} direction={new Vector3(-1, 0.5, 0)} />
            </Scene>
          </EngineWithContext>
        </Content>
      </Layout>
    </div>
  );
}

export default App;
