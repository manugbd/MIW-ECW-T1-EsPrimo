# Demostración de Rendimiento: WebAssembly (WAT) vs JavaScript

Aplicación web desarrollada para comprobar números primos y comparar el rendimiento de JavaScript frente a WebAssembly nativo mediante un archivo WAT.

## Características de la aplicación

- **Comprobación individual:** permite comprobar si un número entero es primo mediante un algoritmo clásico de división, probando divisores desde `2` hasta la raíz cuadrada del número.
- **Generador de números primos:** permite obtener todos los números primos existentes hasta un límite indicado.
- **Benchmark comparativo:** ejecuta el cálculo de números primos mediante JavaScript y WebAssembly y muestra el tiempo empleado mediante `performance.now()`.
- **Código WebAssembly visible:** carga dinámicamente el archivo `.wat` mediante Fetch y muestra su contenido en la aplicación.
- **WebAssembly nativo:** el módulo se desarrolla directamente mediante WAT, sin utilizar C, C++, Rust u otro lenguaje como paso intermedio.

## Estructura del proyecto

- `EsPrimo.html` — Interfaz de la aplicación.
- `EsPrimo.css` — Estilos de la aplicación.
- `EsPrimo.js` — Lógica JavaScript e interacción con WebAssembly.
- `EsPrimo.wat` — Código fuente WebAssembly en formato textual.
- `EsPrimo.wasm` — Módulo WebAssembly compilado a formato binario.
- `leeme.txt` — Características, ventajas y estándares utilizados.

## Funcionamiento

La función `esPrimo` está implementada tanto en JavaScript como en WebAssembly para realizar la misma operación en ambos lenguajes.

El módulo WebAssembly también dispone de `contarPrimos`, que realiza directamente el recorrido y las comprobaciones dentro de WebAssembly. Esto permite realizar el benchmark evitando una llamada JavaScript → WebAssembly por cada número.

Los tiempos obtenidos pueden variar dependiendo del navegador, hardware y carga del sistema.

## Ventajas de WebAssembly frente a JavaScript

- **Tipos numéricos explícitos:** WebAssembly utiliza tipos definidos como `i32`, mientras que JavaScript utiliza un sistema de tipos dinámico.
- **Formato binario compacto:** WebAssembly utiliza un formato binario diseñado para su ejecución eficiente en los navegadores.
- **Cálculos intensivos:** WebAssembly está diseñado para ejecutar eficientemente operaciones que requieren una elevada cantidad de cálculos.
- **Menor comunicación entre JavaScript y WebAssembly:** `contarPrimos` realiza el bucle completo dentro del módulo WebAssembly, evitando numerosas llamadas entre ambos entornos.

Estas características no implican que WebAssembly sea siempre más rápido que JavaScript. El resultado depende del algoritmo, navegador, hardware y forma de comunicación entre ambos entornos.

## Estándares y tecnologías utilizadas

La aplicación utiliza HTML5, CSS, JavaScript mediante módulos ES6 y WebAssembly nativo mediante WAT. También utiliza Fetch para cargar el código WAT y `performance.now()` para realizar las mediciones.

La estructura HTML utiliza elementos semánticos como `header`, `main`, `section` y `footer`, además de asociar correctamente los `label` con sus campos de formulario. No se utilizan frameworks ni librerías externas.

## Ejecución

Es necesario ejecutar la aplicación mediante un servidor web para poder cargar correctamente el módulo WebAssembly.

```bash
python3 -m http.server 8000