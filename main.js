// const body = document.body
// const div = document.createElement("div")
// const strong = document.createElement("strong")


// strong.innerText = "Monkeys are strong"
// div.append(strong)
// div.innerText = "Monkeys"
//div.innerHTML = "<b>Monkeys 2</b> are <i>Monkeys</i>"

// body.append(div)


// const div = document.querySelector("div")

// console.log(div.textContent)
// console.log(div.innerText)


// const div = document.querySelector("div")
// const spanHi = document.querySelector("#hi")
// const spanBye = document.querySelector("#bye")

//spanBye.remove()

//console.log(spanHi.setAttribute("title", "monkeys"))

//console.log(spanHi.dataset)

const grandparent = document.querySelector(".grandparent");
const parent = document.querySelector(".parent");
const child = document.querySelector(".child");

let grandparentColorIndex = 0;
let parentColorIndex = 0;
let childColorIndex = 0;

const colors = ["orange", "green", "purple"];

document.addEventListener("click", e => {
    console.log("Document");
});

grandparent.addEventListener("click", e => {
    grandparent.style.backgroundColor = colors[grandparentColorIndex];
    grandparentColorIndex = (grandparentColorIndex + 1) % colors.length;
    console.log("Grandparent 1");
});

parent.addEventListener("click", e => {
    parent.style.backgroundColor = colors[parentColorIndex];
    parentColorIndex = (parentColorIndex + 1) % colors.length;
    console.log("Parent 1");
});

child.addEventListener("click", e => {
    child.style.backgroundColor = colors[childColorIndex];
    childColorIndex = (childColorIndex + 1) % colors.length;
    console.log("Child 1");
});



// parent.addEventListener('')
// child.addEventListener('')