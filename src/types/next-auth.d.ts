import "next-auth";

declare module "next-auth" {
  interface Session {
    userId: string;
    roles: string[];
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    roles?: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    roles: string[];
  }
  
}
