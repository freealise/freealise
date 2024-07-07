[pose-detection](https://github.com/freealise/tfjs-models/tree/master/pose-detection)  
[face-landmarks-detection](https://github.com/freealise/tfjs-models/tree/master/face-landmarks-detection)  
[hand-pose-detection](https://github.com/freealise/tfjs-models/tree/master/hand-pose-detection)  
[opencv](https://docs.opencv.org/4.x/d1/d0d/tutorial_js_pose_estimation.html)  
hand detection on video for chord transcription; pose detection for music, remote acting or rtc  
common midi / web audio controls  
  
([MindAR.js](https://github.com/hiukim/mind-ar-js))  
([AR.js](https://github.com/AR-js-org/AR.js))  
[jsartoolkit5](https://github.com/artoolkitx/jsartoolkit5)   

face movement with mocap  
scene with color and shadows (filmed or drawn cubemap + layers / transparency) -> 3d video  
normals from depth map in opencv (https://answers.opencv.org/question/82453/calculate-surface-normals-from-depth-image-using-neighboring-pixels-cross-product/)  
foil -> mocap for auto quality feedback ?

//https://www.google.com/streetview/how-it-works/  
//upload video/subs to archive.org for transcoding (https://archive.org/details/download_20240209_0047)  
  
//correct depth map by algorithm (non-zero depth from sphere to cylinder without roof, bottom 1/4 of image to ground) for paper model  
//morph timepoints in 2d with control points selected on depth map or segmentation by sparse angles, for inpainting / animation  
//or load 2 panos and use precise latlng from gsv url for offset direction  
//delete objects that changed position / by segmentation, and add them from video  
//color foil by hand and use hs(l) color from combined changed objects for paper in grayscale filmed video and remove background, keeping shadows  
