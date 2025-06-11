<template>
  <div>
    <div v-if="isLoading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
    <div v-else>
      <File :FilesList="Files" :isHome="false" />
    </div>
  </div>
</template>

<script>
import File from "@/components/file";
import api from "../js/api";

export default {
  components: {
    File,
  },
  
  data() {
    return {
      id: this.$route.params.id,
      isLoading: false,
      Files: [],
    };
  },

  methods: {
    async fetchFiles() {
      this.isLoading = true;
      try {
        const response = await api.get(
          `Files/GetAllFiles?conferenceVersionID=${this.id}`
        );
        this.Files = response.data.items;
        console.log("Files:", this.Files);  
      } catch (error) {
        console.error("Error fetching conference versions:", error);
      } finally {
        this.isLoading = false;
      }

    },
  },
  mounted() {
    this.fetchFiles();
  },
};
</script>

<style scoped>



</style>