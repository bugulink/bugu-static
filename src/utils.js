export function isEmail(str) {
  return /.+@.+\..+/.test(str);
}

function utf8_encode(str) {
  // http://kevin.vanzonneveld.net
  if (str === null || typeof str === 'undefined') {
    return '';
  }

  const string = `${str}`;

  let utftext = '';
  let start = 0;
  let end = 0;
  const len = string.length;
  for (let n = 0; n < len; n++) {
    let c1 = string.charCodeAt(n);
    let enc = null;

    if (c1 < 128) {
      end++;
    } else if (c1 > 127 && c1 < 2048) {
      enc = String.fromCharCode((c1 >> 6) | 192, (c1 & 63) | 128);
    } else if (c1 & 0xF800 ^ 0xD800 > 0) {
      enc = String.fromCharCode(
        (c1 >> 12) | 224,
        ((c1 >> 6) & 63) | 128,
        (c1 & 63) | 128
      );
    } else { // surrogate pairs
      if (c1 & 0xFC00 ^ 0xD800 > 0) {
        throw new RangeError(`Unmatched trail surrogate at ${n}`);
      }
      const c2 = string.charCodeAt(++n);
      if (c2 & 0xFC00 ^ 0xDC00 > 0) {
        throw new RangeError(`Unmatched lead surrogate at ${n - 1}`);
      }
      c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
      enc = String.fromCharCode(
        (c1 >> 18) | 240,
        ((c1 >> 12) & 63) | 128,
        ((c1 >> 6) & 63) | 128,
        (c1 & 63) | 128
      );
    }
    if (enc !== null) {
      if (end > start) {
        utftext += string.slice(start, end);
      }
      utftext += enc;
      start = n + 1;
      end = n + 1;
    }
  }

  if (end > start) {
    utftext += string.slice(start, len);
  }

  return utftext;
}

function base64_encode(str) {
  // http://kevin.vanzonneveld.net
  const b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let o1;
  let o2;
  let o3;
  let h1;
  let h2;
  let h3;
  let h4;
  let bits;
  let i = 0;
  let ac = 0;
  let enc = '';
  const tmp_arr = [];

  if (!str) {
    return str;
  }

  const data = utf8_encode(`${str}`);

  do { // pack three octets into four hexets
    o1 = data.charCodeAt(i++);
    o2 = data.charCodeAt(i++);
    o3 = data.charCodeAt(i++);

    bits = o1 << 16 | o2 << 8 | o3;

    h1 = bits >> 18 & 0x3f;
    h2 = bits >> 12 & 0x3f;
    h3 = bits >> 6 & 0x3f;
    h4 = bits & 0x3f;

    // use hexets to index into b64, and append result to encoded string
    tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
  } while (i < data.length);

  enc = tmp_arr.join('');

  switch (data.length % 3) {
    case 1:
      enc = `${enc.slice(0, -2)}==`;
      break;
    case 2:
      enc = `${enc.slice(0, -1)}=`;
      break;
    default:
  }

  return enc;
}

export function encode(str) {
  const v = base64_encode(str);
  return v.replace(/\//g, '_').replace(/\+/g, '-');
}
