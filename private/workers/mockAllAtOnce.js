!function e(t,r,o){function a(s,i){if(!r[s]){if(!t[s]){var u="function"==typeof require&&require;if(!i&&u)return u(s,!0);if(n)return n(s,!0);var d=new Error("Cannot find module '"+s+"'");throw d.code="MODULE_NOT_FOUND",d}var l=r[s]={exports:{}};t[s][0].call(l.exports,function(e){var r=t[s][1][e];return a(r?r:e)},l,l.exports,e,t,r,o)}return r[s].exports}for(var n="function"==typeof require&&require,s=0;s<o.length;s++)a(o[s]);return a}({1:[function(e,t,r){"use strict";"describe"===process.argv[2]?process.stdout.write(JSON.stringify({harvestMode:"allAtOnce"})):"autofill"===process.argv[2]?process.send([{name:"Test gauge 1",code:"001",location:{type:"Point",altitude:100,coordinates:[43,10]},timestamp:Date.now(),level:100*Math.random(),flow:100*Math.random(),url:"https://ya.ru",disabled:!1},{name:"Test gauge 2",code:"002",location:{altitude:200,type:"Point",coordinates:[11,22]},timestamp:Date.now(),level:100+100*Math.random(),flow:100+100*Math.random(),url:"https://ya.ru",disabled:!1}]):"harvest"===process.argv[2]&&setTimeout(function(){process.send([{code:"001",timestamp:Date.now(),level:100*Math.random(),flow:100*Math.random()},{code:"002",timestamp:Date.now(),level:100+100*Math.random(),flow:100+100*Math.random()}])},100)},{}]},{},[1]);