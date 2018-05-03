
SC.initialize({
    client_id: 'iZIs9mchVcX5lhVRyQGGAYlNPVldzAoX'
  });
  
  //onload playlist
  SC.get('playlists/89657406').then(function(tracks){
    console.log(tracks);
  });
  
  
  
  //search
  SC.get('/tracks', {
    q: 'Tom Walker Leave a light on'
  }).then(function(tracks) {
    console.log(tracks);
  });
  
  SC.stream('/tracks/367956896').then(function(player){
    player.play();
    console.log(player);
  });