var test = require('prova');
var List = require('./');
test('basic pop', function (t) {
  var l = 10;
  t.plan(l + 2);
  var a = new Array(l);
  var i = -1;
  while (++i < l) {
    a[i] = i;
  }
  var list = new List(a);
  t.equals(a.length, l, 'all inserted');
  while (i--) {
    t.equals(list.pop(), a[i], 'poped ' + i);
  }
  t.equals(list.length, 0, 'non left');
});
test('basic shift', function (t) {
  var l = 10;
  t.plan(l + 2);
  var a = new Array(l);
  var i = -1;
  while (++i < l) {
    a[i] = i;
  }
  var list = new List(a);
  t.equals(a.length, l, 'all inserted');
  while (i--) {
    t.equals(list.shift(), a[(l - 1) - i], 'shifted ' + i);
  }
  t.equals(list.length, 0, 'non left');
});