<template>
  <div class="terms">
    <div class="container">
      <h1 class="page-title">{{ $t('terms') }}</h1>
      
      <div class="content-section">
        <h2>{{ $t('termsTitle') }}</h2>
        <p>{{ $t('termsIntro') }}</p>
        
        <div class="terms-section">
          <h3>{{ $t('eligibility') }}</h3>
          <p>{{ $t('eligibilityText') }}</p>
        </div>

        <div class="terms-section">
          <h3>{{ $t('submissionGuidelines') }}</h3>
          <p>{{ $t('submissionGuidelinesText') }}</p>
          <ul>
            <li>{{ $t('originalWork') }}</li>
            <li>{{ $t('formatting') }}</li>
            <li>{{ $t('deadlines') }}</li>
            <li>{{ $t('reviewProcess') }}</li>
          </ul>
        </div>

        <div class="terms-section">
          <h3>{{ $t('intellectualProperty') }}</h3>
          <p>{{ $t('intellectualPropertyText') }}</p>
        </div>

        <div class="terms-section">
          <h3>{{ $t('codeOfConduct') }}</h3>
          <p>{{ $t('codeOfConductText') }}</p>
          <ul>
            <li>{{ $t('professionalism') }}</li>
            <li>{{ $t('respect') }}</li>
            <li>{{ $t('confidentiality') }}</li>
          </ul>
        </div>

        <div class="terms-section">
          <h3>{{ $t('liability') }}</h3>
          <p>{{ $t('liabilityText') }}</p>
        </div>

        <div class="terms-section">
          <h3>{{ $t('modifications') }}</h3>
          <p>{{ $t('modificationsText') }}</p>
        </div>

        <div class="terms-section">
          <h3>{{ $t('contactUs') }}</h3>
          <p>{{ $t('termsContactText') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Terms'
}
</script>

<style scoped>
.terms {
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

.terms-section {
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #eee;
  padding: 15px;
}

.terms-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
  padding: 15px;
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
  .terms {
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