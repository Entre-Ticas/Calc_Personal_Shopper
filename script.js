 function init() {
    getExchange();
    initCalculadoras();
 }

 function initCalculadoras() {
  // Selecciona todas las calculadoras activas
  const calculadoras = document.querySelectorAll('.calculator');

  calculadoras.forEach((calc, index) => {
    // Inputs dinámicos dentro de cada calculadora
    const price = calc.querySelector(`#price${index}`);
    const pound = calc.querySelector(`#pound${index}`);
    const kg = calc.querySelector(`#Kg${index}`);
    const lb = calc.querySelector(`#Lb${index}`);
    const cbkImp = calc.querySelector(`#cbkImp${index}`);

    if (price) price.addEventListener('input', () => calculate(index));
    if (pound) pound.addEventListener('input', () => calculate(index));
    if (kg) kg.addEventListener('change', () => enableProductWeightLabel(index));
    if (lb) lb.addEventListener('change', () => enableProductWeightLabel(index));
    if (cbkImp) cbkImp.addEventListener('change', () => enableProductWeightLabel2(index));
  });
}

function showTab(tabNum) {
  document.querySelectorAll('.tab').forEach((el, idx) => {
	el.classList.toggle('active', idx + 1 === tabNum);
  });
  document.querySelectorAll('.calculator').forEach((el, idx) => {
	el.classList.toggle('active', idx + 1 === tabNum);
  });
}

async function getExchange() {
  try {	
	document.getElementById('exchange2').textContent = "¢" + TC;
  } catch (error) {
	console.error("Error al obtener el tipo de cambio: ", error);
  }
}

function calculate(id) {

  const get = (name) => document.getElementById(`${name}${id}`);
  const priceInput = get(`price`);
  const results = get(`results`);

  let price = parseFloat(priceInput.value);
  const cbkDollar = get("cbkDollar")?.checked;

  if (isNaN(price) || isNaN(tipoCambio)) {
    results.style.display = "none";
    return;
  }

  // ---------- IMPUESTO OPCIONAL ----------
  if (id === 0) {

    const chkImp = document.getElementById(`cbkImp${id}`);
    const impRow = document.getElementById(`impRow${id}`);

    if (chkImp?.checked) {
      const impPercent = parseFloat(document.getElementById(`impPercent${id}`).value) || 0;
      const extraTax = price * (impPercent / 100);

      price += extraTax;

      document.getElementById(`impPercentLabel${id}`).textContent = impPercent;
      document.getElementById(`impAmount${id}`).textContent = extraTax.toFixed(2);

      impRow.style.display = "block";

    } else {
      impRow.style.display = "none";
    }
  }

  // ---------- COMISION ----------
  const feePercent = cbkDollar ? 0.04 : 0.08;
  const fee = price * feePercent;

  // ---------- PESO ----------
  let weight = 0;

  if (id === 0) {

    const pound = parseFloat(get("pound")?.value) || 0;

    if (!document.getElementById(`Lb${id}`).checked && !document.getElementById(`Kg${id}`).checked) {
      alert("Por favor, seleccione una opción: Kilos o Libras.");
      return;
    }

    if (document.getElementById(`Lb${id}`).checked) {
      weight = pound * precioLibraAmazon;
    }

    if (document.getElementById(`Kg${id}`).checked) {
      weight = pound * precioKgAmazon;
    }
    get(`amountPound`).textContent = weight.toFixed(2);
  }

  // ---------- TOTALES ----------
  const totalUsd = price + fee + weight;
  const totalCrc = totalUsd * tipoCambio;

  get("feeVariable").textContent = cbkDollar ? 4 : 8;
  get("fee").textContent = fee.toFixed(2);
  get("totalUsd").textContent = totalUsd.toFixed(2);
  get("totalCrc").textContent = Math.round(totalCrc).toLocaleString("es-CR");

  results.style.display = "block";
}

document.querySelectorAll('input[name="unidad"]').forEach(radio => {

  radio.addEventListener('change', function() {
	let id = parseInt(this.id.replace(/\D/g, ""), 10); 
	let lbOrKg = 0;
	let pound = document.getElementById(`pound${id}`).value;
	if (document.getElementById(`Lb${id}`).checked) {
	  lbOrKg = (pound * 2.20462).toFixed(2);
	} else if (document.getElementById(`Kg${id}`).checked) {
	  lbOrKg =  (pound / 2.20462).toFixed(2);
	}
	
	document.getElementById(`pound${id}`).value = lbOrKg;

   calculate(id);
})});



function enableProductWeightLabel(id) {
  const peso = document.getElementById(`pound${id}`);

  if (((document.getElementById(`Kg${id}`).checked || document.getElementById(`Lb${id}`).checked) )&& peso.disabled) {
    peso.disabled = false;
	peso.value = 1;
  } 
}

function enableProductWeightLabel2(id) {

  const chk = document.getElementById(`cbkImp${id}`);
  const container = document.getElementById(`impContainer${id}`);

  if (chk.checked) {
    container.style.display = 'block';
  } else {
    container.style.display = 'none';
  }

  calculate(id);
}

