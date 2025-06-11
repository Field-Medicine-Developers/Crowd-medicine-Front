<script>
export default {

  props: {
    commit: {
      type: Object,
      required: true,
    },

    committeesCategories : {
      type : Array,
      required : false,
    }
  },

  data(){

    return {
      isLoading: false,
     
    };

  },

  methods:{
    getLocalized(field) {
        const languageMap = {
          ar: "arabic",
          en: "english",
          fa: "persian",
        };
        const prefix = languageMap[this.$i18n.locale];
        return this.commit[`${prefix}${field}`] || "";
      },


      getCatLocalized(field, index) {
      const languageMap = {
        ar: "arabic",
        en: "english",
        fa: "persian",
      };
      const prefix = languageMap[this.$i18n.locale];
      return (
        (this.committeesCategories[index] && this.committeesCategories[index][`${prefix}${field}`]) || ""
      );
    },

    getCatItemLocalized(field, index, itemIndex) {
  const languageMap = {
    ar: "arabic",
    en: "english",
    fa: "persian",
  };
  const prefix = languageMap[this.$i18n.locale];
  
  // Accessing committeesItems[itemIndex] and checking if it exists
  return (
    (this.committeesCategories[index]?.committeesItems?.[itemIndex]?.[`${prefix}${field}`]) || ""
  );
},


  },

  computed: {
    supervisoryCommitteeMembers() {
      return [
        {
          name: this.$t("anisNail"),
          jobTitle: this.$t("anisNailTitle"),
        },
        {
          name: this.$t("farsLami"),
          jobTitle: this.$t("farsLamiTitle"),
        },
        {
          name: this.$t("ibrahimHayawi"),
          jobTitle: this.$t("ibrahimHayawiTitle"),
        },
        {
          name: this.$t("abdulRazaBazooki"),
          jobTitle: this.$t("abdulRazaBazookiTitle"),
        },
        {
          name: this.$t("salmanRuwaf"),
          jobTitle: this.$t("salmanRuwafTitle"),
        },
        {
          name: this.$t("fadelAkla"),
          jobTitle: this.$t("fadelAklaTitle"),
        },
        {
          name: this.$t("sabahMousawi"),
          jobTitle: this.$t("sabahMousawiTitle"),
        },
        {
          name: this.$t("haiderAlabadi"),
          jobTitle: this.$t("haiderAlabadiTitle"),
        },
      ];
    },
    advisoryCommitteeMembers() {
      return [
        {
          name: this.$t("haiderShamari"),
          jobTitle: this.$t("haiderShamariTitle"),
        },
        {
          name: this.$t("qahtanMousawi"),
          jobTitle: this.$t("qahtanMousawiTitle"),
        },
        {
          name: this.$t("anwarYesari"),
          jobTitle: this.$t("anwarYesariTitle"),
        },
      ];
    },
    scientificCommitteeMembers() {
      return [
        {
          name: this.$t("haiderSabahKazem"),
          jobTitle: this.$t("haiderSabahKazemTitle"),
        },
        { name: this.$t("ahmedSahib"), jobTitle: this.$t("ahmedSahibTitle") },
        {
          name: this.$t("husseinJaraallah"),
          jobTitle: this.$t("husseinJaraallahTitle"),
        },
        { name: this.$t("batoolAli"), jobTitle: this.$t("batoolAliTitle") },
        { name: this.$t("hindMousawi"), jobTitle: this.$t("hindMousawiTitle") },
        {
          name: this.$t("aliAbdulSaadoun"),
          jobTitle: this.$t("aliAbdulSaadounTitle"),
        },
        {
          name: this.$t("aliAbdulReda"),
          jobTitle: this.$t("aliAbdulRedaTitle"),
        },
        {
          name: this.$t("mehdiShafeei"),
          jobTitle: this.$t("mehdiShafeeiTitle"),
        },
        {
          name: this.$t("murtadaJubouri"),
          jobTitle: this.$t("murtadaJubouriTitle"),
        },
        {
          name: this.$t("jasimJafairy"),
          jobTitle: this.$t("jasimJafairyTitle"),
        },
        { name: this.$t("qasimJafary"), jobTitle: this.$t("qasimJafaryTitle") },
        { name: this.$t("abrarHassan"), jobTitle: this.$t("abrarHassanTitle") },
        {
          name: this.$t("sayyedHossam"),
          jobTitle: this.$t("sayyedHossamTitle"),
        },
        { name: this.$t("farahAnsari"), jobTitle: this.$t("farahAnsariTitle") },
        {
          name: this.$t("wameedHashem"),
          jobTitle: this.$t("wameedHashemTitle"),
        },
        {
          name: this.$t("mohannadBakr"),
          jobTitle: this.$t("mohannadBakrTitle"),
        },
        { name: this.$t("asadMahdi"), jobTitle: this.$t("asadMahdiTitle") },
        { name: this.$t("inaamHameed"), jobTitle: this.$t("inaamHameedTitle") },
        {
          name: this.$t("maherAlbanna"),
          jobTitle: this.$t("maherAlbannaTitle"),
        },
        { name: this.$t("mousaJafar"), jobTitle: this.$t("mousaJafarTitle") },
        { name: this.$t("dhafirFadel"), jobTitle: this.$t("dhafirFadelTitle") },
      ];
    },

    preparatoryCommitteeMembers() {
      return [
        { name: this.$t("yasirHusseinAlIssawi"), jobTitle: this.$t("yasirHusseinAlIssawiTitle") },
        { name: this.$t("zaferFadelHussein"), jobTitle: this.$t("zaferFadelHusseinTitle") },
        { name: this.$t("husseinIsmailKhalil"), jobTitle: this.$t("husseinIsmailKhalilTitle") },
        { name: this.$t("hamidDakheelAlHabib"), jobTitle: this.$t("hamidDakheelAlHabibTitle") },
        { name: this.$t("aliShakirAlKhafaf"), jobTitle: this.$t("aliShakirAlKhafafTitle") },
        { name: this.$t("abrarHassanAlNuri"), jobTitle: this.$t("abrarHassanAlNuriTitle") },
        { name: this.$t("alaaHassanAbuAlHil"), jobTitle: this.$t("alaaHassanAbuAlHilTitle") },
        { name: this.$t("abdAlAmeerAlQurayshi"), jobTitle: this.$t("abdAlAmeerAlQurayshiTitle") },
        { name: this.$t("mehdiWahabNasrAllah"), jobTitle: this.$t("mehdiWahabNasrAllahTitle") },
        { name: this.$t("adiAbdulHusseinSalami"), jobTitle: this.$t("adiAbdulHusseinSalamiTitle") },
        { name: this.$t("mohannadAlAqabi"), jobTitle: this.$t("mohannadAlAqabiTitle") },
        { name: this.$t("osamaAbdAlHasan"), jobTitle: this.$t("osamaAbdAlHasanTitle") },
        { name: this.$t("yasirYounisMajid"), jobTitle: this.$t("yasirYounisMajidTitle") },
        { name: this.$t("alaaAbdulRahmanAlJanabi"), jobTitle: this.$t("alaaAbdulRahmanAlJanabiTitle") },
        { name: this.$t("hindIbrahim"), jobTitle: this.$t("hindIbrahimTitle") },
        { name: this.$t("ammarAbdAlIlahKhalil"), jobTitle: this.$t("ammarAbdAlIlahKhalilTitle") },
        { name: this.$t("salamSahibObaidAlRubaei"), jobTitle: this.$t("salamSahibObaidAlRubaeiTitle") },
      ];
    },
  },
 
};
</script>

