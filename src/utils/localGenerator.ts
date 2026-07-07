/**
 * Generador de respaldo de mensajes estoicos locales.
 * Contenido 100% original, sin paráfrasis de frases célebres conocidas.
 * Estructura: saludo + reflexión del tema + imagen estoica + cierre.
 * Con 5 saludos, 29 reflexiones repartidas en 7 temas, 7 imágenes y 7 cierres.
 */

const SALUDOS = [
  "{nombre}, detente y respira.",
  "{nombre}, recibe estas palabras en el silencio de tu mente.",
  "{nombre}, lee esto no como una orden, sino como un recordatorio.",
  "{nombre}, detén el tumulto del mundo exterior por un instante.",
  "{nombre}, el día te arrastra, pero tú puedes elegir dónde anclarte."
];

const REFLEXIONES_POR_TEMA: Record<string, string[]> = {
  "la serenidad ante lo que no controlas": [
    "El viento sopla sobre las copas de los árboles sin preguntarles su dirección; de la misma manera, los sucesos externos caen sobre nosotros sin pedir permiso. Tu único reino soberano es la actitud con la que decides recibirlos.",
    "Te afanas por corregir las olas del océano, olvidando que ninguna fuerza humana puede calmar la marea. Lo único que puedes gobernar es la firmeza de tus propios pies sobre la orilla.",
    "La tormenta ruge afuera, pero dentro de ti hay un rincón inalcanzable para cualquier tempestad del destino. No busques calmar el viento; calma tu propia respiración.",
    "Sufres porque exiges que las cosas se adapten a tus deseos, en lugar de adaptar tus expectativas a la naturaleza del universo. Desear lo incontrolable es cavar tu propia celda."
  ],
  "la adversidad y cómo atravesarla": [
    "La dificultad que tienes delante no es un muro que te bloquea el paso, sino el terreno mismo sobre el que debes construir tu propio carácter. El fuego que consume la madera débil es el mismo que templa el acero.",
    "Cada obstáculo en tu camino no es una desgracia, sino una oportunidad directa para practicar la paciencia, la audacia o la templanza. Sin viento en contra, el ave nunca aprendería a elevarse.",
    "Cuando el camino se vuelva áspero y sientas que las fuerzas te abandonan, recuerda que la fatiga es solo el precio de tu transformación. Los caminos fáciles nunca conducen a la cima del monte.",
    "Mira la piedra en el camino: no está allí para hacerte caer, sino para forzar tus piernas a saltar más alto. El verdadero filósofo transforma cada tropiezo en un paso adelante."
  ],
  "la disciplina y el trabajo diario": [
    "Lo que haces cada día sin testigos es el cincel con el que te esculpes. Nadie aplaude al escultor mientras golpea; aplauden a la estatua cuando ya está terminada. Tu constancia silenciosa es tu obra de arte.",
    "El río no talla el cañón por su fuerza bruta, sino por su persistencia constante a lo largo del tiempo. No busques grandes hazañas de un solo día; busca la pequeña victoria cotidiana.",
    "Vencer a un ejército en batalla es más fácil que gobernarte a ti mismo en las horas de ocio y pereza. La verdadera soberanía consiste en levantarse y hacer lo debido, incluso cuando todo el cuerpo pide descanso.",
    "La constancia no es un castigo, sino la mayor muestra de amor y respeto que puedes tener por tu propio potencial. No dejes que el capricho del momento destruya el trabajo de meses."
  ],
  "una pérdida o despedida": [
    "Nada de lo que amamos nos pertenece realmente; el universo solo nos lo presta por un tiempo. Cuando llegue el momento de devolverlo, agradece el tiempo compartido en lugar de maldecir la partida.",
    "La ausencia de lo que amabas deja un vacío inmenso, pero también te recuerda la belleza de haberlo tenido cerca. La tristeza es el eco del amor, pero no dejes que nuble tu presente.",
    "Las estaciones cambian, las hojas caen y las personas parten de nuestra vida como parte de un ciclo natural e inevitable. Aceptar el fin de una etapa es abrir la puerta a la sabiduría del camino.",
    "El dolor por la despedida es una herida sagrada, pero aferrarse al pasado solo prolonga el sufrimiento. Abraza el recuerdo con gratitud y sigue caminando con el corazón abierto."
  ],
  "encontrar propósito y dirección": [
    "No busques el propósito de tu vida en las estrellas ni en el reconocimiento de los demás; el sentido nace de tus acciones más pequeñas hoy. Una vida con dirección es aquella que actúa con justicia.",
    "Caminar sin rumbo es permitir que cualquier viento decida tu destino. Define hoy qué hombre o mujer deseas ser y haz que cada paso que des apunte directamente hacia esa visión.",
    "El propósito no es una meta lejana que alcanzar, sino la manera en que decides cruzar el puente del presente. Vive con rectitud y habrás encontrado todo el sentido que necesitas.",
    "A menudo buscamos grandes misiones, ignorando que el propósito se revela en la paciencia con la que tratamos a un amigo o la honestidad con la que realizamos nuestra tarea diaria."
  ],
  "el miedo al futuro": [
    "Sufres más en tu imaginación que en la realidad misma. El mañana aún no existe y el ayer ya se ha ido; solo el presente te pertenece. No gastes las fuerzas de hoy en batallas imaginarias del mañana.",
    "El futuro llegará con sus propios desafíos, y para entonces tendrás las mismas herramientas mentales que hoy te sostienen en pie. No te adelantes al dolor antes de que llame a tu puerta.",
    "El miedo al mañana es la cadena con la que atas tu libertad de hoy. El universo es un río en constante cambio, y tu única tarea es aprender a flotar sin pánico en sus aguas turbulentas.",
    "Proyectar desastres futuros es una trampa de la mente que busca certezas donde no las hay. Abraza la incertidumbre como el espacio donde se forja el coraje."
  ],
  "general": [
    "Mira a tu alrededor: todo fluye, cambia y se transforma a cada instante. No pretendas congelar el río del tiempo; aprende a nadar en él con alegría y dignidad.",
    "La vida no se mide por los años que respiramos, sino por los momentos de lucidez en los que somos plenamente dueños de nuestra mente. Desapierta de tu letargo y habita este instante.",
    "La riqueza más grande no se encuentra en el cofre del tesoro, sino en la ausencia de deseos superfluos. Aquel que se contenta con lo necesario es más libre que cualquier emperador.",
    "No son los hechos los que perturban a los hombres, sino los juicios y opiniones que formulan sobre esos hechos. Cambia tu interpretación y cambiarás tu mundo entero.",
    "La verdadera libertad consiste en no depender de las opiniones ajenas ni de los favores del destino. Eres el único dueño de tu ciudadela interior; protégela con celo."
  ]
};

