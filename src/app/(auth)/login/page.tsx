import LoginForm from './LoginForm';

export default function LoginPage() {
  const issuer = process.env.AUTH_ISSUER_URL;
  const helpUrl = issuer ? new URL('/ui/v2/login/help', issuer).href : undefined;
  return <LoginForm helpUrl={helpUrl} />;
}
