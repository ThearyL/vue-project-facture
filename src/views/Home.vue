<script setup></script>
<template>
  <div class="home container">
    <!--Header-->
    <div class="header flex">
      <div class="left flex flex-column">
        <h1>Factures</h1>
        <span>
          Il y a {{ store.invoiceData.length }}
          {{ store.invoiceData.length > 1 ? 'factures' : 'facture' }}
        </span>
      </div>
      <div class="right flex flex-row">
        <div @click="toggleFilterMenu" class="filter flex">
          <span>Filtrer par statut: <span v-if="filteredInvoice">{{ filteredInvoice }}</span></span>
          <img src="@/assets/icon-arrow-down.svg" alt="">
          <ul v-show="filterMenu" class="filter-menu">
            <li @click="filteredInvoices">Brouillon</li>
            <li @click="filteredInvoices">En attente</li>
            <li @click="filteredInvoices">Payée</li>
            <li @click="filteredInvoices">Effacer filtre</li>
          </ul>
        </div>
        <div @click="newInvoice" class="button flex">
          <div class="inner-button flex">
            <img src="@/assets/icon-plus.svg" alt="">
          </div>
          <span>Nouvelle facture</span>
        </div>
      </div>
    </div>
    <div class="mid flex">
      <div class="left flex">
        <h4>ID</h4>
        <h4>Date</h4>
        <h4>Client</h4>
      </div>
      <div class="right flex">
        <h4>Prix</h4>
        <h4>Statut</h4>

      </div>
    </div>

    <!-- Afficher la liste des factures seulement s'il y en a -->
    <div v-if="store.invoiceData.length > 0">
      <!-- Parcourir les factures filtrées et afficher chaque composant Invoice -->
      <Invoice v-for="(invoice, index) in filteredData" :invoice="invoice" :key="index" />
    </div>
    <div v-else class="empty flex flex-column">
      <img src="@/assets/illustration-empty.svg" alt="">
      <h3>Il n’y a rien ici</h3>
      <p>Cliquez sur le bouton « Nouvelle facture » pour créer une nouvelle facture et commencer</p>
    </div>
  </div>
</template>

<script>
import Invoice from '@/components/Invoice.vue';
import { userFactureStore } from '@/stores/index.js';

export default {
  name: "Home",
  data() {
    return {
      filterMenu: null,
      filteredInvoice: null,
    }
  },
  components: {
    Invoice,
  },
  methods: {
    newInvoice() {
      this.store.TOGGLE_INVOICE();
    },
    toggleFilterMenu() {
      this.filterMenu = !this.filterMenu;
    },
    filteredInvoices(e) {
      if (e.target.innerText === 'Effacer filtre') {
        this.filteredInvoice = null;
        return;
      }
      this.filteredInvoice = e.target.innerText;
    },
  },
  computed: {
    store() {
      return userFactureStore()
    },
    filteredData() {
      return this.store.invoiceData.filter((invoice) => {
        if (this.filteredInvoice === "Brouillon") {
          return invoice.invoiceDraft === true;
        }
        if (this.filteredInvoice === "En attente") {
          return invoice.invoicePending === true;
        }
        if (this.filteredInvoice === "Payée") {
          return invoice.invoicePaid === true;
        }
        return invoice;
      });
    },
  },
}
</script>

<style lang="scss" scoped>
.home {
  color: #292F2F;

  .header {
    margin-bottom: 60px;

    .left,
    right {
      flex: 1;
    }

    .right {
      justify-content: flex-end;
      align-items: center;

      .button,
      .filter {
        align-items: center;

        span {
          font-size: 12px;
        }
      }

      .filter {
        cursor: pointer;
        position: relative;
        margin-right: 40px;

        img {
          margin-left: 12px;
          width: 9px;
          height: 5px;
        }

        .filter-menu {
          width: 120px;
          position: absolute;
          top: 25px;
          list-style: none;
          background-color: #E9ECEF;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

          li {
            cursor: pointer;
            font-size: 12px;
            padding: 10px 20px;

            &:hover {
              color: #1e2139;
              background-color: #fff;
            }
          }
        }
      }

      .button {
        padding: 8px 10px;
        background-color: #7c5dfa;
        border-radius: 40px;

        .inner-button {
          margin-right: 8px;
          border-radius: 50%;
          padding: 8px;
          align-items: center;
          justify-content: center;
          background-color: #fff;

          img {
            width: 10px;
            height: 10px;
          }
        }
      }
    }
  }

  .mid {
    border-bottom: 1px solid #98a0a083;
    color: #292F2F;
    gap: 16px;
    margin-bottom: 16px;
    padding: 0 32px;
    padding-bottom: 12px;
    align-items: center;

    .left {
      align-items: center;
      flex-basis: 60%;
      gap: 16px;

      h4 {
        flex: 1;
      }

    }

    .right {
      gap: 16px;
      flex-basis: 40%;
      align-items: center;

      h4 {
        flex: 1;
      }
    }
  }


  .empty {
    margin-top: 160px;
    align-items: center;

    img {
      width: 214px;
      height: 200px;
    }

    h3 {
      font-size: 20px;
      margin-top: 40px;
    }

    p {
      text-align: center;
      max-width: 224px;
      font-size: 12px;
      font-weight: 300;
      margin-top: 16px;
    }
  }
}
</style>
