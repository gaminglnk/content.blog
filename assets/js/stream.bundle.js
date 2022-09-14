// Variables
var vidurl="";
var vtturl="";
var vidimg="";
var vidtitle="";

// Other variables
var autoplay="";
var autoplayset="";

// Player
vtturl = getParameter('cc');
vidurl = getParameter('link');
vidimg = getParameter('img');
vidtitle = getParameter('title');
autoplay = getParameter('autoplay');

// Autoplay Parameter
if (autoplay == 1){
  console.log('Autoplay is set to true.')
  var autoplayset="autoplay";
}
else if (autoplay == 'true'){
  console.log('Autoplay is set to true.')
  var autoplayset="autoplay";
}
else
  console.log('Autoplay is false');

// Title Parameter
if (!getParameter('title')){
  document.title = "Player";
}
else{
  document.title = vidtitle
}

// Video Player Generator
if (getParameter('link')){
  document.write("<video crossorigin style='object-fit:fill;' src="+vidurl+" poster="+vidimg+" preload='metadata' class='stream_player' playsinline controls><track kind='captions' label='Source' src="+vtturl+" srclang='cc' default/></video>");
}

// Function to get URL Parameters
function getParameter( parameterName ){
    let parameters = new URLSearchParams(window.location.search);
    return parameters.get( parameterName );
}

// Player Options
const controls =
  [
      'play-large', // The large play button in the center
     // 'restart', // Restart playback
      'rewind', // Rewind by the seek time (default 10 seconds)
      'play', // Play/pause playback
      'fast-forward', // Fast forward by the seek time (default 10 seconds)
      'progress', // The progress bar and scrubber for playback and buffering
      'current-time', // The current time of playback
      'duration', // The full duration of the media
     //'volume', // Volume control
     // 'captions', // Toggle captions
      'mute', // Toggle mute
      'settings', // Settings menu
     // 'pip', // Picture-in-picture
      'airplay', // Airplay (currently Safari only)
     // 'download', // Show a download button with a link to either the current source or a custom URL you specify in your options
      'fullscreen' // Toggle fullscreen
  ];
  
    const player = new Plyr('.stream_player',{controls});
