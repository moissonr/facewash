// This helps avoid conflicts in case we inject
// this script on the same page multiple times
// without reloading.
var clean_copy = clean_copy || (function(){

  var methods = {};

  methods.kopy =function(){
    var tabUrl = document.URL;
    if (tabUrl.match(/^https?:\/\/www.facebook.com/) === null) return false;

    var id, idStr;
    id = tabUrl.match(/\/(\d+)(?=\/|$)/);
    if (id !== null && id[1] !== null) return "https://www.facebook.com/" + id[1];
    id = tabUrl.match(/fbid=(\d+)/);
    if (id !== null && id[1] !== null) return "https://www.facebook.com/" + id[1];
    id = tabUrl.match(/\Wid=(\d+)/);
    if (id !== null && id[1] !== null) return "https://www.facebook.com/" + id[1];

    var graphUrl = tabUrl.replace('http://www', 'http://graph');
    graphUrl = tabUrl.replace('https://www', 'https://graph');
    $.ajax({
      type: "GET",
      url: graphUrl,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      cache: true,
      async: false
    }).done(function(data) {
      idStr = data.id;
    });
    if (idStr !== null && idStr !== "") return "https://www.facebook.com/" + idStr;
    return tabUrl;
  };

  // This tells the script to listen for
  // messages from our extension.
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var data = {};
    // If the method the extension has requested
    // exists, call it and assign its response
    // to data.
    if (methods.hasOwnProperty(request.method))
      data = methods[request.method]();
    // Send the response back to our extension.
    sendResponse({ data: data });
    return true;
  });

  return true;
})();
