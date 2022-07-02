const DRC = [
  0.5, 1, 1.6, 2, 3, 4, 6, 8, 10, 13, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125,
  160, 200, 250, 320, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3200,
  4000, 5000, 6300,
]; //DevicesRowCurrent

const CCS =  [1.5, 2.5, 4,  6,  10, 16,  25,  35,  50,  70,  95,  120, 150, 185, 240]; //CableCrossSection
const CCuA = [19,  25,  35, 42, 55, 75,  95,  120, 145, 180, 220, 260, 305, 350, NaN]; //CurrentCuprumAir
const CCuG = [27,  38,  49, 60, 90, 115, 150, 180, 225, 275, 330, 385, 435, 500, NaN]; //CurrentCuprumGround

const CT = [
  "",
  "ВВГнг(А)-LS",
  "ВВГнг(А)-FRLS",
  "КГВВГнг(А)-LS",
  "КГВВГнг(А)-FRLS",
  "ВВГнг(А)-FRLS",
  "ПвБШв",
  "в ПНД трубе ПвВГ",
  "ПвБШвнг(А)-LS",
]; //cableTypes

const CLinks = [
  "",
  "cable-vvgng-ls",
  "cable-vvgng-frls",
  "cable-kgvvng-ls",
  "",
  "cable-vvgng-frls",
  "pvvg",
  "pvbshv",
  "",
]; //cableLinks

let I = 0;
let Up = 0.22;
let Ul = (Math.sqrt(3) * Up).toPrecision(2);

const outID1 = document.querySelector("#outputInputData1");
const outID2 = document.querySelector("#outputInputData2");
const outI = document.querySelector("#outputI");
const outDevIn = document.querySelector("#outputDevIn");
const outCabIn = document.querySelector("#outputCabIn");
const LinkToCab = document.querySelector((href = "#link"));

$("body").on("input", ".input-range", function () {
  this.value = this.value.replace(/[^0-9\.\,]/g, "");
  isright(this);
});

function isright(obj) {
  if (obj.value > Number(obj.max)) obj.value = obj.max;
  if (obj.value < Number(obj.min)) obj.value = obj.min;
}

document.querySelector("#calculate").onclick = function () {
  let nPhase = document.querySelectorAll('input[name="nPhase"]');
  for (const n of nPhase) {
    if (n.checked) nPhase = Number(n.value);
  }

  let Pn = Number(document.querySelector("#PowerInput").value);
  let CosFi = Number(document.querySelector("#CosFiInput").value);
  let kIsp = Number(document.querySelector("#kIspInput").value);
  let AppLine = Number(document.querySelector("#AppLine").value);
  let EnterCable = CT[AppLine];

  AppLine == 0
    ? (document.querySelector("#CabLink").style.display = "none")
    : (document.querySelector("#CabLink").style.display = "block");

  if (Pn <= 0 || CosFi <= 0 || kIsp <= 0) {
    document.querySelector("#calculate").classList.remove("btn-primary");
    document.querySelector("#calculate").classList.add("btn-danger");
    document.querySelector("#calculate").innerHTML = "Данные введены некорректно. Попробуйте снова.";
  } else {
    document.querySelector("#calculate").innerHTML = "Пересчитать";
    document.querySelector("#calculate").classList.remove("btn-danger");
    document.querySelector("#calculate").classList.add("btn-primary");
    document.querySelector("#results").style.display = "block";
    document.querySelector("#results").classList.add("card", "bg-green");

    outID1.textContent = `Введены данные для ${nPhase}-фазного потребителя с параметрами:`;
    outID2.textContent = `Pн = ${Pn.toFixed(2)} кВт, Cosφ = ${CosFi.toFixed(2)}, Kи = ${kIsp.toFixed(2)}  `;

    Pr = Pn * kIsp;
    Ir = Pr / (nPhase * CosFi * Up);

    outI.textContent = `Расчётный ток: Iр = ${Ir.toFixed(2)} А`;

    let i = 0;
    while (Ir > DRC[i]) {
      i++;
    }
    let DevIn = DRC[i];

    outDevIn.textContent = `Выбран АВ с номинальным током: ${DevIn} А`;

    let ArrCurCab = CCuA;
    i = 0;
    while (DevIn > ArrCurCab[i]) {
      i++;
    }

    let CabIn = ArrCurCab[i];
    let CabSec = CCS[i];

    outCabIn.textContent = `Выбран кабель: ${EnterCable} ${nPhase + 2}x${CabSec} мм² (Iд.д. = ${CabIn} А)`;

    document.querySelector("#CabLink").href = `https://e-kc.ru/cena/${CLinks[AppLine]}-${nPhase + 2}-${String(CabSec).replace(".", "_")}`;
  }
};
