const config = {
  cookies: {
    token: `@AntiRecurso:token${process.env.NODE_ENV === 'development' ? '_dev' : ''}`
  },
  localStorage: {
    consent: '@AntiRecurso:consent'
  },
  mandatoryAuthModes: ['new', 'wrong', 'hard', 'custom']
};

export default config;
