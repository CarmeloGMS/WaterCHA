function solveWaterJugChallenge() {
  // Obtener capacidades de los jarrones y la cantidad objetivo desde el HTML
  const jugXCapacity = parseInt(document.getElementById('jug-x-capacity').value);
  const jugYCapacity = parseInt(document.getElementById('jug-y-capacity').value);
  const targetAmount = parseInt(document.getElementById('target-amount').value);

  // Resolver el desafío de los jarrones
  const solution = waterJugSolver(jugXCapacity, jugYCapacity, targetAmount);
  // Mostrar la solución o indicar si no hay solución
  if (solution === "No Solution") {
    document.getElementById('solution-container').textContent = "Sin solución";
  } else {
    displaySolution(solution, jugXCapacity, jugYCapacity);
  }
}

function waterJugSolver(x, y, z) {
  // Inicializar la cola con el estado inicial y el conjunto de visitados
  const queue = [[0, 0]];
  const visited = new Set();
  let steps = 0;

  // Bucle principal para explorar los estados posibles
  while (queue.length > 0) {
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      // Extraer el estado actual de la cola
      const [a, b] = queue.shift();
      // Verificar si se alcanzó la cantidad objetivo en algún jarro
      if (a === z || b === z) {
        return steps; // Devolver la cantidad de pasos necesarios
      }
      const key = `${a},${b}`;
      // Verificar si el estado actual ya fue visitado
      if (visited.has(key)) {
        continue; // Saltar al siguiente estado si ya fue visitado
      }
      visited.add(key);

      // Generar los estados siguientes y agregarlos a la cola
      queue.push([x, b]); // Llenar jarro X
      queue.push([a, y]); // Llenar jarro Y
      queue.push([0, b]); // Vaciar jarro X
      queue.push([a, 0]); // Vaciar jarro Y
      queue.push([Math.max(0, a - (y - b)), Math.min(b + a, y)]); // Verter de X a Y
      queue.push([Math.min(a + b, x), Math.max(0, b - (x - a))]); // Verter de Y a X
    }
    steps++; // Incrementar el contador de pasos después de explorar un nivel
  }

  return "No Solution"; // Devolver si no se encuentra una solución
}

function displaySolution(solution, jugXCapacity, jugYCapacity) {
  // Obtener el contenedor para la solución
  const solutionContainer = document.getElementById('solution-container');
  solutionContainer.textContent = '';

  let currentStateX = 0;
  let currentStateY = 0;

  // Iterar a través de cada paso de la solución
  for (let i = 0; i <= solution; i++) {
    // Obtener los elementos HTML de los jarrones
    const jugXElement = document.getElementById('jug-x');
    const jugYElement = document.getElementById('jug-y');

    // Actualizar la altura de los jarrones según el estado actual
    jugXElement.style.height = `${(currentStateX / jugXCapacity) * 100}%`;
    jugYElement.style.height = `${(currentStateY / jugYCapacity) * 100}%`;

    // Mostrar el estado actual en el contenedor de la solución
    solutionContainer.textContent += `Step ${i}: Jug X: ${currentStateX}, Jug Y: ${currentStateY}\n`;

    // Generar el próximo estado
    const nextStates = getNextStates(currentStateX, currentStateY, jugXCapacity, jugYCapacity);
    const nextState = nextStates[i];
    currentStateX = nextState[0];
    currentStateY = nextState[1];
  }
}

function getNextStates(currentX, currentY, jugXCapacity, jugYCapacity) {
  // Devolver los posibles estados siguientes según las operaciones permitidas
  return [
    [jugXCapacity, currentY], // Llenar jarro X
    [currentX, jugYCapacity], // Llenar jarro Y
    [0, currentY], // Vaciar jarro X
    [currentX, 0], // Vaciar jarro Y
    [Math.max(0, currentX - (jugYCapacity - currentY)), Math.min(currentY + currentX, jugYCapacity)], // Verter de X a Y
    [Math.min(currentX + currentY, jugXCapacity), Math.max(0, currentY - (jugXCapacity - currentX))] // Verter de Y a X
  ];
}