(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/* globals Stats, dat, AMI*/

var LoadersVolume = AMI.default.Loaders.Volume;
var ControlsTrackball = AMI.default.Controls.Trackball;
var HelpersLut = AMI.default.Helpers.Lut;
var HelpersVR = AMI.default.Helpers.VolumeRendering;

// standard global letiables
var controls;
var threeD;
var renderer;
var stats;
var camera;
var scene;
var vrHelper;
var lut;
var ready = false;

var myStack = {
  lut: 'random',
  opacity: 'random',
  steps: 10,
  alphaCorrection: 0.5,
  interpolation: 1
};

/**
 * Handle mouse down event
 */
function onMouseDown() {
  if (vrHelper && vrHelper.uniforms) {
    vrHelper.uniforms.uSteps.value = Math.floor(myStack.steps / 2);
    vrHelper.interpolation = 0;
  }
}

/**
 * Handle mouse up event
 */
function onMouseUp() {
  if (vrHelper && vrHelper.uniforms) {
    vrHelper.uniforms.uSteps.value = myStack.steps;
    vrHelper.interpolation = myStack.interpolation;
  }
}

/**
 * Handle window resize event
 */
function onWindowResize() {
  // update the camera
  camera.aspect = threeD.offsetWidth / threeD.offsetHeight;
  camera.updateProjectionMatrix();

  // notify the renderer of the size change
  renderer.setSize(threeD.offsetWidth, threeD.offsetHeight);
}

/**
 * Build GUI
 */
function buildGUI() {
  var gui = new dat.GUI({
    autoPlace: false
  });

  var customContainer = document.getElementById('my-gui-container');
  customContainer.appendChild(gui.domElement);

  var stackFolder = gui.addFolder('Settings');
  var lutUpdate = stackFolder.add(myStack, 'lut', lut.lutsAvailable());
  lutUpdate.onChange(function (value) {
    lut.lut = value;
    vrHelper.uniforms.uTextureLUT.value.dispose();
    vrHelper.uniforms.uTextureLUT.value = lut.texture;
  });
  // init LUT
  lut.lut = myStack.lut;
  vrHelper.uniforms.uTextureLUT.value.dispose();
  vrHelper.uniforms.uTextureLUT.value = lut.texture;

  var opacityUpdate = stackFolder.add(myStack, 'opacity', lut.lutsAvailable('opacity'));
  opacityUpdate.onChange(function (value) {
    lut.lutO = value;
    vrHelper.uniforms.uTextureLUT.value.dispose();
    vrHelper.uniforms.uTextureLUT.value = lut.texture;
  });

  var stepsUpdate = stackFolder.add(myStack, 'steps', 0, 512).step(1);
  stepsUpdate.onChange(function (value) {
    if (vrHelper.uniforms) {
      vrHelper.uniforms.uSteps.value = value;
    }
  });

  var alphaCorrrectionUpdate = stackFolder.add(myStack, 'alphaCorrection', 0, 1).step(0.01);
  alphaCorrrectionUpdate.onChange(function (value) {
    if (vrHelper.uniforms) {
      vrHelper.uniforms.uAlphaCorrection.value = value;
    }
  });

  stackFolder.add(vrHelper, 'interpolation', 0, 1).step(1);

  stackFolder.open();
}

/**
 * Init the scene
 */
function init() {
  /**
   * Rendering loop
   */
  function animate() {
    // render
    controls.update();

    if (ready) {
      renderer.render(scene, camera);
    }

    stats.update();

    // request new frame
    requestAnimationFrame(function () {
      animate();
    });
  }

  // renderer
  threeD = document.getElementById('r3d');
  renderer = new THREE.WebGLRenderer({
    alpha: true
  });
  renderer.setSize(threeD.offsetWidth, threeD.offsetHeight);
  threeD.appendChild(renderer.domElement);

  // stats
  stats = new Stats();
  threeD.appendChild(stats.domElement);

  // scene
  scene = new THREE.Scene();

  // camera
  camera = new THREE.PerspectiveCamera(45, threeD.offsetWidth / threeD.offsetHeight, 0.1, 100000);
  camera.position.x = 150;
  camera.position.y = 400;
  camera.position.z = -350;
  camera.up.set(-0.42, 0.86, 0.26);

  // controls
  controls = new ControlsTrackball(camera, threeD);
  controls.rotateSpeed = 5.5;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;

  threeD.addEventListener('mousedown', onMouseDown, false);
  threeD.addEventListener('mouseup', onMouseUp, false);
  window.addEventListener('resize', onWindowResize, false);

  // start rendering loop
  animate();
}

// init threeJS...
init();

// var file = 'https://cdn.rawgit.com/FNNDSC/data/master/nifti/eun_brain/eun_uchar_8.nii.gz';
var file = '../../../data/eun_uchar_8.nii.gz';
var testFiles = [
    'http://59.110.52.133:8081/data/getdicom/XNAT_E00289/80261/1.2.840.113704.1.111.10072.1492388594.1-80261-43-1ex9sr.dcm',
    'http://59.110.52.133:8081/data/getdicom/XNAT_E00289/80262/1.2.840.113704.1.111.10072.1492388594.1-80262-34-1trrb5.dcm',
    'http://59.110.52.133:8081/data/getdicom/XNAT_E00289/80260/1.2.840.113704.1.111.10072.1492388594.1-80260-84-ukubf.dcm',
    'http://59.110.52.133:8081/data/getdicom/XNAT_E00289/80260/1.2.840.113704.1.111.10072.1492388594.1-80260-83-ukube.dcm',
    'http://59.110.52.133:8081/data/getdicom/XNAT_E00289/80260/1.2.840.113704.1.111.10072.1492388594.1-80260-82-u11q0.dcm',
    'http://59.110.52.133:8081/data/getdicom/XNAT_E00289/80260/1.2.840.113704.1.111.10072.1492388594.1-80260-81-u11pz.dcm',
    'http://59.110.52.133:8081/data/getdicom/XNAT_E00289/80260/1.2.840.113704.1.111.10072.1492388594.1-80260-80-u11py.dcm'
];
    let t2 = [
        '36444280', '36444294', '36444308', '36444322', '36444336',
        '36444350', '36444364', '36444378', '36444392', '36444406',
        '36748256', '36444434', '36444448', '36444462', '36444476',
        '36444490', '36444504', '36444518', '36444532', '36746856',
        '36746870', '36746884', '36746898', '36746912', '36746926',
        '36746940', '36746954', '36746968', '36746982', '36746996',
        '36747010', '36747024', '36748200', '36748214', '36748228',
        '36748270', '36748284', '36748298', '36748312', '36748326',
        '36748340', '36748354', '36748368', '36748382', '36748396',
        '36748410', '36748424', '36748438', '36748452', '36748466',
        '36748480', '36748494', '36748508', '36748522', '36748242',
    ];

    let files = t2.map(function(v) {
        return 'https://cdn.rawgit.com/FNNDSC/data/master/dicom/adi_brain/' + v;
    });
    console.log(files);
var loader = new LoadersVolume(threeD);
loader.load(testFiles).then(function () {
    console.log(loader.data);
  var series = loader.data[0].mergeSeries(loader.data)[0];
  loader.free();
  loader = null;
  console.log(series);
  // get first stack from series
  var stack = series.stack[0];

  vrHelper = new HelpersVR(stack);
  // scene
  scene.add(vrHelper);

  // CREATE LUT
  lut = new HelpersLut('my-tf');
  lut.luts = HelpersLut.presetLuts();
  lut.lutsO = HelpersLut.presetLutsO();
  // update related uniforms
  vrHelper.uniforms.uTextureLUT.value = lut.texture;
  vrHelper.uniforms.uLut.value = 1;

  // update camrea's and interactor's target
  var centerLPS = stack.worldCenter();
  camera.lookAt(centerLPS.x, centerLPS.y, centerLPS.z);
  camera.updateProjectionMatrix();
  controls.target.set(centerLPS.x, centerLPS.y, centerLPS.z);

  // create GUI
  buildGUI();

  ready = true;
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsZXNzb25zLzA2L2RlbW8uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOztBQUVBLElBQUksZ0JBQWdCLElBQUEsQUFBSSxRQUFKLEFBQVksUUFBaEMsQUFBd0M7QUFDeEMsSUFBSSxvQkFBb0IsSUFBQSxBQUFJLFFBQUosQUFBWSxTQUFwQyxBQUE2QztBQUM3QyxJQUFJLGFBQWEsSUFBQSxBQUFJLFFBQUosQUFBWSxRQUE3QixBQUFxQztBQUNyQyxJQUFJLFlBQVksSUFBQSxBQUFJLFFBQUosQUFBWSxRQUE1QixBQUFvQzs7QUFFcEM7QUFDQSxJQUFBLEFBQUk7QUFDSixJQUFBLEFBQUk7QUFDSixJQUFBLEFBQUk7QUFDSixJQUFBLEFBQUk7QUFDSixJQUFBLEFBQUk7QUFDSixJQUFBLEFBQUk7QUFDSixJQUFBLEFBQUk7QUFDSixJQUFBLEFBQUk7QUFDSixJQUFJLFFBQUosQUFBWTs7QUFFWixJQUFJO09BQVUsQUFDUCxBQUNMO1dBRlksQUFFSCxBQUNUO1NBSFksQUFHTCxBQUNQO21CQUpZLEFBSUssQUFDakI7aUJBTEYsQUFBYyxBQUtHO0FBTEgsQUFDWjs7QUFPRjs7O0FBR0EsU0FBQSxBQUFTLGNBQWMsQUFDckI7TUFBSSxZQUFZLFNBQWhCLEFBQXlCLFVBQVUsQUFDakM7YUFBQSxBQUFTLFNBQVQsQUFBa0IsT0FBbEIsQUFBeUIsUUFBUSxLQUFBLEFBQUssTUFBTSxRQUFBLEFBQVEsUUFBcEQsQUFBaUMsQUFBMkIsQUFDNUQ7YUFBQSxBQUFTLGdCQUFULEFBQXlCLEFBQzFCO0FBQ0Y7OztBQUVEOzs7QUFHQSxTQUFBLEFBQVMsWUFBWSxBQUNuQjtNQUFJLFlBQVksU0FBaEIsQUFBeUIsVUFBVSxBQUNqQzthQUFBLEFBQVMsU0FBVCxBQUFrQixPQUFsQixBQUF5QixRQUFRLFFBQWpDLEFBQXlDLEFBQ3pDO2FBQUEsQUFBUyxnQkFBZ0IsUUFBekIsQUFB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ZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBnbG9iYWxzIFN0YXRzLCBkYXQsIEFNSSovXG5cbnZhciBMb2FkZXJzVm9sdW1lID0gQU1JLmRlZmF1bHQuTG9hZGVycy5Wb2x1bWU7XG52YXIgQ29udHJvbHNUcmFja2JhbGwgPSBBTUkuZGVmYXVsdC5Db250cm9scy5UcmFja2JhbGw7XG52YXIgSGVscGVyc0x1dCA9IEFNSS5kZWZhdWx0LkhlbHBlcnMuTHV0O1xudmFyIEhlbHBlcnNWUiA9IEFNSS5kZWZhdWx0LkhlbHBlcnMuVm9sdW1lUmVuZGVyaW5nO1xuXG4vLyBzdGFuZGFyZCBnbG9iYWwgbGV0aWFibGVzXG52YXIgY29udHJvbHM7XG52YXIgdGhyZWVEO1xudmFyIHJlbmRlcmVyO1xudmFyIHN0YXRzO1xudmFyIGNhbWVyYTtcbnZhciBzY2VuZTtcbnZhciB2ckhlbHBlcjtcbnZhciBsdXQ7XG52YXIgcmVhZHkgPSBmYWxzZTtcblxudmFyIG15U3RhY2sgPSB7XG4gIGx1dDogJ3JhbmRvbScsXG4gIG9wYWNpdHk6ICdyYW5kb20nLFxuICBzdGVwczogMjU2LFxuICBhbHBoYUNvcnJlY3Rpb246IDAuNSxcbiAgaW50ZXJwb2xhdGlvbjogMSxcbn07XG5cbi8qKlxuICogSGFuZGxlIG1vdXNlIGRvd24gZXZlbnRcbiAqL1xuZnVuY3Rpb24gb25Nb3VzZURvd24oKSB7XG4gIGlmICh2ckhlbHBlciAmJiB2ckhlbHBlci51bmlmb3Jtcykge1xuICAgIHZySGVscGVyLnVuaWZvcm1zLnVTdGVwcy52YWx1ZSA9IE1hdGguZmxvb3IobXlTdGFjay5zdGVwcyAvIDIpO1xuICAgIHZySGVscGVyLmludGVycG9sYXRpb24gPSAwO1xuICB9XG59XG5cbi8qKlxuICogSGFuZGxlIG1vdXNlIHVwIGV2ZW50XG4gKi9cbmZ1bmN0aW9uIG9uTW91c2VVcCgpIHtcbiAgaWYgKHZySGVscGVyICYmIHZySGVscGVyLnVuaWZvcm1zKSB7XG4gICAgdnJIZWxwZXIudW5pZm9ybXMudVN0ZXBzLnZhbHVlID0gbXlTdGFjay5zdGVwcztcbiAgICB2ckhlbHBlci5pbnRlcnBvbGF0aW9uID0gbXlTdGFjay5pbnRlcnBvbGF0aW9uO1xuICB9XG59XG5cbi8qKlxuICogSGFuZGxlIHdpbmRvdyByZXNpemUgZXZlbnRcbiAqL1xuZnVuY3Rpb24gb25XaW5kb3dSZXNpemUoKSB7XG4gIC8vIHVwZGF0ZSB0aGUgY2FtZXJhXG4gIGNhbWVyYS5hc3BlY3QgPSB0aHJlZUQub2Zmc2V0V2lkdGggLyB0aHJlZUQub2Zmc2V0SGVpZ2h0O1xuICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuXG4gICAgLy8gbm90aWZ5IHRoZSByZW5kZXJlciBvZiB0aGUgc2l6ZSBjaGFuZ2VcbiAgcmVuZGVyZXIuc2V0U2l6ZSh0aHJlZUQub2Zmc2V0V2lkdGgsIHRocmVlRC5vZmZzZXRIZWlnaHQpO1xufVxuXG4vKipcbiAqIEJ1aWxkIEdVSVxuICovXG5mdW5jdGlvbiBidWlsZEdVSSgpIHtcbiAgdmFyIGd1aSA9IG5ldyBkYXQuR1VJKHtcbiAgICAgIGF1dG9QbGFjZTogZmFsc2UsXG4gICAgfSk7XG5cbiAgdmFyIGN1c3RvbUNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdteS1ndWktY29udGFpbmVyJyk7XG4gIGN1c3RvbUNvbnRhaW5lci5hcHBlbmRDaGlsZChndWkuZG9tRWxlbWVudCk7XG5cbiAgdmFyIHN0YWNrRm9sZGVyID0gZ3VpLmFkZEZvbGRlcignU2V0dGluZ3MnKTtcbiAgdmFyIGx1dFVwZGF0ZSA9IHN0YWNrRm9sZGVyLmFkZChteVN0YWNrLCAnbHV0JywgbHV0Lmx1dHNBdmFpbGFibGUoKSk7XG4gIGx1dFVwZGF0ZS5vbkNoYW5nZShmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgbHV0Lmx1dCA9IHZhbHVlO1xuICAgICAgdnJIZWxwZXIudW5pZm9ybXMudVRleHR1cmVMVVQudmFsdWUuZGlzcG9zZSgpO1xuICAgICAgdnJIZWxwZXIudW5pZm9ybXMudVRleHR1cmVMVVQudmFsdWUgPSBsdXQudGV4dHVyZTtcbiAgICB9KTtcbiAgLy8gaW5pdCBMVVRcbiAgbHV0Lmx1dCA9IG15U3RhY2subHV0O1xuICB2ckhlbHBlci51bmlmb3Jtcy51VGV4dHVyZUxVVC52YWx1ZS5kaXNwb3NlKCk7XG4gIHZySGVscGVyLnVuaWZvcm1zLnVUZXh0dXJlTFVULnZhbHVlID0gbHV0LnRleHR1cmU7XG5cbiAgdmFyIG9wYWNpdHlVcGRhdGUgPSBzdGFja0ZvbGRlci5hZGQoXG4gICAgbXlTdGFjaywgJ29wYWNpdHknLCBsdXQubHV0c0F2YWlsYWJsZSgnb3BhY2l0eScpKTtcbiAgb3BhY2l0eVVwZGF0ZS5vbkNoYW5nZShmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgbHV0Lmx1dE8gPSB2YWx1ZTtcbiAgICAgIHZySGVscGVyLnVuaWZvcm1zLnVUZXh0dXJlTFVULnZhbHVlLmRpc3Bvc2UoKTtcbiAgICAgIHZySGVscGVyLnVuaWZvcm1zLnVUZXh0dXJlTFVULnZhbHVlID0gbHV0LnRleHR1cmU7XG4gICAgfSk7XG5cbiAgdmFyIHN0ZXBzVXBkYXRlID0gc3RhY2tGb2xkZXIuYWRkKG15U3RhY2ssICdzdGVwcycsIDAsIDUxMikuc3RlcCgxKTtcbiAgc3RlcHNVcGRhdGUub25DaGFuZ2UoZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIGlmICh2ckhlbHBlci51bmlmb3Jtcykge1xuICAgICAgICB2ckhlbHBlci51bmlmb3Jtcy51U3RlcHMudmFsdWUgPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICB2YXIgYWxwaGFDb3JycmVjdGlvblVwZGF0ZSA9IHN0YWNrRm9sZGVyLmFkZChcbiAgICBteVN0YWNrLCAnYWxwaGFDb3JyZWN0aW9uJywgMCwgMSkuc3RlcCgwLjAxKTtcbiAgYWxwaGFDb3JycmVjdGlvblVwZGF0ZS5vbkNoYW5nZShmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgaWYgKHZySGVscGVyLnVuaWZvcm1zKSB7XG4gICAgICAgIHZySGVscGVyLnVuaWZvcm1zLnVBbHBoYUNvcnJlY3Rpb24udmFsdWUgPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICBzdGFja0ZvbGRlci5hZGQodnJIZWxwZXIsICdpbnRlcnBvbGF0aW9uJywgMCwgMSkuc3RlcCgxKTtcblxuICBzdGFja0ZvbGRlci5vcGVuKCk7XG59XG5cbi8qKlxuICogSW5pdCB0aGUgc2NlbmVcbiAqL1xuZnVuY3Rpb24gaW5pdCgpIHtcbiAgLyoqXG4gICAqIFJlbmRlcmluZyBsb29wXG4gICAqL1xuICBmdW5jdGlvbiBhbmltYXRlKCkge1xuICAgIC8vIHJlbmRlclxuICAgIGNvbnRyb2xzLnVwZGF0ZSgpO1xuXG4gICAgaWYgKHJlYWR5KSB7XG4gICAgICByZW5kZXJlci5yZW5kZXIoc2NlbmUsIGNhbWVyYSk7XG4gICAgfVxuXG4gICAgc3RhdHMudXBkYXRlKCk7XG5cbiAgICAvLyByZXF1ZXN0IG5ldyBmcmFtZVxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpIHtcbiAgICAgIGFuaW1hdGUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIHJlbmRlcmVyXG4gIHRocmVlRCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyM2QnKTtcbiAgcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7XG4gICAgYWxwaGE6IHRydWUsXG4gIH0pO1xuICByZW5kZXJlci5zZXRTaXplKHRocmVlRC5vZmZzZXRXaWR0aCwgdGhyZWVELm9mZnNldEhlaWdodCk7XG4gIHRocmVlRC5hcHBlbmRDaGlsZChyZW5kZXJlci5kb21FbGVtZW50KTtcblxuICAvLyBzdGF0c1xuICBzdGF0cyA9IG5ldyBTdGF0cygpO1xuICB0aHJlZUQuYXBwZW5kQ2hpbGQoc3RhdHMuZG9tRWxlbWVudCk7XG5cbiAgLy8gc2NlbmVcbiAgc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcblxuICAvLyBjYW1lcmFcbiAgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKFxuICAgIDQ1LCB0aHJlZUQub2Zmc2V0V2lkdGggLyB0aHJlZUQub2Zmc2V0SGVpZ2h0LCAwLjEsIDEwMDAwMCk7XG4gIGNhbWVyYS5wb3NpdGlvbi54ID0gMTUwO1xuICBjYW1lcmEucG9zaXRpb24ueSA9IDQwMDtcbiAgY2FtZXJhLnBvc2l0aW9uLnogPSAtMzUwO1xuICBjYW1lcmEudXAuc2V0KC0wLjQyLCAwLjg2LCAwLjI2KTtcblxuICAvLyBjb250cm9sc1xuICBjb250cm9scyA9IG5ldyBDb250cm9sc1RyYWNrYmFsbChjYW1lcmEsIHRocmVlRCk7XG4gIGNvbnRyb2xzLnJvdGF0ZVNwZWVkID0gNS41O1xuICBjb250cm9scy56b29tU3BlZWQgPSAxLjI7XG4gIGNvbnRyb2xzLnBhblNwZWVkID0gMC44O1xuICBjb250cm9scy5zdGF0aWNNb3ZpbmcgPSB0cnVlO1xuICBjb250cm9scy5keW5hbWljRGFtcGluZ0ZhY3RvciA9IDAuMztcblxuICB0aHJlZUQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Nb3VzZURvd24sIGZhbHNlKTtcbiAgdGhyZWVELmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbk1vdXNlVXAsIGZhbHNlKTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIG9uV2luZG93UmVzaXplLCBmYWxzZSk7XG5cbiAgLy8gc3RhcnQgcmVuZGVyaW5nIGxvb3BcbiAgYW5pbWF0ZSgpO1xufVxuXG4vLyBpbml0IHRocmVlSlMuLi5cbmluaXQoKTtcblxudmFyIGZpbGUgPVxuICAnaHR0cHM6Ly9jZG4ucmF3Z2l0LmNvbS9GTk5EU0MvZGF0YS9tYXN0ZXIvbmlmdGkvZXVuX2JyYWluL2V1bl91Y2hhcl84Lm5paS5neic7XG5cbnZhciBsb2FkZXIgPSBuZXcgTG9hZGVyc1ZvbHVtZSh0aHJlZUQpO1xubG9hZGVyLmxvYWQoZmlsZSlcbi50aGVuKGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZXJpZXMgPSBsb2FkZXIuZGF0YVswXS5tZXJnZVNlcmllcyhsb2FkZXIuZGF0YSlbMF07XG4gICAgbG9hZGVyLmZyZWUoKTtcbiAgICBsb2FkZXIgPSBudWxsO1xuICAgIC8vIGdldCBmaXJzdCBzdGFjayBmcm9tIHNlcmllc1xuICAgIHZhciBzdGFjayA9IHNlcmllcy5zdGFja1swXTtcblxuICAgIHZySGVscGVyID0gbmV3IEhlbHBlcnNWUihzdGFjayk7XG4gICAgLy8gc2NlbmVcbiAgICBzY2VuZS5hZGQodnJIZWxwZXIpO1xuXG4gICAgLy8gQ1JFQVRFIExVVFxuICAgIGx1dCA9IG5ldyBIZWxwZXJzTHV0KCdteS10ZicpO1xuICAgIGx1dC5sdXRzID0gSGVscGVyc0x1dC5wcmVzZXRMdXRzKCk7XG4gICAgbHV0Lmx1dHNPID0gSGVscGVyc0x1dC5wcmVzZXRMdXRzTygpO1xuICAgIC8vIHVwZGF0ZSByZWxhdGVkIHVuaWZvcm1zXG4gICAgdnJIZWxwZXIudW5pZm9ybXMudVRleHR1cmVMVVQudmFsdWUgPSBsdXQudGV4dHVyZTtcbiAgICB2ckhlbHBlci51bmlmb3Jtcy51THV0LnZhbHVlID0gMTtcblxuICAgIC8vIHVwZGF0ZSBjYW1yZWEncyBhbmQgaW50ZXJhY3RvcidzIHRhcmdldFxuICAgIHZhciBjZW50ZXJMUFMgPSBzdGFjay53b3JsZENlbnRlcigpO1xuICAgIGNhbWVyYS5sb29rQXQoY2VudGVyTFBTLngsIGNlbnRlckxQUy55LCBjZW50ZXJMUFMueik7XG4gICAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcbiAgICBjb250cm9scy50YXJnZXQuc2V0KGNlbnRlckxQUy54LCBjZW50ZXJMUFMueSwgY2VudGVyTFBTLnopO1xuXG4gICAgLy8gY3JlYXRlIEdVSVxuICAgIGJ1aWxkR1VJKCk7XG5cbiAgICByZWFkeSA9IHRydWU7XG59KTtcbiJdfQ==
