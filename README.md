# DelilahResto

## Introducción
La API Delilah Restó corresponde al tercer trabajo práctico de la carrera Desarrollo Web Full Stack de la academia Acámica. En este TP se intenta replicar el trabajo de un desarrollador Backend utilizando diferentes tecnologías para crear una API de un local de comidas. Algunas de las herramientas/lenguajes utilizadas en este proyecto son:
- JavaScript
- NodeJs
- Express
- NPM
- MySQL
- PostMan (client-side emulator)
- Swagger (YAML editor)
- Apache Server
- GIT

## Estructura del repositorio
### Directorio raíz
En este directorio están los archivos index.js (archivo de servidor), gitignore y archivo de dependencias package.json.
### Services
Acá se encuentran los códigos de los bloques relacionados al manejo de datos y middlewares de la API.
### Endpoints
En esta carpeta estan los códigos de las tres categorias de endpoints de la API que se rutean para poder ser accedidos desde index.js.
### DB
En este directorio estan los códigos donde se definen la configuración de la base de datos, los métodos que definien la estructura de las queries y un módulo queries.js que contiene todos los métodos que necesita la API para interactuar con la base de datos.
### Docs
Esta carpeta contiene el archivo db_init.sql con las queries necesarias para crear la base de datos, sus tablas y popular con datos de prueba las tablas de usuarios y productos. En esta carpeta también vas a encontrar el archivo de especificación donde se detallan las estructuras de todos los endpoints para hacer un uso correcto de la API. Aquí tambien se encuentra el documento de diseño "design_document.pdf" que muestra un diagrama de arquitectura de la API y el diagrama de entidad/relación de la Base de Datos.

## Requerimientos para correr la API y DB
Antes que nada, asegurate de cumplir con los siguientes requerimientos previos. Van a ser necesarios para poder descargar, correr y probar la API correctamente. Debés tener instalado lo siguiente:
- Un entorno de desarrollo y editor de código. Se recomienda Visual Studio Code (VSC) (https://code.visualstudio.com/download)
- NodeJS (https://nodejs.org/es/download/)
- Un servidor y un gestor de MySQL. Se recomienda XAMPP (https://www.apachefriends.org/es/index.html)
- Un emulador de cliente. Se recomienda Postman API Client (https://www.postman.com/product/api-client/)
- El gestor de versionado Git (https://git-scm.com/downloads)

## Clonar la API
Una vez que instalaste todo lo necesario, vas a necesitar clonar el proyecto a tu máquina. A continuación te recomiendo una de las formas en que podés hacerlo.
- Desde el boton "Code" de esta pagina, en la sección Clone, copiá la URL del proyecto. Ejemplo: "https://github.com/mperetti84/DelilahResto.git"
- Creá una carpeta en tu máquina donde quieras copiar el proyecto.
- Abrí Git Bash y navega hasta posicionarte en el directorio que acabás de crear.
- Una vez ahí, corre el comando $git clone seguido de la URL que copiaste, ejemplo:
```
$ git clone https://github.com/mperetti84/DelilahResto.git
```
- Presiona Enter para crear tu clon local del proyecto

Ahora ya tenés el proyecto en tu máquina. Si abrís la carpeta que creaste anteriormente deberías ver todas las carpetas y archivos del proyecto. 

## Instalar las dependencias del proyecto
Para que la API funcione correctamente, es necesario que instales todas las dependencias del proyecto. Estos módulos de NodeJS que se instalarán son obligatorios ya que sin ellos no se podrían ejecutar la mayoria de las funcionalidades de la API. Seguí estos pasos:
- Desde el entorno de desarrollo/ editor de código abri la carpeta donde copiaste el proyecto.
- Desplegá un visor de Terminal (en SVC: View->Terminal)
- Ejecuta el siguiente comando para instalar las dependencias:
```
npm install
```
Listo, las dependencias fueron instaladas y asociadas al proyecto. Deberías ver que la carpeta "node_modules" fue creada y agregada en la raíz del proyecto. Dentro de esta carpeta estan todos los archivos de los módulos instalados. 

## Armar la Base de Datos
Para funcionar, la API debe estar vinculada a una base de datos con un nombre determinado y con una estructura de tablas específica. A continuación están los pasos que debés seguir para crear la base de datos, sus tablas correspondientes y popular dos de sus tablas con datos de ejemplo para que puedas correr y probar la API: 
- Desde el panel de control de XAMPP, iniciar Apache y MySQL.
- Ingresar a la ventana de Administrador de MySQL "phpmyadmin" (http://localhost/phpmyadmin/index.php)
- En la pestaña Importar, hacé click en "Seleccionar archivo" y seleccioná el archivo "db_init.sql" que se encuentra en la carpeta "/Docs".
- Clickeá en el botón "Continuar"

En este punto ya creaste la base de datos, todas sus tablas y populaste las tablas users y products con datos que te van a servir para probar la API. A continuación vamos a conectar la API a la base de datos e inicializar el servidor.

## Inicializar la API
Ya está todo listo para poder inicializar la API. En el archivo "config.js" dentro de la carpeta "/db" se encuentran los parametros necesarios para la conexión a la base de datos con sus valores por defecto. Con los pasos que siguen vas a poder conectar la API con la DB e inicializar el servidor dejándola lista para ejecutar las peticiones definidas en el archivo de especificaciones "spec.yml":
- En el panel de control de XAMPP entra a la seccion de configuración haciendo click en el botón "Config"
- Entrá en "Service and Port Settings"
- En la pestaña MySQL, asegurate que el Main Port tenga el valor 3306 (valor de configuración por defecto). Se querés usar otro puerto, recordá de modificar también el parámetro "port" en el archivo "config.js".
- Dale click a "Save" en ambas ventanas.
- En tu entorno de desarrollo desplegá un visor de Terminal (en SVC: View->Terminal) y ejecuta el siguiente comando:
```
node index.js
```
- Dale Enter y listo! La API se conectó con la DB y se inicializó el servidor. Para validar que ambas acciones se ejecutaron con éxito debés observar debajo del comando que ingresaste en la terminal las siguientes indicaciones:
```
Connecting to DB ...
DB connected
Server started
```

## Usar la API
La API ya esta corriendo, el servidor levantado y la DB creada y conectada, solo falta comenzar a usarla. Basáte en el documento de especificación "specs.yml" que se encuentra en la carpeta "/Docs" para crear las primeras peticiones a la API. En este documento vas a encontrar información precisa de cómo se deben crear las peticiones a los endpoints correspondientes y cuáles son las respuestas esperadas.

Espero que disfrutes de la API, gracias por pasar!

