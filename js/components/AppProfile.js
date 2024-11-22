app.component('app-profile', {
  props: ['result', 'isFavorite'],
  methods: {
      addFavorite() {
          this.$emit('add-favorite')
      },
      removeFavorite() {
          this.$emit('remove-favorite')
      }
  },
  template: 
  /* html */ `
    <div class="result">
      <a v-if="isFavorite" href="#" class="result_toggle-favorite" @click="removeFavorite">Remove Favorite
          ⭐️</a>
      <a v-else href="#" class="result_toggle-favorite" @click="addFavorite">Add Favorite ⭐️</a>
      <h2 class="result_name">{{ result.name }}</h2>
      <img v-bind:src="result.avatar_url" :alt="result.name" class="result_avatar">
      <p class="result_bio">{{ result.bio }} <br>
          <a v-bind:href="result.blog" target="_blank" class="result_blog">{{ result.blog }}</a>
      </p>
    </div>
    `
})