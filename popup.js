jQuery.fn.selectText = function(){
    var doc = document,
        element = this[0],
        range,
        selection;
    if (doc.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) {
        selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }
};

var cleanKopy = {
  injectedMethod: function (tab, method, callback) {
    chrome.tabs.executeScript(tab.id, { file: "jquery.js" }, function() {
      chrome.tabs.executeScript(tab.id, { file: 'inject.js' }, function(){
        chrome.tabs.sendMessage(tab.id, { method: method }, callback);
      });
    });
  },

  kopy: function (tab) {
    this.injectedMethod(tab, 'kopy', function(response){
      if (typeof response.data === 'undefined' || response.data === false){
        return window.close();
      }
      $('#clean-link').text(response.data);
      $('#clean-link').selectText();
      return true;
    });
  }
};

function KeyPress(e) {
  var evtobj = window.event ? event : e;
  if (evtobj.keyCode == 67 && evtobj.ctrlKey) window.close();
}
document.onkeydown = KeyPress;

chrome.tabs.query(
  { active: true, currentWindow: true },
  function (tabs) {
    cleanKopy.kopy(tabs[0]);
  }
);
