#!/usr/bin/env node --expose_gc --gc_global --nouse-idle-notification 
var sprintf = require('underscore.string').sprintf;

var ITERATIONS = 100000;
var REPEATS = 1;

var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
//var letters = ['aa', 'bb', 'cc', 'dd', 'ee', 'ff', 'gg', 'hh', 'ii', 'jj', 'll', 'mm', 'nn', 'oo', 'pp', 'qq', 'rr', 'ss', 'tt', 'uu', 'vv', 'ww', 'xx', 'yy', 'zz'];
var str50 = "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwx";
var str0 = "";


function mem() {
  gc();
  return process.memoryUsage().heapUsed;
}

function empty_array(tot) {
  var array = [];
  for (var i = 0; i < ITERATIONS; i++) {
    array[i] = 0;
  }
  return array;
}

function harness(fn) {
  var total1 = 0, total2 = 0, total3 = 0;
  for(var k = 0; k < REPEATS; k++) {
    var stuff = empty_array(ITERATIONS);
    var before = mem();

    // As raw stuff
    for (var i = 0; i < ITERATIONS; i++) {
      stuff[i] = fn(1000000+i, k);
    }
    total1 += mem() - before;
    
    if (true) {
      // As JSON string
      stuff = JSON.stringify(stuff);
      var tmp = empty_array(ITERATIONS);
      total2 += mem() - before;
      tmp = null;

      // Reparsed from JSON
      stuff = JSON.parse(stuff)
      total3 += mem() - before;
    }

    stuff = null;
  }

  var DIV = ITERATIONS * REPEATS;
  var header = sprintf("Test['arrayOf%s']", ucfirst(fn.name)).rpad(' ', 50);
  console.log("%s = %s  =>  %s (JSON)  =>  %s (parsed)", header, dot2(total1 / DIV), dot2(total2 / DIV), dot2(total3 / DIV))
}


function dot2(n) {
  return sprintf("%0.02f", n).lpad(' ', 6);
}

function ucfirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

String.prototype.lpad = function(padString, length) {
  var str = this;
  while (str.length < length) {
    str = padString + str;
  }
  return str;
}
String.prototype.rpad = function(padString, length) {
  var str = this;
  while (str.length < length) {
    str = str + padString;
  }
  return str;
}

function string1(i) {
  return letters[i % 26];
}
function string7(i) {
  return "" + i;
}
function string8(i) {
  return "a" + i;
}
function string9(i) {
  return "ab" + i;
}
function string10(i) {
  return "abc" + i;
}

var stuff = [
  function zero(i) {
    return 0;
  },
  function string7(i) {
    return "" + i;
  },
  function string8(i) {
    return "a" + i;
  },
  function string9(i) {
    return "ab" + i;
  },
  function string10(i) {
    return "abc" + i;
  },
  function string10p(i) {
    return (""+i).lpad(' ', 10);
  },
  function string10l(i) {
    return "abcdabd" + (100+(i % 100));
  },
  function string10pl(i) {
    return (""+(100+(i % 100))).lpad(' ', 10);
  },
  function string11(i) {
    return "abcd" + i;
  },
  function string12(i) {
    return "abcde" + i;
  },
  function string13(i) {
    return "abcdef" + i;
  },
  function string14(i) {
    return "abcdefg" + i;
  },
  function string15(i) {
    return "abcdefgh" + i;
  },
  function string11p(i) {
    return ("" + i).lpad(' ', 11);
  },
  function string12p(i) {
    return ("" + i).lpad(' ', 12);
  },
  function string13p(i) {
    return ("" + i).lpad(' ', 13);
  },
  function string14p(i) {
    return ("" + i).lpad(' ', 14);
  },
  function string15p(i) {
    return ("" + i).lpad(' ', 15);
  },
  function string99p(i) {
    return ("" + i).lpad(' ', 40);
  },
  function string16(i) {
    return "abcdefghi" + i;
  },
  function string16p(i) {
    return ("" + i).lpad(' ', 16);
  },
  function string17(i) {
    return "abcdefghij" + i;
  },
  function string18(i) {
    return "abcdefghijk" + i;
  },
  function string18b(i) {
    return string9(i) + string9(i);
  },
  function string19(i) {
    return string10(i) + string9(i);
  },
  function string20(i) {
    return string10(i) + string10(i);
  },
  function string20b(i) {
    return 'd' + string10(i) + string9(i);
  },
  function array() {
    return [];
  },
  function arrayWithOneElement(i) {
    return [i];
  },
  function arrayWithTwoElements(i) {
    return [i, i+1];
  },
  function arrayWithThreeElements(i) {
    return [i, i+1, i+2];
  },
  function object() {
    return {};
  },
  function objectWithOneKey(i) {
    return {k: i};
  },
  function objectWithTwoKeys(i) {
    return {k: i, k2: i+1};
  },
  function objectWithTenKeys(i) {
    return {k: i, k2: i+1, k3: i+3, k4: i+2, k5: i+2, k6: i, k7: i, k8: i, k9: i, k10: i};
  },
  function objectWithLongKey(i) {
    return {koteuhanotehuaoeutsanthaoeuhtn: i};
  },
  function objectWithSetKey(i) {
    var ret;
    return (ret = {}, ret.k = i, ret);
  },
  function objectWithString10Value(i) {
    return {k: 'd78' + i};
  },
  function objectWithString1Key(i) {
    var ret, key10;
    return (ret = {}, ret[string1(i)] = i, ret);
  },
  function objectWithString7Key(i) {
    var ret, key10;
    return (ret = {}, ret[string7(i)] = i, ret);
  },
  function objectWithString8Key(i) {
    var ret, key10;
    return (ret = {}, ret[string8(i)] = i, ret);
  },
  function objectWithString9Key(i) {
    var ret, key10;
    return (ret = {}, ret[string9(i)] = i, ret);
  },
  function objectWithString10Key(i) {
    var ret, key10;
    return (ret = {}, ret[string10(i)] = i, ret);
  }
];

for (var i = 0, l=stuff.length; i < l; i++) {
  harness(stuff[i])
}
