<template>
    <div @click="checkClick" ref="invoiceWrap" class="invoice-wrap flex flex-column">
        <form @submit.prevent="submitForm" class="invoice-content">
            <Loading v-show="loading" />
            <h1 v-if="!store.editInvoice">Nouvelle facture</h1>
            <h1 v-else>Modifier la facture</h1>
            <!-- Facture par-->
            <div class="bill-from flex flex-column">
                <h4>Facture par</h4>
                <div class="input flex flex-column">
                    <label for="billerStreetAddress">Adresse</label>
                    <input required type="text" id="billerStreetAddress" v-model="billerStreetAddress">
                </div>
                <div class="location-details flex">
                    <div class="input flex flex-column">
                        <label for="billerCity">Ville</label>
                        <input required type="text" id="billerCity" v-model="billerCity">
                    </div>
                    <div class="input flex flex-column">
                        <label for="billerZipCode">Code postale</label>
                        <input required type="text" id="billerZipCode" v-model="billerZipCode">
                    </div>
                    <div class="input flex flex-column">
                        <label for="billerCountry">Pays</label>
                        <input required type="text" id="billerCountry" v-model="billerCountry">
                    </div>
                </div>
            </div>

            <!-- Facture pour-->
            <div class="bill-to flex flex-column">
                <h4>Facturer à</h4>
                <div class="input flex flex-column">
                    <label for="clientName">Client</label>
                    <input required type="text" id="clientName" v-model="clientName">
                </div>
                <div class="input flex flex-column">
                    <label for="clientEmail">Courriel</label>
                    <input required type="text" id="clientEmail" v-model="clientEmail">
                </div>
                <div class="input flex flex-column">
                    <label for="clientStreetAddress">Adresse du client</label>
                    <input required type="text" id="clientStreetAddress" v-model="clientStreetAddress">
                </div>
                <div class="location-details flex">
                    <div class="input flex flex-column">
                        <label for="clientCity">Ville</label>
                        <input required type="text" id="clientCity" v-model="clientCity">
                    </div>
                    <div class="input flex flex-column">
                        <label for="clientZipCode">Code postale</label>
                        <input required type="text" id="clientZipCode" v-model="clientZipCode">
                    </div>
                    <div class="input flex flex-column">
                        <label for="clientCountry">Pays</label>
                        <input required type="text" id="clientCountry" v-model="clientCountry">
                    </div>
                </div>
            </div>

            <!--Details facture-->
            <div class="invoice-work flex flex-column">
                <div class="payment flex">
                    <div class="input flex flex-column">
                        <label for="invoiceDate">Date de la facture</label>
                        <input disabled type="text" id="invoiceDate" v-model="invoiceDate">
                    </div>
                    <div class="input flex flex-column">
                        <label for="paymentDueDate">Date limite</label>
                        <input disabled type="text" id="paymentDueDate" v-model="paymentDueDate">
                    </div>
                </div>
                <div class="input flex flex-column">
                    <label for="paymentTerms">Terme de payment</label>
                    <select required type="text" id="paymentTerms" v-model="paymentTerms">
                        <option value="30">30 jours</option>
                        <option value="60">60 jours</option>
                    </select>
                </div>
                <div class="input flex flex-column">
                    <label for="productDescription">Description du produit</label>
                    <input required type="text" id="productDescription" v-model="productDescription">
                </div>
                <div class="work-items">
                    <h3>Liste d’articles</h3>
                    <table class="item-list">
                        <tr class="table-heading flex">
                            <th class="item-name">Article</th>
                            <th class="qty">Qté.</th>
                            <th class="price">Prix</th>
                            <th class="total">Total</th>
                        </tr>
                        <tr class="table-items flex" v-for="(item, index) in invoiceItemList" :key="index">
                            <td class="item-name"><input type="text" v-model="item.itemName"></td>
                            <td class="qty"><input type="text" v-model="item.qty"></td>
                            <td class="price"><input type="text" v-model="item.price"></td>
                            <td class="total flex">${{ item.total=item.qty * item.price }}</td>
                            <img @click="deleteInvoiceItem(item.id)" src="@/assets/icon-delete.svg" alt="">
                        </tr>
                    </table>
                    <div @click="addNewInvoiceItem" class="flex button">
                        <img src="@/assets/icon-plus.svg" alt="">
                        Ajouter un nouveau article
                    </div>
                </div>
            </div>

            <!--Save-->
            <div class="save flex">
                <div class="left">
                    <button type="button" @click="closeInvoice" class="red">Annuler</button>
                </div>
                <div class="right flex">
                    <button v-if="!store.editInvoice" type="submit" @click="saveDraft" class="dark-purple">Sauvegarder
                        brouillon</button>
                    <button v-if="!store.editInvoice" type="submit" @click="publishInvoice" class="purple">Créer la
                        facture</button>
                    <button v-if="store.editInvoice" type="submit" class="purple">Mettre à jour</button>
                </div>
            </div>

        </form>
    </div>
