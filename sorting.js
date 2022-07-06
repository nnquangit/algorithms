const colours = {
  yellow: "\x1b[33m%s\x1b[0m",
};
const arr = [43, 613, 831, 987, 17, 210, 1990, 1234];

Object.prototype.toFlat = function () {
  return Object.values(this).reduce((a, c) => a.concat(c), []);
};

Array.prototype.toLog = function () {
  return "[" + this.join(", ") + "]";
};

Array.prototype.swap = function (i, j) {
  let temp = this[i];
  this[i] = this[j];
  this[j] = temp;
};

Array.prototype.quick_sort = function () {
  const segments = [[0, this.length - 1]];
  const partition = function (left, right) {
    let iterator = left;
    let pivot = this[right];

    for (let i = left + 1; i < right; i++) {
      if (this[i] <= pivot) {
        this.swap(iterator, i);
        iterator++;
      }
    }

    if (this[right] < this[iterator]) {
      this.swap(iterator, right);
    }

    return iterator;
  }.bind(this);

  console.log(colours.yellow, "Quick sort");
  console.log(this.toLog(), "Before");

  while (segments.length) {
    let [left, right] = segments.pop();
    let iterator = partition(left, right);
    console.log(this.toLog(), "Partition", left, right);

    if (iterator > left) {
      segments.push([left, iterator]);
    }

    if (iterator < right - 1) {
      segments.push([iterator + 1, right]);
    }
  }

  console.log(this.toLog(), "After");
};

Array.prototype.radix_sort = function () {
  let done = false;
  let base = 10;
  let position = 1;
  let arrs = this;

  console.error(colours.yellow, "Radix sort");
  console.log(arrs.toLog(), "Before");

  while (!done) {
    done = true;
    let list = {};
    arrs.forEach((element) => {
      let temp = Math.floor(element / position);
      let digit = temp % base;
      if (list[digit]) {
        list[digit].push(element);
      } else {
        list[digit] = [element];
      }
      done = temp > 0 ? false : done;
    });

    arrs = list.toFlat();
    position *= base;
  }

  console.log(arrs.toLog(), "After");
};

arr.quick_sort();
