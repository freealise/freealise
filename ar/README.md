[pose-detection](https://github.com/freealise/tfjs-models/tree/master/pose-detection)  
[face-landmarks-detection](https://github.com/freealise/tfjs-models/tree/master/face-landmarks-detection)  
[hand-pose-detection](https://github.com/freealise/tfjs-models/tree/master/hand-pose-detection)  
[opencv](https://docs.opencv.org/4.x/d1/d0d/tutorial_js_pose_estimation.html)  
hand detection on video for chord transcription; pose detection for music, remote acting or rtc  
common midi / web audio controls  
sparse optical flow to track hair and clothes  
  
([MindAR.js](https://github.com/hiukim/mind-ar-js))  
([AR.js](https://github.com/AR-js-org/AR.js))  
[jsartoolkit5](https://github.com/artoolkitx/jsartoolkit5)   

face movement with mocap + morph by points  
scene with color and shadows (filmed or drawn cubemap + layers / transparency) -> 3d video  
normals from depth map in opencv (https://answers.opencv.org/question/82453/calculate-surface-normals-from-depth-image-using-neighboring-pixels-cross-product/)  
foil -> mocap for auto quality feedback ?

//https://www.google.com/streetview/how-it-works/  
//upload video/subs to archive.org for transcoding (https://archive.org/details/download_20240209_0047)  
  
//correct depth map by algorithm (non-zero depth from sphere to cylinder without roof, bottom 1/4 of image to ground) for paper model  
//load several panos and move / rotate / scale with keyboard in text input with preventdefault to match (only holes from objects removed from depth map to 255) for inpainting / animation  
//use precise latlng from gsv url for offset direction (multiply values for all meshes by negative radius of svg circle displacement) and metadata pitch + heading for rotation  
//delete points that changed position more than by given distance / by segmentation, and add them from video  
//color foil by hand and use hs(l) color from combined changed objects for paper in grayscale filmed video and remove background, keeping shadows  
  
//draw objects on pano and find depth map  
