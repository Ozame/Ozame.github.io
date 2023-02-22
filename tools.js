function hexToBase64(hexString) {
    if (hexString.length == 0) {return ""}
    return btoa(hexString.match(/\w{2}/g).map(function(a) {
          return String.fromCharCode(parseInt(a, 16));
      }).join(""));
  }
  
  
  function base64ToHex(str) {
     if (str.length == 0) {return ""}
    const raw = atob(str);
    let result = '';
    for (let i = 0; i < raw.length; i++) {
      const hex = raw.charCodeAt(i).toString(16);
      result += (hex.length === 2 ? hex : '0' + hex);
    }
    return result.toUpperCase();
  }
  
  function hexToAscii(hexString) {
    if (hexString.length == 0) {return ""}
      var hex  = hexString.toString();
      var str = '';
      for (var n = 0; n < hex.length; n += 2) {
          str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
      }
      return str;
   }
  
  function asciiToHex(str) {
     if (str.length == 0) {return ""}
    var arr = [];
    for (var i = 0, l = str.length; i < l; i ++) {
      var hex = Number(str.charCodeAt(i)).toString(16);
      arr.push(hex);
    }
    return arr.join('');
  }