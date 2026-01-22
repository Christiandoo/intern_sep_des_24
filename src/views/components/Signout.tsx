import { signOut } from "next-auth/react";



const SignoutButton = () => {
    return (
      <button
        onClick={() => signOut()}
        className="bg-[#9089fc] text-white px-4 py-2 rounded hover:bg-brand-dark transition-colors"
      >
        Sign out
      </button>
    );
  };
  
  export default SignoutButton;
  