//EsPrimo.js
let wasmInstance = null;

// Algoritmo equivalente a la lógica del módulo WAT para JavaScript
function esPrimoJS(n) {
  if (n < 2) return 0;

  for (let i = 2; i * i <= n; i++) if (n % i === 0) return 0;

  return 1;
}

async function cargarWasm() {
  if (wasmInstance) return wasmInstance;
  const res = await fetch("./EsPrimo.wasm");
  if (!res.ok) throw new Error("No se pudo cargar EsPrimo.wasm");
  const bytes = await res.arrayBuffer();
  const mod = await WebAssembly.instantiate(bytes);
  wasmInstance = mod.instance.exports;
  return wasmInstance;
}

async function cargarCodigoWat() {
  const pre = document.querySelector("section:nth-of-type(4) pre");
  try {
    const res = await fetch("./EsPrimo.wat");
    if (!res.ok) throw new Error();
    pre.textContent = await res.text();
  } catch {
    pre.textContent = "No se pudo cargar el archivo EsPrimo.wat";
  }
}

function inicializarEventos() {
  // Comprobar número individual
  document
    .getElementById("form-comprobar")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const wasm = await cargarWasm();
      const num = parseInt(document.getElementById("numero").value, 10);
      const pResult = document.querySelector("section:nth-of-type(1) p");
      const inicioWasm = performance.now();
      const esPrimoWasm = wasm.esPrimo(num);
      const tiempoWasm = (performance.now() - inicioWasm).toFixed(4);
      pResult.textContent = `Número ${num}: ${esPrimoWasm === 1 ? "Es PRIMO" : "NO es primo"} (Calculado por Wasm en ${tiempoWasm} ms).`;
    });

  // Listar primos hasta un límite
  document
    .getElementById("form-listar")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const wasm = await cargarWasm();
      const limite = parseInt(document.getElementById("limite").value, 10);
      const output = document.querySelector("section:nth-of-type(2) output");
      const primos = [];
      for (let i = 1; i <= limite; i++) {
        if (wasm.esPrimo(i) === 1) primos.push(i);
      }
      output.textContent = `Primos encontrados (${primos.length}): ${primos.join(", ")}`;
    });

  // Benchmark de rendimiento JS vs WASM
  document
    .getElementById("form-comparar")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const wasm = await cargarWasm();
      const limite = parseInt(
        document.getElementById("limite-comparacion").value,
        10,
      );
      const tbody = document.querySelector("tbody");
      const pBenchmark = document.querySelector("section:nth-of-type(3) p");
      tbody.innerHTML = "";

      // Prueba JavaScript
      const t0JS = performance.now();
      let contadorJS = 0;
      for (let i = 1; i <= limite; i++) if (esPrimoJS(i) === 1) contadorJS++;
      const t1JS = performance.now() - t0JS;

      // Prueba WebAssembly
      const t0Wasm = performance.now();
      //let contadorWasm = 0;
      //for (let i = 1; i <= limite; i++)
      //if (wasm.esPrimo(i) === 1) contadorWasm++;
      const contadorWasm = wasm.contarPrimos(limite);
      const t1Wasm = performance.now() - t0Wasm;

      tbody.innerHTML = `
        <tr>
            <td>JavaScript</td>
            <td>${contadorJS}</td>
            <td>${t1JS.toFixed(2)} ms</td>
        </tr>
        <tr>
            <td>WebAssembly (WAT)</td>
            <td>${contadorWasm}</td>
            <td>${t1Wasm.toFixed(2)} ms</td>
        </tr>
      `;

      const diferencia = (t1JS / t1Wasm).toFixed(2);
      pBenchmark.textContent =
        t1Wasm < t1JS
          ? `WebAssembly ha sido aproximadamente ${diferencia} veces más rápido que JavaScript.`
          : `JavaScript y WebAssembly mostraron rendimientos similares para este rango.`;
    });
}

document.addEventListener("DOMContentLoaded", () => {
  inicializarEventos();
  cargarCodigoWat();
});
