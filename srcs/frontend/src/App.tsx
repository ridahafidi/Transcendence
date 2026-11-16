import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger";
  children: React.ReactNode;
  className?: string;
}


function Button({ variant = "primary", type = "button", className, children, ...props }: ButtonProps) {
  const variants = {
    primary: "bg-primary text-background font-medium hover:bg-primary-hover",
    danger: "bg-danger text-foreground font-medium hover:opacity-90",
  };

  return <button
    type={type}
    className={`${variants[variant] || variant.primary} ${className || ""}`}
    {...props}
  >
    {children}
  </button>
}

function Input({ type, children, ...props }) {
  return <input placeholder={children} {...props} />
}

function App() {
  const features = {
    secure: "Your data, our priority.",
    fast: "Built for performance",
    Reliable: "Always available.",
  }

  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-2">
      {/* regestration and sign in side*/}
      <div className="flex justify-center items-center bg-green-100">
        <div className="flex flex-col bg-blue-100">
          <div className="flex">
            <Button className="bg-yellow-100 flex-1">Login</Button>
            <Button className="bg-yellow-100 flex-1 text-nowrap">Sign up</Button>
          </div>
          <h1>Welcome <b className="bg-yellow-100">back</b></h1>
          <p>sign in to your account</p>
          <Input className="">username or email</Input>
          <Input className="">password</Input>
          <Button variant="primary">Sign in</Button>
          <p>or contine with:</p>
          <Button variant="danger">Continue with 42</Button>
          <div>
            <p>Privact Policy</p>
            <p>Terms of service</p>
          </div>
        </div>
      </div>

      {/* logo and announce side */}
      <div className="bg-red-100">
        <h1>// spaceio</h1>
        <p>Simplified Systems,</p>
        <p className="text-primary">Superior Results.</p>
        <ul>
          {Object.entries(features).map(([key, value]) => (
            <li>{key}: {value}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App
