import dynamic from "next/dynamic";
const LoginForm = dynamic(() => import("./components/login-form"), {
  ssr: false,
});

const LoginPage = () => {
  return (
    <div className="w-full flex-col h-screen flex items-center justify-center">
      <div className="container">
        <LoginForm />
      </div>
    </div>
  );
};
export default LoginPage;
