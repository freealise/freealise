bezier to nurbs by repeated knot insertion (three in a row)  
  
scene with color and shadows (filmed or drawn cubemap + layers / transparency; apply displacementmap from ascii or dot symbols x2 (0-65535, 16 colors) to cube
https://github.com/ssatguru/BabylonJS-EditControl, 
https://github.com/ssatguru/BabylonJS-MeshEditor, 
https://doc.babylonjs.com/toolsAndResources/assetLibraries/postProcessLibrary/asciiArtPP for depth, 
https://doc.babylonjs.com/features/featuresDeepDive/materials/using/parallaxMapping for display ?) -> 3d video (animation by trilinear interpolation)  
quadtrees for optimizing depth map triangulation (~earcut)  
https://madebyevan.com/shaders/lightmap/, https://madebyevan.com/webgl-path-tracing/  
  
mocap of pose / face / hands for virtual characters (tensorflow / opencv; hand detection for multitouch modelling; physics simulation for hair and clothes, or detect markers by color - https://docs.opencv.org/4.x/df/d9d/tutorial_py_colorspaces.html)  
3d scanner of foil (photogrammetry): ai depth estimation of cube sides from phone camera + gyroscope
  
### face / pose / hands detection (for 3d skeleton rotation)  
https://mediapipe-studio.webapps.google.com/  
detect the skeleton from image of 3d mesh with new detector (image mode) and bind vertices by linear or logarithmic proximity  
3d face points in radial coordinates related to center or average, set as linear and change angle and radius in multitouch  
(~parametric equalizer), also use multitouch for skeleton rotation by phi and theta (third coordinate by touch radius ?)  
  
### 3d video soundtrack editor
load audio files as stroke-dasharray (lossless or for charting; subpixel stroke / gap ratio is volume,  
x/y is theta/phi, backward stroke data or distance is envelope, text along path is filename to include,  
grouped and layered strokes are spectrum (?))  
(https://doc.babylonjs.com/features/featuresDeepDive/mesh/drawCurves)  
  
https://cyos.babylonjs.com/  
https://sandbox.babylonjs.com/  
https://playground.babylonjs.com/  
https://doc.babylonjs.com/features/featuresDeepDive/scene/optimize_your_scene  
