# III War World

Primer prototipo jugable del juego de gran estrategia.

## Probar
Abre `index.html` mediante GitHub Pages o un servidor web estático.

## Incluido en v0.1
- Mapa interactivo Europa occidental / Mediterráneo.
- Nodos terrestres conquistables conceptualmente.
- Nodos marítimos neutrales y no conquistables.
- Conexiones tierra-tierra, mar-mar y costa-mar.
- Dos ejércitos de prueba.
- Selección y movimiento entre nodos vecinos.
- Moral militar aplicada a la fuerza de combate con mínimo del 10%.
- Combate al coincidir ejércitos enemigos en un nodo.
- Interfaz adaptada a móvil.

## Reglas económicas fijadas
Cada provincia consume por intervalo 12 de trigo, carne, petróleo, carbón, madera e hierro. La producción máxima base del recurso provincial es 100 y depende de la moral según: `100 × (0.5 + moral / 200)`.

Este prototipo es la base técnica, no el mapa definitivo.