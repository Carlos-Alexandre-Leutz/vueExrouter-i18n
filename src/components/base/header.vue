<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid col-11 m-auto">
      <!-- <router-link class="navbar-brand col-1" to="/home"> logo </router-link> -->
      <div class="navbar-brand col-5" to="/home">
      <switchLanguage></switchLanguage>
      </div>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <div
              @click="$router.push('/tarefa')"
              class="nav-link cursor"
              to="/tarefa"
            >
              Tarefas
            </div>
          </li>
          <li class="nav-item">
            <div @click="$router.push('/usuario')" class="nav-link cursor">
              Usuários
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>
import switchLanguage from "../SwitchLanguage/SwitchLanguage.vue"
export default {
  components:{
    switchLanguage
  }
}
</script>
<style scoped>
.cursor {
  cursor: pointer;
}
</style>