</template>

<script>
import { userFactureStore } from '@/stores/index.js';
import db from '../firebase/firebaseInit';
import { collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import Loading from './Loading.vue';
import { uid } from 'uid';

export default {
    name: "invoiceModal",
    data() {
        return {
            dateOptions: { year: "numeric", month: "short", day: "numeric" },
            docId: null,
            loading: null,
            billerStreetAddress: null,
            billerCity: null,
            billerZipCode: null,
            billerCountry: null,
            clientName: null,
            clientEmail: null,
            clientStreetAddress: null,
            clientCity: null,
            clientZipCode: null,
            clientCountry: null,
            invoiceDateUnix: null,
            invoiceDate: null,
            paymentTerms: null,
            paymentDueDateUnix: null,
            paymentDueDate: null,
            productDescription: null,
            invoicePending: null,
            invoiceDraft: null,
            invoiceItemList: [],
            invoiceTotal: 0,
        }
    }, components: {
        Loading,
    },
    // Initialisation du formulaire de la facture.
    // Nouvelle facture : date du jour.
    // Modification : chargement des données depuis le store Pinia.
    created() {
        if (!this.store.editInvoice) {
            this.invoiceDateUnix = Date.now();
            this.invoiceDate = new Date(this.invoiceDateUnix).toLocaleDateString('fr-CA', this.dateOptions);
        }
        if (this.store.editInvoice) {
            const currentInvoice = this.store.currentInvoiceArray[0];
            this.docId = currentInvoice.docId;
            this.billerStreetAddress = currentInvoice.billerStreetAddress;
            this.billerCity = currentInvoice.billerCity;
            this.billerZipCode = currentInvoice.billerZipCode;
            this.billerCountry = currentInvoice.billerCountry;
            this.clientName = currentInvoice.clientName;
            this.clientEmail = currentInvoice.clientEmail;
            this.clientStreetAddress = currentInvoice.clientStreetAddress;
            this.clientCity = currentInvoice.clientCity;
            this.clientZipCode = currentInvoice.clientZipCode;
            this.clientCountry = currentInvoice.clientCountry;
            this.invoiceDateUnix = currentInvoice.invoiceDateUnix;
            this.invoiceDate = currentInvoice.invoiceDate;
            this.paymentTerms = currentInvoice.paymentTerms;
            this.paymentDueDateUnix = currentInvoice.paymentDueDateUnix;
            this.paymentDueDate = currentInvoice.paymentDueDate;
            this.productDescription = currentInvoice.productDescription;
            this.invoicePending = currentInvoice.invoicePending;
            this.invoiceDraft = currentInvoice.invoiceDraft;
            this.invoiceItemList = currentInvoice.invoiceItemList;
            this.invoiceTotal = currentInvoice.invoiceTotal;
        }
    },
    methods: {
        //Apparition de la modal lorsque cliqué dehors du formulaire
        checkClick(e) {
            if (e.target === this.$refs.invoiceWrap) {
                this.store.TOGGLE_MODAL();
            }
        },
        closeInvoice() {
            this.store.TOGGLE_INVOICE();
            if (this.store.editInvoice) {
                this.store.TOGGLE_EDIT_INVOICE();
            }
        },
        addNewInvoiceItem() {
            this.invoiceItemList.push({
                id: uid(),
                itemName: "",
                qty: "",
                price: "",
                total: 0,
            });
        },
        deleteInvoiceItem(id) {
            this.invoiceItemList = this.invoiceItemList.filter((item) => item.id !== id);
        },
        calInvoiceTotal() {
            this.invoiceTotal = 0;
            this.invoiceItemList.forEach(item => {
                this.invoiceTotal += item.total;
            });
        },
        publishInvoice() {
            this.invoicePending = true;
        },
        saveDraft() {
            this.invoiceDraft = true;
        },
        // Enregistrer la facture dans Firestore
        async uploadInvoice() {
            if (this.invoiceItemList.length <= 0) {
                alert("Sil vous plaît remplir les items");
                return;
            }
            this.loading = true;
            this.calInvoiceTotal();

            const dataBase = doc(collection(db, 'invoice'));
            await setDoc(dataBase, {
                invoiceId: uid(6),
                billerStreetAddress: this.billerStreetAddress,
                billerCity: this.billerCity,
                billerZipCode: this.billerZipCode,
                billerCountry: this.billerCountry,
                clientName: this.clientName,
                clientEmail: this.clientEmail,
                clientStreetAddress: this.clientStreetAddress,
                clientCity: this.clientCity,
                clientZipCode: this.clientZipCode,
                clientCountry: this.clientCountry,
                invoiceDate: this.invoiceDate,
                invoiceDateUnix: this.invoiceDateUnix,
                paymentTerms: this.paymentTerms,
                paymentDueDate: this.paymentDueDate,
                paymentDueDateUnix: this.paymentDueDateUnix,
                productDescription: this.productDescription,
                invoiceItemList: this.invoiceItemList,
                invoiceTotal: this.invoiceTotal,
                invoicePending: this.invoicePending,
                invoiceDraft: this.invoiceDraft,
                invoicePaid: null,
            });

            this.loading = false;

            this.store.TOGGLE_INVOICE();
            // Recharger la liste des factures pour afficher la nouvelle facture
            this.store.GET_INVOICES();
        },
        async updateInvoice() {
            if (this.invoiceItemList.length <= 0) {
                alert("Sil vous plaît remplir les items");
                return;
            }
            this.loading = true;
            this.calInvoiceTotal();
            // Récupérer la référence du document à modifier dans Firestore
            const dataBase = doc(db, 'invoice', this.docId);
            await updateDoc(dataBase, {
                billerStreetAddress: this.billerStreetAddress,
                billerCity: this.billerCity,
                billerZipCode: this.billerZipCode,
                billerCountry: this.billerCountry,
                clientName: this.clientName,
                clientEmail: this.clientEmail,
                clientStreetAddress: this.clientStreetAddress,
                clientCity: this.clientCity,
                clientZipCode: this.clientZipCode,
                clientCountry: this.clientCountry,
                paymentTerms: this.paymentTerms,
                paymentDueDate: this.paymentDueDate,
                paymentDueDateUnix: this.paymentDueDateUnix,
                productDescription: this.productDescription,
                invoiceItemList: this.invoiceItemList,
                invoiceTotal: this.invoiceTotal,
            });

            this.loading = false;
            // Préparer les informations nécessaires pour mettre à jour l'état local
            const data = {
                docId: this.docId,
                routeId: this.$route.params.invoiceId,
            };
            this.store.UPDATE_INVOICE(data);
        },
        submitForm() {
            if (this.store.editInvoice) {
                this.updateInvoice();
                return;
            }
            this.uploadInvoice();

        }
    },
    watch: {
        paymentTerms() {
            const futureDate = new Date();
            this.paymentDueDateUnix = futureDate.setDate(futureDate.getDate() + parseInt(this.paymentTerms));
            this.paymentDueDate = new Date(this.paymentDueDateUnix).toLocaleDateString('fr-ca', this.dateOptions);
        }
    },
    computed: {
        store() {
            return userFactureStore()
        }
    }
}</script>

<style lang="scss" scoped>
.invoice-wrap {
    position: fixed;
    top: 0;
    left: 0;
    background-color: transparent;
    height: 100vh;
    width: 100%;
    overflow: scroll;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: none;
    }

    @media(min-width:900px) {
        left: 90px;
    }
}

