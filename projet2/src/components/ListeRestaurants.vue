<template>
  <div>
    <!--
  <form v-on:submit="ajouterRestaurant($event)">
        <label>
            Nom : <input name="nom" type="text" required v-model="nom">
        </label>
        <label>
            Cuisine : <input name="cuisine" type="text" required v-model="cuisine">
        </label>
        <label>
            Ville : <input borough="borough" type="text" required v-model="ville">
        </label>
        -->

    <form v-on:submit="ajouterRestaurant($event)">
      <md-field>
        <label>Nom :</label>
        <md-input name="nom" type="text" required v-model="nom"></md-input>
        </md-field>
        <md-field>
        <label>Cuisine :</label>
        <md-input name="cuisine" type="text" required v-model="cuisine"></md-input>
        </md-field>

        <md-button type="submit" class="md-raised md-accent">Ajouter</md-button>
    </form>

    <!--
    <p>
      Chercher par nom :
      <input
        @input="chercherRestaurants()"
        type="text"
        v-model="nomRestauRecherche"
      />
    </p>
    -->


    <p>Page {{page}} / {{ nbPageTotal }}</p>
    <md-button class="md-raised md-accent" :disabled="page === 0" @click="pagePrecedente()">Précédent</md-button
    >&nbsp;&nbsp;
    <md-button class="md-raised md-accent" :disabled="page === nbPageTotal" @click="pageSuivante()">
      Suivant
    </md-button>
    <br> <br>
    
    <!--
    <table>
      <tr>
        <th>Nom</th>
        <th>Cuisine</th>
        <th>Ville</th>
        <th>Détails</th>
      </tr>
      <tbody>
        <tr
          v-for="(r, index) in restaurants"
          v-bind:style="{ backgroundColor: getColor(index) }"
          :key="index"
          v-bind:class="{ bordureRouge: index === 2 }"
        >
          <td>{{ r.name }}</td>
          <td>{{ r.cuisine }}</td>
          <td>{{ r.borough }}</td>
          <td>
            <router-link :to="'/restaurant/' + r._id" tag="button"
              >Détail d'un restaurant</router-link
            >
          </td>
          <td><button @click="supprimerRestaurant(r)">delete</button></td>
        </tr>
      </tbody>
    </table>
  -->

  <md-table v-model="restaurants" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <h1 class="md-title">Nombre de restaurants : {{ nbRes }}</h1>
        </div>

        <md-field md-clearable class="md-toolbar-section-end">
          <md-input placeholder="Nom du restaurant..." v-model="nomRestauRecherche" @input="chercherRestaurants()" />
        </md-field>
      </md-table-toolbar>

      <md-table-empty-state
        md-label="Pas de restaurant"
        :md-description="`Pas de restaurant au nom de '${nomRestauRecherche}' trouvé. Essayer une differente recherche.`">
      </md-table-empty-state>

      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Name" md-sort-by="name" md-numeric>{{ item.name }}</md-table-cell>
        <md-table-cell md-label="Cuisine" md-sort-by="cuisine">{{ item.cuisine }}</md-table-cell>
        <md-table-cell md-label="Ville" md-sort-by="borough">{{ item.borough }}</md-table-cell>
        <md-table-cell md-label="Details" ><router-link :to="'/restaurant/' + item._id"><md-button class="md-raised md-accent">Détail du restaurant</md-button></router-link></md-table-cell>
        <md-table-cell><md-button class="md-accent" @click="supprimerRestaurant(item)">Supprimer</md-button></md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  name: "ListeRestaurants",
  data: function () {
    return {
      restaurants: [],
      nom: "",
      cuisine: "",
      ville: "",
      nbRes: 0,
      page: 0,
      pageSize: 10,
      nbPageTotal: 0,
      msg: "",
      nomRestauRecherche: "",
      cuisineRestauRecherche: "",
    };
  },
  mounted() {
    console.log("AVANT RENDU HTML");
    this.getRestaurantsFromServer();
  },
  methods: {
    pagePrecedente() {
      if (this.page === 0) return;
      this.page--;
      this.getRestaurantsFromServer();
    },
    pageSuivante() {
      if (this.page === this.nbPageTotal) return;
      this.page++;
      this.getRestaurantsFromServer();
    },
    getRestaurantsFromServer() {
      let url = "http://localhost:8080/api/restaurants?";
      url += "page=" + this.page;
      url += "&name=" + this.nomRestauRecherche;
      url += "&cuisine=" + this.cuisineRestauRecherche;

      fetch(url)
        .then((responseJSON) => {
          responseJSON.json().then((resJS) => {
            console.log(resJS);
            this.restaurants = resJS.data;
            this.nbRes = resJS.count;
            this.nbPageTotal = Math.round(this.nbRes / this.pageSize);
          });
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    chercherRestaurants: _.debounce(function () {
      this.getRestaurantsFromServer();
    }, 300),
    supprimerRestaurant(r) {
      let url = "http://localhost:8080/api/restaurants/" + r._id;

      fetch(url, {
        method: "DELETE",
      })
        .then((responseJSON) => {
          responseJSON.json().then((resJS) => {
            this.msg = resJS.msg;
            this.getRestaurantsFromServer();
          });
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    ajouterRestaurant(event) {
      // eviter le comportement par defaut
      event.preventDefault();

      // Récupération du formulaire. Pas besoin de document.querySelector
      // ou document.getElementById puisque c'est le formulaire qui a généré
      // l'événement
      let form = event.target;

      // Récupération des valeurs des champs du formulaire
      // en prévision d'un envoi multipart en ajax/fetch
      let donneesFormulaire = new FormData(form);

      let url = "http://localhost:8080/api/restaurants?";

      fetch(url, {
        method: "POST",
        body: donneesFormulaire,
      })
        .then((responseJSON) => {
          responseJSON.json().then((resJS) => {
            // Maintenant res est un vrai objet JavaScript
            console.log(resJS.msg);
          });
        })
        .catch(function (err) {
          console.log(err);
        });
      this.nom = "";
      this.cuisine = "";
      this.ville = "";
    },
    getColor(index) {
      return index % 2 ? "lightBlue" : "pink";
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
form {
    width: 300px;
    height: 300px;
    margin-left: auto; 
    margin-right: auto;

}

.md-field {
    max-width: 300px;
  }

md-table-row {
    margin-left: auto; 
    margin-right: auto;
}
</style>
