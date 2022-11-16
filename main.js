let h = 1080, w = 1920;
let densityArray = "$@B%8&WM#oahkbdpqwmZO0QLCJUYXzcvunxrjftIil1/\\|{}[]?()!*+~-\"^;:,`'___...     ";
let scale = 0.5;
let video = document.getElementById("videoInput");
video.width = 640;
video.height = 480;
navigator.mediaDevices
  .getUserMedia({ video: true, audio: false })
  .then(function(stream) {
    video.srcObject = stream;
    video.play();
    h=video.height;
    w=video.width;
    let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
    let cap = new cv.VideoCapture(video);
    const FPS = 30;
    function processVideo() {
    let outText="";
    try {
        let begin = Date.now();
        cap.read(src);   
        cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
        h=Math.floor(scale*video.height)
        w = Math.floor(video.width*scale)*2;
        let dim = new cv.Size(w,h);
        cv.resize(dst,dst,dim,0,0,cv.INTER_AREA);
        for (let i = 0; i < h;i++) {
            for (let j = 0; j < w;j++) {
                let density = dst.ucharAt(i, j)*(densityArray.length-1)/255;
                let densityChar = densityArray[Math.floor(density)];
                outText += densityChar;       
            }
            outText += "\n";
        }
        document.getElementById("ascii").innerHTML = outText;   
        // cv.imshow("canvasOutput", dst);
        let delay = 1000 / FPS - (Date.now() - begin);
        setTimeout(processVideo, delay);
    } catch (err) {
        console.error(err);
    }
    }
    setTimeout(processVideo, 0);
  })
  .catch(function(err) {
    console.log("An error occurred! " + err);
  });
