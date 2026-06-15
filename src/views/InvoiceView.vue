<template>
  <div class="invoice-view container">
    <router-link class="nav-link flex" :to="{ name: 'Home' }">
      <img src="@/assets/icon-arrow-left.svg" alt=""> Retourner
    </router-link>
    <div class="header flex">
      <div class="left flex">
        <span>Statut:</span>
        <div class="status-button flex" :class="{
          paid: currentInvoice.invoicePaid,
          draft: currentInvoice.invoiceDraft,
          pending: currentInvoice.invoicePending,
        }">
          <span v-if="currentInvoice.invoicePaid">Payée</span>
          <span v-if="currentInvoice.invoiceDraft">Brouillon</span>
          <span v-if="currentInvoice.invoicePending">En attente</span>
        </div>
      </div>
      <div class="right flex">
        <button @click="toggleEditInvoice" class="grey">Modifier</button>
        <button @click="deleteInvoice(currentInvoice.docId)" class="red">Effacer</button>
        <button @click="updateStatusToPaid(currentInvoice.docId)" v-if="currentInvoice.invoicePending" class="green">
          Marquer comme payée
        </button>
        <button v-if="currentInvoice.invoiceDraft || currentInvoice.invoicePaid"
          @click="updateStatusToPending(currentInvoice.docId)" class="orange">
          Marquer en attente
        </button>
      </div>
    </div>
    <div class="invoice-title flex flex-column">
      <h2>Informations de facturation</h2>
    </div>
    <div class="invoice-details flex flex-column">
      <div class="top flex">
        <div class="left flex flex-column">
          <p><span>#</span>{{ currentInvoice.invoiceId }}</p>
          <p>{{ currentInvoice.productDescription }}</p>
        </div>
        <div class="right flex flex-column">
          <p>{{ currentInvoice.billerStreetAddress }}</p>
          <p>{{ currentInvoice.billerCity }}</p>
          <p>{{ currentInvoice.billerZipCode }}</p>
          <p>{{ currentInvoice.billerCountry }}</p>
        </div>
      </div>
      <div class="middle flex">
        <div class="payment flex flex-column">
          <h4>Date de la facture</h4>
          <p>
            {{ currentInvoice.invoiceDate }}
          </p>
          <h4>Date limite</h4>
          <p>
            {{ currentInvoice.paymentDueDate }}
          </p>
        </div>
        <div class="bill flex flex-column">
          <h4>Facturer à</h4>
          <p>{{ currentInvoice.clientName }}</p>
          <p>{{ currentInvoice.clientStreetAddress }}</p>
          <p>{{ currentInvoice.clientCity }}</p>
          <p>{{ currentInvoice.clientZipCode }}</p>
          <p>{{ currentInvoice.clientCountry }}</p>
        </div>
        <div class="send-to flex flex-column">
          <h4>Envoyer à</h4>
          <p>{{ currentInvoice.clientEmail }}</p>
        </div>
      </div>
      <div class="bottom flex flex-column">
        <div class="billing-items">
          <div class="heading flex">
            <p>Articles</p>
            <p>Qté.</p>
            <p>Prix</p>
            <p>Total</p>
          </div>
          <div v-for="(item, index) in currentInvoice.invoiceItemList" :key="index" class="item flex">
            <p>{{ item.itemName }}</p>
            <p>{{ item.qty }}</p>
            <p>{{ item.price }}</p>
            <p>{{ item.total }}</p>
          </div>
        </div>
        <div class="total flex">
          <p>Montant dû</p>
          <p>{{ currentInvoice.invoiceTotal }}</p>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import { userFactureStore } from '@/stores/index.js';
