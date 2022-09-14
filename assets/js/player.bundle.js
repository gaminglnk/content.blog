// Variables
const preview = "QUl6YVN5QUh";
const hashcvv = "JRFBLRlNWYkR3ay";
const varcavo = "1OZGxBVzhuM3VoMnE2QU";
const auth = atob(preview + hashcvv + varcavo +"preUFB");
var video="";
var vtturl="";
var vidtitle="";

// Homepage for no parameter.
if(!getParameter('id')){
  var eid = prompt('Enter Drive Video ID');
  var cc = prompt('Enter Captions URL (Optional)')
  var ttl = prompt('Enter Title')
  var embed = `${location.href}?cc=${cc}&title=${ttl}&id=${eid}`;

  prompt('Here is your video link ',embed);
  window.location.href = window.location.href+'?cc='+cc+'&title='+ttl+'&id='+eid;
}

// Player
video = getParameter('id');
vtturl = getParameter('cc');
vidtitle = getParameter('title');
var vidimg = "https://drive.google.com/thumbnail?id="+video;
var vidurl = "https://www.googleapis.com/drive/v3/files/"+video+"?alt=media&key="+auth;

if (!getParameter('title')){
  document.title = "Player";
}
else{
  document.title = vidtitle
}

if (getParameter('id')){
  document.write("<video crossorigin style='object-fit:cover;' src="+vidurl+" poster="+vidimg+" preload='none' class='drive_player' playsinline controls><track kind='captions' label='Source' src="+vtturl+" srclang='cc' default/></video>");
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
  
    const player = new Plyr('.drive_player',{controls});
