'use strict';

module.exports = LinkedList;

function LinkedList(stringify, compare, iterable) {
  this.length = 0;
  this.head = new Item(true, this);
  this.tail = new Item(false, this);
  this.head.next = this.tail;
  this.tail.prev = this.head;
  this.sideTable = {};
  if (typeof stringify === 'function') {
    this.stringify = stringify;
  } else if (Array.isArray(stringify)) {
    iterable = stringify;
  }
  if (typeof compare === 'function') {
    this.compare = compare;
  } else if (Array.isArray(compare)) {
    iterable = compare;
  }
  if (Array.isArray(iterable)) {
    iterable.forEach(function (item) {
      this.push(item);
    }, this);
  }
}
var lp = LinkedList.prototype;

lp.push = function (value) {
  return this.tail.insertBefore(value);
};

lp.pop = function () {
  if (this.tail.prev === this.head) {
    return undefined;
  }
  return this.tail.prev.destroy();
};
lp.unshift = function (value) {
  return this.head.insertAfter(value);
};
lp.shift = function () {
  if (this.head.next === this.tail) {
    return undefined;
  }
  return this.head.next.destroy();
};
lp.clear = function () {
  this.head.next = this.tail;
  this.tail.prev = this.head;
  this.length = 0;
  this.sideTable = {};
};
lp.stringify = function () {};
lp.compare = function (a, b) {
  return a === b;
};
lp.find = function (item) {
  if (!this.length) {
    return;
  }
  var key = this.stringify(item);
  if (typeof key === 'string') {
    if (key in this.sideTable) {
      return this.sideTable[key];
    }
    return;
  }
  var cur = this.head.next;
  while (cur.next) {
    if (this.compare(item, cur)) {
      return cur;
    } else {
      cur = cur.next;
    }
  }
};
lp.insert = function (item) {
  var current = this.find(item);
  if (current) {
    current.value = item;
    return current;
  }
  return this.push(item);
};
lp.cache = function (item) {
  var key = this.stringify(item.value);
  if (typeof key === 'string') {
    this.sideTable[key] = item;
    return true;
  }
  return false;
};
lp.decache = function (item) {
  var key = this.stringify(item.value);
  if (typeof key === 'string' && key in this.sideTable) {
    delete this.sideTable[key];
    return true;
  }
  return false;
};
function Item(list, value, prev, next){
  if (list === false) {
    this.list = value;
    this.next = false;
    this.tail = true;
    return;
  } else if (list === true) {
    this.list = value;
    this.prev = false;
    this.head = true;
    return;
  }
  this.value = value;
  this.prev = prev;
  this.prev.next = this;
  this.next = next;
  this.next.prev = this;
  this.list = list;
  this.list.cache(this);
}
var ip = Item.prototype;
ip.destroy = function () {
  if (this.list.length === 1) {
    this.list.clear();
    return this.value;
  }
  this.list.decache(this);
  this.prev.next = this.next;
  this.next.prev = this.prev;
  this.list.length--;
  return this.value;
};
ip.insertBefore = function (value) {
  if (this.head) {
    throw new Error('can\'t insert before the begining');
  }
  this.list.length++;
  return new Item(this.list, value, this.prev, this);
};
ip.insertAfter = function (value) {
  if (this.tail) {
    throw new Error('can\'t insert after the end');
  }
  this.list.length++;
  return new Item(this.list, value, this, this.next);
};