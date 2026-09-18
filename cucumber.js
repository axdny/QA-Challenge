module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    requireModule: ['tsx/cjs'],
    require: ['src/**/*.ts'],
    format: ['pretty', 'summary', 'html:reports/cucumber-report.html', 'allure-cucumberjs/reporter'],
    publishQuiet: true
  }
};