const arr = [4, 1, 6, 2, 7, 3, 1, 9, 2, 8, 3, 7];

Array.prototype.toLog = function () {
  return "[" + this.join(", ") + "]";
};

function swap(i, j) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

function show(iterator, i) {
  const padBegin = (iterator + 1) * 3;
  const padFromSub = (i - iterator) * 3;
  const padEnd = (arr.length - i - 1) * 3;
  console.log(
    "s".padStart(padBegin, "-") +
      "i".padStart(padFromSub, "-") +
      "".padStart(padEnd, "-")
  );
}

function partition(left, right) {
  let iterator = left;
  let pivot = arr[right];

  for (let i = left + 1; i < right; i++) {
    if (arr[i] <= pivot) {
      show(iterator, i);
      swap(iterator, i);
      iterator++;
    }
  }

  if (arr[right] < arr[iterator]) {
    show(iterator, right);
    swap(iterator, right);
  }

  return iterator;
}

function quick_sort() {
  const segments = [[0, arr.length - 1]];
  while (segments.length) {
    let [left, right] = segments.pop();
    console.log(arr.toLog(), "Partition", left, right);

    let iterator = partition(left, right);

    if (iterator > left) {
      segments.push([left, iterator]);
    }

    if (iterator < right - 1) {
      segments.push([iterator + 1, right]);
    }
  }
}

console.log(arr.toLog(), "Before");
quick_sort();
console.log(arr.toLog(), "After");