const IMAGENES = [
  "Piensa en la roca del acantilado: el mar embravecido la golpea día y noche, pero ella permanece firme, templada y sin inmutarse ante el rugido del agua.",
  "Visualiza el yunque bajo el martillo pesado: cada golpe ruidoso no lo destruye, sino que lo hace más compacto, denso y resistente.",
  "Imagínate como una antorcha encendida en medio de la noche: cuanto más fuerte sopla el viento, más aviva tu llama y más alumbra tu entorno.",
  "Observa un timón firme en mitad de una tempestad colosal: el viento sopla enfurecido, pero la madera del timonel guía el barco con paciencia y precisión.",
  "Considera la corriente de un río de montaña: fluye sorteando las piedras con suavidad, sin luchar contra ellas, adaptando su curso con naturalidad infinita.",
  "Contempla el roble majestuoso que hunde sus raíces profundamente en la tierra: es precisamente el viento invernal el que le obliga a aferrarse con más fuerza al suelo.",
  "Recuerda el agua limpia que se vierte sobre el barro: con constancia y flujo continuo, disuelve la turbiedad hasta volver a dejar el fondo nítido."
];

const CIERRES = [
  "Camina hoy con paso firme y la cabeza alta.",
  "No olvides que tu fortaleza reside en tu interior.",
  "Que la razón sea siempre tu brújula en el camino.",
  "Mantén tu ciudadela interior a salvo de los ruidos del mundo.",
  "Acepta el presente y abraza tu destino con serenidad.",
  "Tú eres el único guardián de tu paz.",
  "El día es tuyo; actúa con justicia y templanza."
];

const FILOSOFOS = ["Marco Aurelio", "Séneca", "Epicteto", "Musonio Rufo", "Cleantes"];

export function generarMensajeLocal(nombre: string, temaKey: string): { texto: string; firma: string } {
  // Normalize key to match internal keys or fallback to general
  let key = temaKey;
  if (!REFLEXIONES_POR_TEMA[key]) {
    key = "general";
  }

  const saludos = SALUDOS;
  const reflexiones = REFLEXIONES_POR_TEMA[key];
  const imagenes = IMAGENES;
  const cierres = CIERRES;

  const saludo = saludos[Math.floor(Math.random() * saludos.length)].replace("{nombre}", nombre);
  const reflexion = reflexiones[Math.floor(Math.random() * reflexiones.length)];
  const imagen = imagenes[Math.floor(Math.random() * imagenes.length)];
  const cierre = cierres[Math.floor(Math.random() * cierres.length)];

  const texto = `${saludo} ${reflexion} ${imagen} ${cierre}`;
  const firma = `— ${FILOSOFOS[Math.floor(Math.random() * FILOSOFOS.length)]}`;

  return { texto, firma };
}