export default {
  name: "invoiceView",
  data() {
    return {
      currentInvoice: null,
    };
  },
  created() {
    this.getCurrentInvoice();
  },
  methods: {
    getCurrentInvoice() {
      this.store.SET_CURRENT_INVOICE(this.$route.params.invoiceId);
      this.currentInvoice = this.store.currentInvoiceArray[0];
    },
    toggleEditInvoice() {
      this.store.TOGGLE_EDIT_INVOICE();
      this.store.TOGGLE_INVOICE();
    },
    async deleteInvoice(docId) {
      await this.store.DELETE_INVOICE(docId);
      this.$router.push({ name: "Home" });
    },
    async updateStatusToPaid(docId) {
      await this.store.UPDATE_STATUS_TO_PAID(docId);
    },
    async updateStatusToPending(docId) {
      await this.store.UPDATE_STATUS_TO_PENDING(docId);
    },
  }, computed: {
    store() {
      return userFactureStore()
    }
  },
  watch: {
    // Réagir lorsque le mode édition change
    'store.editInvoice'(newValue) {
      // Si on quitte le mode édition
      if (!newValue) {
        // Restaurer la facture actuelle depuis le store
        this.currentInvoice = this.store.currentInvoiceArray[0]
      }
    }
  }
}

</script>

<style lang="scss" scoped>
.invoice-view {
  .nav-link {
    margin-bottom: 32px;
    align-items: center;
    color: #292F2F;
    font-size: 12px;

    img {
      margin-right: 16px;
      width: 7px;
      height: 10px;
    }
  }

  .header,
  .invoice-details {
    background-color: transparent;
    border-radius: 20px;
  }

  .header {
    align-items: center;
    padding: 24px 32px;
    font-size: 12px;


    .left {
      align-items: center;

      span {
        margin-right: 16px;
      }
    }

    .right {
      flex: 1;
      justify-content: flex-end;

      button {
        color: #fff;
      }
    }

    .paid {
      color: #0F766E;
    }

    .draft {
      color: #3F51B5;
    }

    .pending {
      color: #E65100;
    }

    .grey {
      background-color: #B8C2CC;
    }
  }

  .invoice-title {
    padding: 0 48px;
    margin-top: 32px;
  }

  .invoice-details {
    padding: 0 48px;
    margin-top: 8px;


    .top {
      div {
        color: #292F2F;
        flex: 1;
      }

      .left {
        font-size: 12px;

        p:first-child {
          font-size: 24px;
          text-transform: uppercase;
          color: #292F2F;
          margin-bottom: 8px;
        }

        p:nth-child(2) {
          font-size: 16px;
        }

        span {
          color: #292F2F;
        }
      }

      .right {
        font-size: 12px;
        align-items: flex-end;
      }
    }

    .middle {
      margin-top: 50px;
      color: #292F2F;
      gap: 16px;

      h4 {
        font-size: 12px;
        font-weight: 500;
        margin-bottom: 12px;
      }

      p {
        font-size: 16px;
      }

      .bill,
      .payment {
        flex: 1;
      }

      .payment {
        h4:nth-child(3) {
          margin-top: 32px;
        }

        p {
          font-weight: 600;
        }
      }

      .bill {
        p:nth-child(2) {
          font-size: 16px;
        }

        p:nth-child(3) {
          margin-top: auto;
        }

        p {
          font-size: 12px;
        }
      }

      .send-to {
        flex: 2;
      }
    }

    .bottom {
      margin-top: 50px;

      .billing-items {
        padding: 32px;
        border-radius: 6px 6px 0 0;
        background-color: #E9ECEF;

        .heading {
          color: #292F2F;
          font-size: 12px;
          margin-bottom: 32px;


          p:first-child {
            flex: 3;
            text-align: left;
          }

          p {
            flex: 1;
            text-align: right;
          }
        }

        .item {
          margin-bottom: 32px;
          font-size: 13px;
          color: #292F2F;

          &:last-child {
            margin-bottom: 0;
          }

          p:first-child {
            flex: 3;
            text-align: left;
          }

          p {
            flex: 1;
            text-align: right;
          }
        }
      }

      .total {
        color: #292F2F;
        padding: 32px;
        background-color: #D6DADF;
        align-items: center;
        border-radius: 0 0 6px 6px;

        p {
          flex: 1;
          font-size: 12px;
        }

        p:nth-child(2) {
          font-size: 28px;
          text-align: right;
        }
      }
    }
  }
}
</style>
