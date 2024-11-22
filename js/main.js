const API = "https://api.github.com/users/";

const app = Vue.createApp({
  data () {
    return {
      search: null,
      result: null, 
      error: null,
      favorites: new Map()
    }
  },
  // cuando Vue se inicializa recorre una serie de pasos
  // created: se crea la instancia Vue pero no tenemos acceso al DOM
  // mounted : tengo acceso a la plantilla del DOM
  created() {
    // guardamos en favorites con JSON.stringify, ahora hay que hacer el parse
    const saveFavorites = JSON.parse(window.localStorage.getItem('favorites'));
    if( saveFavorites?.length){
      // recorremos los favoritos guardados y creamos un nuevo mapa
      // para cada favorite se retorna un array con la key y el value
      const favorites = new Map(saveFavorites.map(favorite =>[favorite.login, favorite]))
     //asociamos a la propiedad favorites de data los favoritos que nos hemos traido del localstorage
      this.favorites = favorites
    }
  },
  computed: {
    isFavorite() {
      return this.favorites.has(this.result.login)
    },

    // con este metodo solo obtengo los valores de favoritos
    allFavorites() {
      return Array.from (this.favorites.values())
    }
  },
  methods: {
    async doSearch() {
      // reinicialiamos los estados cada vez que hacemos la peticion
      this.result = this.error = null
      const foundInFavorites = this.favorites.get(this.search)
      const shouldRequestAgain = (() => {
        if (!!foundInFavorites) {
          const { lastRequest } = foundInFavorites;
          return (
            new Date().getTime() - new Date(lastRequest).getTime() >
            requestMaxTimeMs
          );
        }
        return false;
      })(); // IIFE

      if (!!foundInFavorites && !shouldRequestAgain) {
        console.log('Found and we use the cached version');
        return (this.result = foundInFavorites);
      }

      await this.doRequest()
      if (foundInFavorites) foundInFavorites.lastRequest = new Date();
    },
    async doRequest() {
      try {
        const response = await fetch(API + this.search )
        const data = await response.json(); 
        if(!response.ok) throw new Error('user not found') 
        this.result = data  
        
  
      } catch (error) {
        this.error = error
      } finally {
        this.search = null
      }          
    },

    // seteamos la clave favorites, le añadimos la clave login y el valor será un objeto con todo el 
    //  resultado para ese login. Ej: 1657: {name: Ana Lanz, bio: blablabla....}
    // los mapas garantizan que los valores son unicos, no se duplican
    addFavorite() {
      this.favorites.set(this.result.login, this.result);
      this.updateStorage()
    },

     removeFavorite() {
      this.favorites.delete(this.result.login);
      this.updateStorage()
    },

    showFavorite(favorite) {
      this.result = favorite
    },

    checkFavorite(id) {
      return this.result?.login === id
    },

    updateStorage() {
      // vamos a guardarlo todo en la key favorites dentro del localStorage
      window.localStorage.setItem(
        'favorites', 
        JSON.stringify(this.allFavorites)
      )
    },
  }, 
});

