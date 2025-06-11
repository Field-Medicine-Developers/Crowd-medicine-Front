<template>
  <div class="container mt-4 cb" dir="rtl">
    <h2 class="text-center mb-4">اختر المؤتمر </h2>

    <BFormSelect
       v-model="form.conferenceVersionID"
      :options="conferenceVersionsList"
       @change="fetchId()"
    />
  </div>
  </template>
  <script>
import api from "../js/api";



   export default {
    name: "conferenceVersionSelect",
    data() {
      return {
        conferenceVersionsList: [],
        form: {
          conferenceVersionID: null,
        },
      };
    },

    methods: {
     
      async fetchConferenceVersions() {
      this.isLoading = true;
      try {
        const response = await api.get(
          "ConferenceVersion/GetAllConferenceVersions?PageNumber=1&PageSize=100"
        );
        this.conferenceVersionsList = response.data.items.map((value) => ({
          text: value.arabicName + " - " + value.year,
          value: value.id,
        }));
      } catch (error) {
        console.error("Error fetching conference versions:", error);
      } finally {
        this.isLoading = false;
      }
    },

    fetchId() {
     this.$emit("fetch-id", this.form.conferenceVersionID);
    },

    },
    mounted() {
      this.fetchConferenceVersions();
    },

  };
</script>