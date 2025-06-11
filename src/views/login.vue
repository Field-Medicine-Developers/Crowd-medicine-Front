<script>
import api from "@/js/api";

export default {
  data() {
    return {
      formErrors: {},
      errorMessage: "",
      isLoading: false,
      form: {
        userName: "",
        password: "",
      },
      blogs: [],
    };
  },
  methods: {
    validateForm() {
      this.formErrors = {};
      let valid = true;

      if (!this.form.userName) {
        this.formErrors.userName = this.$t("requiredField");
        valid = false;
      }
      if (!this.form.password) {
        this.formErrors.password = this.$t("requiredField");
        valid = false;
      }

      return valid;
    },
 
    async submitForm() {
      if (this.validateForm()) {

        this.isLoading = true;
        try {
          const response = await api.post("Auth/login", this.form);
          if (response.status === 200) {
            const role = response.data.data.role;
            localStorage.setItem("token", response.data.data.token);
            localStorage.setItem('role', role);
            this.form = { userName: "", password: "" };
            this.$toast.open({
              message: this.$t("loginSuccess"),
              type: "success",
            });
            if (role === 3) {
              console.log("User is a participant");
              this.$router.push("admin/registrationOfAttendanceForm");
            } else if (role === 1) {
              this.$router.push("admin/dashboard");
            } 
          } else {
            this.errorMessage = this.$t("loginFailed");
          }
        } catch (error) {
          this.errorMessage = error.response?.data?.message || this.$t("serverError");
        } finally {
          this.isLoading = false;
        }
      }
    },
  },
};
</script>

<template>
  <section
    class="bg-account-pages vh-100 d-flex align-items-center bg-center position-relative"
    :style="{ backgroundImage: `url(${require('@/assets/images/auth-bg.png')})` }"
  >
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6 col-xl-5">
          <div class="bg-white shadow">
            <div class="p-4">
              <div class="text-center mt-3">
                
                <p class="text-muted mt-2">{{ $t("signin") }}</p>
              </div>
              <div class="p-3">
                <form @submit.prevent="submitForm">
                  <div class="mb-3">
                    <label for="username" class="form-label">{{ $t("userName") }}</label>
                    <input
                      v-model="form.userName"
                      :placeholder="$t('userName')"
                      id="username"
                      type="text"
                      class="form-control"
                    />
                    <div v-if="formErrors.userName" class="text-danger">{{ formErrors.userName }}</div>
                  </div>
                  <div class="mb-3">
                    <label for="userpassword" class="form-label">{{ $t("password") }}</label>
                    <input
                      v-model="form.password"
                      :placeholder="$t('enterPassword')"
                      id="userpassword"
                      type="password"
                      class="form-control"
                    />
                    <div v-if="formErrors.password" class="text-danger">{{ formErrors.password }}</div>
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="remember-Check"
                    />
                    <label class="form-check-label" for="remember-Check">
                      {{ $t("rememberme") }}
                    </label>
                  </div>
                  <div class="d-grid mt-3">
                    <button
                      type="submit"
                      class="btn btn-primary btn-block"
                      :disabled="isLoading"
                    >
                      <span v-if="isLoading">{{ $t("loading") }}</span>
                      <span v-else>{{ $t("signin") }}</span>
                    </button>
                  </div>
                  <div v-if="errorMessage" class="text-danger mt-2">{{ errorMessage }}</div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
.footer-logo {
  margin-bottom: 1.5rem;
  display: block;
  transition: all 0.3s ease;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
  width: 80px;
  height: auto;
  position: relative;
  object-fit: contain;
}

@media (max-width: 768px) {
  .footer-logo {
    width: 70px;
  }
}

@media (max-width: 576px) {
  .footer-logo {
    width: 60px;
  }
}
</style>
