(module

  ;; Definimos una función que comprueba si un número es primo.
  ;; Un número primo es un entero mayor que 1 que solo es divisible
  ;; entre 1 y él mismo.
  ;;
  ;; Devuelve:
  ;;   1 -> Si el número es primo.
  ;;   0 -> Si el número no es primo.

  (func $esPrimo (param $n i32) (result i32)
    (local $i i32)

    ;; Los números menores que 2 no son primos.
    local.get $n
    i32.const 2
    i32.lt_s
    if
      i32.const 0
      return
    end

    ;; Comenzamos a probar divisores desde 2.
    i32.const 2
    local.set $i

    ;; Comprobamos los divisores hasta la raíz cuadrada de n.
    block $break
      loop $top

        ;; Si i * i > n, no quedan divisores por comprobar.
        local.get $i
        local.get $i
        i32.mul
        local.get $n
        i32.gt_s
        br_if $break

        ;; Si n es divisible entre i, no es primo.
        local.get $n
        local.get $i
        i32.rem_s
        i32.eqz
        if
          i32.const 0
          return
        end

        ;; Probamos el siguiente divisor.
        local.get $i
        i32.const 1
        i32.add
        local.set $i

        br $top
      end
    end

    ;; Si no encontramos ningún divisor, es primo.
    i32.const 1
  )
  ;; Definimos una función que cuenta cuántos números primos hay hasta un límite.
  ;; Ejecuta el bucle masivo directamente en WebAssembly para evitar
  ;; la sobrecarga de llamadas cruzadas entre JavaScript y Wasm.
  ;;
  ;; Devuelve:
  ;;   Cantidad total de números primos encontrados entre 1 y $limite.

  (func $contarPrimos (param $limite i32) (result i32)
    (local $i i32)
    (local $contador i32)

    ;; --- Inicializar i = 1, contador = 0 ---
    i32.const 1
    local.set $i
    i32.const 0
    local.set $contador

    ;; --- Bucle de conteo masivo en Wasm ---
    block $break_count
      loop $top_count
        ;; Salir si i > limite
        local.get $i
        local.get $limite
        i32.gt_s
        br_if $break_count

        ;; Comprobar si i es primo e incrementar contador si retorna 1
        local.get $i
        call $esPrimo
        if
          local.get $contador
          i32.const 1
          i32.add
          local.set $contador
        end

        ;; i += 1
        local.get $i
        i32.const 1
        i32.add
        local.set $i

        ;; Volver al inicio del bucle
        br $top_count
      end
    end

    ;; --- Retornar total de primos encontrados ---
    local.get $contador
  )

  ;; Exportamos las funciones para que puedan usarse desde JavaScript.
  (export "esPrimo" (func $esPrimo))
  (export "contarPrimos" (func $contarPrimos))

)