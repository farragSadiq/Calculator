const keysContainer = document.getElementById("keys-container");
const hero = document.querySelector("#hero");
const calculated = document.querySelector("#calculated");

const inputs = document.querySelectorAll("#num, #function")

const deleteKey = document.querySelector("#delete");
const acKey = document.querySelector("#ac");
const equalsKey = document.querySelector("#equals");

let input = ""
let result = 0

updateDisplay(input)

function inputHandler(e) {
  let val = e.target.value
  let lastInput = input[input.length - 1]
  if (!input && /[+ \- x ÷ 0]/g.test(val)) return

  if (val === ".") {
    if (lastInput === ".") return
    if (/[+ \- x ÷]/g.test(lastInput) || !input) val = "0" + val
  }

  if (/[+ \- x ÷]/g.test(lastInput) && /[+ \- x ÷]/g.test(val)) {
    input = input.replace(lastInput, val)

  } else {
    input ? input += String(val) : input = String(val)

  }

  updateDisplay(input)
}



function updateDisplay(inp, res) {
  let display = 0;
  if (inp) {
    let transformedInp = "";
    for (let char of inp) {
      let isFloat = false
      if (char === ".") {
        transformedInp.match(/(\d+[.]|\d+)?(\d+|[.])/g).forEach(dig => {
          isFloat = dig.includes(".")
        })
        if (isFloat) continue
      }

      transformedInp += /([.])|([.])?[0-9]+/g.test(char) ? char : ` ${char} `

    }
    display ? display += transformedInp : display = transformedInp
  }

  hero.innerHTML = display

  if (res) {
    hero.innerHTML = res
    calculated.innerHTML = display
  }

  hero.innerHTML.length > 15 ? resizeFont(hero.innerHTML.length) : resizeFont()
}

function resizeFont(value) {
  value ? hero.style.fontSize = ` calc(1em - ${value / 3})` : hero.style.fontSize = `1em`
  hero.scrollLeft = hero.scrollWidth

}

function calc(inp) {
  if (!inp || /[+ \- x ÷]/g.test(inp[inp.length - 1]) || result === inp) return
  let numsArray = inp.match(/([0-9]+)?([.])?[0-9]+/g).map(item => parseFloat(item)) || []
  let signsArray = inp.match(/[+ \- x ÷]/g) || []

  if (Number(result) < 0) {
    signsArray.shift()
    numsArray[0] = -numsArray[0]
  }
  result = 0

  let newNumsArray = []
  let newSignsArray = []
  for (let i = 0; i < numsArray.length; i++) {
    switch (signsArray[i - 1]) {
      case "+": newNumsArray.push(numsArray[i]); newSignsArray.push("+");
        break;
      case "-": newNumsArray.push(numsArray[i]); newSignsArray.push("-");
        break;
      case "x": newNumsArray[newNumsArray.length - 1] *= numsArray[i];
        break;
      case "÷": newNumsArray[newNumsArray.length - 1] /= numsArray[i];
        break;
      default: newNumsArray.push(numsArray[i])
    }
  }


  for (let i = 0; i < newNumsArray.length; i++) {
    if (newSignsArray[i - 1] === "-") {
      result -= newNumsArray[i]
    } else {
      result += newNumsArray[i]
    }

  }
  result = Number.isSafeInteger(result) ? result : result.toFixed(2)

  updateDisplay(inp, String(result));
  input = String(result);

}

inputs.forEach(inp => {
  inp.addEventListener("click", inputHandler)
})

equalsKey.addEventListener("click", () => calc(input))

deleteKey.addEventListener("click", () => {
  if (input) {
    input = input.slice(0, input.length - 1) || 0
  }

  updateDisplay(input)
  result = 0
});

acKey.addEventListener("click", () => {
  input = ""
  calculated.innerHTML = ""
  result = 0
  updateDisplay(input, result)
});