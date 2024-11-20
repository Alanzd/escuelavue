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
  computed: {
    isFavorite() {
      return this.favorites.has(this.result.id)
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

    // seteamos la clave favorites, le añadimos la clave id y el valor será un objeto con todo el 
    //  resultado para ese id. Ej: 1657: {name: Ana Lanz, bio: blablabla....}
    // los mapas garantizan que los valores son unicos, no se duplican
    addFavorite() {
      this.favorites.set(this.result.id, this.result)
    },
     removeFavorite() {
      this.favorites.delete(this.result.id)
    }
  }, 
});

