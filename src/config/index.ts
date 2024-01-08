const config = {
  cookies: {
    token: `@AntiRecurso:token${process.env.NODE_ENV === 'development' ? '_dev' : ''}}`
  },
  localStorage: {
    consent: '@AntiRecurso:consent',
    changelog: '@AntiRecurso:changelog'
  },
  mandatoryAuthModes: ['new', 'realistic', 'wrong', 'hard', 'custom'],
  version: '1.3.6'
};

export default config;
