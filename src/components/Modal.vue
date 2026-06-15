<template>
  <div class="modal flex">
    <div class="modal-content">
      <p>Êtes-vous sûr de vouloir quitter ? Vos modifications ne seront pas enregistrées.</p>
      <div class="actions flex">
        <button @click="closeModal" class="purple">Retourner</button>
        <button @click="closeInvoice" class="red">Fermer</button>
      </div>
    </div>
  </div>
</template>

<script>
import { userFactureStore } from '@/stores/index.js';
export default {

  name: "modal",
  methods: {
    closeModal() {
      this.store.TOGGLE_MODAL();
    },
    closeInvoice() {
      this.store.TOGGLE_MODAL();
      this.store.TOGGLE_INVOICE();
      if (this.store.editInvoice) {
        this.store.TOGGLE_EDIT_INVOICE();
      }
    }
  },
  computed: {
    store() {
      return userFactureStore()
    },
  },
}
</script>

<style lang="scss" scoped>
.modal {
  z-index: 100;
  position: fixed;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;

  .modal-content {
    border-radius: 20px;
    padding: 48px 32px;
    max-width: 450px;
    background-color: #252945;
    color: #fff;

    p {
      text-align: center;
    }

    .actions {
      margin-top: 24px;

      button {
        flex: 1;
      }
    }
  }
}
</style>
