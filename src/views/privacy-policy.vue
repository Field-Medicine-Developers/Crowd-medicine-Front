<template>
  <div class="privacy-policy">
    <div class="container">
      <h1 class="page-title">{{ $t('privacyPolicy') }}</h1>
      
      <div class="content-section">
        <h2>{{ $t('privacyPolicyTitle') }}</h2>
        <p>{{ $t('privacyPolicyIntro') }}</p>
        
        <div class="policy-section">
          <h3>{{ $t('informationCollection') }}</h3>
          <p>{{ $t('informationCollectionText') }}</p>
          <ul>
            <li>{{ $t('personalInfo') }}</li>
            <li>{{ $t('contactInfo') }}</li>
            <li>{{ $t('professionalInfo') }}</li>
            <li>{{ $t('submissionInfo') }}</li>
          </ul>
        </div>

        <div class="policy-section">
          <h3>{{ $t('informationUsage') }}</h3>
          <p>{{ $t('informationUsageText') }}</p>
          <ul>
            <li>{{ $t('conferenceRegistration') }}</li>
            <li>{{ $t('communication') }}</li>
            <li>{{ $t('improvement') }}</li>
            <li>{{ $t('compliance') }}</li>
          </ul>
        </div>

        <div class="policy-section">
          <h3>{{ $t('dataProtection') }}</h3>
          <p>{{ $t('dataProtectionText') }}</p>
        </div>

        <div class="policy-section">
          <h3>{{ $t('cookies') }}</h3>
          <p>{{ $t('cookiesText') }}</p>
        </div>

        <div class="policy-section">
          <h3>{{ $t('thirdPartyLinks') }}</h3>
          <p>{{ $t('thirdPartyLinksText') }}</p>
        </div>

        <div class="policy-section">
          <h3>{{ $t('policyUpdates') }}</h3>
          <p>{{ $t('policyUpdatesText') }}</p>
        </div>

        <div class="policy-section">
          <h3>{{ $t('contactUs') }}</h3>
          <p>{{ $t('privacyContactText') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrivacyPolicy'
}
</script>

<style scoped>
.privacy-policy {
  padding: 4rem 0;
  background: #f8f9fa;
  min-height: 100vh;
}

.page-title {
  text-align: center;
  margin-bottom: 3rem;
  color: #2c3e50;
  font-size: 2.5rem;
}

.content-section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.policy-section {
  margin-bottom: 2rem;
}

h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
}

h3 {
  color: #34495e;
  margin: 1.5rem 0 1rem;
  font-size: 1.4rem;
}

p {
  color: #34495e;
  line-height: 1.6;
  margin-bottom: 1rem;
}

ul {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

li {
  color: #34495e;
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .privacy-policy {
    padding: 2rem 0;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .content-section {
    padding: 1.5rem;
  }
}
</style> 