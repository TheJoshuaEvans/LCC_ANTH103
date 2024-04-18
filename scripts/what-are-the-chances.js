/*
  If there are 171 objects in two parallel arrays, and they are all randomly joined together,
  what is the chances that of the first 31 objects in each array, 15 of them match together 
*/

const startTime = Date.now();
const RUN_COUNT = 10_000_000;
const LOG_WAIT_SECONDS = 2;

/**
 * Generate a random integer!
 * 
 * @param {number} max The maximum value to return (exclusive)
 */
const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
}

// Create a map that will hold our results per matched count
const matchedCountMap = {};
for (let i=0; i<=31; i++) {
  matchedCountMap[i] = 0;
}

// Make the arrays
const arr1 = [];
const arr2 = [];
for (let i=0; i<171; i++) {
  arr1[i] = {i, partnerInArr2: null};
  arr2[i] = {i, partnerInArr1: null};
}

console.log(`Running ${RUN_COUNT.toLocaleString()} iterations...`);
let lastCheckTime = Date.now();

for (let i=0; i<RUN_COUNT; i++) {
  if (lastCheckTime < Date.now() - LOG_WAIT_SECONDS * 1000) {
    console.log(`...still processing. Current index: ${i.toLocaleString()}...`)
    lastCheckTime = Date.now();
  }

  const splicingArr2 = [...arr2];

  // Randomly put them together by going through the first array and randomly assigning a
  // partner in the second array
  arr1.forEach((partnerFromArr1) => {
    // Select the partner and extract it from the splicing array
    const partnerIndex = getRandomInt(splicingArr2.length)
    const partnerFromArr2 = splicingArr2.splice(partnerIndex, 1)[0];

    // Link!
    partnerFromArr1.partnerInArr2 = partnerFromArr2;
    partnerFromArr2.partnerInArr1 = partnerFromArr1;
  });

  // Pick out the first 31 from each array
  const compareArr1 = arr1.slice(0, 31);
  const compareArr2 = arr2.slice(0, 31);

  // Count the number of references within the comparison arrays that match
  let matchedCount = 0;
  compareArr1.forEach((itemFromArr1) => {
    if (compareArr2.includes(itemFromArr1.partnerInArr2)) {
      matchedCount++;
    }
  });

  // Add it to the map
  matchedCountMap[matchedCount]++;
}

// Calculate the percentage chances and stuff from the numbers
const valuesMap = {};
for (const numberOfMatches in matchedCountMap) {
  const timesEncountered = matchedCountMap[numberOfMatches];

  const percentChance = (timesEncountered / RUN_COUNT) * 100;
  valuesMap[numberOfMatches] = {
    timesEncountered,
    percentChance,
    inversePercent: 100 - percentChance,
  };
}

const endTime = Date.now();

console.log(`...Ran for ${((endTime - startTime) / 1000).toFixed(2)} seconds`)
console.log(valuesMap);
