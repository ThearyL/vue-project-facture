import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import db from '@/firebase/firebaseInit';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';


export const userFactureStore = defineStore('facture', {
  /* 
  1️⃣ STATE - Les données 
  (comme data() dans un composant classique Vue)
  */
  state: () => ({
    invoiceData: [],
    invoiceModal: null,
    modalActive: null,
    invoicesLoaded: null,
    currentInvoiceArray: null,
    editInvoice: null,
  }),

  /* 
  2️⃣ GETTERS - Données calculées 
  (comme computed dans un composant classique Vue)
  */
  getters: {

  },

  /*
  3️⃣ ACTIONS - Fonctions qui modifient le state
  (comme methods dans un composant classique Vue)
  */
  actions: {
    TOGGLE_INVOICE() {
      this.invoiceModal = !this.invoiceModal;
    },
    TOGGLE_MODAL() {
      this.modalActive = !this.modalActive;
    },
    SET_INVOICE_DATA(payload) {
      this.invoiceData.push(payload);

    },
    INVOICES_LOADED() {
      this.invoicesLoaded = true;
    },
    SET_CURRENT_INVOICE(payload) {
      this.currentInvoiceArray = this.invoiceData.filter((invoice) => {
        return invoice.invoiceId === payload
      });
    },
    TOGGLE_EDIT_INVOICE() {
      this.editInvoice = !this.editInvoice;
    },
    REMOVE_INVOICE_FROM_STATE(payload) {
      this.invoiceData = this.invoiceData.filter(invoice => invoice.docId !== payload)
    },
    UPDATE_STATUS_TO_PAID_FROM_STATE(payload) {
      this.invoiceData.forEach(invoice => {
        if (invoice.docId === payload) {
          invoice.invoicePaid = true;
          invoice.invoicePending = false;
        }
      })
    },
    UPDATE_STATUS_TO_PENDING_FROM_STATE(payload) {
      this.invoiceData.forEach(invoice => {
        if (invoice.docId === payload) {
          invoice.invoicePaid = false;
          invoice.invoicePending = true;
          invoice.invoiceDraft = false;
        }
      })
    },
    //Firebase
    // Prendre les données
    async GET_INVOICES() {
      const getData = collection(db, 'invoice');
      const results = await getDocs(getData);
      // Vérifier chaque document de facture et l'ajouter à invoiceData
      // seulement si aucune facture avec le même ID n'est déjà présente
      results.forEach((doc) => {
        if (!this.invoiceData.some((invoice) => invoice.docId === doc.id)) {
          const data = {
            docId: doc.id,
            invoiceId: doc.data().invoiceId,
            billerStreetAddress: doc.data().billerStreetAddress,
            billerCity: doc.data().billerCity,
            billerZipCode: doc.data().billerZipCode,
            billerCountry: doc.data().billerCountry,
            clientName: doc.data().clientName,
            clientEmail: doc.data().clientEmail,
            clientStreetAddress: doc.data().clientStreetAddress,
            clientCity: doc.data().clientCity,
            clientZipCode: doc.data().clientZipCode,
            clientCountry: doc.data().clientCountry,
            invoiceDateUnix: doc.data().invoiceDateUnix,
            invoiceDate: doc.data().invoiceDate,
            paymentTerms: doc.data().paymentTerms,
            paymentDueDateUnix: doc.data().paymentDueDateUnix,
            paymentDueDate: doc.data().paymentDueDate,
            productDescription: doc.data().productDescription,
            invoiceItemList: doc.data().invoiceItemList,
            invoiceTotal: doc.data().invoiceTotal,
            invoicePending: doc.data().invoicePending,
            invoiceDraft: doc.data().invoiceDraft,
            invoicePaid: doc.data().invoicePaid,
          };
          this.invoiceData.push(data);
        }
      });
      this.invoicesLoaded = true;
    },
    // Recharge les factures et mettre à jour l'interface
    async UPDATE_INVOICE({ docId, routeId }) {
      this.REMOVE_INVOICE_FROM_STATE(docId);
      await this.GET_INVOICES();
      this.TOGGLE_INVOICE();
      this.TOGGLE_EDIT_INVOICE();
      this.SET_CURRENT_INVOICE(routeId);
    },
    async DELETE_INVOICE(docId) {
      const getInvoice = doc(db, 'invoice', docId);
      await deleteDoc(getInvoice);
      this.REMOVE_INVOICE_FROM_STATE(docId);
    },
    async UPDATE_STATUS_TO_PAID(docId) {
      const getInvoice = doc(db, 'invoice', docId);
      await updateDoc(getInvoice, {
        invoicePaid: true,
        invoicePending: false,
      });
      this.UPDATE_STATUS_TO_PAID_FROM_STATE(docId);
    },
    async UPDATE_STATUS_TO_PENDING(docId) {
      const getInvoice = doc(db, 'invoice', docId);
      await updateDoc(getInvoice, {
        invoicePaid: false,
        invoicePending: true,
        invoiceDraft: false,
      });
      this.UPDATE_STATUS_TO_PENDING_FROM_STATE(docId);
    }
  },
});