<script>
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet"; 

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker, 
  },
  props: {
    setting: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      zoom: 15, 
      markerPosition: null,
    };
  },
  methods: {
    getLocalized(field) {
      const languageMap = {
        ar: "arabic",
        en: "english",
        fa: "persian",
      };
      const prefix = languageMap[this.$i18n.locale];
      console.log(`${prefix}${field}`);
      return this.setting.location[`${prefix}${field}`] || "";
    },
  },
  mounted() {
    if (this.setting && this.setting.location) {
      this.markerPosition = [
        this.setting.location.latitude,
        this.setting.location.longitude,
      ];
    }
  },
};
</script>

<template>
  <div>
    <section class="section bg-gradient-primary py-5">
      <div
        class="bg-overlay-img"
        :style="{
          'background-image':
            'url(' + require('@/assets/images/demos.png') + ')',
        }"
      ></div>
      <div class="container" id="address">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="text-center mb-5">
              <h1 class="text-white mb-4">{{ getLocalized('Address') }}</h1>
              <p class="text-white mb-4 font-size-16">
                {{ getLocalized('AddressDescription')  }}
              </p>
              <!-- <p class="text-white mb-5 font-size-16  location">
                <i class="fa fa-location-arrow mr-2 ml-2" aria-hidden="true"></i>

                {{ $t("AddressDescription") }}
              </p> -->
            </div>
          </div>
          <div class="col-12">
            <div class="map-container shadow-lg rounded-lg">
              <div style="height: 600px; width: 100%">
                <l-map
                  ref="map"
                  v-model:zoom="zoom"
                  :center="[32.6119734, 44.0101955]"
                >
                  <l-tile-layer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    layer-type="base"
                    name="OpenStreetMap"
                  ></l-tile-layer>

                  <!-- Add the marker -->
                  <l-marker :lat-lng="markerPosition">
                    <!-- You can add a popup or other content here -->
                    <template #popup>
                      <span>{{ $t("conferenceAddress") }}</span>
                    </template>
                  </l-marker>
                </l-map>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.bg-overlay-img {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-position: center;
  background-size: cover;
  filter: brightness(50%);
  z-index: -1;
}

.map-container {
  position: relative;
  overflow: hidden;
}

.section {
  padding-top: 80px;
  padding-bottom: 80px;
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
  text-transform: uppercase;
}

p {
  font-size: 1rem;
  line-height: 1.6;
}

.bg-gradient-primary {
  background: linear-gradient(to right, #195015, #195015);
}

.text-white {
  color: #ffffff;
}

@media (max-width: 768px) {
  h1 {
    font-size: 2rem;
  }

  .font-size-16 {
    font-size: 14px;
  }
}
</style>
