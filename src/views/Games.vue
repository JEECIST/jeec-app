<template>
  <div class="game-wrapper">
    <router-link to="/connections" class="game-card connections">
      <img src="/src/assets/connections.png" alt="Connections">
      <h3>JEEConnections</h3>
    </router-link>

    <router-link to="/wordle" class="game-card wordle">
      <img src="/src/assets/wordle.png" alt="Wordle">
      <h3>JEECdle</h3>
    </router-link>
  </div>
</template>


<style scoped>
.games-container {
  padding: 20px;
  text-align: center;
}

.game-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  height: 60vh;
  width: 100%;
}

/* router-link behaves like a div */
.game-card {
  width: 100px;
  height: 100px;
  display: grid;
  place-items: center;
  gap: 5px;

  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

/* images stay constrained */
.game-card img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

/* optional hover feedback */
.game-card:hover {
  transform: translateY(-2px);
  transition: transform 0.15s ease;
}
</style>