.invoice-content {
    position: relative;
    padding: 56px;
    max-width: 700px;
    width: 100%;
    background-color: #141625;
    color: #fff;
    box-shadow: 10px 4px 6px -1px rgba(0, 0, 0, 0.2),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);

    h1 {
        margin-bottom: 48px;
        color: #fff;
    }

    h3 {
        margin-bottom: 16px;
        font-size: 18px;
        color: #777f98;
    }

    h4 {
        color: #7c5dfa;
        font-size: 16px;
        margin-bottom: 24px;
    }

    .bill-to,
    .bill-from {
        margin-bottom: 48px;

        .location-details {
            gap: 16px;

            div {
                flex: 1;
            }
        }
    }

    .invoice-work {
        .payment {
            gap: 24px;

            div {
                flex: 1;
            }
        }

        #paymentDueDate {
            background-color: #171a29;
        }

        .work-items {
            .item-list {
                width: 100%;

                .table-heading,
                .table-items {
                    gap: 16px;
                    font-size: 12px;

                    .item-name {
                        flex-basis: 50%
                    }

                    .qty {
                        flex-basis: 10%;
                    }

                    .price {
                        flex-basis: 20%;
                    }

                    .total {
                        flex-basis: 20%;
                        align-self: center;
                    }
                }

                .table-heading {
                    margin-bottom: 16px;

                    th {
                        text-align: left;
                    }
                }

                .table-items {
                    position: relative;
                    margin-bottom: 24px;

                    img {
                        cursor: pointer;
                        position: absolute;
                        top: 15px;
                        right: 0;
                        width: 12px;
                        height: 16px;
                    }
                }
            }

            .button {
                color: #fff;
                background-color: #252945;
                align-items: center;
                justify-content: center;
                width: 100%;

                img {
                    margin-right: 4px;
                }
            }
        }

    }

    .save {
        margin-top: 60px;

        div {
            flex: 1;
            white-space: nowrap;
        }

        .right {
            justify-content: flex-end;
        }
    }
}

.input {
    margin-bottom: 24px;
}

label {
    font-size: 20px;
    margin-bottom: 6px;
}

input,
select {
    width: 100%;
    background-color: #1e2139;
    color: #fff;
    border-radius: 4px;
    padding: 12px 4px;
    border: none;

    &:focus {
        outline-color: #fff;
    }
}
</style>