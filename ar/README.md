[pose-detection](https://github.com/freealise/tfjs-models/tree/master/pose-detection)  
[face-landmarks-detection](https://github.com/freealise/tfjs-models/tree/master/face-landmarks-detection)  
[hand-pose-detection](https://github.com/freealise/tfjs-models/tree/master/hand-pose-detection)  
[opencv](https://docs.opencv.org/4.x/d1/d0d/tutorial_js_pose_estimation.html)  
hand detection on video for chord transcription; pose detection for music, remote acting or rtc  
common midi / web audio controls  
  
([MindAR.js](https://github.com/hiukim/mind-ar-js))  
([AR.js](https://github.com/AR-js-org/AR.js))  
[jsartoolkit5](https://github.com/artoolkitx/jsartoolkit5)   

scene with color and shadows (filmed or drawn cubemap + layers / transparency) -> 3d video  
normals from depth map in opencv (https://answers.opencv.org/question/82453/calculate-surface-normals-from-depth-image-using-neighboring-pixels-cross-product/)  
foil -> mocap for auto quality feedback ?

//https://www.google.com/streetview/how-it-works/  
//upload video/subs to archive.org for transcoding (https://archive.org/details/download_20240209_0047)  
  
//correct depth map (subtract ground with range to find beginning of data from below (remove 224): n > depth > 0 from sphere to cylinder), show depth in 3d for paper model  
//use precise latlng from gsv url for offset direction (multiply values for all meshes by negative radius of displacement) and metadata pitch + heading for rotation  
//use gradio api, add scene from video (<- local webgl file)  
//color foil by hand and use hs(l) color from combined changed objects for paper in grayscale filmed video and remove background, keeping shadows  
  
//draw objects on pano and find depth map  
//scanned foil + mocap (sparse optical flow to track hair and clothes -  
https://docs.opencv.org/4.x/dc/d0d/tutorial_py_features_harris.html,  
https://docs.opencv.org/4.x/d4/d8c/tutorial_py_shi_tomasi.html)  
//face movement with mocap + morph by points  