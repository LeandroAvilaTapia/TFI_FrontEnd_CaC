const { createApp } = Vue;

// Crea una instancia de la aplicación Vue
createApp({
  data() {
    /* El código define una instancia de la aplicación Vue. Aquí se especifican los datos utilizados por la aplicación, incluyendo la lista de productos, la URL del backend, indicadores de error y carga, así como los atributos para almacenar los valores del formulario de producto.
     */
    return {
      productos: [], // Almacena los productos obtenidos del backend
      // url:'http://localhost:5000/productos', // URL local
      url: "https://leandroavilatapia.pythonanywhere.com/productos", // URL del backend donde se encuentran los productos
      error: false,
      cargando: true,
      // Atributos para el almacenar los valores del formulario
      id: 0,
      nombre: "",
      imagen: "",
      stock: 0,
      precio: 0,
    };
  },
  computed: {
    cantidadProductos() {
      return this.productos.length;
    }
  },
  mounted(){
        
    const prueba = this; // Almacenar una referencia a la instancia de Vue
      
      document.getElementById("formularioBusqueda").addEventListener("submit", function (event) {
        // Evitar que el formulario se envíe de forma predeterminada
        event.preventDefault();
        
        // Obtener el valor del campo de búsqueda
        var textoBuscado = document.getElementsByName("textoBuscado")[0].value;
        console.log(textoBuscado);
        
        if (textoBuscado !== "") {      
          prueba.cargando = true;      
          // Realizar una solicitud fetch para enviar los datos del formulario a la ruta Flask
          fetch("https://leandroavilatapia.pythonanywhere.com/productos/find/" + textoBuscado)
            .then((response) => response.json())
            .then((data) => {
              // Mostrar los productos que coinciden con el término de búsqueda
              prueba.productos = data;
              prueba.cargando = false;
            })
            .catch((err) => {
              console.error(err);
              prueba.error = true;
              alert("Error al buscar productos.");
            });
        } else {
          prueba.fetchData(prueba.url);
        }
      });
  },
  methods: {
    fetchData(url) {
      /**El método fetchData realiza una solicitud HTTP utilizando la función fetch a la URL especificada. Luego, los datos de respuesta se convierten en formato JSON y se asignan al arreglo productos. Además, se actualiza la variable cargando para indicar que la carga de productos ha finalizado. En caso de producirse un error, se muestra en la consola y se establece la variable error en true.
       *
       */
      fetch(url)
        .then((response) => response.json()) // Convierte la respuesta en formato JSON
        .then((data) => {
          // Asigna los datos de los productos obtenidos al arreglo 'productos'
          this.productos = data;
          this.cargando = false;
        })
        .catch((err) => {
          console.error(err);
          this.error = true;
        });
    },
    eliminar(producto) {
      /* El método eliminar toma un parámetro producto y construye la URL para eliminar ese producto en particular. Luego, realiza una solicitud fetch utilizando el método HTTP DELETE a la URL especificada. Después de eliminar el producto, la página se recarga para reflejar los cambios.
       */
      // Construye la URL para eliminar el producto especificado
      const url = this.url + "/" + producto;
      var options = {
        method: "DELETE", // Establece el método HTTP como DELETE
      };
      fetch(url, options)
        .then((res) => res.text()) // Convierte la respuesta en texto (or res.json())
        .then((res) => {
          location.reload(); // Recarga la página actual después de eliminar el producto
        });
    },

    duplicar(producto){
      const url = this.url + "/" + producto; //estoy en el producto a dupplicar
      let productos = {}
      var options = {
        method: "GET", // Establece el método HTTP como DELETE
      };
      fetch(url, options)
        .then((response) => response.json())
        .then((data) => {
          
        console.log(data);  
          productos = {
            nombre: data.nombre,
            precio: data.precio,
            stock: data.stock,
            imagen: data.imagen,
          };
          // Configurar las opciones para la solicitud fetch
      var options = {
        body: JSON.stringify(productos), // Convertir el objeto a una cadena JSON
        method: "POST", // Establecer el método HTTP como POST
        headers: { "Content-Type": "application/json" },
        redirect: "follow",
      };
      console.log(options);

      // Realizar una solicitud fetch para guardar el producto en el servidor
      fetch(this.url, options)
        .then(function () {
          window.location.href = "./productos.html"; // Redirigir a la página de productos
        })
        .catch((err) => {
          console.error(err);
          
        });
        })

        .catch((err) => {
          console.error(err);
          alert("Error al duplicar.");
        });    

    },
    grabar() {
      /* El método grabar se encarga de guardar los datos de un nuevo producto en el servidor. Primero, se crea un objeto producto con los datos ingresados en el formulario. Luego, se configuran las opciones para la solicitud fetch, incluyendo el cuerpo de la solicitud como una cadena JSON, el método HTTP como POST y el encabezado Content-Type como application/json. Después, se realiza la solicitud fetch a la URL especificada utilizando las opciones establecidas. Si la operación se realiza con éxito, se muestra un mensaje de éxito y se redirige al usuario a la página de productos. Si ocurre algún error, se muestra un mensaje de error.
       */
      // Crear un objeto 'producto' con los datos del formulario
      let producto = {
        nombre: this.nombre,
        precio: this.precio,
        stock: this.stock,
        imagen: this.imagen,
      };

      // Configurar las opciones para la solicitud fetch
      var options = {
        body: JSON.stringify(producto), // Convertir el objeto a una cadena JSON
        method: "POST", // Establecer el método HTTP como POST
        headers: { "Content-Type": "application/json" },
        redirect: "follow",
      };

      // Realizar una solicitud fetch para guardar el producto en el servidor
      fetch(this.url, options)
        .then(function () {
          alert("Registro grabado!");
          window.location.href = "./productos.html"; // Redirigir a la página de productos
        })
        .catch((err) => {
          console.error(err);
          alert("Error al Grabar.");
        });
    },
    
  },
  created() {
    this.fetchData(this.url);

  },
}).mount("#app");
