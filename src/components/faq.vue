<template>
  <div>
    <section class="section" id="blog">
      <div class="container">
        <div class="row justify-content-center mb-4">
          <div class="col-lg-7 text-center">
            <h2 class="fw-bold">{{ $t("faq") }}</h2>
            <p class="text-muted">
              {{ $t("faqDec") }}
            </p>
          </div>
        </div>
        <div class="row">
          <div class="col-12 mb-4">
            <div v-for="(faq, index) in faqs" :key="index">
              <!-- Button to toggle collapse -->
              <BButton v-b-toggle="'collapse-' + index" class="m-1 outline-primary">
                {{ getFaqsLocalized('Question' , index) }}
              </BButton>

              <!-- Element to collapse -->
              <BCollapse :id="'collapse-' + index">
                <BCard class="mt-4 mb-4">
                  <BCardBody >{{ getFaqsLocalized('Answer' , index) }}</BCardBody>
                </BCard>
              </BCollapse>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    faqs: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
    
    };
  },
  methods : {
    getFaqsLocalized(field, index) {
      const languageMap = {
        ar: "arabic",
        en: "english",
        fa: "persian",
      };
      const prefix = languageMap[this.$i18n.locale];
      return (
        (this.faqs[index] && this.faqs[index][`${prefix}${field}`]) || ""
      );
    },

  },
  mounted() {
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaa");
        console.log(this.faqs);
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaa");
  },  

};
</script>