<template>
  <!-- Pricing start -->
  <section class="section" id="committees">
    <div class="container">
      <div class="row justify-content-center mb-5">
        <div class="col-lg-7 text-center">
          <h2 class="fw-bold">{{ getLocalized('Title') }}</h2>
          <p class="text-muted">
            {{ getLocalized('Description') }}
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12">
          <div class="text-center mb-4 pricing-tab">
            <b-tabs
              pills
              justified
              nav-class="rounded-pill d-inline-block shadow-sm"
              content-class="mt-4"
            >
              <b-tab
                title-item-class="d-inline-block"
                title-link-class="rounded-pill"
                v-for="(committee, index) in committeesCategories"
                :key="index"
              >
                <template v-slot:title>{{
                  getCatLocalized('Title', index)
                }}</template>
                <div class="row">
                  <div
                    class="col-lg-6 mb-4"
                    v-for="(member, indexitem) in committee.committeesItems"
                    :key="indexitem"
                  >
                    <div class="card shadow-sm border-0 rounded">
                      <div class="card-body">
                        <h5 class="fw-bold mb-2">{{getCatItemLocalized('Name' , index , indexitem ) }}</h5>
                        <p class="text-muted mb-0">{{getCatItemLocalized('JobTitle' , index , indexitem ) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </b-tab>
            </b-tabs>
          </div>
          <!-- end tab content -->
        </div>
        <!-- end col -->
      </div>
      <!-- end row -->
    </div>
    <!-- end container -->
  </section>
  <!-- Pricing end -->
</template>
