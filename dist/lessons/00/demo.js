/* globals AMI*/

// VJS classes we will be using in this lesson
var LoadersVolume = AMI.default.Loaders.Volume;

// element to contain the progress bar
var container = document.getElementById('container');

// instantiate the loader
var loader = new LoadersVolume(container);
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
// var t2 = ['36444280', '36444294', '36444308', '36444322', '36444336'];
var files = t2.map(function(v) {
    return 'https://cdn.rawgit.com/FNNDSC/data/master/dicom/adi_brain/' + v;
  });
var testFiles = [
    'http://59.110.52.133:8081/data/getdicom/XNAT_E00289/80261/1.2.840.113704.1.111.10072.1492388594.1-80261-43-1ex9sr.dcm',
    'http://59.110.52.133:8081/data/getdicom/XNAT_E00289/80262/1.2.840.113704.1.111.10072.1492388594.1-80262-34-1trrb5.dcm',
    'http://59.110.52.133:8081/data/getdicom/XNAT_E00289/80260/1.2.840.113704.1.111.10072.1492388594.1-80260-84-ukubf.dcm',
    'http://59.110.52.133:8081/data/getdicom/XNAT_E00289/80260/1.2.840.113704.1.111.10072.1492388594.1-80260-83-ukube.dcm',
    'http://59.110.52.133:8081/data/getdicom/XNAT_E00289/80260/1.2.840.113704.1.111.10072.1492388594.1-80260-82-u11q0.dcm',
    'http://59.110.52.133:8081/data/getdicom/XNAT_E00289/80260/1.2.840.113704.1.111.10072.1492388594.1-80260-81-u11pz.dcm',
    'http://59.110.52.133:8081/data/getdicom/XNAT_E00289/80260/1.2.840.113704.1.111.10072.1492388594.1-80260-80-u11py.dcm'
];
// once all files have been loaded (fetch + parse + add to array)
// merge them into series / stacks / frames
loader.load(files)
.then(function() {
  console.log(loader);
    // merge files into clean series/stack/frame structure
    var series = loader.data[0].mergeSeries(loader.data);
    console.log(series);
    loader.free();
    loader = null;

    // series/stacks/frames are ready to be used
    window.console.log(series);

    // Display some content on the DOM
    var seriesIndex = 1;
    for(var mySeries of series) {
      var seriesDiv = document.createElement('div');
      seriesDiv.className += 'indent';
      seriesDiv.insertAdjacentHTML('beforeend',
        '<div> SERIES (' + seriesIndex + '/' + series.length + ')</div>');
      seriesDiv.insertAdjacentHTML('beforeend',
        '<div class="series"> numberOfChannels: '
        + mySeries.numberOfChannels+ '</div>');

      container.appendChild(seriesDiv);

      // loop through stacks
      var stackIndex = 1;
      for(var myStack of mySeries.stack) {
        var stackDiv = document.createElement('div');
        stackDiv.className += 'indent';
        stackDiv.insertAdjacentHTML('beforeend',
          '<div> STACK (' + stackIndex + '/'
          + mySeries.stack.length + ')</div>');
        stackDiv.insertAdjacentHTML('beforeend',
          '<div class="stack"> bitsAllocated: '
          + myStack.bitsAllocated+ '</div>');

        seriesDiv.appendChild(stackDiv);

        // loop through frames
        var frameIndex = 1;
        for(var myFrame of myStack.frame) {
          var frameDiv = document.createElement('div');
          frameDiv.className += 'indent';
          frameDiv.insertAdjacentHTML('beforeend',
            '<div> FRAME (' + frameIndex + '/'
            + myStack.frame.length + ')</div>');
          frameDiv.insertAdjacentHTML('beforeend',
            '<div class="frame"> instanceNumber: '
            + myFrame.instanceNumber+ '</div>');

          stackDiv.appendChild(frameDiv);
          frameIndex++;
        }

        stackIndex++;
      }

      seriesIndex++;
    }
  })
  .catch(function(error) {
    window.console.log('oops... something went wrong...');
    window.console.log(error);
  });

