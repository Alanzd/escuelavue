const API = "https://api.github.com/users/";

const app = Vue.createApp({
  data () {
    return {
      search: null,
      result: null
    }
  },
  methods: {
    async doSearch() {
      
      try {
        const response = await fetch(API + this.search )
        const data = await response.json(); 
        if(!response.ok) throw new Error('user not found') 
        console.log(data);
        this.result = data
        
      } catch (error) {
        this.error = error
      } finally {
        this.search = null
      }
           
    }
  }, 
});

