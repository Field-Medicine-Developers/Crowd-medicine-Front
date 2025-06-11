<template>
  <section class="file-library section py-5" id="file">
    <div class="container">
      <h2 class="section-title text-center mb-5">{{ $t("Filelibrary") }} - 
        <!-- back  -->
        <router-link :to="`/conference/${cId}`">{{ $t("back") }}</router-link>
      </h2>
      <div class="row">
        <div
          class="col-md-4 col-sm-6"
          v-for="(file, index) in FilesList"
          v-bind:key="index"
        >
          <div class="file-card">
            <div class="file-card-icon">
              <i :class="getFileIcon(file.fileType)" class="file-icon"></i>
            </div>
            <div class="file-card-body">
              <h5 class="file-card-title">
                {{ getfileLocalized("Description", index) }}
              </h5>
              <!-- <p class="file-card-text">
                {{ getfileLocalized("Content", index) }}
              </p> -->
              <div class="d-flex justify-content-between align-items-center">
                <template v-if="isVideoFile(file.fileType)">
                  <button 
                    class="btn btn-outline-primary" 
                    @click="openVideoModal(file)"
                  >
                    <i class="fa fa-play-circle mr-1"></i>
                    {{ $t("playVideo") }}
                  </button>
                </template>
                <template v-else>
                  <a
                    :href="file.theFileFullUrl"
                    target="_blank"
                    class="btn btn-outline-primary"
                  >
                    {{ $t("download") }}
                  </a>
                </template>
                <small class="text-muted">
                  {{  formatFileSize(file.fileSize)   }}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Video Modal -->
    <b-modal
      v-model="showVideoModal"
      size="xl"
      hide-footer
      hide-header
      class="video-modal"
      body-class="p-0"
    >
      <div class="video-container">
        <video
          v-if="selectedVideo"
          :src="selectedVideo.theFileFullUrl"
          controls
          class="w-100"
          controlsList="nodownload"
        >
          {{ $t("videoNotSupported") }}
        </video>
      </div>
    </b-modal>
  </section>
</template>

<script>
export default {
  props: {
    FilesList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      isLoading: false,
      cId : this.$route.params.id,
      showVideoModal: false,
      selectedVideo: null,
    };
  },
  methods: {
    getFileIcon(fileType) {
      const icons = {
        pdf: "fa fa-file-pdf-o text-danger",
        doc: "fa fa-file-word-o text-primary",
        docx: "fa fa-file-word-o text-primary",
        xls: "fa fa-file-excel-o text-success",
        xlsx: "fa fa-file-excel-o text-success",
        ppt: "fa fa-file-powerpoint-o text-warning",
        pptx: "fa fa-file-powerpoint-o text-warning",
        zip: "fa fa-file-archive-o text-secondary",
        txt: "fa fa-file-text-o text-muted",
        png : "fa fa-file-image-o text-info",
        jpg : "fa fa-file-image-o text-info",
        jpeg : "fa fa-file-image-o text-info",
        gif : "fa fa-file-image-o text-info",
        webp : "fa fa-file-image-o text-info",
        mp4: "fa fa-file-video-o text-danger",
        webm: "fa fa-file-video-o text-danger",
        mov: "fa fa-file-video-o text-danger",
        default: "fa fa-file-o text-secondary",
        
      };
      return icons[fileType] || icons.default;
    },
    isVideoFile(fileType) {
      const videoTypes = ['mp4', 'webm', 'mov'];
      return videoTypes.includes(fileType);
    },
    openVideoModal(file) {
      this.selectedVideo = file;
      this.showVideoModal = true;
    },
    getfileLocalized(field, index) {
      const languageMap = {
        ar: "arabic",
        en: "english",
        fa: "persian",
      };
      const prefix = languageMap[this.$i18n.locale];
      return (
        (this.FilesList[index] && this.FilesList[index][`${prefix}${field}`]) ||
        ""
      );
    },
    formatFileSize(size) {
      if (size < 1024) return size + " B";
      if (size < 1024 * 1024) return (size / 1024).toFixed(2) + " KB";
      return (size / (1024 * 1024)).toFixed(2) + " MB";
    },
  },
};
</script>

<style scoped>
.file-library .file-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: center;
}
.file-library .file-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}
.file-library .file-card-icon {
  font-size: 50px;
  margin-bottom: 15px;
}
.file-library .file-card-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}
.file-library .file-card-text {
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 15px;
}
.file-library .btn {
  font-size: 14px;
  padding: 5px 15px;
}

.video-modal {
  background-color: rgba(0, 0, 0, 0.9);
}

.video-modal .modal-content {
  background-color: transparent;
  border: none;
}

.video-container {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
}

.video-container video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.file-card .btn-outline-primary {
  display: flex;
  align-items: center;
  gap: 5px;
}

.file-card .btn-outline-primary i {
  font-size: 1.1em;
}
</style>
