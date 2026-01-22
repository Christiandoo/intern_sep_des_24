
export declare module "next-auth" {
  interface Session {
    userId: string; 
    roles?: string[];
  }

  interface JWT {
    userId: string; 
    roles?: string;
  }
}
